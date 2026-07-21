import NotificationHeader from "@/components/notifications/notification-header";
import NotificationList from "@/components/notifications/notification-list";
import NotificationSidebar from "@/components/notifications/notification-sidebar";

const NotificationPage = () => {
  return (
    <div className="min-h-screen bg-oatmeal px-4 py-6 sm:px-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6 lg:space-y-8">
        
        {/* Header */}
        <NotificationHeader />

        {/* Main Content */}
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
          
          {/* Notification List */}
          <main className="min-w-0 flex-1">
            <NotificationList />
          </main>

          {/* Filter Sidebar */}
          <aside className="w-full lg:w-[340px] lg:shrink-0">
            <NotificationSidebar />
          </aside>

        </div>
      </div>
    </div>
  );
};

export default NotificationPage;