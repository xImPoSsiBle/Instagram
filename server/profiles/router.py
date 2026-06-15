from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from core.database import get_db
from core.security import get_current_user
from .service import get_profile_data, get_profile_posts_data


router = APIRouter(prefix='/profile', tags=['Profile'])

@router.get('/{username}')
async def get_profile(username: str, current_user_id: int = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    return await get_profile_data(username, current_user_id, db)

@router.get('/{username}/posts')
async def get_profile_posts(username, db: AsyncSession = Depends(get_db)):
    return await get_profile_posts_data(username, db)