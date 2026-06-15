from fastapi import Cookie, HTTPException, Response
import jwt
from sqlalchemy import or_, select
from sqlalchemy.ext.asyncio import AsyncSession

from core.config import ACCESS_TOKEN_EXPIRE_MINUTES, ALGORITHM, REFRESH_TOKEN_EXPIRE_MINUTES, SECRET_KEY
from core.security import create_access_token, create_refresh_token
from .schemas import UserCreate, UserLogin
from models import User
from utils import hash_password, verify_password


async def register_user_data(data: UserCreate, db: AsyncSession):
    result = await db.execute(select(User).where(or_(User.username == data.username, User.email == data.email)))
    user = result.scalar_one_or_none()

    if user:
        raise HTTPException(status_code=400, detail="Пользователь c таким именем или почтой уже существует")
    
    hashed = hash_password(data.password)

    new_user = User(username=data.username, email=data.email, hashed_password=hashed)

    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)

    return new_user

def set_auth_cookies(response: Response, access_token: str, refresh_token: str):
    response.set_cookie(
        key='access_token',
        value=access_token,
        httponly=True,
        max_age=ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        samesite='lax',
    )
    response.set_cookie(
        key='refresh_token',
        value=refresh_token,
        httponly=True,
        max_age=REFRESH_TOKEN_EXPIRE_MINUTES * 60,
        samesite='lax',
    )

async def login_user_data(data: UserLogin, response: Response, db: AsyncSession):
    result = await db.execute(select(User).where(User.username == data.username))
    user = result.scalar_one_or_none()

    if not user or not verify_password(data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Неверный логин или пароль")
    
    access_token = create_access_token({'user_id': user.id})
    refresh_token = create_refresh_token({'user_id': user.id})

    set_auth_cookies(response, access_token, refresh_token)

    return {'username': user.username, 'email': user.email}

async def get_refresh_data(response: Response, db: AsyncSession, refresh_token: str = Cookie(None)):
    if not refresh_token:
        raise HTTPException(status_code=401, detail='Refresh токен отсутствует')

    try:
        payload = jwt.decode(refresh_token, SECRET_KEY, algorithms=ALGORITHM)
        user_id = payload.get('user_id')

        if not user_id:
            raise HTTPException(status_code=401, detail='Неверный токен')
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail='Токен истек')
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail='Неверный токен') 
    
    user = await db.get(User, user_id)

    if not user:
        raise HTTPException(status_code=401, detail='Неверный токен')
    
    new_access = create_access_token({'user_id': user_id})
    new_refresh = create_refresh_token({'user_id': user_id})

    set_auth_cookies(response, new_access, new_refresh)

    return {'username': user.username, 'email': user.email}