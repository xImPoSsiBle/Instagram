export interface Comment {
    id: number,
    content: string,
    user: {
        username: string,
        profile_image: string
    }
}