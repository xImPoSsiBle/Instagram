from fastapi import APIRouter, Depends, HTTPException
import jwt
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import or_, select

from core.config import ALGORITHM, SECRET_KEY
from core.database import get_db
from core.security import create_access_token, create_refresh_token
from models import User
from schemas import LoginResponse, RefreshRequest, UserCreate, UserLogin, UserResponse
from utils import hash_password, verify_password


router = APIRouter(prefix='/auth', tags=['Auth'])

@router.post('/register', response_model=UserResponse)
async def register_user(data: UserCreate, db: AsyncSession = Depends(get_db)):
    
    
    exist_user = select(User).where(or_(User.username == data.username, User.email == data.email))
    result = await db.execute(exist_user)
    user = result.scalar_one_or_none()

    if user:
        raise HTTPException(status_code=400, detail="Пользователь c таким именем или почтой уже существует")
    
    hashed = hash_password(data.password)

    new_user = User(username=data.username, email=data.email, hashed_password=hashed)

    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)

    return new_user

@router.post('/login', response_model=LoginResponse)
async def login_user(data: UserLogin, db: AsyncSession = Depends(get_db)):
    stmt = select(User).where(User.username == data.username)
    result = await db.execute(stmt)
    user = result.scalar_one_or_none()

    if not user:
        raise HTTPException(status_code=401, detail="Неверный логин или пароль")

    if not verify_password(data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Неверный логин или пароль")
    
    access_token = create_access_token({'user_id': user.id})
    refresh_token = create_refresh_token({'user_id': user.id})

    return LoginResponse(
        username=user.username, 
        email=user.email, 
        access_token=access_token,
        refresh_token=refresh_token
    )

@router.post('/refresh')
async def get_refresh(data: RefreshRequest, db: AsyncSession = Depends(get_db)):
    try:
        payload = jwt.decode(data.refresh_token, SECRET_KEY, algorithms=ALGORITHM)
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

    return LoginResponse(
        username=user.username, 
        email=user.email, 
        access_token=new_access,
        refresh_token=new_refresh
    )