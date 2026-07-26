import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Message } from "../../models/message.model";


interface MessageState {
    chats: Record<string, Message[]>
    unread: Record<string, number>
    onlineUsers: Record<number, boolean>
    typingUsers: Record<number, boolean>
}

const initialState: MessageState = {
    chats: {},
    unread: {},
    onlineUsers: {},
    typingUsers: {}
}

export const messagesSlice = createSlice({
    name: 'messages',
    initialState,
    reducers: {
        setMessages(state, action: PayloadAction<{ chatId: string; messages: Message[] }>) {
            state.chats[action.payload.chatId] = action.payload.messages;
        },
        addMessage(state, action: PayloadAction<Message>) {
            const { chat_id } = action.payload
            if (!state.chats[chat_id]) state.chats[chat_id] = []
            state.chats[chat_id].push(action.payload)
        },
        markAsRead(state, action: PayloadAction<string>) {
            state.unread[action.payload] = 0
        },
        incrementUnread(state, action: PayloadAction<string>) {
            const id = action.payload
            state.unread[id] = (state.unread[id] || 0) + 1
        },
        setUserStatus(state, action: PayloadAction<{ userId: number, isOnline: boolean }>) {
            state.onlineUsers[action.payload.userId] = action.payload.isOnline
        },
        setTyping(state, action: PayloadAction<{ userId: number, isTyping: boolean }>) {
            state.typingUsers[action.payload.userId] = action.payload.isTyping
        },
        prependMessages(state, action: PayloadAction<{ chatId: string, messages: Message[] }>) {
            const existing = state.chats[action.payload.chatId] ?? []
            const existingIds = new Set(existing.map(m => String(m.id)))

            const newMsgs = action.payload.messages.filter(m => !existingIds.has(String(m.id)))
            state.chats[action.payload.chatId] = [...newMsgs, ...existing]
        }
    }
})

export const { setMessages, addMessage, markAsRead, incrementUnread, setUserStatus, setTyping, prependMessages } = messagesSlice.actions;