import React, { useState } from "react"
import { useAppDispatch } from "../hooks/redux"
import { toggleCreatePostModal } from "../store/slices/uiSlice"
import { postApi } from "../services/postApi"


const CreatePostModal = () => {
  const dispatch = useAppDispatch()

  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [caption, setCaption] = useState('')

  const [createPost] = postApi.useCreatePostMutation()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0]
    if (!selected) return

    setFile(selected)
    setPreview(URL.createObjectURL(selected))
  }

  const handleCreatePost = async () => {
    if (!file) return

    createPost({ caption, image: file })
    dispatch(toggleCreatePostModal())
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    const files = e.dataTransfer.files[0]

    if (!files) return

    setFile(files)
    setPreview(URL.createObjectURL(files))
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={() => dispatch(toggleCreatePostModal())}
    >
      <div className="bg-[#212328] rounded-t-2xl" onClick={e => e.stopPropagation()}>
        <div className="h-10 bg-black rounded-t-2xl flex items-center justify-center">
          <h1 className="text-white font-bold">
            Создание публикации
          </h1>
        </div>

        {!file && (
          <div
            className="w-120 h-120 bg-[#212328] flex flex-col items-center justify-center rounded-b-2xl"
            onClick={(e) => e.stopPropagation()}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            <span className="text-white text-xl">
              Перетащите сюда фото или видео
            </span>

            <input
              id="input-file"
              type="file"
              className="hidden"
              accept="image/*,video/*"
              onChange={handleFileChange}
            />

            <label
              htmlFor="input-file"
              className="w-50 h-10 bg-[#4a5df1] flex items-center justify-center text-white font-medium rounded mt-5 cursor-pointer"
            >
              <span>
                Выбрать на компьютере
              </span>
            </label>
          </div>
        )}

        {file && preview && (
          <div className="flex h-[500px] w-[900px]">
            <div className="w-2/3 bg-black flex items-center justify-center">
              {file.type.startsWith("image") ? (
                <img
                  src={preview}
                  className="max-h-full max-w-full object-contain"
                />
              ) : (
                <video
                  src={preview}
                  controls
                  className="max-h-full max-w-full object-contain"
                />
              )}
            </div>

            <div className="w-1/3 p-4 flex flex-col gap-4">
              <textarea
                placeholder="Напишите описание..."
                className="w-full h-40 resize-none rounded-lg bg-[#2b3036] p-3 text-white outline-none focus:ring-2 focus:ring-[#4a5df1]"
                value={caption}
                onChange={e => setCaption(e.target.value)}
              />

              <button
                onClick={handleCreatePost}
                className="mt-auto h-10 rounded-lg bg-[#4a5df1] text-white font-medium hover:bg-[#3f50d8] transition"
              >
                Поделиться
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default CreatePostModal