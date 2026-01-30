import type { JSX } from "react";
import { FiPlus, FiUser } from "react-icons/fi";
import { GoHome } from "react-icons/go";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { toggleCreatePostModal } from "../store/slices/uiSlice";
import { logout } from "../store/slices/authSlice";
import { postApi } from "../services/postApi";
import { useNavigate } from "react-router-dom";
import { IoExitOutline } from "react-icons/io5";

interface MenuItems {
    name: string,
    icon: JSX.Element,
    onClick?: () => void,
}

const SideBar = () => {
    const dispatch = useAppDispatch()
    const navigate = useNavigate()

    const {user} = useAppSelector(state => state.auth)

    const menuItems: MenuItems[] = [
        { name: 'Главная', icon: <GoHome size={26} />, onClick: () => { navigate('/') } },
        { name: 'Создать', icon: <FiPlus size={26} />, onClick: () => { dispatch(toggleCreatePostModal()) } },
        { name: 'Профиль', icon: <FiUser  size={26} />, onClick: () => { navigate(`/profile/${user.username}`) } },
        {
            name: 'Выход', icon: <IoExitOutline size={26} />,
            onClick: () => {
                dispatch(logout())
                dispatch(postApi.util.resetApiState())
            },
        },
    ];

    return (
        <div className="w-1/6 h-screen text-white border-[rgb(38,38,38)] border-r-1 flex flex-col items-center fixed">
            <h1 className="text-2xl my-10">Instagram</h1>
            {menuItems.map((item) => (
                <div key={item.name} className="w-4/5 text-lg my-2 flex items-center gap-3 cursor-pointer hover:bg-[rgba(255,255,255,0.1)] p-3 rounded-xl transition" onClick={() => item?.onClick?.()}>
                    {item.icon}
                    <span>{item.name}</span>
                </div>
            ))}
        </div>
    )
}

export default SideBar