# security.py
import os
from typing import Optional
import logging

import jwt
from jwt import PyJWTError
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer

from dto.user_model import User

# JWT 토큰을 인코딩하고 디코딩하기 위한 비밀 키
JWT_SECRET_KEY = os.environ.get("JWT_SECRET")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.environ.get("JWT_EXPIRATION"))
ALGORITHM = "HS512"

# OAuth2 스킴 설정
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/token")

async def get_current_user(token: str = Depends(oauth2_scheme)) -> User:
    # 인증 예외 설정
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="자격 증명을 확인할 수 없습니다.",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        # JWT 토큰 디코딩
        logging.debug(f"get_current_user: got {token}")
        payload = jwt.decode(token, JWT_SECRET_KEY, algorithms=[ALGORITHM])
        username: Optional[str] = payload.get("sub")
        if username is None:
            # 사용자명이 없는 경우 인증 예외 발생
            raise credentials_exception
    except jwt.ExpiredSignatureError:
        # 토큰이 만료된 경우 예외 발생
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="토큰이 만료되었습니다.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except PyJWTError as e:
        # JWT 관련 기타 예외 처리
        raise credentials_exception
    # 사용자 객체 반환
    return User(email=username)
