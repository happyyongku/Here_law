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
    """
    사용자의 구독 정보와 관심사를 기반으로 코사인 유사도를 계산하여 관련 변호사를 추천하는 API.
    유사도가 높은 변호사들을 포인트 순으로 정렬하여 상위 10명 반환.
    """
    # 현재 로그인한 사용자 정보 가져오기
    user_email = str(token).split("'")[1]
    
    with db_connection.get_connection() as conn:
        # 사용자 정보 조회
        user_query = """
        SELECT id FROM user_entity WHERE email = %s
        """
        with conn.cursor(row_factory=dict_row) as cur:
            cur.execute(user_query, (user_email,))
            user = cur.fetchone()
            if not user:
                raise HTTPException(status_code=404, detail="사용자를 찾을 수 없습니다.")
            
            # 사용자 관심사 조회
            interests_query = """
            SELECT interests FROM user_entity_interests WHERE user_entity_id = %s
            """
            cur.execute(interests_query, (user['id'],))
            interests = [row['interests'] for row in cur.fetchall()]

            # 사용자 구독 정보 조회
            subscriptions_query = """
            SELECT subscriptions FROM user_subscriptions WHERE user_id = %s
            """
            subscriptions = [row['subscriptions'] for row in cur.fetchall()]

            # 사용자 데이터 벡터화 준비
            user_profile = " ".join(interests + subscriptions)

            # 변호사 데이터 조회
            lawyer_query = """
            SELECT l.lawyer_id, l.description, l.expertise_main, l.office_location, 
                   l.qualification, l.phone_number, l.point, u.nickname AS lawyer_name
            FROM lawyer_entity l
            JOIN user_entity u ON l.user_id = u.id
            """
            cur.execute(lawyer_query)
            lawyers = cur.fetchall()

            if not lawyers:
                raise HTTPException(status_code=404, detail="변호사를 찾을 수 없습니다.")

    # 변호사들의 전문 분야를 벡터화
    lawyer_profiles = [lawyer['expertise_main'] for lawyer in lawyers]
    lawyer_ids = [lawyer['lawyer_id'] for lawyer in lawyers]

    # 사용자 프로필과 변호사 프로필을 벡터화
    vectorizer = TfidfVectorizer()
    vectors = vectorizer.fit_transform([user_profile] + lawyer_profiles)
    
    # 코사인 유사도 계산 (사용자 벡터와 변호사 벡터들 간의 유사도)
    cosine_similarities = cosine_similarity(vectors[0:1], vectors[1:]).flatten()

    # 변호사 ID와 유사도를 묶어 정렬 (유사도가 높은 순서대로)
    lawyer_similarity_scores = list(zip(lawyer_ids, cosine_similarities))
    sorted_lawyers = sorted(lawyer_similarity_scores, key=lambda x: x[1], reverse=True)

    # 상위 10명의 변호사 ID 추출
    top_lawyer_ids = [lawyer_id for lawyer_id, _ in sorted_lawyers[:10]]

    # 상위 10명의 변호사 정보를 포인트 기준으로 정렬하여 가져오기
    final_query = """
    SELECT l.lawyer_id, l.description, l.expertise_main, l.office_location, 
           l.qualification, l.phone_number, l.point, u.nickname AS lawyer_name
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
  
@lawyer_router.get("/lawyer/{lawyer_id}")
def get_lawyer_details(lawyer_id: int):
    """
    특정 변호사의 상세 정보를 조회하는 API.
    lawyer_entity와 user_entity의 정보를 모두 반환합니다.
    """
    with db_connection.get_connection() as conn:
        # 변호사와 관련된 정보 조회
        query = """
        SELECT l.lawyer_id, l.description, l.expertise_main, l.office_location, 
               l.qualification, l.phone_number AS lawyer_phone, l.point, 
               u.id AS user_id, u.created_date, u.email, u.is_email_verified, 
               u.nickname, u.profile_img, u.update_date, u.user_type, u.phone_number AS user_phone
        FROM lawyer_entity l
        JOIN user_entity u ON l.user_id = u.id
        WHERE l.lawyer_id = %s
        """
        with conn.cursor(row_factory=dict_row) as cur:
            cur.execute(query, (lawyer_id,))
            lawyer_details = cur.fetchone()

    if not lawyer_details:
        raise HTTPException(status_code=404, detail="해당 변호사의 정보를 찾을 수 없습니다.")

    return lawyer_details
  