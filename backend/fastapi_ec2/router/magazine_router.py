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


@magazine_router.post("/{magazine_id}/like")
def toggle_like(request: Request, magazine_id: int, token: str = Depends(get_current_user)):
    """
    좋아요 기능 API: 특정 magazine_id에 대해 사용자가 좋아요를 누르면 기록을 추가,
    이미 좋아요를 누른 상태면 기록을 삭제하고, user_magazine_likes의 레코드 수로 likes를 계산.
    """
    # 현재 로그인한 사용자 정보를 가져오기
    user_email = str(token).split("'")[1]
    with db_connection.get_connection() as conn:
        # 사용자 정보 조회
        user = get_user_by_email(conn, user_email)
        if not user:
            raise HTTPException(status_code=404, detail="사용자를 찾을 수 없습니다.")

        # magazine 조회
        magazine = get_magazine_by_id(conn, magazine_id)
        if not magazine:
            raise HTTPException(status_code=404, detail="해당 magazine을 찾을 수 없습니다.")

        # 사용자가 이미 해당 magazine에 대해 좋아요를 눌렀는지 확인
        check_like_query = """
        SELECT * FROM user_magazine_likes WHERE user_id = %s AND magazine_id = %s
        """
        with conn.cursor(row_factory=dict_row) as cur:
            cur.execute(check_like_query, (user['id'], magazine_id))
            existing_like = cur.fetchone()

            if existing_like:
                # 이미 좋아요를 눌렀다면 좋아요 취소 (기록 삭제)
                delete_like_query = "DELETE FROM user_magazine_likes WHERE id = %s"
                cur.execute(delete_like_query, (existing_like['id'],))
                action = "좋아요를 취소했습니다."
            else:
                # 좋아요를 누르지 않았다면 좋아요 추가 (기록 삽입)
                insert_like_query = "INSERT INTO user_magazine_likes (user_id, magazine_id) VALUES (%s, %s)"
                cur.execute(insert_like_query, (user['id'], magazine_id))
                action = "좋아요를 추가했습니다."

            # 트랜잭션 커밋 (좋아요 추가/취소 이후에 반영)
            conn.commit()

            # 좋아요 수 카운트 (user_magazine_likes에서 레코드 수 계산)
            count_likes_query = "SELECT COUNT(*) FROM user_magazine_likes WHERE magazine_id = %s"
            cur.execute(count_likes_query, (magazine_id,))
            like_count = cur.fetchone()['count']
            
            # magazines 테이블의 likes 필드 업데이트
            update_magazine_query = "UPDATE magazines SET likes = %s WHERE magazine_id = %s"
            cur.execute(update_magazine_query, (like_count, magazine_id))

            # 다시 한번 트랜잭션 커밋 (likes 업데이트 반영)
            conn.commit()

    return {"message": action, "updated_likes": like_count}

@magazine_router.get("/top-liked")
def get_top_liked_magazines(request: Request, token: str = Depends(get_current_user)):
    """
    좋아요 순으로 정렬된 magazine 목록을 30개까지 반환하는 API 엔드포인트입니다.
    """
    with db_connection.get_connection() as conn:
        query = """
        SELECT magazine_id, title, category, created_at, image, content, view_count, likes, law_id
        FROM magazines
        ORDER BY likes DESC
        LIMIT 30;
        """
        with conn.cursor(row_factory=dict_row) as cur:
            cur.execute(query)
            top_liked_magazines = cur.fetchall()

    return top_liked_magazines


@magazine_router.get("/top-viewed")
def get_top_viewed_magazines(request: Request, token: str = Depends(get_current_user)):
    """
    조회수 순으로 정렬된 magazine 목록을 30개까지 반환하는 API 엔드포인트입니다.
    """
    with db_connection.get_connection() as conn:
        query = """
        SELECT magazine_id, title, category, created_at, image, content, view_count, likes, law_id
        FROM magazines
        ORDER BY view_count DESC
        LIMIT 30;
        """
        with conn.cursor(row_factory=dict_row) as cur:
            cur.execute(query)
            top_viewed_magazines = cur.fetchall()

    return top_viewed_magazines

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