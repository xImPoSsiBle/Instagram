import { Outlet, useNavigate } from "react-router-dom"
import SideBar from "../components/SideBar"
import { useAppSelector } from "../hooks/redux"
import { useEffect } from "react"
import CreatePostModal from "../components/CreatePostModal"


const MainLayout = () => {
    const { access_token } = useAppSelector(state => state.auth)
    const { createPostModal } = useAppSelector(state => state.ui)
    const navigate = useNavigate()


    useEffect(() => {
        if (!access_token) {
            navigate('/login')
        }
    }, [])

    return (
        <div className="flex flex-col md:flex-row">
            {createPostModal && <CreatePostModal />}
            <SideBar />

            <Outlet />
        </div>
    )
}

export default MainLayout