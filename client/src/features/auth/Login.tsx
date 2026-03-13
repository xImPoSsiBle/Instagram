import { useEffect, useState } from 'react'
import { IoEyeOffOutline, IoEyeOutline } from 'react-icons/io5'
import { useAppDispatch, useAppSelector } from '../../hooks/redux'
import { login } from '../../store/slices/authSlice'
import { Link, useLocation, useNavigate } from 'react-router-dom'

const Login = () => {
    const dispatch = useAppDispatch()
    const isAuth = useAppSelector(state => state.auth.isAuth);

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [visible, setVisible] = useState(false)

    const navigate = useNavigate()
    const location = useLocation()

    const from = location.state?.from?.pathname || '/'

    const handleLogin = async () => {
        const resp = await fetch('http://localhost:8000/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        })

        const data = await resp.json()

        if (!resp.ok) {
            alert(data.detail)
            return
        }

        console.log(data)

        dispatch(login(data))

        navigate(from, { replace: true })
    }

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if(username === '' || password === '') return

        if(event.key === 'Enter') handleLogin()
    }

    useEffect(() => {
        if(isAuth) navigate(from, { replace: true })
    }, [isAuth, navigate, from])

    return (
        <div className='w-screen h-screen'>
            <div className='w-full h-full flex flex-col items-center justify-center gap-5'>
                <input
                    type="text"
                    placeholder='Введите имя пользователя'
                    onChange={(e) => setUsername(e.target.value)}
                    onKeyDown={handleKeyDown}
                    value={username}
                    className='w-100 h-15 text-white p-3 rounded-2xl bg-[#1f1f1f]'
                />
                <div className='relative w-100'>
                    <input
                        type={visible ? 'text' : 'password'}
                        placeholder='Пароль'
                        onChange={(e) => setPassword(e.target.value)}
                        onKeyDown={handleKeyDown}
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
                    onClick={handleLogin}
                >
                    Войти
                </button>
                <p className='text-white'>Нет аккаунта? <Link to={'/register'} className='text-[#0066f4] cursor-pointer'>Зарегистрироваться</Link></p>
            </div>
        </div>
    )
}

export default Login