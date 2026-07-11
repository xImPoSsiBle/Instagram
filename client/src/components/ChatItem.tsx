import { useAppSelector } from "../hooks/redux"

interface ChatItemProps {
    chat: any
    active: boolean
    onClick: () => void
}

const ChatItem = ({ chat, active, onClick }: ChatItemProps) => {
    const isOnline = useAppSelector(state => state.messages.onlineUsers[chat.interlocutor.id] ?? false)

    return (
        <div
            onClick={onClick}
            className={`flex items-center gap-3 px-4 py-2.5 cursor-pointer transition-colors
                ${active ? 'bg-neutral-800' : 'hover:bg-neutral-900'}`}
        >
            <div className="relative flex-shrink-0">
                <img src={chat.interlocutor.profile_image} className="w-12 h-12 rounded-full object-cover" />
                {isOnline && (
                    <span className="absolute bottom-0.5 right-0.5 w-3 h-3 bg-green-500 border-2 border-black rounded-full" />
                )}
            </div>
            <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline mb-0.5">
                    <span className="text-sm font-medium text-white truncate">{chat.interlocutor.username}</span>
                    <span className="text-[11px] text-neutral-500 flex-shrink-0">{chat.last_message.created_at}</span>
                </div>
                <p className="text-[13px] text-neutral-400 truncate">{chat.last_message.text}</p>
            </div>
        </div>
    )
}

export default ChatItem