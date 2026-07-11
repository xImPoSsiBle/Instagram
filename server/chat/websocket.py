import json
from typing import Dict

from fastapi import WebSocket


class ConnectionManager:
    def __init__(self):
        self.active_connections: Dict[int, WebSocket] = {}

    async def connect(self, user_id: int, websocket: WebSocket):
        await websocket.accept()
        self.active_connections[user_id] = websocket

    def disconnect(self, user_id: int):
        self.active_connections.pop(user_id, None)

    async def send_to_user(self, user_id: int, data: dict):
        websocket = self.active_connections.get(user_id)

        if websocket:
            await websocket.send_text(json.dumps(data, default=str))

    async def broadcast_status(self, user_id: int, is_online: bool, interlocutors: list[int]):
        payload = {
            'type': 'status',
            'user_id': user_id,
            'is_online': is_online
        }

        for uid in interlocutors:
            await self.send_to_user(uid, payload)

    def is_online(self, user_id: int) -> bool:
        return user_id in self.active_connections

manager = ConnectionManager()