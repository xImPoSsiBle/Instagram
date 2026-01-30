import { Navigate, Outlet, useLocation } from "react-router-dom"
import { useAppSelector } from "../hooks/redux"


const PrivateRoute = () => {
    const isAuth = useAppSelector(state => state.auth.isAuth)
    const location = useLocation()

    return isAuth ? <Outlet /> : <Navigate state={{ from: location }} to={'/login'} replace />
}

export default PrivateRoute