from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from utils.db_connection import DBConnection

# 라우터 생성
case_router = APIRouter()

# PostgreSQL 연결 정보

# Pydantic 모델 (응답 데이터 형식 정의)
class LegalCase(BaseModel):
    case_info_id: str
    case_name: str
    case_number: str
    judgment_date: str
    judgment: str
    court_name: str
    case_type: str
    judgment_type: str
    issues: str
    judgment_summary: str
    reference_clause: str
    reference_cases: str
    full_text: str

# 데이터베이스 연결 함수
def get_db_connection():
    db_instance = DBConnection()
    return db_instance()

# 판례 일련번호로 데이터를 조회하는 API
@case_router.get("/cases/{case_info_id}", response_model=LegalCase)
def get_case_by_info_id(case_info_id: str):
    conn = get_db_connection()
    cur = conn.cursor()

    try:
        # 데이터베이스에서 판례일련번호로 조회
        cur.execute("SELECT * FROM legal_cases WHERE case_info_id = %s", (case_info_id,))
        row = cur.fetchone()

        # 데이터가 없는 경우 404 오류 반환
        if row is None:
            raise HTTPException(status_code=404, detail="Case not found")

        # 데이터가 있는 경우 Pydantic 모델에 맞춰 변환하여 반환
        legal_case = LegalCase(
            case_info_id=row[0],
            case_name=row[1],
            case_number=row[2],
            judgment_date=row[3],
            judgment=row[4],
            court_name=row[5],
            case_type=row[6],
            judgment_type=row[7],
            issues=row[8],
            judgment_summary=row[9],
            reference_clause=row[10],
            reference_cases=row[11],
            full_text=row[12]
        )

        return legal_case
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cur.close()
        conn.close()
