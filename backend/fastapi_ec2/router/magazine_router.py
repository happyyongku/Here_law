from http import server
from turtle import st
from fastapi import APIRouter, HTTPException, Depends, status, Request
from utils.security import get_current_user
from pydantic import BaseModel
from sqlalchemy import BIGINT, VARCHAR, BigInteger, Boolean, ForeignKey, create_engine, Column, Integer, String, Text, TIMESTAMP, null, ForeignKey
from sqlalchemy.ext. declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session, relationship
from sqlalchemy.sql import func
from dotenv import load_dotenv
import requests
import os
import logging


router = APIRouter()
load_dotenv()

DB_USERNAME = os.environ.get('DB_USERNAME')
DB_PASSWORD = os.environ.get('DB_PASSWORD')
DB_DOMAIN = os.environ.get("DB_DOMAIN")
DB_HOST = os.environ.get("DB_HOST")
DB_PORT_FASTAPI = os.environ.get("DB_PORT_FASTAPI")
DB_NAME = os.environ.get("DB_NAME")

DATABASE_URL = f"postgresql://{DB_USERNAME}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT_FASTAPI}/{DB_NAME}"

print(f"DATABASE_URL={DATABASE_URL}")

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
        
class UserEntity(Base):
    __tablename__="user_entity"
    id = Column(BigInteger, primary_key=True, index=True)
    created_date = Column(TIMESTAMP, server_default=func.now(), nullable=False)
    email = Column(String(255), nullable=True)
    email_token=Column(String(255), nullable=True)
    is_email_verified = Column(Boolean, nullable=True)
    is_first=Column(Boolean, nullable=True)
    nickname=Column(String(255), nullable=True)
    password=Column(String(255), nullable=True)
    phone_number=Column(String(255), nullable=True)
    update_date=Column(TIMESTAMP, server_default=func.now(), nullable=True)
    user_type=Column(String(255), nullable=True)
    
    interests = relationship("UserInterests", back_populates="user")

class UserInterests(Base):
    __tablename__="user_entity_interests"
    user_entity_id = Column(BigInteger, ForeignKey("user_entity.id"), nullable=False, primary_key=True)
    interests = Column(String(255))
    user = relationship("UserEntity", back_populates="interests")
        
class Magazine(Base):
    __tablename__ = "magazines"
    magazine_id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    category = Column(String(100), nullable=False)
    created_at = Column(TIMESTAMP, server_default=func.now(), nullable=False)
    image = Column(String(255), default='default.jpg')
    content = Column(Text, nullable=False)
    view_count = Column(Integer, default=0)
    likes = Column(Integer, default=0)
    


@router.get("/")
def magazine_mount(request:Request, token:str=Depends(get_current_user), db: Session=Depends(get_db)):
    user_email = str(token).split("'")[1]
    user = db.query(UserEntity).filter(UserEntity.email == user_email).first()
    print("///////////////////////////////")
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    user_intersts = db.query(UserInterests).filter(UserInterests.user_entity_id == user.id).all()
    interest_categories = [interest.interests for interest in user_intersts]
    if not interest_categories:
        raise HTTPException(status_code=404, detail="Interest not found")
    
    magazines = (db.query(Magazine)
                .filter(Magazine.category.in_(interest_categories))
                .order_by(Magazine.created_at.desc())
                .limit(5)
                .all())
    if not magazines:
        magazines = db.query(Magazine).order_by(Magazine.created_at.desc()).limit(5).all() 

    return magazines