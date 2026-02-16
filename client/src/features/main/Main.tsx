import PostItem from "../../components/PostItem"
import { postApi } from "../../services/postApi"
import EmptyPosts from "../../components/EmptyPosts"



const Main = () => {
    const { data: posts, isLoading, isError } = postApi.useGetAllPostsQuery()

    console.log(posts)

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
            {isError && <div>Error</div>}
            {posts?.length === 0 && <EmptyPosts />}
            {posts?.map(post => (
                <PostItem key={post.id} post={post} />
            ))
            }
        </div >
    )
}

export default Main