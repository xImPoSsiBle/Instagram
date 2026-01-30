export interface User {
    id: number,
    username: string,
    profile_image: string,
    email: string,
    posts: number,
    followers: number,
    following: number,
    followed: boolean,
    is_me: boolean,
}