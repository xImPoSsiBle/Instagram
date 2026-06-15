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
import { useEffect } from 'react'
import { login, logout, setAuthLoading } from './store/slices/authSlice'

function App() {
  const dispatch = useAppDispatch()
  const { isLoading } = useAppSelector(state => state.auth)
  const location = useLocation()
  const state = location.state as { backgroundLocation?: Location }

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const resp = await fetch('http://localhost:8000/auth/me', {
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

    checkAuth()
  }, [])

  if(isLoading) return null

  return (
    <>
      <ToastContainer />
      <Routes location={state?.backgroundLocation || location}>
        <Route element={<PrivateRoute />}>
          <Route element={<MainLayout />}>
            <Route path='/' element={<Main />} />
            <Route path='/profile/:username' element={<ProfilePage />} key={location.pathname} />
          </Route>
        </Route>

        <Route element={<AuthLayout />}>
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
        </Route>
      </Routes>

      {state?.backgroundLocation && (
        <Routes>
          <Route element={<PrivateRoute />}>
            <Route element={<PostDetails />} path='/post/:id' />
            <Route element={<FollowDetails />} path='/profile/:username/:type' />
          </Route>
        </Routes>
      )}
    </>
  )
}

export default App
