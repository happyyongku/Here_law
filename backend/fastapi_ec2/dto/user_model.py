from pydantic import BaseModel
from sqlalchemy import BIGINT, VARCHAR, BigInteger, Boolean, ForeignKey, create_engine, Column, Integer, String, Text, TIMESTAMP, null, ForeignKey
from sqlalchemy.ext. declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session, relationship
from sqlalchemy.sql import func
from datetime import datetime

Base = declarative_base()

class User(BaseModel):
    email: str
    
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
    subscriptions = relationship("UserSubscription", back_populates="user")

class UserInterests(Base):
    __tablename__="user_entity_interests"
    user_entity_id = Column(BigInteger, ForeignKey("user_entity.id"), nullable=False, primary_key=True)
    interests = Column(String(255), nullable=True)
    user = relationship("UserEntity", back_populates="interests")
    
class UserSubscription(Base):
    __tablename__="user_subscriptions"
    user_id = Column(BigInteger, ForeignKey("user_entity.id"), nullable=False, primary_key=True)
    subscriptions = Column(String(255), nullable=True)
    user = relationship("UserEntity", back_populates="subscriptions")
    
        
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
    
    def as_dict(self):
        return {
            'magazine_id':self.magazine_id,
            'title': self.title,
            'category': self.category,
            'created_at': self.created_at.isoformat() if isinstance(self.created_at, datetime) else None,
            'image': self.image,
            'content': self.content,
            'view_count': self.view_count,
            'likes': self.likes
        }


    