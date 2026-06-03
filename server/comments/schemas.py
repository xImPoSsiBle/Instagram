from pydantic import BaseModel

class CommentRequest(BaseModel):
    post_id: int
    content: str