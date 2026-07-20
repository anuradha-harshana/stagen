import NotificationCard from "./notification-card";
import { Check, Image, Receipt, Calendar, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Bell, MoreHorizontal } from "lucide-react";

const notifications = [
  {
    title: "Frame stage completed",
    description: "The Frame stage has been marked as completed.",
    time: "10 mins ago",
    icon: <Check className="text-green-600" />,
  },
  {
    title: "New photos uploaded",
    description: "5 new photos were added to your project.",
    time: "1 hour ago",
    icon: <Image className="text-sky-600" />,
  },
  {
    title: "Invoice #INV-2024-0456 issued",
    description: "A new invoice has been issued.",
    time: "3 hours ago",
    icon: <Receipt className="text-orange-500" />,
  },
  {
    title: "Inspection scheduled",
    description: "Plumbing inspection scheduled.",
    time: "Yesterday",
    icon: <Calendar className="text-purple-600" />,
  },
  {
    title: "Warranty issue updated",
    description: "Warranty issue status changed.",
    time: "2 days ago",
    icon: <Wrench className="text-yellow-500" />,
  },
];

const NotificationList = () => {
  return (
    <div className="space-y-4">

      <div className="flex justify-end gap-3">
        <Button variant="ghost">
          Mark all as read
        </Button>

        <Button variant="ghost" size="icon">
          <MoreHorizontal />
        </Button>
      </div>

      {notifications.map((item) => (
        <NotificationCard
          key={item.title}
          {...item}
        />
      ))}

      <Button
        variant="outline"
        className="w-full rounded-2xl h-14 bg-palladian"
      >
        Load More ▼
      </Button>

    </div>
  );
};

export default NotificationList;