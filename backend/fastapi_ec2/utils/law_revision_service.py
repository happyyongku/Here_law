import difflib
import logging
import re 
from typing import List, Dict, Optional, Literal
from psycopg.rows import dict_row
from pydantic import BaseModel, RootModel

from utils.law_service import get_law_info_by_law_id, reconstruct_law_text_from_sections, get_law_sections_by_law_id
from utils.magazine_service import get_magazine_by_law_id

from utils.db_connection import DBConnection #Singleton 이므로 생성자를 남발해도 문제 없음.

# Model to represent each diff element
class ClauseDifferenceElement(BaseModel):
    index: str
    content: str

# Model to represent a pair of old and new diff elements
class ClauseDifferencePair(BaseModel):
    old: List[ClauseDifferenceElement]
    new: List[ClauseDifferenceElement]

class LawDifferenceWithLawInfo(BaseModel):
    law_name: str
    law_id: str
    proclamation_date:str
    category: str
    diff: List[ClauseDifferencePair]

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
    if diff_text == "":
        return None
    logging.debug("generate_diff: 법령의 차이점을 생성했습니다.")
    return diff_text

def parse_diff(diff_text) -> List[ClauseDifferencePair]:
    SPLIT_DELIMITER = ": "
    # Split the diff text into blocks based on the @@...@@ markers
    diff_blocks = re.split(r'@@.*@@', diff_text)

    # To store the final result
    differences = []

    # Loop through each block (skip the first block as it’s before the first @@)
    for block in diff_blocks[1:]:
        old_list = []
        new_list = []
        
        # Split the block into lines
        lines = block.strip().splitlines()
        for line in lines:
            # Removed lines (old version, marked by '-')
            if line.startswith('-'):
                target_list = old_list
            else: #line.startswith('+'):
                target_list = new_list

            # Remove the '-' and split into index and content
            try:
                index, content = line[1:].split(SPLIT_DELIMITER, 1)
            except ValueError: # index로 삼을 만한 게 없음
                if len(target_list) == 0:
                    index = ""
                    content = line[1:]
                else:
                    target_list[-1].content += "\n" + line[1:]
                    continue # to next line
            target_list.append(ClauseDifferenceElement.model_construct(**{'index': index.strip(), 'content': content.strip()}))

        # Add a pair of old and new dictionaries to differences
        differences.append(ClauseDifferencePair.model_construct(**{"old" : old_list, "new" : new_list}))

    return differences


def insert_law_revision(law_id: str, data: LawDifferenceWithLawInfo, conn_given = None):
    """생성된 law_revision 저장"""
    # Flag to determine whether we need to commit/rollback based on connection ownership
    sql = "INSERT INTO law_revision (law_id, data) VALUES (%s, %s) ON CONFLICT DO NOTHING;"
    data_str = data.model_dump_json()

    own_connection = conn_given is None
    
    if own_connection:
        with DBConnection().get_connection() as conn:
            try:
                with conn.cursor() as cursor:
                    cursor.execute(sql, (law_id, data_str))
            except Exception as e:
                logging.warning(f"insert_law_revision: DB에 저장 실패: {e}")
                conn.rollback()
                raise  # Re-raise the exception for further handling
    else:
        with conn_given.cursor() as cursor:
            cursor.execute(sql, (law_id, data_str))
    logging.debug(f"insert_law_revision: law_id {law_id}에 대한 law revision 저장 완료")

def generate_and_insert_law_revision(law_id:str) -> Optional[str]:
    """
    law revision information 생성 후 저장함. 해당 law의 이전 버전이 없거나 차이점이 없으면 저장하지 않음.
    """

    law_info = get_law_info_by_law_id(law_id)[0]
    if law_info.get("previous_law_id") is None: # 과거 기록이 없음
        logging.debug(f"generate_and_insert_law_revision: 법령 {law_id}의 이전 법령이 없음!")
        return

    new_sections = get_law_sections_by_law_id(law_info["law_id"])
    old_sections = get_law_sections_by_law_id(law_info["previous_law_id"])
    new_text = reconstruct_law_text_from_sections(new_sections)
    old_text = reconstruct_law_text_from_sections(old_sections)
    diff_text = generate_diff(old_text=old_text, new_text=new_text)

    if diff_text is None: #차이점 없음
        logging.debug(f"generate_and_insert_law_revision: 법령 {law_id} 와 이전 법령의 차이가 없음!")
        return

    magazine_info = get_magazine_by_law_id(law_info["law_id"])
    if magazine_info is None:
        logging.warning(f"generate_and_insert_law_revision: 법령 {law_id} 에 대한 Magazine 이 없어 revision 생성에 실패함")
        return
    category = magazine_info["category"]

    diff_model = parse_diff(diff_text)

    insert_law_revision(
        law_id,
        LawDifferenceWithLawInfo.model_construct(**{
            "law_name" : law_info["law_name_kr"],
            "law_id" : law_info["law_id"],
            "proclamation_date" : law_info["proclamation_date"].strftime('%Y-%m-%d'),
            "category" : category,
            "diff" : diff_model
            }
        )
    )
    return law_id
