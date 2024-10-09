# security.py
import os
from typing import Optional
import logging

import jwt
from jwt import PyJWTError
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

from dto.user_model import User
from dotenv import load_dotenv

load_dotenv()

# JWT 토큰을 인코딩하고 디코딩하기 위한 비밀 키
# JWT settings
JWT_SECRET_KEY = os.environ.get("JWT_SECRET")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.environ.get("JWT_EXPIRATION"))
ALGORITHM = os.environ.get("JWT_ALGORITHM")

# Security scheme
security = HTTPBearer()

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> User:
    token = credentials.credentials
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Cannot validate credentials.",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        logging.debug(f"get_current_user: token received: {token}")
        payload = jwt.decode(token, JWT_SECRET_KEY, algorithms=[ALGORITHM])
        username: Optional[str] = payload.get("sub")
        logging.debug(f"get_current_user: payload extracted, username: {username}")
        if username is None:
            logging.debug("get_current_user: no username in token payload.")
            raise credentials_exception
    except jwt.ExpiredSignatureError:
        logging.error("get_current_user: Token has expired.")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has expired.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except PyJWTError as e:
        logging.error(f"get_current_user: JWT error: {str(e)}")
        raise credentials_exception
    return User(email=username)

