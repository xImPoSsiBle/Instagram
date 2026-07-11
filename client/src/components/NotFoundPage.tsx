import { useNavigate } from "react-router-dom"

export default function NotFoundPage() {
    const navigate = useNavigate()

    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-8">
            <div className="flex flex-col items-center text-center gap-6 max-w-sm w-full">
                <p className="text-white font-medium text-[clamp(80px,20vw,120px)] leading-none tracking-tighter">
                    404
                </p>

                <div>
                    <p className="text-white font-medium text-lg">Страница не найдена</p>
                    <p className="text-neutral-500 text-sm mt-2 leading-relaxed">
                        Эта страница не существует или была удалена. Проверь ссылку и попробуй снова.
                    </p>
                </div>

                <div className="flex gap-3 flex-wrap justify-center mt-1">
                    <button
                        onClick={() => navigate(-1)}
                        className="bg-white text-black text-sm font-medium px-7 py-2.5 rounded-lg hover:opacity-85 transition-opacity"
                    >
                        Назад
                    </button>
                    <button
                        onClick={() => navigate('/')}
                        className="bg-transparent text-white text-sm font-medium px-7 py-2.5 rounded-lg border border-neutral-700 hover:bg-neutral-900 transition-colors"
                    >
                        На главную
                    </button>
                </div>
            </div>
        </div>
    )
}