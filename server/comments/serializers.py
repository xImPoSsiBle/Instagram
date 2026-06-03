from utils import media_url


def serialize_comment(comment, user):
    return {
        'id': comment.id,
        'content': comment.content,
        'post_id': comment.post_id,
        'created_at': comment.created_at,
        'user': {
            'id': user.id,
            'username': user.username,
            'profile_image': media_url(user.profile_image)
        }
    }