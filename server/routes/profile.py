from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import case, exists, func, select
from sqlalchemy.ext.asyncio import AsyncSession

from core.database import get_db
from core.security import get_current_user
from models import User, Post, Follow


router = APIRouter(prefix='/profile', tags=['Profile'])

@router.get('/{username}')
async def get_profile(username: str, current_user_id: int = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    user_stmt = select(User).where(User.username == username)
    user_res = await db.execute(user_stmt)
    user = user_res.scalar_one_or_none()

    print(user)

    if not user:
        raise HTTPException(status_code=404, detail='Пользователь не найден')

    posts_subq = select(func.count(Post.id)).where(Post.user_id == user.id).scalar_subquery()
    followers_subq = select(func.count(Follow.id)).where(Follow.following_id == user.id).scalar_subquery()
    following_subq = select(func.count(Follow.id)).where(Follow.follower_id == user.id).scalar_subquery()
    followed_subq = exists().where(Follow.follower_id == current_user_id, Follow.following_id == user.id)

    stmt = select(
        User.id,
        User.username,
        User.profile_image,
        posts_subq.label('posts'),
        followers_subq.label('followers'),
        following_subq.label('following'),
        followed_subq.label('followed')
    ).where(User.id == user.id)

    res = await db.execute(stmt)

    profile = res.one()

    profile_image_url = (f"http://localhost:8000/{profile.image_url}" if user is None else f"http://localhost:8000/images/default-avatar.png")

    return {
        'id': profile.id,
        'username': profile.username,
        "profile_image": profile_image_url,
        'posts': profile.posts,
        'followers': profile.followers,
        'following': profile.following,
        'followed': profile.followed,
        'is_me': profile.id == current_user_id
    }

@router.get('/{username}/posts')
async def get_profile_posts(username, db: AsyncSession = Depends(get_db)):
    user_stmt = select(User).where(User.username == username)
    user_res = await db.execute(user_stmt)
    user = user_res.scalar_one_or_none()

    if not user:
        raise HTTPException(status_code=404, detail='Пользователь не найден')

    stmt = select(Post).where(Post.user_id == user.id)

    res = await db.execute(stmt)
    
    data = []
    
    for post in res.scalars().all():
        data.append({
            'id': post.id,
            'caption': post.caption,
            'image': f"http://localhost:8000/{post.image_url}",
            'media_type': post.media_type,
            'created_at': post.create_at,
            'user_id': post.user_id
        })

    return data