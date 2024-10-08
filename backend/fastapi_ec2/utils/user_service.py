from utils.db_connection import DBConnection
from psycopg.rows import dict_row

def get_user_by_email(email):
    """
    주어진 이메일을 통해 사용자 정보를 조회합니다.
    
    Parameters:
    conn (Connection): 데이터베이스 연결 객체
    email (str): 조회할 사용자의 이메일
    
    Returns:
    dict: 사용자 정보
    """
    query = """
    SELECT id, email, is_email_verified, nickname, phone_number 
    FROM user_entity 
    WHERE email = %s
    """
    with DBConnection().get_connection() as conn:
        with conn.cursor(row_factory=dict_row) as cur:
            cur.execute(query, (email,))
            return cur.fetchone()

# 유저의 관심사를 조회하는 함수
def get_user_interests(user_id):
    """
    주어진 사용자 ID를 통해 사용자의 관심사를 조회합니다.
    
    Parameters:
    conn (Connection): 데이터베이스 연결 객체
    user_id (int): 사용자의 ID
    
    Returns:
    list: 관심사 목록
    """
    query = """
    SELECT interests 
    FROM user_entity_interests 
    WHERE user_entity_id = %s
    """
    with DBConnection().get_connection() as conn:
        with conn.cursor(row_factory=dict_row) as cur:
            cur.execute(query, (user_id,))
            return cur.fetchall()

