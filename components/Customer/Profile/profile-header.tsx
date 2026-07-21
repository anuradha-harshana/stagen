import { Bell } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const ProfileHeader = () => {
  return (
    <div className="flex items-start justify-between">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Profile</h1>

        <p className="mt-1 text-sm text-muted-foreground">
          Manage your personal information and preferences
        </p>
      </div>

      <div className="flex items-center gap-4">
        <Avatar>
          <AvatarImage src="/profile-avatar.png" alt="Profile" />
          <AvatarFallback>JB</AvatarFallback>
        </Avatar>

        <Bell className="h-5 w-5 text-muted-foreground" />
      </div>
    </div>
  )
}

export default ProfileHeader