from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from core.database import get_db
from core.security import get_current_user
from .schemas import LikeRequest
from .service import toggle_like_data


router = APIRouter(prefix="/like", tags=["Likes"])

@router.post('/')
async def toggle_like(data: LikeRequest, user_id: int = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    return await toggle_like_data(data, user_id, db)