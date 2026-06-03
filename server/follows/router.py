from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from core.security import get_current_user
from core.database import get_db
from models import Follow, User
from .service import get_follow_data, toggle_follow_data


router = APIRouter(prefix='/follow', tags=['Follows'])

@router.post('/{following_user_id}')
async def toggle_follow(following_user_id: int, current_user_id: int = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
   return await toggle_follow_data(following_user_id, current_user_id, db)

@router.get('/{username}/{type}')
async def get_follow(username: str, follow_type: str, db: AsyncSession = Depends(get_db)):
    return await get_follow_data(username, follow_type, db)