import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from './api';
import { type User } from '../models/user.model';
import type { Post } from "../models/post.model";


export const profileApi = createApi({
    reducerPath: 'profileApi',
    baseQuery: baseQueryWithReauth,
    tagTypes: ['Profile', 'ProfilePosts'],
    endpoints: (build) => ({
        getProfile: build.query<User, string>({
            query: (username) => `profile/${username}`,
            providesTags: ['Profile']
        }),
        getUserById: build.query<User, number>({
            query: (id) => `profile/id/${id}`,
            providesTags: ['Profile']
        }),
        getProfilePosts: build.query<Post[], string>({
            query: (username) => `profile/${username}/posts`,
            providesTags: ['ProfilePosts']
        }),
        toggleFollow: build.mutation<{ followed: boolean }, number>({
            query: (id) => ({
                url: `follow/${id}`,
                method: 'POST'
            }),
            invalidatesTags: ['Profile']
        }),
        getFollows: build.query<User[], { username: string, type: string }>({
            query: ({ username, type }) => ({
                url: `follow/${username}/${type}`,
                method: 'GET'
            })
        }),
        updateProfile: build.mutation<User, FormData>({
            query: (data) => ({
                url: 'profile/update',
                method: 'PATCH',
                body: data,
            }),
            invalidatesTags: ['Profile']
        })
    })
})