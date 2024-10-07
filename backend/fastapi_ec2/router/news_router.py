from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import List
import psycopg2
from psycopg2.extras import RealDictCursor

# APIRouter 객체 생성
news_router = APIRouter()

# PostgreSQL 데이터베이스 연결 설정
def get_db():
    conn = psycopg2.connect(
        dbname="here_law",
        user="here_law_admin",
        password="1234",
        host="3.36.85.129",
        port="5434",
        cursor_factory=RealDictCursor
    )
    try:
        yield conn
    finally:
        conn.close()

# Pydantic 모델 정의
class News(BaseModel):
    id: int
    title: str
    category: str
    image: str = None
    content: str
    view_count: int
    likes: int
    created_at: str

# 1. 모든 뉴스 조회 API (조회수 증가 없음)
@news_router.get("/news/", response_model=List[News])
def get_all_news(skip: int = 0, limit: int = 10, db: psycopg2.extensions.connection = Depends(get_db)):
    cursor = db.cursor()
    query = "SELECT * FROM news ORDER BY created_at DESC;"
    cursor.execute(query, (skip, limit))
    news_list = cursor.fetchall()
    return news_list

# 2. 특정 뉴스 조회 API (조회할 때마다 조회수 증가)
@news_router.get("/news/{news_id}", response_model=News)
def get_news(news_id: int, db: psycopg2.extensions.connection = Depends(get_db)):
    cursor = db.cursor()
    
    # 조회수 증가
    update_query = "UPDATE news SET view_count = view_count + 1 WHERE id = %s RETURNING *;"
    cursor.execute(update_query, (news_id,))
    news = cursor.fetchone()

    if news is None:
        raise HTTPException(status_code=404, detail="News not found")
    
    db.commit()  # 데이터베이스 변경 사항 적용
    
    return news

# 3. 뉴스 좋아요/취소 토글 API
@news_router.post("/news/{news_id}/like", response_model=News)
def toggle_like(news_id: int, db: psycopg2.extensions.connection = Depends(get_db)):
    cursor = db.cursor()
    
    # 현재 좋아요 상태를 가져옴
    query = "SELECT likes FROM news WHERE id = %s;"
    cursor.execute(query, (news_id,))
    news = cursor.fetchone()

    if news is None:
        raise HTTPException(status_code=404, detail="News not found")
    
    # 좋아요 토글: 0이면 +1, 1 이상이면 -1
    new_likes = news['likes'] + 1 if news['likes'] == 0 else news['likes'] - 1
    
    # 좋아요 상태 업데이트
    update_query = "UPDATE news SET likes = %s WHERE id = %s RETURNING *;"
    cursor.execute(update_query, (new_likes, news_id))
    updated_news = cursor.fetchone()

    db.commit()  # 데이터베이스 변경 사항 적용

    return updated_news
