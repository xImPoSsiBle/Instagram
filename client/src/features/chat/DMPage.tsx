import { useState, useRef, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { useNavigate, useParams } from "react-router-dom";
import { setMessages } from "../../store/slices/messagesSlice";
import { useWS } from "../../context/WSContext";
import { API_URL } from "../../constants/api";
import { logout } from "../../store/slices/authSlice";
import { chatApi } from "../../services/chatApi";
import { profileApi } from "../../services/profileApi";


export default function DMPage() {
  const { id: receiverId } = useParams()

  const { user } = useAppSelector(state => state.auth)
  const isOnline = useAppSelector(state => state.messages.onlineUsers[Number(receiverId)] ?? false)
  const isTyping = useAppSelector(state => state.messages.typingUsers[Number(receiverId)] ?? false)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const [inputText, setInputText] = useState("");
  const [chatId, setChatId] = useState('')
  const messages = useAppSelector(state => chatId ? (state.messages.chats[chatId] ?? []) : [])
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const typingTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)
  const wsRef = useWS()

  const { data: chats } = chatApi.useGetChatIdQuery()
  const interlocutor = chats?.find(c => String(c.interlocutor.id) === receiverId)?.interlocutor

  const { data: profileData } = profileApi.useGetUserByIdQuery(Number(receiverId), {
    skip: !!interlocutor
  })

  const currentUser = interlocutor ?? profileData

  const handleSend = () => {
    const text = inputText.trim();
    if (!text || !wsRef.current) return;
    wsRef.current.send(JSON.stringify({
      type: 'message',
      receiver_id: Number(receiverId),
      text,
    }));

    setInputText("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const isLastInGroup = (idx: number) => {
    const next = messages[idx + 1];
    return !next || next.sender_id !== messages[idx].sender_id;
  };

  const initChat = async () => {
    const res = await fetch(`${API_URL}/chat/dm/${receiverId}`, { method: 'POST', credentials: 'include' })
    const data = await res.json()
    setChatId(data.id)

    const history = await fetch(`${API_URL}/chat/${data.id}/messages`, { credentials: "include" });
    const msgs = await history.json();
    dispatch(setMessages({ chatId: data.id, messages: msgs }));
  }

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(e.target.value)

    wsRef.current?.send(JSON.stringify({
      type: 'typing',
      receiver_id: Number(receiverId),
      is_typing: true
    }))

    if (typingTimeout.current) clearTimeout(typingTimeout.current)

    typingTimeout.current = setTimeout(() => {
      wsRef.current?.send(JSON.stringify({
        type: 'typing',
        receiver_id: Number(receiverId),
        is_typing: false
      }))
    }, 1500)
  }

  useEffect(() => {
    if (!receiverId) {
      return
    }

    initChat()
  }, [receiverId])

  if (!user) {
    dispatch(logout())
    navigate('/login')
    return
  }

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;
    ta.style.height = "auto";
    ta.style.height = Math.min(ta.scrollHeight, 120) + "px";
  }, [inputText]);

  return (
    <div className="flex flex-col max-w-240 h-screen pb-16 md:pb-0 w-full bg-black text-white font-sans">
      <div className="flex items-center gap-3 px-4 py-3 border-b border-neutral-800 shrink-0">
        <button className="text-white mr-1 lg:hidden" onClick={() => navigate('/direct')} aria-label="Назад">
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        <div className="flex items-center gap-3" onClick={() => navigate(`/profile/${currentUser?.username}`)}>
          <div className="relative shrink-0">
            <img
              src={currentUser?.profile_image}
              alt={currentUser?.username}
              className="w-10 h-10 rounded-full object-cover"
            />
            {isOnline && (
              <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-black rounded-full" />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm leading-tight truncate">{currentUser?.username}</p>
            <p className="text-xs text-neutral-400 leading-tight">
              {isOnline ? "В сети" : 'Не в сети'}
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
        {messages.map((msg, idx) => {
          const isMine = msg.sender_id === user.id;
          const last = isLastInGroup(idx);
          return (
            <div
              key={msg.id}
              className={`flex items-end gap-2 ${isMine ? "justify-end" : "justify-start"} ${last ? "mb-3" : "mb-0.5"}`}
            >
              {!isMine && (
                <div className="w-7 h-7 shrink-0">
                  {last ? (
                    <img src={currentUser?.profile_image} alt="" className="w-7 h-7 rounded-full object-cover" />
                  ) : (
                    <div className="w-7 h-7" />
                  )}
                </div>
              )}

              <div className="flex flex-col gap-0.5 max-w-[72%]">
                <div
                  className={`px-4 py-2.5 text-sm leading-relaxed break-words
                    ${isMine
                      ? "bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 text-white rounded-[20px] rounded-br-[4px]"
                      : "bg-neutral-800 text-white rounded-[20px] rounded-bl-[4px]"
                    }`}
                >
                  {msg.text}
                </div>
              </div>
            </div>
          );
        })}

        {isTyping && (
          <div className="flex items-end gap-2">
            <img src={currentUser?.profile_image} alt="" className="w-7 h-7 rounded-full object-cover" />
            <div className="bg-neutral-800 rounded-[20px] rounded-bl-[4px] px-4 py-3 flex gap-1 items-center">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="w-2 h-2 bg-neutral-400 rounded-full animate-bounce"
                  style={{ animationDelay: `${i * 0.15}s` }}
                />
              ))}
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      <div className="shrink-0 px-3 py-3 border-t border-neutral-800 flex items-end gap-3">
        <div className="flex-1 bg-neutral-800 rounded-[22px] flex items-end px-4 py-2.5 min-h-[42px]">
          <textarea
            ref={textareaRef}
            rows={1}
            value={inputText}
            onChange={handleTextChange}
            onKeyDown={handleKeyDown}
            placeholder="Сообщение…"
            className="flex-1 bg-transparent resize-none outline-none text-sm text-white placeholder-neutral-500 leading-relaxed max-h-[120px] overflow-y-auto"
          />
        </div>

        {inputText.trim() &&
          <div className="flex items-center justify-center px-3 py-3">
            <button
              onClick={handleSend}
              className="shrink-0 text-blue-400 hover:text-blue-300 transition font-semibold text-sm"
            >
              Отправить
            </button>
          </div>
        }
      </div>
    </div>
  );
}