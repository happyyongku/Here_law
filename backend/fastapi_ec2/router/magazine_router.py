from http import server
from turtle import st
from fastapi import APIRouter, HTTPException, Depends, status, Request, Response
from fastapi.responses import JSONResponse
from utils.security import get_current_user
from pydantic import BaseModel
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session, relationship
from dotenv import load_dotenv
from dto.user_model import UserEntity, UserInterests, Magazine, UserSubscription
import requests
import os
import logging


router = APIRouter()
# load_dotenv()

DB_USERNAME = os.environ.get('DB_USERNAME')
DB_PASSWORD = os.environ.get('DB_PASSWORD')
DB_DOMAIN = os.environ.get("DB_DOMAIN")
DB_HOST = os.environ.get("DB_HOST")
DB_PORT_FASTAPI = os.environ.get("DB_PORT_FASTAPI")
DB_NAME = os.environ.get("DB_NAME")

DATABASE_URL = f"postgresql://{DB_USERNAME}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT_FASTAPI}/{DB_NAME}"
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base = declarative_base()
# ------------------------------------------------변수 영역-----------------------------------------

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
        
def interest_query(user, db):
    try:
        user_intersts = db.query(UserInterests).filter(UserInterests.user_entity_id == user.id).all()
        interest_categories = [interest.interests for interest in user_intersts]
        magazines = (db.query(Magazine)
                    .filter(Magazine.category.in_(interest_categories))
                    .order_by(Magazine.created_at.desc())
                    .limit(5)
                    .all())
        if not magazines:
            print("No interest Magazine")
            magazines = db.query(Magazine).order_by(Magazine.created_at.desc()).limit(5).all()
    except:
        print("Error in interest")
        magazines = db.query(Magazine).order_by(Magazine.created_at.desc()).limit(5).all()
    
    return [mag.as_dict() for mag in magazines]

def subscriptions_query(user, db):
    try:
        user_subscriptions = db.query(UserSubscription).filter(UserSubscription.user_id == user.id).all()
        subscription_category = [subscription.subscriptions for subscription in user_subscriptions]
        magazines = (db.query(Magazine)
                    .filter(Magazine.category.in_(subscription_category))
                    .order_by(Magazine.created_at)
                    .limit(5)
                    .all())
        if not magazines:
            print("No subscription Magazine")
            magazines = db.query(Magazine).order_by(Magazine.created_at.desc()).limit(5).all()
    except:
        print("Error in Subscription")
        magazines = db.query(Magazine).order_by(Magazine.created_at.desc()).limit(5).all()
    
    return [mag.as_dict() for mag in magazines]

def most_view_query(db):
    magazines = db.query(Magazine).order_by(Magazine.view_count.desc()).limit(5).all()
    return [mag.as_dict() for mag in magazines]

def most_like_query(db):
    magazines = db.query(Magazine).order_by(Magazine.likes.desc()).limit(5).all()
    return [mag.as_dict() for mag in magazines]

# -----------------------------------------------함수 영역 ------------------------------------------------

@router.get("/")
def magazine_mount_interest(token:str=Depends(get_current_user), db: Session=Depends(get_db)):
    user_email = str(token).split("'")[1]
    user = db.query(UserEntity).filter(UserEntity.email == user_email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    interest_magazines = interest_query(user, db)
    subscription_magazines = subscriptions_query(user, db)
    view_count_magazines = most_view_query(db)
    likes_magazines = most_like_query(db)
    
    magazines_obj = {
        'interest': interest_magazines,
        'subscription': subscription_magazines,
        'view_count': view_count_magazines,
        'likes': likes_magazines
    }
    
    return JSONResponse(content=magazines_obj)