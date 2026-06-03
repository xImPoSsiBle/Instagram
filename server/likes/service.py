from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from models import Like

from .schemas import LikeRequest


async def toggle_like_data(data: LikeRequest, user_id: int, db: AsyncSession):
    res = await db.execute(select(Like).where(Like.post_id == data.post_id, Like.user_id == user_id))
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

