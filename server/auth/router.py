from fastapi import APIRouter, Cookie, Depends, HTTPException, Request, Response
from fastapi.responses import JSONResponse
from fastapi_csrf_protect import CsrfProtect
from sqlalchemy.ext.asyncio import AsyncSession

from core.database import get_db
from core.security import get_current_user
from models import User
from .schemas import UserCreate, UserLogin, UserResponse
from .service import get_refresh_data, login_user_data, register_user_data


router = APIRouter(prefix='/auth', tags=['Auth'])

@router.get('/csrf-token')
async def get_csrf_token(csrf_protect: CsrfProtect = Depends()):
   csrf_token, signed_token = csrf_protect.generate_csrf_tokens()
   response = JSONResponse({'csrf_token': csrf_token})
   csrf_protect.set_csrf_cookie(signed_token, response)
   return response

@router.post('/register', response_model=UserResponse)
async def register_user(data: UserCreate, db: AsyncSession = Depends(get_db)):
   return await register_user_data(data, db)

@router.post('/login')
async def login_user(request: Request, data: UserLogin, response: Response, db: AsyncSession = Depends(get_db), csrf_protect: CsrfProtect = Depends()):
   await csrf_protect.validate_csrf(request)
   return await login_user_data(data, response, db)

@router.post('/refresh')
async def get_refresh(response: Response, db: AsyncSession = Depends(get_db), refresh_token: str = Cookie(None)):
   return await get_refresh_data(response, db, refresh_token)

@router.post('/logout')
async def logout(response: Response):
   response.delete_cookie('access_token')
   response.delete_cookie('refresh_token')
   return {'detail': 'Выход выполнен'}

@router.get('/me')
async def get_me(user_id = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
   user = await db.get(User, user_id)

   if not user:
      raise HTTPException(status_code=401, detail='Пользователь не найден')
   
   return {'username': user.username, 'email': user.email}
