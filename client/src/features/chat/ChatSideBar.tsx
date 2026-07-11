import { useNavigate, useParams } from "react-router-dom"
import { chatApi } from "../../services/chatApi"
import ChatItem from "../../components/ChatItem"
import { useState } from "react"

const ChatSideBar = () => {
    const { data: chats } = chatApi.useGetChatIdQuery()
    const navigate = useNavigate()
    const { id: activeChatReceiverId } = useParams()
    const [search, setSearch] = useState('')

    const filtered = chats?.filter(c => c.interlocutor.username.toLowerCase().includes(search.toLowerCase()))

    return (
        <div className="w-full md:w-80 h-screen flex flex-col border-r border-neutral-800 bg-black">
            <div className="flex items-center justify-between px-4 py-5 border-b border-neutral-800">
                <span className="font-medium text-white">Сообщения</span>
            </div>

            <div className="px-3 py-2">
                <input
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    placeholder="Поиск"
                    className="w-full bg-neutral-800 text-white text-sm rounded-lg pl-9 pr-3 py-2 outline-none placeholder-neutral-500 border border-transparent focus:border-neutral-600"
                />
            </div>

            <div className="flex-1 overflow-y-auto">
                {filtered?.map(chat => (
                    <ChatItem
                        key={chat.chat_id}
                        chat={chat}
                        active={chat.interlocutor.id === Number(activeChatReceiverId)}
                        onClick={() => navigate(`/direct/${chat.interlocutor.id}`)}
                    />
                ))}
            </div>
        </div>
    )
}

export default ChatSideBar