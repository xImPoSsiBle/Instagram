from pydantic import BaseModel, EmailStr, Field

class LoginResponse(BaseModel):
    username: str
    email: str
    access_token: str
    refresh_token: str

class UserResponse(BaseModel):
    id: int
    username: str
    email: EmailStr

    class Config:
        from_attributes = True

class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    username: str
    password: str

class RefreshRequest(BaseModel):
    refresh_token: str

class LikeRequest(BaseModel):
    post_id: int

class CommentRequest(BaseModel):
    post_id: int
    content: str