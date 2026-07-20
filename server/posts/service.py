import os
import uuid

from fastapi import HTTPException, UploadFile
from sqlalchemy import case, func, select
from sqlalchemy.ext.asyncio import AsyncSession

from models import Post
from models import Like, User
from utils import get_media_type
from .serializers import serialize_post


ALLOWED_MIMETYPES = {'image/jpeg', 'image/png', 'image/webp', 'video/mp4'}
MAX_FILE_SIZE = 10*1024*1024

def build_post_query(user_id: int):
    liked_case = case((Like.user_id == user_id, 1), else_=0)
    return (select(
        Post, 
        User,
        func.count(Like.id).label('likes'),
        func.max(liked_case).label('liked')
        )
        .join(User, User.id == Post.user_id)
        .outerjoin(Like, Like.post_id == Post.id)
        .group_by(Post.id, User.id)
        .order_by(Post.create_at.desc())
    )

async def get_posts_data(user_id: int, db: AsyncSession):
    stmt = build_post_query(user_id).where(Post.user_id != user_id)
    res = await db.execute(stmt)
    return [serialize_post(post, user, likes, liked) for post, user, likes, liked in res.all()]

async def get_post_data(post_id: int, user_id: int, db: AsyncSession):
    stmt = build_post_query(user_id).where(Post.id == post_id)
    res = await db.execute(stmt)
    row = res.one_or_none()
    if not row:
        raise HTTPException(status_code=404, detail="Пост не найден")
    return serialize_post(*row)

async def create_post_data(caption: str, image: UploadFile, user_id: int, db: AsyncSession):
    os.makedirs('images', exist_ok=True)

    file_size = 0
    contents = await image.read()
    file_size = len(contents)

    if file_size > MAX_FILE_SIZE:
        raise HTTPException(status_code=413, detail='Файл слишком большой')

    if image.content_type not in ALLOWED_MIMETYPES:
        raise HTTPException(status_code=400, detail='Недопустимый тип файла')

    media_type = get_media_type(image)
    filename = f'{user_id}_{uuid.uuid4().hex}_{image.filename}'
    file_path = f'images/{filename}'
    
    with open(file_path, 'wb') as f:
        f.write(contents)

    post = Post(image_url=file_path, caption=caption, user_id=user_id,media_type=media_type)
    db.add(post)
    await db.commit()
    await db.refresh(post)
    return post