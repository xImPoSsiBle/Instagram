import { useLocation, useNavigate } from "react-router-dom"
import { profileApi } from "../../services/profileApi"
import { isDefaultAvatar } from "../../utils/helpers"
import { useState } from "react"
import EditProfileModal from "../../components/EditProfileModal"


interface ProfileHeaderProps {
    username: string
}

const ProfileHeader = ({ username }: ProfileHeaderProps) => {
    const { data: user, isLoading, isError } = profileApi.useGetProfileQuery(username)
    const [toggleFollow] = profileApi.useToggleFollowMutation()

    const navigate = useNavigate()
    const location = useLocation()
    const [isEditing, setIsEditing] = useState(false)

    const isDefault = isDefaultAvatar(user?.profile_image ?? '')

    const openFollowList = (type: 'follower' | 'following') => {
        navigate(`/profile/${username}/${type}`, { state: { backgroundLocation: location } })
    }

    const navigateToDirect = () => {
        navigate(`/direct/${user?.id}`)
    }

    if (isLoading) return (
        <div className="my-5 w-[70%] flex items-center flex-col animate-pulse">
            <div className="flex items-center">
                <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-full bg-neutral-800" />
                <div className="flex flex-col ml-5 sm:ml-10 gap-4">
                    <div className="h-5 w-32 bg-neutral-800 rounded" />
                    <div className="flex gap-3">
                        <div className="h-4 w-16 bg-neutral-800 rounded" />
                        <div className="h-4 w-24 bg-neutral-800 rounded" />
                        <div className="h-4 w-20 bg-neutral-800 rounded" />
                    </div>
                </div>
            </div>
            <div className="mt-5 h-9 w-[260px] bg-neutral-800 rounded-xl" />
        </div>
    )

    if (isError || !user) return (
        <div className="my-5 text-neutral-400 text-sm">
            Пользователь не найден
        </div>
    )

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
                    ? <>
                        <button onClick={() => setIsEditing(true)} className="bg-[#2b3036cc] w-full max-w-[260px] p-2 rounded-xl text-sm">
                            Редактировать профиль
                        </button>
                        {isEditing && <EditProfileModal onClose={() => setIsEditing(false)} />}
                    </>
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
                        <button
                            onClick={navigateToDirect}
                            className="bg-[#2b3036cc] flex-1 max-w-[180px] sm:max-w-[240px] p-2 rounded-xl text-sm cursor-pointer"
                        >
                            Сообщение
                        </button>
                    </div>
                }

            </div>
        </div>
    )
}

export default ProfileHeader