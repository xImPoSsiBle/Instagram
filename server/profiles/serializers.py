from utils import media_url

def serialize_profile(profile, current_user_id):
    return {
        'id': profile.id,
        'username': profile.username,
        "profile_image": media_url(profile.profile_image),
        'posts': profile.posts,
        'followers': profile.followers,
        'following': profile.following,
        'followed': profile.followed,
        'is_me': profile.id == current_user_id
    }

def serialize_post(post):
    return {
        'id': post.id,
        'caption': post.caption,
        'image': media_url(post.image_url),
        'media_type': post.media_type,
        'created_at': post.create_at,
        'user_id': post.user_id
    }