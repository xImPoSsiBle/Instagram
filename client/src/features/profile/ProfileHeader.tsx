import { useLocation, useNavigate } from "react-router-dom"
import { profileApi } from "../../services/profileApi"
import { isDefaultAvatar } from "../../utils"

interface ProfileHeaderProps {
    username: string
}

const ProfileHeader = ({ username }: ProfileHeaderProps) => {
    const { data: user } = profileApi.useGetProfileQuery(username)
    const [toggleFollow] = profileApi.useToggleFollowMutation()

    const navigate = useNavigate()
    const location = useLocation()

    const isDefault = isDefaultAvatar('default-avatar')

    if (!user) {
        return <div>Не найден</div>
    }

    const openFollowList = (type: 'follower' | 'following') => {
        navigate(`/profile/${username}/${type}`, { state: { backgroundLocation: location } })
    }

    return (
        <div className="my-5 w-[70%] flex items-center flex-col">
            <div className="flex items-center">
                <div className={`w-20 h-20 sm:w-28 sm:h-28 md:w-35 md:h-35 flex items-center justify-center rounded-full overflow-hidden ${isDefault && 'invert'}`}>
                    <img
                        src={user?.profile_image}
                        alt=""
                        className="w-full h-full"
                    />
                </div>
                <div className="flex flex-col items-start ml-5 sm:ml-10 gap-5">
                    <p className="text-lg sm:text-2xl font-extrabold">
                        {user?.username}
                    </p>
                    <div className="flex text-xs sm:text-sm gap-3 sm:gap-5">
                        <span>{user?.posts} публикаций</span>
                        <span
                            className="cursor-pointer"
                            onClick={() => openFollowList('follower')}
                        >
                            {user?.followers} подписчиков
                        </span>
                        <span
                            className="cursor-pointer"
                            onClick={() => openFollowList('following')}

                        >
                            {user?.following} подписок
                        </span>
                    </div>
                </div>
            </div>
            <div className="mt-4 sm:mt-5 w-full flex justify-center">
                {user?.is_me
                    ? <button className="bg-[#2b3036cc] w-full max-w-[260px] p-2 rounded-xl text-sm">
                        Редактировать профиль
                    </button>
                    : <div className="flex gap-3 sm:gap-5 w-full justify-center">
                        <button
                            className={`${user.followed ? 'bg-[#2b3036cc]' : 'bg-[#0066f4]'} flex-1 max-w-[180px] sm:max-w-[240px] p-2 rounded-xl text-sm cursor-pointer`}
                            onClick={() => toggleFollow(user.id)}
                        >
                            {user.followed
                                ? <span>Отписаться</span>
                                : <span>Подписаться</span>
                            }
                        </button>
                        <button className="bg-[#2b3036cc] flex-1 max-w-[180px] sm:max-w-[240px] p-2 rounded-xl text-sm cursor-pointer">Сообщение</button>
                    </div>
                }

            </div>
        </div>
    )
}

export default ProfileHeader