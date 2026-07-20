import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi_csrf_protect import CsrfProtect
from pydantic import BaseModel


from core.config import CSRF_SECRET_KEY
from auth import router as auth_router
from posts import router as post_router
from likes import router as like_router
from comments import router as comment_router
from profiles import router as profile_router
from follows import router as follow_router
from chat import router as chat_router

CORS_ORIGINS = os.getenv("CORS_ORIGINS", "http://localhost:5173").split(",")
ALLOWED_METHODS = ["GET", "POST", "PUT", "DELETE", "PATCH"]
ALLOWED_HEADERS = ["Content-Type", "Authorization", "X-CSRF-Token"]

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=ALLOWED_METHODS,
    allow_headers=ALLOWED_HEADERS
)

class CsrfSettings(BaseModel):
    secret_key: str = CSRF_SECRET_KEY
    cookie_samesite: str = 'lax'

@CsrfProtect.load_config
def get_csrf_config():
    return CsrfSettings()

app.mount('/images', StaticFiles(directory='images'), name='images')


app.include_router(auth_router.router)
app.include_router(post_router.router)
app.include_router(like_router.router)
app.include_router(comment_router.router)
app.include_router(profile_router.router)
app.include_router(follow_router.router)
app.include_router(chat_router.router)
