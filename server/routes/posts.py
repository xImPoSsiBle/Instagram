import os
from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile
from sqlalchemy import case, func, select
from sqlalchemy.ext.asyncio import AsyncSession

from core.database import get_db
from core.security import get_current_user
from models import Post
from models import Like, User
from utils import get_media_type

router = APIRouter(prefix="/posts", tags=["Posts"])

@router.get('/')
async def get_posts(user_id: int = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    liked_case = case((Like.user_id == user_id, 1), else_=0)

    stmt = (select(
        Post, 
        User,
        func.count(Like.id).label('likes'),
        func.max(liked_case).label('liked')
        )
        .join(User, User.id == Post.user_id)
        .outerjoin(Like, Like.post_id == Post.id)
        .where(Post.user_id != user_id)
        .group_by(Post.id, User.id)
        .order_by(Post.create_at.desc())
    )

    res = await db.execute(stmt)
    data = []

    for post, user, likes, liked in res.all():
        data.append({
            'id': post.id,
            'caption': post.caption,
            'image': f"http://localhost:8000/{post.image_url}",
            'media_type': post.media_type,
            'created_at': post.create_at,
            'likes': likes,
            'liked': bool(liked),
            'user': {
                'id': user.id,
                'username': user.username,
                'profile_image': (f"http://localhost:8000/{user.profile_image}" if user.profile_image else f"http://localhost:8000/images/default-avatar.png")
            }
        })

    return data

@router.post("/")
async def create_post(caption: str = Form(...), image: UploadFile = File(...), user_id: int = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    os.makedirs('images', exist_ok=True)

    media_type = get_media_type(image)

    filename = f'{user_id}_{image.filename}'
    file_path = f'images/{filename}'

    with open(file_path, 'wb') as f:
        f.write(await image.read())
    
    new_post = Post(
        image_url=file_path, 
        caption=caption, 
        user_id=user_id,
        media_type=media_type
        )

    db.add(new_post)
    await db.commit()
    await db.refresh(new_post)

    return new_post

@router.get('/{post_id}')
async def get_post(post_id: int, user_id: int = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    liked_case = case((Like.user_id == user_id, 1), else_=0)

    stmt = (select(
        Post,
        User,
        func.count(Like.id).label('likes'),
        func.max(liked_case).label('liked')
        )
        .where(Post.id == post_id)
        .join(User, User.id == Post.user_id)
        .outerjoin(Like, Like.post_id == Post.id)
        .group_by(Post.id, User.id)
        .order_by(Post.create_at.desc())
    )

    res = await db.execute(stmt)

    row = res.one_or_none()

    if not row:
        raise HTTPException(status_code=404, detail="Пост не найден")

    post, user, likes, liked = row

    return {
        'id': post.id,
        'caption': post.caption,
        'image': f"http://localhost:8000/{post.image_url}",
        'media_type': post.media_type,
        'created_at': post.create_at,
        'likes': likes,
        'liked': bool(liked),
        'user': {
            'id': post.user_id,
            'username': user.username,
            'profile_image': (f"http://localhost:8000/{user.profile_image}" if user.profile_image else f"http://localhost:8000/images/default-avatar.png")
        }
    }