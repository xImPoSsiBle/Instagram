from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from models import Comment, User
from .serializers import serialize_comment
from .schemas import CommentRequest

async def get_comments_data(post_id: int, db: AsyncSession):
    res = await db.execute(select(Comment, User).join(User, User.id == Comment.user_id).where(Comment.post_id == post_id))
    return [serialize_comment(comment, user) for comment, user in res.all()]

async def create_comment_data(data: CommentRequest, user_id: int, db: AsyncSession):
    comment = Comment(
        content = data.content,
        post_id = data.post_id,
        user_id = user_id
    )

    db.add(comment)
    await db.commit()
    await db.refresh(comment)
    return comment