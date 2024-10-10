from fastapi import APIRouter, HTTPException, Depends
from utils.security import get_current_user
from psycopg.rows import dict_row
from utils.db_connection import DBConnection
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

# FastAPI Router 생성
lawyer_router = APIRouter()

# DBConnection 클래스의 인스턴스 생성
db_connection = DBConnection()

# 사용자 구독 정보와 관심사를 기반으로 코사인 유사도로 변호사 추천
@lawyer_router.get("/recommended-lawyers-cosine")
def get_recommended_lawyers_by_cosine_similarity(token: str = Depends(get_current_user)):
    user_email = token.get("email")  # get_current_user 함수가 토큰에서 이메일을 반환하도록 변경
    
    with db_connection.get_connection() as conn:
        # 사용자 정보 조회
        user_query = "SELECT id FROM user_entity WHERE email = %s"
        with conn.cursor(row_factory=dict_row) as cur:
            cur.execute(user_query, (user_email,))
            user = cur.fetchone()
            if not user:
                raise HTTPException(status_code=404, detail="사용자를 찾을 수 없습니다.")
            
            # 관심사 및 구독 정보 조회
            interests_query = "SELECT interests FROM user_entity_interests WHERE user_entity_id = %s"
            cur.execute(interests_query, (user['id'],))
            interests = [row['interests'] for row in cur.fetchall()] or []

            subscriptions_query = "SELECT subscriptions FROM user_subscriptions WHERE user_id = %s"
            cur.execute(subscriptions_query, (user['id'],))
            subscriptions = [row['subscriptions'] for row in cur.fetchall()] or []

            # 사용자 프로필 생성
            user_profile = " ".join(interests + subscriptions)

            if not user_profile:
                raise HTTPException(status_code=400, detail="사용자의 관심사와 구독 정보가 없습니다.")
            
            # 변호사 데이터 조회
            lawyer_query = """
            SELECT l.lawyer_id, l.expertise_main, u.nickname AS lawyer_name
            FROM lawyer_entity l
            JOIN user_entity u ON l.user_id = u.id
            """
            cur.execute(lawyer_query)
            lawyers = cur.fetchall()

            if not lawyers:
                raise HTTPException(status_code=404, detail="변호사를 찾을 수 없습니다.")

    # 변호사 프로필 벡터화
    lawyer_profiles = [lawyer['expertise_main'] for lawyer in lawyers]
    lawyer_ids = [lawyer['lawyer_id'] for lawyer in lawyers]

    vectorizer = TfidfVectorizer()
    vectors = vectorizer.fit_transform([user_profile] + lawyer_profiles)
    cosine_similarities = cosine_similarity(vectors[0:1], vectors[1:]).flatten()

    # 유사도 정렬 및 상위 10명 추출
    lawyer_similarity_scores = sorted(zip(lawyer_ids, cosine_similarities), key=lambda x: x[1], reverse=True)
    top_lawyer_ids = [lawyer_id for lawyer_id, _ in lawyer_similarity_scores[:10]]

    if not top_lawyer_ids:
        raise HTTPException(status_code=404, detail="추천할 변호사를 찾을 수 없습니다.")

    # 추천 변호사 정보를 포인트 기준으로 정렬하여 반환
    final_query = """
    SELECT l.lawyer_id, l.description, l.expertise_main, u.nickname AS lawyer_name
    FROM lawyer_entity l
    JOIN user_entity u ON l.user_id = u.id
    WHERE l.lawyer_id = ANY(%s)
    ORDER BY l.point DESC
    """
    with db_connection.get_connection() as conn:
        with conn.cursor(row_factory=dict_row) as cur:
            cur.execute(final_query, (top_lawyer_ids,))
            recommended_lawyers = cur.fetchall()

    if not recommended_lawyers:
        raise HTTPException(status_code=404, detail="추천할 변호사를 찾을 수 없습니다.")

    return recommended_lawyers