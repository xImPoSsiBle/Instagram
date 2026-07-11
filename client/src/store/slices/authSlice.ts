import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

interface AuthUser {
    id: number
    username: string
    email: string,
    profile_image: string
}

interface authState {
    isAuth: boolean,
    isLoading: boolean,
    user: AuthUser | null
}

const initialState: authState = {
    isAuth: false,
    isLoading: true,
    user: null
}

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        login: (state, action: PayloadAction<{ id: number, username: string, email: string, profile_image: string }>) => {
            state.isAuth = true
            state.user = action.payload
        },
        logout: (state) => {
            state.isAuth = false
            state.user = null
        },
        setAuthLoading: (state, action) => {
            state.isLoading = action.payload
        }
    }
})

export const { login, logout, setAuthLoading } = authSlice.actions