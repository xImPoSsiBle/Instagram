from fastapi import HTTPException, UploadFile
from sqlalchemy import exists, func, select
from sqlalchemy.ext.asyncio import AsyncSession

from models import User, Post, Follow
from .serializers import serialize_post, serialize_profile

async def get_user_or_404(username: str, db: AsyncSession):
    res = await db.execute(select(User).where(User.username == username))
    user = res.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=404, detail='Пользователь не найден')
    return user

async def get_profile_data(username: str, current_user_id: int, db: AsyncSession):
    user = await get_user_or_404(username, db)

    posts_subq = select(func.count(Post.id)).where(Post.user_id == user.id).scalar_subquery()
    followers_subq = select(func.count(Follow.id)).where(Follow.following_id == user.id).scalar_subquery()
    following_subq = select(func.count(Follow.id)).where(Follow.follower_id == user.id).scalar_subquery()
    followed_subq = exists().where(Follow.follower_id == current_user_id, Follow.following_id == user.id)

    stmt = select(
        User.id, User.username, User.profile_image,
        posts_subq.label('posts'),
        followers_subq.label('followers'),
        following_subq.label('following'),
        followed_subq.label('followed')
    ).where(User.id == user.id)

    res = await db.execute(stmt)
    return serialize_profile(res.one(), current_user_id)

async def get_profile_by_id_data(user_id: int, db: AsyncSession):
    res = await db.execute(select(User).where(User.id == user_id))
    user = res.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=404, detail='Пользователь не найден')
    return user

async def get_profile_posts_data(username: str, db: AsyncSession):
    user = await get_user_or_404(username, db)
    res = await db.execute(select(Post).where(Post.user_id == user.id))
    return [serialize_post(post) for post in res.scalars().all()]

async def update_profile_data(username: str, avatar: UploadFile, current_user_id: int, db: AsyncSession):
    user = await db.get(User, current_user_id)

    if username:
        user.username = username
    if avatar:
        path = f"images/avatars/{current_user_id}.jpg"
        with open(path, 'wb') as f:
            f.write(await avatar.read())
        user.profile_image = f"{path}"

    await db.commit()
    await db.refresh(user)
    return user