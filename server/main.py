from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi_csrf_protect import CsrfProtect
from pydantic import BaseModel


from core.config import CSRF_SECRET_KEY
from models import *
from utils import *
from auth import router as auth_router
from posts import router as post_router
from likes import router as like_router
from comments import router as comment_router
from profiles import router as profile_router
from follows import router as follow_router


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=['http://localhost:5173'],
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*']
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
