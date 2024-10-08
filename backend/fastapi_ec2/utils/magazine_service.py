import logging

from utils.db_connection import DBConnection
from psycopg.rows import dict_row

from datetime import datetime

def insert_magazine_article(law_id: str, title: str, category: str, current_day: str, content: str, conn_given=None):
    """생성된 기사를 DB에 저장합니다."""
    # Convert the string to a datetime object and set the KST timezone
    date_obj_kst = datetime.fromisoformat(current_day)
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
        'title': title,
        'category': category,
        'created_at': date_obj_kst,
        'image': None,
        'content': content,
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

def get_magazine_by_law_id(law_id:str):
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