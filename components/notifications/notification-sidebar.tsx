import NotificationFilter from "./notification-filter";
import NotificationChannel from "./notification-channel";

const NotificationSidebar = () => {
  return (
    <aside className="w-[300px] space-y-6">
      <NotificationFilter />
      <NotificationChannel />
    </aside>
  );
};

export default NotificationSidebar;