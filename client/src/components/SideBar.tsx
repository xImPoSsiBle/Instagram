import type { JSX } from "react";
import { FiPlus, FiUser } from "react-icons/fi";
import { GoHome } from "react-icons/go";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { toggleCreatePostModal } from "../store/slices/uiSlice";
import { logout } from "../store/slices/authSlice";
import { postApi } from "../services/postApi";
import { useNavigate } from "react-router-dom";
import { IoExitOutline } from "react-icons/io5";
import { profileApi } from "../services/profileApi";

interface MenuItems {
    name: string,
    icon: JSX.Element,
    onClick?: () => void,
}

const SideBar = () => {
    const dispatch = useAppDispatch()
    const navigate = useNavigate()

    const { user } = useAppSelector(state => state.auth)

    const handleLogout = async () => {
        await fetch(`${import.meta.env.VITE_API_URL}/auth/logout`, {
            method: 'POST',
            credentials: 'include',
        })
        dispatch(logout())
        dispatch(postApi.util.resetApiState())
        dispatch(profileApi.util.resetApiState())
        navigate('/login')
    }

    const menuItems: MenuItems[] = [
        { name: 'Главная', icon: <GoHome className="w-6 h-6 shrink-0" />, onClick: () => { navigate('/') } },
        { name: 'Создать', icon: <FiPlus className="w-6 h-6 shrink-0" />, onClick: () => { dispatch(toggleCreatePostModal()) } },
        { name: 'Профиль', icon: <FiUser className="w-6 h-6 shrink-0" />, onClick: () => { navigate(`/profile/${user.username}`) } },
        {
            name: 'Выход', icon: <IoExitOutline className="w-6 h-6 shrink-0" />,
            onClick: handleLogout
        },
    ];

    return (
        <div className="fixed z-50 bottom-0 left-0 w-full h-16 text-white border-[rgb(38,38,38)] flex flex-row items-center justify-around bg-black border-t-1 md:w-1/6 md:h-screen md:border-r-1 md:flex-col md:justify-start"
        >
            <h1 className="text-xl hidden md:text-2xl md:block my-10">Instagram</h1>
            {menuItems.map((item) => (
                <div key={item.name} className="w-4/5 my-2 flex items-center justify-center md:justify-start gap-3 cursor-pointer hover:bg-[rgba(255,255,255,0.1)] p-3 rounded-xl transition" onClick={() => item?.onClick?.()}>
                    {item.icon}
                    <span className="text-md hidden md:block lg:text-lg">{item.name}</span>
                </div>
            ))}
        </div>
    )
}

export default SideBar