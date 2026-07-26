from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from models import Chat, ChatMembers, Message, User
from .serializers import serialize_chat


async def get_or_create_chat(user_a: int, user_b: int, db: AsyncSession):
    chats_of_a = select(ChatMembers.chat_id).where(ChatMembers.user_id == user_a)
    chats_of_b = select(ChatMembers.chat_id).where(ChatMembers.user_id == user_b)

    stmt = select(ChatMembers.chat_id).where(
        ChatMembers.chat_id.in_(chats_of_a),
        ChatMembers.chat_id.in_(chats_of_b)
    ).group_by(ChatMembers.chat_id).having(func.count(ChatMembers.user_id) == 2)
    
    result = await db.execute(stmt)
    existing_chat_id = result.scalar_one_or_none()

    if existing_chat_id:
        chat = await db.get(Chat, existing_chat_id)
        return chat
    
    chat = Chat()
    db.add(chat)
    await db.flush()

    db.add_all([
        ChatMembers(chat_id=chat.id, user_id=user_a),
        ChatMembers(chat_id=chat.id, user_id=user_b)
    ])

    await db.commit()
    await db.refresh(chat)
    return chat


async def save_messages(chat_id, sender_id: int, text: str, db: AsyncSession):
    msg = Message(chat_id=chat_id, sender_id=sender_id, text=text)
    db.add(msg)
    await db.commit()
    await db.refresh(msg)
    return msg

async def get_messages_data(chat_id, db: AsyncSession, offset: int, limit: int):
    stmt = (
        select(Message)
        .where(Message.chat_id == chat_id)
        .order_by(Message.created_at.desc())
        .offset(offset)
        .limit(limit)
    )
    result = await db.execute(stmt)
    msgs = result.scalars().all()
    return list(reversed(msgs))

async def get_user_chats_data(current_user_id: int, db: AsyncSession):
    last_message = (
        select(Message.chat_id, func.max(Message.created_at).label('last_at'))
        .group_by(Message.chat_id)
        .subquery()
                    )

    stmt = (
        select(Chat, User, Message)
        .join(ChatMembers, ChatMembers.chat_id == Chat.id)
        .join(User, User.id == ChatMembers.user_id)
        .join(last_message, last_message.c.chat_id == Chat.id)
        .join(Message, (Message.chat_id == Chat.id) & (Message.created_at == last_message.c.last_at))
        .where(ChatMembers.user_id != current_user_id)
            )
    
    res = await db.execute(stmt)
    return [serialize_chat(chat, user, message) for chat, user, message in res.all()]

async def get_interlocutors(user_id: int, db: AsyncSession):
    stmt = (select(ChatMembers.user_id)
    .where(
        ChatMembers.user_id != user_id,
        ChatMembers.chat_id.in_(
            select(ChatMembers.chat_id).where(ChatMembers.user_id == user_id)
        )
    )
    )

    res = await db.execute(stmt)
    return res.scalars().all()