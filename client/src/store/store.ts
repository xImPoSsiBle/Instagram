import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { authSlice } from "./slices/authSlice";
import { uiSlice } from "./slices/uiSlice";
import { postApi } from "../services/postApi";
import { profileApi } from "../services/profileApi";


const rootReducer = combineReducers({
    auth: authSlice.reducer,
    ui: uiSlice.reducer,
    [postApi.reducerPath]: postApi.reducer,
    [profileApi.reducerPath]: profileApi.reducer
})

export const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(postApi.middleware, profileApi.middleware)
})


export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch