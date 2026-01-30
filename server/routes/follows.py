from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from core.security import get_current_user
from core.database import get_db
from models import Follow


router = APIRouter(prefix='/follow', tags=['Follows'])

@router.post('/{following_user_id}')
async def toggle_follow(following_user_id: int, current_user_id: int = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    stmt = select(Follow).where(Follow.following_id == following_user_id, Follow.follower_id == current_user_id)

    res = await db.execute(stmt)
    follow = res.scalar_one_or_none()

    if follow:
        await db.delete(follow)
        await db.commit()
        return {'followed': False}
    
    new_follow = Follow(following_id = following_user_id, follower_id = current_user_id)

    db.add(new_follow)

    await db.commit()
    await db.refresh(new_follow)

    return {'followed': True}
