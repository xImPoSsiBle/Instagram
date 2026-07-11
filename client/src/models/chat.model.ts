export interface Chat {
    chat_id: string,
    interlocutor: {
        id: number,
        username: string,
        profile_image: string,
    },
    last_message: {
        text: string,
        created_at: string
    }
}       