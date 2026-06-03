from utils import media_url


def serialize_user(user):
    return {
        'id': user.id,
        'username': user.username,
        'profile_image': media_url(user.profile_image),
    }