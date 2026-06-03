import { useLocation, useNavigate } from "react-router-dom"
import { profileApi } from "../../services/profileApi"
import EmptyPosts from "../../components/EmptyPosts"

interface ProfilePostsProps {
    username: string
}

const ProfilePosts = ({ username }: ProfilePostsProps) => {
    const { data: posts } = profileApi.useGetProfilePostsQuery(username)

    const navigate = useNavigate()
    const location = useLocation()

    const handleClick = (id: number) => {
        navigate(`/post/${id}`, {
            state: { backgroundLocation: location }
        })
    }

    console.log(posts)

    return (
        <div className="flex justify-start flex-wrap min-w-200 sm:max-w-[700px] max-w-[100px] gap-1 my-5">
            {posts?.length === 0 && <EmptyPosts />}

            {posts?.map(post => (
                <div
                    key={post.id}
                    className="w-65 h-85 bg-gray-500 border border-black"
                    onClick={() => handleClick(post.id)}
                >
                    {post.media_type === "video" ? (
                        <video
                            className='w-full h-full'
                            src={post.image}
                            muted
                            preload="metadata"
                        />
                    ) : (
                        <img
                            src={post.image}
                            alt="post"
                            className="w-full h-full"
                        />
                    )}
                </div>
            ))}
        </div>
    )
}

export default ProfilePosts