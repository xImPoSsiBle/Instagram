import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./api";
import type { Chat } from "../models/chat.model";


export const chatApi = createApi({
    reducerPath: 'chatApi',
    baseQuery: baseQueryWithReauth,
    endpoints: (build) => ({
        getChatId: build.query<Chat[], void>({
            query: () => ({
                url: `chat`,
            })
        })
    })
})