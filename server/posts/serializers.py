from utils import media_url

def serialize_post(post, user, likes, liked):
    return{
        'id': post.id,
        'caption': post.caption,
        'image': media_url(post.image_url),
        'media_type': post.media_type,
        'created_at': post.create_at,
        'likes': likes,
        'liked': bool(liked),
        'user': {
            'id': post.user_id,
            'username': user.username,
            'profile_image': media_url(user.profile_image)
        }
    }
