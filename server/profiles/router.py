from fastapi import APIRouter, Depends, File, Form, UploadFile
from sqlalchemy.ext.asyncio import AsyncSession

from core.database import get_db
from core.security import get_current_user
from .service import get_profile_by_id_data, get_profile_data, get_profile_posts_data, update_profile_data


router = APIRouter(prefix='/profile', tags=['Profile'])

@router.get('/{username}')
async def get_profile(username: str, current_user_id: int = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    return await get_profile_data(username, current_user_id, db)

@router.get('/id/{user_id}')
async def get_profile_by_id(user_id: int, db: AsyncSession = Depends(get_db)):
    return await get_profile_by_id_data(user_id, db)

@router.get('/{username}/posts')
async def get_profile_posts(username, db: AsyncSession = Depends(get_db)):
    return await get_profile_posts_data(username, db)

@router.patch('/update')
async def update_profile(username: str = Form(None), avatar: UploadFile = File(None), current_user_id: int = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    await update_profile_data(username, avatar, current_user_id, db)