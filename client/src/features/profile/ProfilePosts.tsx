import { useLocation, useNavigate } from "react-router-dom"
import { profileApi } from "../../services/profileApi"
import EmptyPosts from "../../components/EmptyPosts"

interface ProfilePostsProps {
    username: string
}

const ProfilePosts = ({ username }: ProfilePostsProps) => {
    const { data: posts, isLoading, isError } = profileApi.useGetProfilePostsQuery(username)

    const navigate = useNavigate()
    const location = useLocation()

    const handleClick = (id: number) => {
        navigate(`/post/${id}`, {
            state: { backgroundLocation: location }
        })
    }

    if (isLoading) return (
        <div className="w-full max-w-3xl mx-auto px-1 my-5">
            <div className="grid grid-cols-3 gap-0.5 sm:gap-1 animate-pulse">
                {Array.from({ length: 9 }).map((_, i) => (
                    <div key={i} className="aspect-square bg-neutral-800" />
                ))}
            </div>
        </div>
    )

    if (isError) return (
        <div className="text-neutral-400 text-sm text-center my-5">
            Не удалось загрузить публикации
        </div>
    )

    return (
        <div className="w-full max-w-3xl mx-auto px-1 my-5">
            {posts?.length === 0 && <EmptyPosts />}

            <div className="grid grid-cols-3 gap-0.5 sm:gap-1">
                {posts?.map(post => (
                    <div
                        key={post.id}
                        className="aspect-square bg-gray-200 cursor-pointer overflow-hidden"
                        onClick={() => handleClick(post.id)}
                    >
                        {post.media_type === "video" ? (
                            <video
                                className='w-full h-full object-cover'
                                src={post.image}
                                muted
                                preload="metadata"
                            />
                        ) : (
                            <img
                                src={post.image}
                                alt="post"
                                className="w-full h-full object-cover"
                            />
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}

export default ProfilePosts