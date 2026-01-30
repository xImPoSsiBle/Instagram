from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from core.database import get_db

from models import Comment
from core.security import get_current_user
from schemas import CommentRequest


router = APIRouter(prefix='/comments', tags=['Comments'])

@router.get('/{post_id}')
async def get_comments(post_id: int, db: AsyncSession = Depends(get_db)):
    res = await db.execute(select(Comment).where(Comment.post_id == post_id))
    return res.scalars().all()

@router.post('/')
async def create_comment(data: CommentRequest, user_id= Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    comment = Comment(
        content = data.content,
        post_id = data.post_id,
        user_id = user_id
    )

    db.add(comment)
    await db.commit()
    await db.refresh(comment)
    return comment