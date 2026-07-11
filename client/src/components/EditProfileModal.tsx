import { useRef, useState } from "react"
import { useAppSelector } from "../hooks/redux"
import { profileApi } from "../services/profileApi"


interface EditProfileModalProps {
    onClose: () => void
}

const EditProfileModal = ({ onClose }: EditProfileModalProps) => {
    const { user } = useAppSelector(state => state.auth)
    const [updateProfile, { isLoading }] = profileApi.useUpdateProfileMutation()

    const [username, setUsername] = useState(user?.username ?? '')
    const [preview, setPreview] = useState<string | null>(null)
    const [file, setFile] = useState<File | null>(null)
    const [error, setError] = useState('')
    const fileRef = useRef<HTMLInputElement>(null)

    const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        const f = e.target.files?.[0]
        if (!f) return
        setFile(f)
        setPreview(URL.createObjectURL(f))
    }

    const handleSave = async () => {
        if (!username.trim()) { setError('Имя не может быть пустым'); return }
        setError('')

        const formData = new FormData()
        formData.append('username', username)
        if (file) formData.append('avatar', file)

        await updateProfile(formData)
        onClose()
    }

    return (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
            <div className="bg-neutral-900 border border-neutral-800 rounded-xl w-full max-w-sm overflow-hidden">
                <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-800">
                    <button onClick={onClose} className="text-white text-sm">Отмена</button>
                    <span className="text-white font-medium text-sm">Редактировать профиль</span>
                    <button
                        onClick={handleSave}
                        disabled={isLoading}
                        className="text-[#0095f6] font-medium text-sm disabled:opacity-50"
                    >
                        Готово
                    </button>
                </div>

                <div className="p-6 flex flex-col gap-6">
                    <div className="flex flex-col items-center gap-3">
                        <div className="relative w-20 h-20 group">
                            <img
                                src={preview ?? user?.profile_image}
                                className="w-20 h-20 rounded-full object-cover"
                                alt="Аватар"
                            />
                            <div
                                onClick={() => fileRef.current?.click()}
                                className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
                            >
                                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" />
                                    <circle cx="12" cy="13" r="4" />
                                </svg>
                            </div>
                        </div>
                        <button
                            onClick={() => fileRef.current?.click()}
                            className="text-[#0095f6] text-sm font-medium"
                        >
                            Сменить фото
                        </button>
                        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-neutral-500 text-xs">Имя пользователя</label>
                        <input
                            value={username}
                            onChange={e => setUsername(e.target.value)}
                            className="bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2.5 text-white text-sm outline-none focus:border-neutral-500"
                        />
                        {error && <span className="text-red-500 text-xs">{error}</span>}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default EditProfileModal