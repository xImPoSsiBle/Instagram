from fastapi import HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from models import Follow
from models import User
from .serializers import serialize_user

async def toggle_follow_data(following_user_id: int, current_user_id: int, db: AsyncSession):
    res = await db.execute(select(Follow).where(Follow.following_id == following_user_id, Follow.follower_id == current_user_id))
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

async def get_follow_data(username: str, follow_type: str, db: AsyncSession):
    user_res = await db.execute(select(User).where(User.username == username))
    user = user_res.scalar_one_or_none()

    if not user:
        raise HTTPException(status_code=404, detail='Пользователь не найден')


    if follow_type == 'follower':
        stmt = select(User).join(Follow, User.id == Follow.follower_id).where(Follow.following_id == user.id)
    elif follow_type == 'following':
        stmt = select(User).join(Follow, User.id == Follow.following_id).where(Follow.follower_id == user.id)
    else:
        raise HTTPException(status_code=400, detail='Неверный тип')
        
    follow_res = await db.execute(stmt)
    follow = follow_res.scalars().all()
        
    return [serialize_user(u) for u in follow]