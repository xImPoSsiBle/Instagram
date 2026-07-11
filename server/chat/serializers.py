from utils import media_url


def serialize_chat(chat, user, message):
    return {
        "chat_id": str(chat.id),
        "interlocutor": {
            "id": user.id,
            "username": user.username,
            "profile_image": media_url(user.profile_image),
        },
        "last_message": {
            "text": message.text,
            "created_at": message.created_at.isoformat(),
        }
    }