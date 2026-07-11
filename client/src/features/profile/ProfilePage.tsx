import { useParams } from "react-router-dom"
import ProfileHeader from "./ProfileHeader"
import ProfilePosts from "./ProfilePosts"


const ProfilePage = () => {
  const { username } = useParams<{ username: string }>()

  if (!username) {
    return null
  }


  return (
    <div className="w-screen flex flex-col justify-center items-center text-white md:ml-[16%]">
      <ProfileHeader username={username} />
      <ProfilePosts username={username} />
    </div>
  )
}

export default ProfilePage