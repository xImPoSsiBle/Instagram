import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./api";
import { type Post } from "../models/post.model";
import type { Comment } from "../models/comment.model";


export const postApi = createApi({
    reducerPath: 'postApi',
    baseQuery: baseQueryWithReauth,
    tagTypes: ['Post', 'Comment', 'Profile', 'ProfilePosts'],
    endpoints: (build) => ({
        getAllPosts: build.query<Post[], void>({
            query: () => 'posts',
            providesTags: ['Post']
        }),
        getPostById: build.query<Post, number>({
            query: (postId) => `posts/${postId}`,
            providesTags: ['Post']
        }),
        createPost: build.mutation<Post, { caption: string, image: File }>({
            query: ({ caption, image }) => {
                const formData = new FormData()
                formData.append('caption', caption)
                formData.append('image', image)

                return {
                    url: 'posts',
                    method: 'POST',
                    body: formData
                }
            },
            invalidatesTags: ['Post', 'Profile', 'ProfilePosts']
        }),
        toggleLike: build.mutation<{ liked: boolean }, number>({
            query: (postId) => ({
                url: 'like',
                method: 'POST',
                body: { post_id: postId }
            }),
            invalidatesTags: ['Post']
        }),
        getComments: build.query<Comment[], number>({
            query: (postId) => `comments/${postId}`,
            providesTags: ['Comment']
        }),
        createComment: build.mutation<{ comment: Comment }, { post_id: number, content: string }>({
            query: ({ post_id, content }) => ({
                url: 'comments',
                method: 'POST',
                body: { post_id, content }
            }),
            invalidatesTags: ['Comment']
        })
    })
})