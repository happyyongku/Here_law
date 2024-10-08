# bills_router.py
#

from fastapi import APIRouter, HTTPException
import psycopg2
from psycopg2.extras import RealDictCursor
from typing import List

# 라우터 생성
bill_router = APIRouter()

# PostgreSQL 연결 함수
def connect_db():
    return psycopg2.connect(
        dbname="here_law",
        user="here_law_admin",
        password="1234",
        host="3.36.85.129",
        port="5434",
        cursor_factory=RealDictCursor  # 쿼리 결과를 딕셔너리 형태로 반환
    )

# 데이터베이스에서 법안 정보 조회 함수
def get_bill_data():
    conn = connect_db()
    try:
        cur = conn.cursor()
        cur.execute("SELECT * FROM bills")
        result = cur.fetchall()
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching data: {e}")
    finally:
        cur.close()
        conn.close()

# 모든 법안 데이터를 반환하는 API 엔드포인트
@bill_router.get("/bills", response_model=List[dict])
async def read_bills():
    bills = get_bill_data()
    if not bills:
        raise HTTPException(status_code=404, detail="No bills found")
    return bills

# 특정 법안 ID로 법안을 조회하는 API 엔드포인트
@bill_router.get("/bills/{bill_id}", response_model=dict)
async def read_bill_by_id(bill_id: str):
    conn = connect_db()
    try:
        cur = conn.cursor()
        cur.execute("SELECT * FROM bills WHERE bill_id = %s", (bill_id,))
        bill = cur.fetchone()
        if not bill:
            raise HTTPException(status_code=404, detail="Bill not found")
        return bill
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error fetching bill: {e}")
    finally:
        cur.close()
        conn.close()