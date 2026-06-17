import { fetchBaseQuery, type BaseQueryFn } from "@reduxjs/toolkit/query"
import { login, logout } from "../store/slices/authSlice"
import { postApi } from "./postApi"


const rawBaseQuery = fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_API_URL}`,
    credentials: 'include',
})

export const baseQueryWithReauth: BaseQueryFn = async (args, api, extraOptions) => {
    let result = await rawBaseQuery(args, api, extraOptions)

    if (result.error && result.error.status === 401) {
        const refreshResult = await rawBaseQuery(
            {
                url: "auth/refresh",
                method: "POST",
            },
            api,
            extraOptions
        )

        if (refreshResult.data) {
            api.dispatch(login(refreshResult.data))
            result = await rawBaseQuery(args, api, extraOptions)
        } else {
            await fetch(`${import.meta.env.VITE_API_URL}/auth/logout`, {
                method: 'POST',
                credentials: 'include',
            })
            api.dispatch(logout())
            api.dispatch(postApi.util.resetApiState())
            window.location.href = '/login'
        }
    }

    return result
}