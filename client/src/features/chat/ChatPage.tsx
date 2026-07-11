import { useParams } from "react-router-dom"
import ChatSideBar from './ChatSideBar'
import DMPage from './DMPage'

const ChatPage = () => {
    const { id } = useParams()

    return (
        <div className='flex w-full min-h-screen md:ml-[16.666%]'>
            <div className={`${id ? 'hidden md:flex' : 'flex'} w-full md:w-80 flex-shrink-0`}>
                <ChatSideBar />
            </div>

            <div className={`${id ? 'flex' : 'hidden md:flex'} flex-1`}>
                {id ? <DMPage /> : (
                    <div className="hidden md:flex flex-1 items-center justify-center text-neutral-500 text-sm">
                        Выберите чат
                    </div>
                )}
            </div>
        </div>
    )
}

export default ChatPage