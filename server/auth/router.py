from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from core.database import get_db
from .schemas import LoginResponse, RefreshRequest, UserCreate, UserLogin, UserResponse
from .service import get_refresh_data, login_user_data, register_user_data


router = APIRouter(prefix='/auth', tags=['Auth'])

@router.post('/register', response_model=UserResponse)
async def register_user(data: UserCreate, db: AsyncSession = Depends(get_db)):
    return await register_user_data(data, db)

@router.post('/login', response_model=LoginResponse)
async def login_user(data: UserLogin, db: AsyncSession = Depends(get_db)):
   return await login_user_data(data, db)

@router.post('/refresh')
async def get_refresh(data: RefreshRequest, db: AsyncSession = Depends(get_db)):
   return await get_refresh_data(data, db)