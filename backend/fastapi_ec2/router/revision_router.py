from fastapi import APIRouter, HTTPException, Depends, Request
import psycopg2
from psycopg.rows import dict_row
from utils.db_connection import DBConnection
from utils.security import get_current_user

# DBConnection 클래스의 인스턴스 생성
db_connection = DBConnection()

# APIRouter 객체 생성
revision_router = APIRouter()

# proclamation_date로 개정 정보를 조회하는 라우터
@revision_router.get("/law-revision/{proclamation_date}")
def get_law_by_proclamation_date(proclamation_date: str, request: Request, token: str = Depends(get_current_user)):
    """
    특정 공포일에 해당하는 법률 개정 정보를 반환하는 API
    """
    # DB 연결 획득 및 작업 처리
    with db_connection.get_connection() as conn:
        query = """
        SELECT law_name, proclamation_date, revision_date, status, content, reason
        FROM law_revision
        WHERE proclamation_date = %s
        """
        with conn.cursor(row_factory=dict_row) as cur:
            cur.execute(query, (proclamation_date,))
            law_info = cur.fetchall()

            # 해당 날짜에 법률 정보가 없을 경우
            if not law_info:
                raise HTTPException(status_code=404, detail="해당 공포일에 해당하는 법률 정보를 찾을 수 없습니다.")
    
    # 결과 반환
    return law_info
