import Image from "next/image"
import { Bell } from "lucide-react"
import { Userdetails } from "@/lib/types/types"




const UserDetails = ({
  username
}: Userdetails) => {
  return (
    <div className="flex font-sans justify-between">
          <div>
              <h1 className="text-blue-fantastic text-3xl">Welcome back, {username}</h1>
              <p className="text-sm text-gray-500">Here's the latest update on your home</p>
          </div>
          <div className="flex gap-3 h-fit">
              <Image 
                  src="/images/user.jpg"
                  width={44}
                  height={44}
                  alt="user"
                  className="rounded-full"
              />
              <Bell color="white"/>
          </div>
        </div>
  )
}

export default UserDetails
