# security.py
import os
from typing import Optional
import logging
from dotenv import load_dotenv

import jwt
from jwt import PyJWTError
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

from dto.user_model import User

load_dotenv()

# JWT 토큰을 인코딩하고 디코딩하기 위한 비밀 키
# JWT settings
JWT_SECRET_KEY = os.environ.get("JWT_SECRET")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.environ.get("JWT_EXPIRATION"))
ALGORITHM = "HS512"

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
        logging.debug(f"get_current_user: got {token}")
        payload = jwt.decode(token, JWT_SECRET_KEY, algorithms=[ALGORITHM])
        username: Optional[str] = payload.get("sub")
        if username is None:
            raise credentials_exception
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has expired.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except PyJWTError:
        raise credentials_exception
    return User(email=username)
