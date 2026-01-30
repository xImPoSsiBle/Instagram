import { fetchBaseQuery, type BaseQueryFn } from "@reduxjs/toolkit/query"
import { login, logout } from "../store/slices/authSlice"
import { type RootState } from "../store/store"
import { postApi } from "./postApi"


const rawBaseQuery = fetchBaseQuery({
    baseUrl: "http://localhost:8000/",
    prepareHeaders: (headers, { getState }) => {
        const token = (getState() as RootState).auth.access_token
        if (token) {
            headers.set("authorization", `Bearer ${token}`)
        }
        return headers
    }
})

export const baseQueryWithReauth: BaseQueryFn = async (args, api, extraOptions) => {
    let result = await rawBaseQuery(args, api, extraOptions)

    if (result.error && result.error.status === 401) {
        const refreshToken = (api.getState() as RootState).auth.refresh_token

        const refreshResult = await rawBaseQuery(
            {
                url: "auth/refresh",
                method: "POST",
                body: { refresh_token: refreshToken },
            },
            api,
            extraOptions
        )

        if (refreshResult.data) {
            api.dispatch(login(refreshResult.data))

            result = await rawBaseQuery(args, api, extraOptions)
        } else {
            api.dispatch(logout())
            api.dispatch(postApi.util.resetApiState())
            window.location.href = '/login'
        }
    }

    return result
}

// export const baseFetch = async (url: string, options: RequestInit = {}) => {
//     const access_token = (store.getState() as RootState).auth.access_token

//     const resp = await fetch(BASE_URL + url, {
//         ...options,
//         headers: {
//             ...options.headers,
//             'Authorization': `Bearer ${access_token}`
//         }
//     })

//     if (resp.status === 401) {
//         return refreshAndRetry(url, options)
//     }

//     return resp
// }

// const refreshAndRetry = async (url: string, options: RequestInit = {}) => {
//     const refresh_token = store.getState().auth.refresh_token

//     const resp = await fetch(BASE_URL + 'auth/refresh', {
//         method: 'POST',
//         body: JSON.stringify({ refresh_token })
//     })

//     if (!resp.ok) {
//         store.dispatch(logout())
//         window.location.href = '/login'
//         throw new Error('Failed to refresh token')
//     }

//     const data = await resp.json()

//     store.dispatch(login(data))

//     return fetch(BASE_URL + url, {
//         ...options,
//         headers: {
//             ...options.headers,
//             'Authorization': `Bearer ${data.access_token}`
//         }
//     })
// }