from fastapi import APIRouter, Depends, File, Form, UploadFile
from sqlalchemy.ext.asyncio import AsyncSession

from core.database import get_db
from core.security import get_current_user

from .service import create_post_data, get_post_data, get_posts_data

router = APIRouter(prefix="/posts", tags=["Posts"])

@router.get('/')
async def get_posts(user_id: int = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
   return await get_posts_data(user_id, db)

@router.post("/")
async def create_post(caption: str = Form(...), image: UploadFile = File(...), user_id: int = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    return await create_post_data(caption, image, user_id, db)

@router.get('/{post_id}')
async def get_post(post_id: int, user_id: int = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    return await get_post_data(post_id, user_id, db)