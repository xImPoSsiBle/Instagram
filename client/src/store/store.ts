import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { authSlice } from "./slices/authSlice";
import { uiSlice } from "./slices/uiSlice";
import { postApi } from "../services/postApi";
import { profileApi } from "../services/profileApi";
import { messagesSlice } from "./slices/messagesSlice";
import { chatApi } from "../services/chatApi";


const rootReducer = combineReducers({
    auth: authSlice.reducer,
    ui: uiSlice.reducer,
    messages: messagesSlice.reducer,
    [postApi.reducerPath]: postApi.reducer,
    [profileApi.reducerPath]: profileApi.reducer,
    [chatApi.reducerPath]: chatApi.reducer
})

export const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(postApi.middleware, profileApi.middleware, chatApi.middleware)
})


export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch