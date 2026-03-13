import { useNavigate, useParams } from "react-router-dom"


const FollowDetails = () => {
    const { type } = useParams()
    const navigate = useNavigate()

    const isFollowing = type === 'following' ? true : false

    return (
        <div
            className="inset-0 flex items-center justify-center fixed z-50 bg-black/70"
            onClick={() => navigate(-1)}
        >
            <div
                className="w-[560px] h-[400px] bg-[#212328] rounded-xl overflow-y-auto md:overflow-hidden shadow-2xl text-white"
                onClick={e => e.stopPropagation()}
            >
                <div className="w-full text-center text-md font-bold py-2 border-b-1 border-[rgb(48,48,54)]">
                    Ваши {isFollowing ? "подписки" : "подписчики"}
                </div>
            </div>
        </div>
    )
}

export default FollowDetails