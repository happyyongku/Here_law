from fastapi import APIRouter, HTTPException, Depends, Request
from utils.security import get_current_user
import logging
from contextlib import contextmanager
from psycopg.rows import dict_row
from utils.db_connection import DBConnection

magazine_router = APIRouter()

# DBConnection 클래스의 인스턴스 생성
db_connection = DBConnection()

# 유저 정보를 이메일로 조회하는 함수
def get_user_by_email(conn, email):
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
    with conn.cursor(row_factory=dict_row) as cur:
        cur.execute(query, (email,))
        return cur.fetchone()

# 유저의 관심사를 조회하는 함수
def get_user_interests(conn, user_id):
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
    with conn.cursor(row_factory=dict_row) as cur:
        cur.execute(query, (user_id,))
        return cur.fetchall()

# 관심사를 기준으로 magazine를 조회하는 함수
def get_magazines_by_category(conn, categories, limit):
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
    LIMIT {limit}
    """
    with conn.cursor(row_factory=dict_row) as cur:
        cur.execute(query, (categories,))
        return cur.fetchall()

# 특정 magazine을 ID로 조회하는 함수
def get_magazine_by_id(conn, magazine_id):
    """
    특정 magazine_id를 통해 magazine 정보를 조회합니다.
    """
    query = """
    SELECT magazine_id, title, category, created_at, image, content, view_count, likes, law_id
    FROM magazines 
    WHERE magazine_id = %s
    """
    with conn.cursor(row_factory=dict_row) as cur:
        cur.execute(query, (magazine_id,))
        return cur.fetchone()

# 최근 magazine를 조회하는 함수
def get_recent_magazines(conn):
    """
    최신 순으로 magazine 목록을 조회합니다.
    
    Parameters:
    conn (Connection): 데이터베이스 연결 객체
    
    Returns:
    list: 최신 magazine 목록
    """
    query = """
    SELECT magazine_id, title, category, created_at, image, content, view_count, likes, law_id
    FROM magazines 
    ORDER BY created_at DESC
    LIMIT 5
    """
    with conn.cursor(row_factory=dict_row) as cur:
        cur.execute(query)
        return cur.fetchall()

@magazine_router.get("")
def magazine_mount(request: Request, token: str = Depends(get_current_user)):
    """
    사용자의 관심사에 따라 magazine 목록을 제공하는 API 엔드포인트입니다.
    만약 사용자의 관심사에 해당하는 magazine가 없을 경우 최신 magazine를 제공합니다.
    
    Parameters:
    request (Request): FastAPI Request 객체
    token (str): 인증된 사용자의 토큰 (get_current_user를 통해 의존성 주입)
    
    Returns:
    list: magazine 목록
    """
    # 토큰에서 이메일 추출
    user_email = str(token).split("'")[1]

    # DB 연결 획득 및 작업 처리
    with db_connection.get_connection() as conn:
        # 사용자 정보 조회
        user = get_user_by_email(conn, user_email)
        if not user:
            raise HTTPException(status_code=404, detail="사용자를 찾을 수 없습니다.")
        
        # 사용자의 관심사 조회
        user_interests = get_user_interests(conn, user['id'])
        interest_categories = [interest['interests'] for interest in user_interests]
        
        # 관심사가 없을 경우 오류 반환
        if not interest_categories:
            raise HTTPException(status_code=404, detail="관심사를 찾을 수 없습니다.")
        
        # 관심사를 기반으로 magazine 조회
        magazines = get_magazines_by_category(conn, interest_categories, 5)

    return magazines

@magazine_router.get("/{magazine_id}")
def get_magazine(request: Request, magazine_id: int, token: str = Depends(get_current_user)):
    with db_connection.get_connection() as conn:
        # magazine을 조회
        magazine = get_magazine_by_id(conn, magazine_id)
        if not magazine:
            raise HTTPException(status_code=404, detail="해당 magazine을 찾을 수 없습니다.")
        
        # view_count 업데이트
        update_query = "UPDATE magazines SET view_count = view_count + 1 WHERE magazine_id = %s"
        with conn.cursor() as cur:
            cur.execute(update_query, (magazine_id,))
            conn.commit()  # 트랜잭션 커밋

        # 업데이트된 view_count 값을 다시 가져옴
        magazine = get_magazine_by_id(conn, magazine_id)  # 업데이트 후 다시 가져오기

    return magazine
