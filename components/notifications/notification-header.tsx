import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Bell, MoreHorizontal } from "lucide-react";

const NotificationHeader = () => {
  return (
    <>
      <div className="flex flex-row justify-between items-start">
        <div className="font-cream">
          <h1 className="text-4xl font-bold ">
            Notifications
          </h1>

          <p className="text-muted-foreground mt-1">
            Stay updated with the latest activity on your home
          </p>
        </div>

        <div className="flex items-center gap-4">
          <Bell className="w-6 h-6" />

          <Avatar>
            <AvatarImage src="/avatar.png" />
            <AvatarFallback>NM</AvatarFallback>
          </Avatar>
        </div>
      </div>

      
    </>
  );
};

export default NotificationHeader;