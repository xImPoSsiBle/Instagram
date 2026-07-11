from datetime import datetime
import uuid

from sqlalchemy import UUID, Column, DateTime, ForeignKey, Integer
from sqlalchemy.orm import relationship

from core.database import Base


class Chat(Base):
    __tablename__ = 'chats'

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    created_at = Column(DateTime, default=datetime.utcnow)

    members = relationship('ChatMembers', back_populates='chat')
    messages = relationship('Message', back_populates='chat')

class ChatMembers(Base):
    __tablename__ = 'chat_members'

    chat_id = Column(UUID(as_uuid=True), ForeignKey('chats.id', ondelete='CASCADE'), primary_key=True)
    user_id = Column(Integer, ForeignKey('users.id', ondelete='CASCADE'), primary_key=True)
    
    chat = relationship('Chat', back_populates='members')
    user = relationship('User', back_populates='chats')
