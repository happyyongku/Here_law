from fastapi import APIRouter, HTTPException, Depends, Request
from utils.security import get_current_user
from psycopg.rows import dict_row
from utils.db_connection import DBConnection

# FastAPI Router 생성
lawyer_router = APIRouter()

# DBConnection 클래스의 인스턴스 생성
db_connection = DBConnection()

# 사용자 관심사 기반으로 포인트가 가장 높은 변호사 순으로 정렬하여 상위 10명 반환
@lawyer_router.get("/top-lawyers")
def get_top_lawyers_by_interests(token: str = Depends(get_current_user)):
    """
    사용자 관심사를 기반으로 포인트가 가장 높은 변호사 10명을 반환하는 API
    """
    # 현재 로그인한 사용자 정보 가져오기
    user_email = str(token).split("'")[1]
    
    # DB 연결 및 작업 처리
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

            if not interests:
                raise HTTPException(status_code=404, detail="사용자의 관심사를 찾을 수 없습니다.")
            
            # 관심사와 관련된 변호사 조회 및 포인트 기준 상위 10명 정렬
            lawyer_query = """
            SELECT l.lawyer_id, l.description, l.expertise_main, l.office_location, 
                   l.qualification, l.phone_number, l.point, u.nickname AS lawyer_name
            FROM lawyer_entity l
            JOIN user_entity u ON l.user_id = u.id
            WHERE l.expertise_main = ANY(%s)
            ORDER BY l.point DESC
            LIMIT 10
            """
            cur.execute(lawyer_query, (interests,))
            top_lawyers = cur.fetchall()

    if not top_lawyers:
        raise HTTPException(status_code=404, detail="관심사와 관련된 변호사를 찾을 수 없습니다.")

    return top_lawyers
  
  
@lawyer_router.get("/recommended-lawyers")
def get_recommended_lawyers_by_subscription(token: str = Depends(get_current_user)):
    """
    사용자 구독 정보를 기반으로 관련 변호사를 추천하는 API.
    구독 정보에 따라 포인트가 가장 높은 변호사들을 반환합니다.
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
            
            # 사용자 구독 정보 조회
            subscriptions_query = """
            SELECT subscriptions FROM user_subscriptions WHERE user_id = %s
            """
            cur.execute(subscriptions_query, (user['id'],))
            subscriptions = [row['subscriptions'] for row in cur.fetchall()]

            if not subscriptions:
                raise HTTPException(status_code=404, detail="사용자의 구독 정보를 찾을 수 없습니다.")
            
            # 구독 정보와 관련된 변호사 조회 및 포인트 기준 상위 10명 정렬
            lawyer_query = """
            SELECT l.lawyer_id, l.description, l.expertise_main, l.office_location, 
                   l.qualification, l.phone_number, l.point, u.nickname AS lawyer_name
            FROM lawyer_entity l
            JOIN user_entity u ON l.user_id = u.id
            WHERE l.expertise_main = ANY(%s)
            ORDER BY l.point DESC
            LIMIT 10
            """
            cur.execute(lawyer_query, (subscriptions,))
            recommended_lawyers = cur.fetchall()

    if not recommended_lawyers:
        raise HTTPException(status_code=404, detail="구독 정보와 관련된 변호사를 찾을 수 없습니다.")

    return recommended_lawyers