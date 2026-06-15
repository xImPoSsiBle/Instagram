import { createSlice } from "@reduxjs/toolkit"
import type { User } from "../../models/user.model"


interface authState {
    isAuth: boolean,
    isLoading: boolean,
    user: User
}

const initialState: authState = {
    isAuth: false,
    isLoading: true,
    user: JSON.parse(localStorage.getItem('user') || '{}')
}

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        login: (state, action) => {
            state.isAuth = true
            state.user.username = action.payload.username
            state.user.email = action.payload.email

            localStorage.setItem('user', JSON.stringify({username: action.payload.username, email: action.payload.email}))
        },
        logout: (state) => {
            state.isAuth = false
            state.user.username = ''
            state.user.email = ''
            
            localStorage.removeItem('user')
        },
        setAuthLoading: (state, action) => {
            state.isLoading = action.payload
        }
    }
})

export const { login, logout, setAuthLoading } = authSlice.actions