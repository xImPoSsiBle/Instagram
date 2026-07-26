from fastapi import APIRouter, Depends, WebSocket, WebSocketDisconnect

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from core.security import get_current_user
from core.database import get_db
from models import Chat
from utils import get_user_id_from_ws
from .service import get_interlocutors, get_user_chats_data, get_or_create_chat, save_messages, get_messages_data
from .websocket import manager

router = APIRouter(prefix='/chat', tags=['Chat'])


@router.websocket('/ws/connect')
async def global_ws(websocket: WebSocket, db: AsyncSession = Depends(get_db)):
    user_id = get_user_id_from_ws(websocket)

    if not user_id:
        await websocket.close(code=1008)
        return
    
    await manager.connect(user_id, websocket)

    interlocutors = await get_interlocutors(user_id, db) 

    await manager.broadcast_status(user_id, is_online=True, interlocutors=interlocutors)

    for uid in interlocutors:
        if manager.is_online(uid):
            await manager.send_to_user(user_id, {
                "type": "status",
                "user_id": uid,
                "is_online": True,
            })

    try:
        while True:
            data = await websocket.receive_json()
            if data.get('type') == 'message':
                chat = await get_or_create_chat(user_id, data['receiver_id'], db)
                msg = await save_messages(chat.id, user_id, data['text'], db)

                payload = {
                    "type": "message",
                    "id": str(msg.id),
                    "chat_id": str(chat.id),
                    "sender_id": user_id,
                    "text": msg.text,
                    "created_at": msg.created_at.isoformat(),
                }

                await manager.send_to_user(data['receiver_id'], payload)
                await manager.send_to_user(user_id, payload)

            elif data.get('type') == 'typing':
                await manager.send_to_user(data['receiver_id'], {
                    "type": "typing",
                    "from_user": user_id,
                    "is_typing": data.get('is_typing', False),
                })
    except WebSocketDisconnect:
        manager.disconnect(user_id)
        await manager.broadcast_status(user_id, is_online=False, interlocutors=interlocutors)


@router.post('/dm/{receiverId}')
async def get_chat_id(receiverId: int, current_user_id: int = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    return await get_or_create_chat(receiverId, current_user_id, db)

@router.get('/{chatId}/messages')
async def get_messages(chatId: str, db: AsyncSession = Depends(get_db), offset: int = 0, limit: int = 50):
    return await get_messages_data(chatId, db, offset, limit)

@router.get('/')
async def get_user_chats(current_user_id: int = Depends(get_current_user), db: AsyncSession = Depends(get_db)):
    return await get_user_chats_data(current_user_id, db)