from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from core.database import get_db

from core.security import get_current_user
from .schemas import CommentRequest
from .service import create_comment_data, get_comments_data


router = APIRouter(prefix='/comments', tags=['Comments'])

@router.get('/{post_id}')
async def get_comments(post_id: int, db: AsyncSession = Depends(get_db)):
    result = await get_comments_data(post_id, db)
    return result

@router.post('/')
async def create_comment(data: CommentRequest, user_id: int = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    return await create_comment_data(data, user_id, db)