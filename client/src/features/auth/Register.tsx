import { useState } from "react"
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5"
import { Link, useNavigate } from "react-router-dom"


const Register = () => {
    const navigate = useNavigate()

    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [visible, setVisible] = useState(false)

    const handleRegister = async () => {
        const resp = await fetch('http://localhost:8000/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, email, password })
        })

        const data = await resp.json()
        if (!resp.ok) {
            alert(data.detail)
            return
        }
        
        navigate('/login')
    }

    return (
        <div className='w-screen h-screen'>
            <div className='w-full h-full flex flex-col items-center justify-center gap-5'>
                <input
                    type="text"
                    placeholder='Введите имя пользователя'
                    onChange={(e) => setUsername(e.target.value)}
                    value={username}
                    className='w-100 h-15 text-white p-3 rounded-2xl bg-[#1f1f1f]'
                />
                <input
                    type="text"
                    placeholder='Введите эл. почту'
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                    className='w-100 h-15 text-white p-3 rounded-2xl bg-[#1f1f1f]'
                />
                <div className='relative w-100'>
                    <input
                        type={visible ? 'text' : 'password'}
                        placeholder='Пароль'
                        onChange={(e) => setPassword(e.target.value)}
                        value={password}
                        className='w-100 h-15 text-white p-3 pr-12 rounded-2xl bg-[#1f1f1f]'
                    />
                    <div
                        className="absolute top-5 right-4 cursor-pointer z-10"
                        onClick={() => setVisible(!visible)}
                    >
                        {visible ? (
                            <IoEyeOutline size={22} color="white" />
                        ) : (
                            <IoEyeOffOutline size={22} color="white" />
                        )}
                    </div>
                </div>
                <button
                    className='w-100 h-10 text-white bg-[#0066f4] rounded-full hover:cursor-pointer'
                    onClick={handleRegister}
                >
                    Зарегистрироваться
                </button>
                <p className="text-white">Есть аккаунт? <Link to={'/login'} className='text-[#0066f4]'>Войти</Link></p>
            </div>
        </div>
    )
}

export default Register