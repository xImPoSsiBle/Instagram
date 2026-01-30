import { createSlice } from "@reduxjs/toolkit"
import type { User } from "../../models/user.model"


interface authState {
    isAuth: boolean,
    access_token: string | null,
    refresh_token: string | null,
    user: User
}

const access = localStorage.getItem('access_token')
const refresh = localStorage.getItem('refresh_token')
const user = localStorage.getItem('user')
console.log(user)

const initialState: authState = {
    isAuth: !!access,
    access_token: access,
    refresh_token: refresh,
    user: user ? JSON.parse(user) : {}
}

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        login: (state, action) => {
            state.isAuth = true
            state.access_token = action.payload.access_token
            state.refresh_token = action.payload.refresh_token
            state.user.username = action.payload.username
            state.user.email = action.payload.email

            localStorage.setItem('access_token', action.payload.access_token)
            localStorage.setItem('refresh_token', action.payload.refresh_token)
            localStorage.setItem('user', JSON.stringify({username: action.payload.username, email: action.payload.email}))
        },
        logout: (state) => {
            state.isAuth = false
            state.access_token = null
            state.refresh_token = null
            state.user.username = ''
            state.user.email = ''

            localStorage.removeItem('access_token')
            localStorage.removeItem('refresh_token')
        },
    }
})

export const { login, logout } = authSlice.actions