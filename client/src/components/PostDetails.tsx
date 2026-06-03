import { useNavigate, useParams } from "react-router-dom"
import { postApi } from "../services/postApi"
import { IoMdHeart, IoMdHeartEmpty } from "react-icons/io"
import { useState } from "react"
import { isDefaultAvatar } from "../utils"

const PostDetails = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const postId = Number(id)

    const { data: post } = postApi.useGetPostByIdQuery(postId, { skip: !postId })
    const { data: comments } = postApi.useGetCommentsQuery(postId, { skip: !postId })
    const [createComment] = postApi.useCreateCommentMutation()
    const [toggleLike] = postApi.useToggleLikeMutation()

    const [comment, setComment] = useState("")

    const handleComment = async () => {
        await createComment({ post_id: postId, content: comment })
        setComment("")
    }
    console.log(comments)
    const isDefault = isDefaultAvatar('default-avatar')

    return (
        <div
            onClick={() => navigate(-1)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
        >
            <div
                onClick={(e) => e.stopPropagation()}
                className="md:flex w-[900px] h-[600px] bg-[#212328] rounded-xl overflow-y-auto md:overflow-hidden shadow-2xl text-white"
            >
                <div className="flex-1 bg-black flex items-center justify-center">
                    {post?.media_type === 'video'
                        ? <video src={post?.image} controls className="w-[470px] h-[600px] md:w-full md:h-full object-contain"></video>
                        : <img src={post?.image} className="w-[470px] h-[600px] md:w-full md:h-fullobject-contain" />
                    }
                </div>

                <div className="w-full md:w-[380px] flex flex-col items-center">
                    <div className="w-[90%] flex items-center gap-3 p-4 border-b border-[#2b3036] ">
                        <img
                            src={post?.user.profile_image}
                            className={`w-9 h-9 rounded-full ${isDefault && 'invert'}`}
                        />
                        <div className="px-4 py-2 text-sm">
                            <span className="font-semibold">{post?.user.username}</span>
                            <p>{post?.caption}</p>
                        </div>
                    </div>

                    <div className="w-[90%] flex-1 overflow-y-auto p-4 space-y-4">
                        {comments?.map((c) => (
                            <div key={c.id} className="flex items-center">
                                <img
                                    src={c.user?.profile_image}
                                    className="w-8 h-8 rounded-full"
                                />
                                <div className="flex px-4 py-2 text-sm">
                                    <span className="font-semibold text-sm mr-2">
                                        {c.user?.username}
                                    </span>
                                    <p className="text-sm">{c.content}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="w-[90%] border-t border-[#2b3036] p-4 space-y-3">
                        <div className="flex items-center gap-2" onClick={() => toggleLike(postId)}>
                            {post?.liked
                                ? <IoMdHeart size={24} color="red" />
                                : <IoMdHeartEmpty size={24} />
                            }
                            <span className="font-semibold">{post?.likes}</span>
                        </div>
                    </div>
                    <div className="w-[90%] flex min-h-[50px] items-center border-t border-[#2b3036] px-2">
                        <textarea
                            value={comment}
                            onChange={(e) => {
                                setComment(e.target.value)
                                e.target.style.height = "auto"
                                e.target.style.height = `${e.target.scrollHeight}px`
                            }}
                            placeholder="Добавьте комментарий"
                            className="max-h-[60px] min-h-[50px] flex-1 px-4 py-2 pt-5 text-sm outline-none resize-none overflow-y-auto break-words rounded-lg"
                        />

                        <button
                            disabled={!comment.trim()}
                            onClick={handleComment}
                            className="h-10 px-4 font-semibold text-sm disabled:opacity-40 cursor-pointer"
                        >
                            Опубликовать
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default PostDetails
