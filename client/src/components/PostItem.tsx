import { useState } from "react";
import type { Post } from "../models/post.model"
import { IoMdHeart, IoMdHeartEmpty } from "react-icons/io";
import { FaRegComment } from "react-icons/fa";
import { postApi } from "../services/postApi";
import { useLocation, useNavigate } from "react-router-dom";


interface PostItemProps {
    post: Post;
}

const PostItem = ({ post }: PostItemProps) => {
    const [avatarLoaded, setAvatarLoaded] = useState(false)
    const [imageLoaded, setImageLoaded] = useState(false)

    const navigate = useNavigate()
    const localtion = useLocation()

    const [toggleLike] = postApi.useToggleLikeMutation()

    const handleClick = () => {
        navigate(`/post/${post.id}`, {
            state: { backgroundLocation: localtion }
        })
    }

    return (
        <div className='w-[470px] flex flex-col gap-3 p-3 mb-5'>
            <div className="flex items-center gap-3">
                {!avatarLoaded && (
                    <div className="w-10 h-10 rounded-full bg-gray-300 animate-pulse" />
                )}

                <img
                    className={`w-10 h-10 rounded-full ${avatarLoaded ? "block" : "hidden"}`}
                    src="https://www.befunky.com/images/wp/wp-2020-07-orignal-mirror-selfie-1.jpg"
                    onLoad={() => setAvatarLoaded(true)}
                    alt=""
                />

                <span
                    className="font-bold cursor-pointer"
                    onClick={() => navigate(`/profile/${post.user.username}`)}
                >
                    {post.user.username}
                </span>
            </div>
            {!imageLoaded && (
                <div className="w-full h-80 bg-gray-600 rounded-md animate-pulse" />
            )}
            {post.media_type === "video" ? (
                <video
                    className={`w-full rounded-md ${imageLoaded ? "block" : "hidden"}`}
                    src={post.image}
                    muted
                    preload="metadata"
                    onLoadedData={() => setImageLoaded(true)}
                />
            ) : (
                <img
                    className={`w-full rounded-md ${imageLoaded ? "block" : "hidden"}`}
                    src={post.image}
                    onLoad={() => setImageLoaded(true)}
                    alt=""
                />
            )}
            <p><b>{post.user.username}</b> {post.caption}</p>

            <div className="flex gap-5">
                <div
                    className="cursor-pointer flex gap-2"
                    onClick={() => toggleLike(post.id)}
                >
                    {post.liked
                        ? <IoMdHeart size={25} color="red" />
                        : <IoMdHeartEmpty size={25} />
                    }
                    <span>{post.likes}</span>
                </div>

                <FaRegComment
                    size={25}
                    className="cursor-pointer"
                    onClick={handleClick}
                />
            </div>
        </div>
    )
}

export default PostItem