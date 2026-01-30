from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from core.database import get_db
from core.security import get_current_user
from models import Like
from schemas import LikeRequest


router = APIRouter(prefix="/like", tags=["Likes"])

@router.post('/')
async def toggle_like(data: LikeRequest, user_id: int = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    stmt = select(Like).where(Like.post_id == data.post_id, Like.user_id == user_id)
    

    res = await db.execute(stmt)
    like = res.scalar_one_or_none()

    if like:
        await db.delete(like)
        await db.commit()
        return {'liked': False}

    new_like = Like(user_id=user_id, post_id=data.post_id)
    db.add(new_like)
    await db.commit()
    await db.refresh(new_like)

    return {'liked': True}