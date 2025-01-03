from curses.ascii import HT
from shutil import ExecError
from turtle import st
from fastapi import APIRouter, HTTPException, Depends, Request
from utils.security import get_current_user
import numpy as np
import logging
from contextlib import contextmanager
from psycopg.rows import dict_row
from utils.user_service import get_user_by_email, get_user_interests
from utils.magazine_service import (
    get_magazine_by_id,
    get_magazines_by_law_ids,
    get_magazines_by_category,
    get_magazines_by_user_liked,
    )
from utils.db_connection import DBConnection
from utils.magazine_vector_database import MagazineVectorDatabase

from dto.user_model import User

magazine_router = APIRouter()

@magazine_router.get("")
def magazine_mount(request: Request, user: User = Depends(get_current_user)):
    """
    사용자의 관심사에 따라 magazine 목록을 추천해 제공. 사용자가 like 한 Magazine과 관심분야의 최신 Magazine 들을 고려하여 AI 기반으로 추천함.
    Parameters:
    request (Request): FastAPI Request 객체
    token (str): 인증된 사용자의 토큰 (get_current_user를 통해 의존성 주입)
    
    Returns:
    list: magazine 목록
    """
    # 토큰에서 이메일 추출
    user_email = user.email

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
    candi_magazines = get_magazines_by_user_liked(user['id'], 10)
    if len(candi_magazines) == 0:
        candi_magazines = get_magazines_by_category(interest_categories, 10)
    else:
        candi_magazines += get_magazines_by_category(interest_categories, len(candi_magazines))
    if len(candi_magazines) == 0:
        raise HTTPException(status_code=500, detail="관련된 Document를 찾을 수 없음!")
    
    vector_store = MagazineVectorDatabase().vector_store
    embedder = vector_store.embeddings
    embedded = embedder.embed_documents([doc["content"] for doc in candi_magazines])
    query_vec = np.average(embedded, axis= 0)
    result_docs = vector_store.similarity_search_by_vector(query_vec, k = 30)
    return get_magazines_by_law_ids([document.metadata["id"] for document in result_docs])


@magazine_router.post("/{magazine_id}/like")
def toggle_like(request: Request, magazine_id: int, user: User = Depends(get_current_user)):
    """
    좋아요 기능 API: 특정 magazine_id에 대해 사용자가 좋아요를 누르면 기록을 추가,
    이미 좋아요를 누른 상태면 기록을 삭제하고, user_magazine_likes의 레코드 수로 likes를 계산.
    """
    # 현재 로그인한 사용자 정보를 가져오기
    user_email = user.email
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
    with DBConnection().get_connection() as conn:
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
def get_top_liked_magazines(request: Request, user: User = Depends(get_current_user)):
    """
    좋아요 순으로 정렬된 magazine 목록을 30개까지 반환하는 API 엔드포인트입니다.
    """
    with DBConnection().get_connection() as conn:
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
def get_top_viewed_magazines(request: Request, user: User = Depends(get_current_user)):
    """
    조회수 순으로 정렬된 magazine 목록을 30개까지 반환하는 API 엔드포인트입니다.
    """
    with DBConnection().get_connection() as conn:
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
def get_magazine(request: Request, magazine_id: int, user: User = Depends(get_current_user)):
    with DBConnection().get_connection() as conn:
        # magazine을 조회
        magazine = get_magazine_by_id(magazine_id)
        if not magazine:
            raise HTTPException(status_code=404, detail="해당 magazine을 찾을 수 없습니다.")
        
        # view_count 업데이트
        update_query = "UPDATE magazines SET view_count = view_count + 1 WHERE magazine_id = %s"
        with conn.cursor() as cur:
            cur.execute(update_query, (magazine_id,))
            conn.commit()  # 트랜잭션 커밋

        # 업데이트된 view_count 값을 다시 가져옴
        magazine = get_magazine_by_id(magazine_id)  # 업데이트 후 다시 가져오기

    return magazine


@magazine_router.get("/category/{category}")
def get_magazines_by_category_endpoint(category: str, request: Request, user: User = Depends(get_current_user)):
    """
    카테고리별로 magazine 목록을 반환하는 API 엔드포인트입니다.
    """
    with DBConnection().get_connection() as conn:
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

@magazine_router.get("/like-status/{magazine_id}")
def check_like_status(magazine_id: int, user: User = Depends(get_current_user)):
    """
    사용자가 해당 magazine에 좋아요를 눌렀는지 여부를 확인하는 API
    """
    # 현재 로그인한 사용자 정보 가져오기
    user_email = user.email
    # 사용자 정보 조회
    user = get_user_by_email(user_email)
    if not user:
        raise HTTPException(status_code=404, detail="사용자를 찾을 수 없습니다.")

    # 좋아요 여부 확인 쿼리
    check_like_query = """
    SELECT 1 FROM user_magazine_likes WHERE user_id = %s AND magazine_id = %s
    """
    with DBConnection().get_connection() as conn:
        with conn.cursor() as cur:
            cur.execute(check_like_query, (user['id'], magazine_id))
            existing_like = cur.fetchone()

    return {"liked": bool(existing_like)}  # 좋아요 여부 반환

@magazine_router.post("/subscribe/{category}")
def toggle_subscribe_category(category: str, user: User = Depends(get_current_user)):
    """
    사용자가 구독 버튼을 눌렀을 때 구독하거나 구독을 해제하는 API
    """
    # 사용자 확인
    user_email = user.email
    user = get_user_by_email(user_email)
    if not user:
        raise HTTPException(status_code=404, detail="사용자를 찾을 수 없습니다.")
    
    check_subscibe_query = """
    SELECT * FROM user_entity_interests WHERE user_id = %s AND subscriptions = %s
    """
    with DBConnection().get_connection() as conn:
        with conn.cursor(row_factory=dict_row) as cur:
            try:
                cur.execute(check_subscibe_query, (user['id'], category))
                existing_subscribe = cur.fetchone()
                print(f"Existing_subscribe: {existing_subscribe}")
            except Exception as e:
                raise HTTPException(status_code=500, detail=f"Error occured in existing_subscribe: {str(e)}")
            
            # 구독하였을 경우 구독 해제
            if existing_subscribe:
                delete_subscribe_query = "DELETE FROM user_entity_interests WHERE user_id = %s And subscriptions = %s"
                cur.execute(delete_subscribe_query, (existing_subscribe['user_id'], existing_subscribe['subscriptions']))
                action = True
            # 구독하지 않았을 경우 구독
            else:
                insert_subscribe_query = "INSERT INTO user_entity_interests (user_id, subscriptions) VALUES (%s, %s)"
                cur.execute(insert_subscribe_query, (user['id'], category))
                action = False
                
            conn.commit()
            
    return {"response": action}

@magazine_router.get("/subscribe_check/{category}")
def subscribe_category_check(category: str, user: User = Depends(get_current_user)):
    user_email = user.email
    user = get_user_by_email(user_email)
    if not user:
        raise HTTPException(status_code=404, detail="사용자를 찾을 수 없습니다.")
    print(f"User : {user}")
    check_subscibe_query = """
    SELECT * FROM user_entity_interests WHERE user_id = %s AND subscriptions = %s
    """
    with DBConnection().get_connection() as conn:
        with conn.cursor(row_factory=dict_row) as cur:
            try:
                cur.execute(check_subscibe_query, (user['id'], category))
                existing_subscribe = cur.fetchone()
                print(f"Exist : {existing_subscribe}")
                if existing_subscribe:
                    return {"subscribe":True}
                else:
                    return {"subscribe":False}
            except Exception as e:
                raise HTTPException(status_code=500, detail=f"Error occured in existing_subscribe: {str(e)}")