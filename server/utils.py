import os
from fastapi import HTTPException, UploadFile, WebSocket
import jwt
from passlib.context import CryptContext

from core.config import ALGORITHM, BASE_URL, SECRET_KEY

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

def media_url(path: str | None, default : str = 'images/avatars/default-avatar.png'):
    if not path:
        path = default
    
    return f'{BASE_URL}/{path}'

def get_user_id_from_ws(websocket: WebSocket):
    token = websocket.cookies.get("access_token")
    if not token:
        return None
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload["user_id"]
    except jwt.PyJWTError:
        return None