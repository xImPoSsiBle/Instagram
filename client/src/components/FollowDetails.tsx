import { useNavigate, useParams } from "react-router-dom"
import { profileApi } from "../services/profileApi"

type FollowType = 'followers' | 'following'

const FollowDetails = () => {
    const { username, type } = useParams<{ username: string, type: FollowType }>()
    const navigate = useNavigate()

    if (!username || !type) {
        navigate('/')
        return
    }

    const isFollowing = type === 'following'

    const { data } = profileApi.useGetFollowsQuery({ username, type })
    console.log(data)

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
                <div className="divide-y divide-[rgb(48,48,54)]">
                    {data?.map((user) => (
                        <div
                            key={user.id}
                            className="flex items-center gap-3 px-4 py-3 hover:bg-[#2a2d33] transition cursor-pointer"
                            onClick={() => navigate(`/profile/${user.username}`)}
                        >
                            <img
                                src={user.profile_image}
                                alt={user.username}
                                className="w-10 h-10 rounded-full object-cover"
                            />

                            <div className="flex flex-col">
                                <span className="font-semibold">{user.username}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default FollowDetails