# 여러 Module에서 사용되는 법 관련 function들의 모음.
import re
import logging
import difflib
from typing import List, Dict, Optional
from psycopg.rows import dict_row
from pydantic import BaseModel, RootModel
import xml.etree.ElementTree as ET

from utils.db_connection import DBConnection #Singleton 이므로 생성자를 남발해도 문제 없음.

# 특수문자 변환 맵핑
_SPCHAR_TO_NUMBER_MAP = {
    "①": 1, "②": 2, "③": 3, "④": 4, "⑤": 5,
    "⑥": 6, "⑦": 7, "⑧": 8, "⑨": 9, "⑩": 10
}

def get_law_sections_by_law_id(law_id: str) -> List[Dict]:
    """특정 law_id의 모든 law_sections를 가져옵니다."""
    sql = """
    SELECT
        part,
        chapter,
        section,
        article,
        clause,
        content
    FROM
        law_sections
    WHERE
        law_id = %(law_id)s
    ORDER BY
        part, chapter, section, article, clause
    """
    with DBConnection().get_connection() as conn:
        with conn.cursor(row_factory=dict_row) as cur:
            cur.execute(sql, {'law_id': law_id})
            law_sections = cur.fetchall()
    logging.debug(f"get_law_sections_by_law_id: law_id {law_id}에 대한 {len(law_sections)}개의 조항을 가져왔습니다.")
    return law_sections

def get_law_info_by_law_id(law_id: str) -> List[Dict]:
    """특정 law_id의 법령 정보를 가져옵니다."""
    sql = """
    SELECT
        *
    FROM
        law_info
    WHERE
        law_id = %(law_id)s
    """
    with DBConnection().get_connection() as conn:
        with conn.cursor(row_factory=dict_row) as cursor:
            cursor.execute(sql, {'law_id': law_id})
            law_info = cursor.fetchall()
    return law_info

def get_law_infos_by_enforcement_date(date_str: str) -> List[Dict]:
    """특정 시행일자의 모든 법령 정보를 가져옵니다."""
    sql = """
    SELECT
        law_id,
        law_name_kr,
        previous_law_id
    FROM
        law_info
    WHERE
        enforcement_date = %(enforcement_date)s
    """
    with DBConnection().get_connection() as conn:
        with conn.cursor(row_factory=dict_row) as cursor:
            cursor.execute(sql, {'enforcement_date': date_str})
            law_infos = cursor.fetchall()
    logging.debug(f"get_law_infos_by_enforcement_date: {len(law_infos)}개의 법령 정보를 가져왔습니다.")
    return law_infos

def reconstruct_law_text_from_sections(law_sections: List[Dict]) -> str:
    """law_sections를 이용하여 법령 원문을 재구성합니다."""
    lines = []
    for section in law_sections:
        # 각 필드가 None인 경우 빈 문자열로 처리
        part = section['part'] + '편' if section['part'] else ''
        chapter = section['chapter'] + '장' if section['chapter'] else ''
        section_ = section['section'] + '절' if section['section'] else ''
        article = section['article'] + '조' if section['article'] else ''
        clause = section['clause'] + '항' if section['clause'] else ''
        content = section['content'] or ''

        # 각 요소를 결합하여 한 줄의 텍스트로 만듭니다.
        line_info_arr = [part, chapter, section_, article, clause]
        line_info = ' '.join(filter(None, line_info_arr)).strip() + ':'
        line_elements = [line_info, content]
        line = ' '.join(filter(None, line_elements)).strip()
        lines.append(line)
    law_text = "\n".join(lines)
    logging.debug(f"reconstruct_law_text: {len(lines)}개의 라인으로 구성된 법령 텍스트를 재구성했습니다.")
    return law_text

def generate_diff(old_text: str, new_text: str) -> Optional[str]:
    """이전 법령과 새로운 법령의 차이점을 생성합니다. 만약 이전 법령이 없으면(빈 문자열) None return."""
    if old_text == "":
        return None
    
    diff = difflib.unified_diff(
        old_text.splitlines(),
        new_text.splitlines(),
        fromfile='이전 법령',
        tofile='신규 법령',
        lineterm='',
        n=0
    )
    diff_text = '\n'.join(diff)
    logging.debug("generate_diff: 법령의 차이점을 생성했습니다.")
    return diff_text

def _xml_to_dict(element):
    """
    # 2. XML 데이터를 JSON 형식으로 변환하는 함수
    """
    if element is None:
        return {}

    node = {}
    if len(element) == 0:
        return element.text
    for child in element:
        child_name = child.tag
        # 재귀적으로 처리
        child_dict = _xml_to_dict(child)
        if child_name in node:
            if isinstance(node[child_name], list):
                node[child_name].append(child_dict)
            else:
                node[child_name] = [node[child_name], child_dict]
        else:
            node[child_name] = child_dict
    return node

def get_law_dict(xml_str:str):
    return _xml_to_dict(ET.fromstring(xml_str))

def get_law_clauses(law_dict:Dict) -> List[Dict]:
    result = []
    law_id = law_dict.get("기본정보", {}).get("법령ID")
    current_hierarchy_backup = {"편": None, "장": None, "절": None, "관": None}
    current_hierarchy = current_hierarchy_backup.copy()
    for clause in law_dict.get("조문", {}).get("조문단위", []):
        if not isinstance(clause, dict):
            continue  # 문자열이나 예상 외의 형식일 경우 건너뜀

        clause_data = None
        clause_content = _clean_spchar(clause.get("조문내용", ""))
        if _is_section_title(clause_content):
            full_section = _extract_structure(clause_content)
            if full_section:
                if "편" in full_section:
                    current_hierarchy = current_hierarchy_backup.copy()
                    current_hierarchy["편"] = full_section
                elif "장" in full_section:
                    current_hierarchy = current_hierarchy_backup.copy()
                    current_hierarchy["장"] = full_section                    
                elif "절" in full_section:
                    current_hierarchy = current_hierarchy_backup.copy()
                    current_hierarchy["절"] = full_section
                elif "관" in full_section:
                    current_hierarchy = current_hierarchy_backup.copy()
                    current_hierarchy["관"] = full_section
        else:
            clause_number = clause.get("조문번호", None)
            if "항" in clause:
                항목들 = clause["항"]
                if not isinstance(항목들, list):
                    항목들 = [항목들]
                for item in 항목들:
                    clean_number = _SPCHAR_TO_NUMBER_MAP.get(item.get("항번호", ""), item.get("항번호", ""))
                    clean_content = _clean_spchar(item.get("항내용", ""))
                    clause_data = {
                        "법령ID": law_id,
                        "편": current_hierarchy["편"],
                        "장": current_hierarchy["장"],
                        "절": current_hierarchy["절"],
                        "관": current_hierarchy["관"],
                        "조": clause_number,
                        "항": clean_number,
                        "항내용": clean_content
                    }
            else:
                clause_data = {
                    "법령ID": law_id,
                    "편": current_hierarchy["편"],
                    "장": current_hierarchy["장"],
                    "절": current_hierarchy["절"],
                    "관": current_hierarchy["관"],
                    "조": clause_number,
                    "항": None,
                    "항내용": clause_content
                }
            result.append(clause_data)
    return result

def _is_section_title(text):
    return text.startswith("제") and any(heading in text for heading in ["편", "장", "절", "관"])

def _clean_spchar(text):
    if text is None:
        return ""
    for special_char in _SPCHAR_TO_NUMBER_MAP.keys():
        text = text.replace(special_char, "")
    return text.strip()

def _extract_structure(text):
    match = re.match(r"(제\d+[편장절관]) (.+)", text)
    if match:
        section_type = match.group(1)
        section_title = match.group(2)
        full_section = f"{section_type} {section_title}"
        return full_section
    return None

# Model to represent each diff element
class ClauseDifferenceElement(BaseModel):
    index: str
    content: str

# Model to represent a pair of old and new diff elements
class ClauseDifferencePair(BaseModel):
    old: ClauseDifferenceElement
    new: ClauseDifferenceElement

LawDifferenceModel = RootModel[List[ClauseDifferencePair]]

def parse_diff(diff_text) -> LawDifferenceModel:
    # Split the diff text into blocks based on the @@...@@ markers
    diff_blocks = re.split(r'@@.*@@', diff_text)

    # To store the final result
    differences = []

    # Loop through each block (skip the first block as it’s before the first @@)
    for block in diff_blocks[1:]:
        old_dict = None
        new_dict = None
        
        # Split the block into lines
        lines = block.strip().splitlines()

        for line in lines:
            # Removed lines (old version, marked by '-')
            if line.startswith('-'):
                # Remove the '-' and split into index and content
                index, content = line[1:].split(':', 1)
                old_dict = {'index': index.strip(), 'content': content.strip()}

            # Added lines (new version, marked by '+')
            elif line.startswith('+'):
                # Remove the '+' and split into index and content
                index, content = line[1:].split(':', 1)
                new_dict = {'index': index.strip(), 'content': content.strip()}

        # If old_dict is None (new line added), use an empty dictionary
        if old_dict is None:
            old_dict = {'index': '', 'content': ''}

        # If new_dict is None (line removed), use an empty dictionary
        if new_dict is None:
            new_dict = {'index': '', 'content': ''}

        # Add a pair of old and new dictionaries to differences
        differences.append(ClauseDifferencePair.model_construct(**{"old" : old_dict, "new" : new_dict}))

    return differences

