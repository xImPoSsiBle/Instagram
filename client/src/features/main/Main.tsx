import PostItem from "../../components/PostItem"
import { postApi } from "../../services/postApi"
import EmptyPosts from "../../components/EmptyPosts"



const Main = () => {
    const { data: posts, isLoading, isError } = postApi.useGetAllPostsQuery()

    return (
        <div className='w-full h-full text-white flex flex-col items-center mb-15 md:mb-0'>
            {isLoading &&
                [1, 2, 3, 4, 5].map((i) => (
                    <div className='w-[470px] flex flex-col gap-3 border-b-1 p-3 mb-5' key={i}>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gray-600 animate-pulse" />
                            <span className="w-20 h-5 rounded-full animate-pulse bg-gray-600" />
                        </div>
                        <div className="w-full h-80 bg-gray-600 rounded-md animate-pulse" />
                    </div>
                ))
            }
            {isError && (
                <div className="flex flex-col items-center justify-center gap-3 mt-20 text-center px-4">
                    <p className="text-white text-lg font-semibold">Что-то пошло не так</p>
                    <p className="text-gray-400 text-sm">Не удалось загрузить посты. Проверьте соединение.</p>
                    <button
                        className="mt-2 px-6 py-2 bg-[#0066f4] text-white rounded-full text-sm hover:opacity-80 transition"
                        onClick={() => window.location.reload()}
                    >
                        Попробовать снова
                    </button>
                </div>
            )}
            {posts?.length === 0
                && <div className="w-screen h-screen">
                    <EmptyPosts />
                </div>}
            {posts?.map(post => (
                <PostItem key={post.id} post={post} />
            ))
            }
        </div >
    )
}

export default Main