from fastapi import APIRouter, HTTPException, Depends, status, Request
from utils.security import get_current_user
from pydantic import BaseModel
from sqlalchemy import create_engine, Column, Integer, String, Text, TIMESTAMP, null
from sqlalchemy.ext. declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from sqlalchemy.sql import func
import requests
import os
import logging


router = APIRouter()

DB_USERNAME = os.environ.get('DB_USERNAME')
DB_PASSWORD = os.environ.get('DB_PASSWORD')
DB_DOMAIN = os.environ.get("DB_DOMAIN")
DB_PORT_FASTAPI = os.environ.get("DB_PORT_FASTAPI")
DB_NAME = os.environ.get("DB_NAME")

DATABASE_URL = f"postgresql://{DB_USERNAME}:{DB_PASSWORD}@{DB_DOMAIN}:{DB_PORT_FASTAPI}/{DB_NAME}"

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
        
class Magazine(Base):
    __tablename__ = "magazines"
    magazine_id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullabale=False)
    category = Column(String(100), nullable=False)
    created_at = Column(TIMESTAMP, server_default=func.now(), nullable=False)
    image = Column(String(255), default='default.jpg')
    content = Column(Text, nullable=False)
    view_count = Column(Integer, default=0)
    likes = Column(Integer, default=0)

@router.get("/")
def magazine_mount(request:Request, user:str=Depends(get_current_user), db: Session=Depends(get_db)):
    magazines = db.query(Magazine).order_by(Magazine.created_at.desc()).limit(5).all()
    return magazines
    