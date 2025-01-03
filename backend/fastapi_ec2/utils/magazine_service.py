import logging

from utils.db_connection import DBConnection
from psycopg.rows import dict_row
from typing import List, Dict
from datetime import datetime

#법령 카테고리. 법령 데이터에는 저장되지 않고 Magazine에 저장된다.
LAW_CATEGORY = [
    "가족법",
    "형사법",
    "민사법",
    "부동산 및 건설",
    "회사 및 상사법",
    "국제 및 무역법",
    "노동 및 고용법",
    "조세 및 관세법",
    "지적재산권",
    "의료 및 보험법",
    "행정 및 공공법",
]

def insert_magazine_article(law_id: str, title: str, category: str, current_day: str, content: str, conn_given=None):
    """생성된 기사를 DB에 저장합니다."""
    # Convert the string to a datetime object and set the KST timezone
    date_obj_kst = current_day
    sql = """
    INSERT INTO magazines (
        title,
        category,
        created_at,
        image,
        content,
        view_count,
        likes,
        law_id
    ) VALUES (
        %(title)s,
        %(category)s,
        %(created_at)s,
        %(image)s,
        %(content)s,
        %(view_count)s,
        %(likes)s,
        %(law_id)s
    )
    ON CONFLICT (law_id) DO NOTHING;
    """
    data = {
        'title': title.strip("\""),
        'category': category.strip("\""),
        'created_at': date_obj_kst,
        'image': None,
        'content': content.strip("\""),
        'view_count': 0,
        'likes': 0,
        'law_id': law_id
    }

    # Flag to determine whether we need to commit/rollback based on connection ownership
    own_connection = conn_given is None
    
    if own_connection:
        with DBConnection().get_connection() as conn:
            try:
                with conn.cursor(row_factory=dict_row) as cursor:
                    cursor.execute(sql, data)
            except Exception as e:
                conn.rollback()
                raise  # Re-raise the exception for further handling
    else:
        with conn_given.cursor(row_factory=dict_row) as cursor:
            cursor.execute(sql, data)
    logging.debug(f"save_magazine_article: law_id {law_id}에 대한 기사를 저장했습니다.")

def get_magazines_by_category(categories, limit=5):
    """
    사용자의 관심사를 기반으로 magazine 목록을 조회합니다.
    
    Parameters:
    conn (Connection): 데이터베이스 연결 객체
    categories (list): 관심사 카테고리 목록
    
    Returns:
    list: magazine 목록
    """
    query = f"""
    SELECT magazine_id, title, category, created_at, image, content, view_count, likes, law_id
    FROM magazines 
    WHERE category = ANY(%s)
    ORDER BY created_at DESC
    LIMIT {str(limit)}
    """
    with DBConnection().get_connection() as conn:
        with conn.cursor(row_factory=dict_row) as cur:
            cur.execute(query, (categories,))
            return cur.fetchall()

def get_magazine_by_id(magazine_id):
    """
    특정 magazine_id를 통해 magazine 정보를 조회합니다.
    """
    query = """
    SELECT magazine_id, title, category, created_at, image, content, view_count, likes, law_id
    FROM magazines 
    WHERE magazine_id = %s
    """
    with DBConnection().get_connection() as conn:
        with conn.cursor(row_factory=dict_row) as cur:
            cur.execute(query, (magazine_id,))
            return cur.fetchone()

def get_magazines_by_user_liked(user_id: str, limit = 10) -> List[Dict]:
    """
    특정 User가 liked 한 Magazine을 최근에 Like한 순서대로 가져옴
    """
    query = """
    SELECT m.magazine_id, m.title, m.category, m.created_at, m.image, m.content, m.view_count, m.likes, m.law_id
    FROM magazines m
    JOIN (
        SELECT magazine_id, created_at
        FROM user_magazine_likes
        WHERE user_id = %s
    ) uml ON m.magazine_id = uml.magazine_id
    ORDER BY uml.created_at DESC
    LIMIT %s
    """
    with DBConnection().get_connection() as conn:
        with conn.cursor(row_factory=dict_row) as cur:
            cur.execute(query, (user_id, limit))
            return cur.fetchall()

def get_magazine_by_law_id(law_id:str) -> Dict:
    """
    특정 law_id 에 대한 magazine 정보를 조회합니다.
    """
    query = """
    SELECT magazine_id, title, category, created_at, image, content, view_count, likes, law_id
    FROM magazines 
    WHERE law_id = %s
    """
    with DBConnection().get_connection() as conn:
        with conn.cursor(row_factory=dict_row) as cur:
            cur.execute(query, (law_id,))
            return cur.fetchone()

def get_magazines_by_law_ids(law_ids: List[str]) -> List[Dict]:
    """
    주어진 law_id들의 리스트에 해당하는 magazine 정보를 조회합니다.
    """
    placeholders = ','.join(['%s'] * len(law_ids))
    query = f"""
    SELECT magazine_id, title, category, created_at, image, content, view_count, likes, law_id
    FROM magazines 
    WHERE law_id IN ({placeholders})
    ORDER BY created_at DESC
    """
    with DBConnection().get_connection() as conn:
        with conn.cursor(row_factory=dict_row) as cur:
            cur.execute(query, law_ids)
            return cur.fetchall()


def get_recent_magazines(limit=5):
    """
    최신 순으로 magazine 목록을 조회합니다.
    
    Parameters:
    conn (Connection): 데이터베이스 연결 객체
    
    Returns:
    list: 최신 magazine 목록
    """
    query = f"""
    SELECT magazine_id, title, category, created_at, image, content, view_count, likes, law_id
    FROM magazines 
    ORDER BY created_at DESC
    LIMIT {str(limit)}
    """
    with DBConnection().get_connection() as conn:
        with conn.cursor(row_factory=dict_row) as cur:
            cur.execute(query)
            return cur.fetchall()

def check_magazine_exists(law_id: str) -> bool:
    """magazines 테이블에 해당 law_id의 기사가 이미 존재하는지 확인합니다."""
    sql = """
    SELECT 1 FROM magazines WHERE law_id = %(law_id)s LIMIT 1;
    """
    with DBConnection().get_connection() as conn:
        with conn.cursor(row_factory=dict_row) as cursor:
            cursor.execute(sql, {'law_id': law_id})
            result = cursor.fetchone()
            exists = result is not None
    logging.debug(f"check_magazine_exists: law_id {law_id}에 대한 기사가 {'존재합니다' if exists else '존재하지 않습니다'}.")
    return exists