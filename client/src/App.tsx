import { Route, Routes, useLocation } from 'react-router-dom'
import './App.css'
import Main from './features/main/Main'
import Login from './features/auth/Login'
import Register from './features/auth/Register'
import MainLayout from './layouts/MainLayout'
import AuthLayout from './layouts/AuthLayout'
import PrivateRoute from './routes/PrivateRoute'
import PostDetails from './components/PostDetails'
import ProfilePage from './features/profile/ProfilePage'
import FollowDetails from './components/FollowDetails'
import { ToastContainer } from 'react-toastify'
import { useAppDispatch, useAppSelector } from './hooks/redux'
import { useEffect, useRef } from 'react'
import { login, logout, setAuthLoading } from './store/slices/authSlice'
import { setCsrfToken } from './utils/csrf'
import ChatPage from './features/chat/ChatPage'
import { addMessage, incrementUnread, setTyping, setUserStatus } from './store/slices/messagesSlice'
import { WSContext } from './context/WSContext'
import { API_URL, WS_URL } from './constants/api'
import NotFoundPage from './components/NotFoundPage'

function App() {
  const dispatch = useAppDispatch()
  const { isLoading } = useAppSelector(state => state.auth)
  const { user } = useAppSelector(state => state.auth)
  const location = useLocation()
  const state = location.state as { backgroundLocation?: Location }

  const wsRef = useRef<WebSocket | null>(null);

  const checkAuth = async () => {
    try {
      const resp = await fetch(`${import.meta.env.VITE_API_URL}/auth/me`, {
        credentials: 'include',
      })
      if (resp.ok) {
        const data = await resp.json()
        dispatch(login(data))
      } else {
        dispatch(logout())
      }
    } catch {
      dispatch(logout())
    } finally {
      dispatch(setAuthLoading(false))
    }
  }

  const initCsrf = async () => {
    const resp = await fetch(`${API_URL}/auth/csrf-token`, { credentials: 'include' })
    const data = await resp.json()
    setCsrfToken(data.csrf_token)
  }


  useEffect(() => {
    if (!user) return;
    wsRef.current = new WebSocket(`${WS_URL}/chat/ws/connect`);

    wsRef.current.onmessage = (e) => {
      const data = JSON.parse(e.data);
      if (data.type === 'message') {
        dispatch(addMessage(data));
        
        const isCurrentChat = location.pathname === `/direct/${data.sender_id}`

        if (!isCurrentChat && user.id !== data.sender_id) {
          dispatch(incrementUnread(data.chat_id))
        }
      }

      if (data.type === 'status') {
        dispatch(setUserStatus({ userId: data.user_id, isOnline: data.is_online }))
      }

      if (data.type === 'typing') {
        dispatch(setTyping({ userId: data.from_user, isTyping: data.is_typing }))
      }
    };

    return () => wsRef.current?.close();
  }, [user]);

  useEffect(() => {
    initCsrf()
    checkAuth()
  }, [])

  if (isLoading) return null

  return (
    <WSContext.Provider value={wsRef}>
      <ToastContainer />
      <Routes location={state?.backgroundLocation || location}>
        <Route element={<PrivateRoute />}>
          <Route element={<MainLayout />}>
            <Route path='/' element={<Main />} />
            <Route path='/profile/:username' element={<ProfilePage />} key={location.pathname} />
            <Route path='/direct/:id?' element={<ChatPage />} />
          </Route>
        </Route>

        <Route element={<AuthLayout />}>
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
        </Route>

        <Route path='*' element={<NotFoundPage />} />
      </Routes>

      {state?.backgroundLocation && (
        <Routes>
          <Route element={<PrivateRoute />}>
            <Route element={<PostDetails />} path='/post/:id' />
            <Route element={<FollowDetails />} path='/profile/:username/:type' />
          </Route>
        </Routes>
      )}
    </WSContext.Provider>
  )
}

export default App
