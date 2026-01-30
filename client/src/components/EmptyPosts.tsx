import { HiOutlineCamera } from 'react-icons/hi2'

const EmptyPosts = () => {
    return (
        <div className="w-full h-full flex flex-col items-center justify-center gap-5">
            <div className="w-15 h-15 flex items-center justify-center border-2 rounded-full">
                <HiOutlineCamera className="w-[60%] h-[60%]" />
            </div>
            <span className="text-3xl font-bold">Пока нет публикаций</span>
        </div>
    )
}

export default EmptyPosts