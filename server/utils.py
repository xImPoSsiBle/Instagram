import os
from fastapi import HTTPException, UploadFile
from passlib.context import CryptContext

from core.config import BASE_URL

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str):
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str):
    return pwd_context.verify(plain_password, hashed_password)

def get_media_type(file: UploadFile):
    if file.content_type.startswith('image/'):
        return 'image'
    if file.content_type.startswith('video/'):
        return 'video'
    raise HTTPException(400, 'Неподдерживаемый тип файла')

def media_url(path: str | None, default : str = 'images/default-avatar.png'):
    if not path:
        path = default
    
    return f'{BASE_URL}/{path}'