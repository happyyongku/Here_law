import re
import xml.etree.ElementTree as ET

from typing import List, Dict

# 특수문자 변환 맵핑
_SPCHAR_TO_NUMBER_MAP = {
    "①": 1, "②": 2, "③": 3, "④": 4, "⑤": 5,
    "⑥": 6, "⑦": 7, "⑧": 8, "⑨": 9, "⑩": 10
}

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
