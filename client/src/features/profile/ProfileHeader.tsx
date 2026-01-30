import { profileApi } from "../../services/profileApi"

interface ProfileHeaderProps {
    username: string
}

const ProfileHeader = ({ username }: ProfileHeaderProps) => {
    const { data: user } = profileApi.useGetProfileQuery(username)

    const isDefaultAvatar = user?.profile_image?.includes('default-avatar') ?? false

    return (
        <div className="my-5 w-[70%] flex items-center flex-col">
            <div className="flex items-center">
                <div className={`w-35 h-35 flex items-center justify-center rounded-full overflow-hidden ${isDefaultAvatar && 'invert'}`}>
                    <img
                        src={user?.profile_image}
                        alt=""
                        className="w-full h-full"
                    />
                </div>
                <div className="flex flex-col items-start ml-10 gap-5">
                    <p className="text-2xl fint-extrabold">
                        {user?.username}
                    </p>
                    <div className="flex text-sm gap-5">
                        <span>{user?.posts} публикаций</span>
                        <span>{user?.followers} подписчиков</span>
                        <span>{user?.following} подписок</span>
                    </div>
                </div>
            </div>
            <div className="mt-5">
                {user?.is_me 
                ? <button className="bg-[#2b3036cc] w-65 min-h-5 p-2 rounded-xl">
                    Редактировать профиль
                </button>
                : <div className="flex gap-5">
                    <button className="bg-[#0066f4] w-60 min-h-5 p-2 rounded-xl cursor-pointer">Подписаться</button>
                    <button className="bg-[#2b3036cc] w-60 min-h-5 p-2 rounded-xl cursor-pointer">Сообщение</button>
                </div>
            }
                
            </div>
        </div>
    )
}

export default ProfileHeader