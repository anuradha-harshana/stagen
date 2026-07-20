import NotificationHeader from "@/components/notifications/notification-header";
import NotificationList from "@/components/notifications/notification-list";
import NotificationSidebar from "@/components/notifications/notification-sidebar";

const NotificationPage = () => {
  return (
    <div className=" gap-4 min-h-screen bg-oatmeal p-8 grid-1">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Header */}
        <NotificationHeader />

        {/* Main Content */}
        <div className="flex gap-6 items-start">
          {/* Left Side */}
          <div className=" gap-4 flex-1">
            <NotificationList />
          </div>

          {/* Right Side */}
          <div className="w-[340px] shrink-0">
            <NotificationSidebar />
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationPage;