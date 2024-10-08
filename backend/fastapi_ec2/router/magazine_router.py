from fastapi import APIRouter, HTTPException, Depends, Request
from utils.security import get_current_user
import logging
from contextlib import contextmanager
from psycopg.rows import dict_row
from utils.user_service import get_user_by_email, get_user_interests
from utils.magazine_service import get_magazine_by_id, get_magazines_by_category, get_recent_magazines
from utils.db_connection import DBConnection

magazine_router = APIRouter()

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

    # 사용자 정보 조회
    user = get_user_by_email(user_email)
    if not user:
        raise HTTPException(status_code=404, detail="사용자를 찾을 수 없습니다.")
    
    # 사용자의 관심사 조회
    user_interests = get_user_interests(user['id'])
    interest_categories = [interest['interests'] for interest in user_interests]
    
    # 관심사가 없을 경우 오류 반환
    if not interest_categories:
        raise HTTPException(status_code=404, detail="관심사를 찾을 수 없습니다.")
    
    # 관심사를 기반으로 magazine 조회
    magazines = get_magazines_by_category(interest_categories, 5)

    return magazines


@magazine_router.post("/{magazine_id}/like")
def toggle_like(request: Request, magazine_id: int, token: str = Depends(get_current_user)):
    """
    좋아요 기능 API: 특정 magazine_id에 대해 사용자가 좋아요를 누르면 기록을 추가,
    이미 좋아요를 누른 상태면 기록을 삭제하고, user_magazine_likes의 레코드 수로 likes를 계산.
    """
    # 현재 로그인한 사용자 정보를 가져오기
    user_email = str(token).split("'")[1]
    # 사용자 정보 조회
    user = get_user_by_email(user_email)
    if not user:
        raise HTTPException(status_code=404, detail="사용자를 찾을 수 없습니다.")

    # magazine 조회
    magazine = get_magazine_by_id(magazine_id)
    if not magazine:
        raise HTTPException(status_code=404, detail="해당 magazine을 찾을 수 없습니다.")

    # 사용자가 이미 해당 magazine에 대해 좋아요를 눌렀는지 확인
    check_like_query = """
    SELECT * FROM user_magazine_likes WHERE user_id = %s AND magazine_id = %s
    """
    with DBConnection.get_connection().cursor(row_factory=dict_row) as cur:
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
            top_liked_magazines = cur.fetchall()  # 쿼리 실행 후 데이터 가져오기

            if not top_liked_magazines:
                raise HTTPException(status_code=404, detail="No magazines found.")

    return top_liked_magazines  # 결과를 명시적으로 반환



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


@magazine_router.get("/category/{category}")
def get_magazines_by_category_endpoint(category: str, request: Request, token: str = Depends(get_current_user)):
    """
    카테고리별로 magazine 목록을 반환하는 API 엔드포인트입니다.
    """
    with db_connection.get_connection() as conn:
        query = """
        SELECT magazine_id, title, category, created_at, image, content, view_count, likes, law_id
        FROM magazines
        WHERE category = %s
        ORDER BY created_at DESC;
        """
        with conn.cursor(row_factory=dict_row) as cur:
            cur.execute(query, (category,))
            magazines = cur.fetchall()  # 해당 카테고리의 데이터 가져오기

            if not magazines:
                raise HTTPException(status_code=404, detail=f"해당 카테고리 '{category}'에 해당하는 magazine을 찾을 수 없습니다.")

    return magazines  # 카테고리별 magazine 목록 반환
