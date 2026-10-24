import { Metadata } from "next";
import { NotificationContainer } from "@/components/notifications/NotificationContainer";
import { PAGE_SHELL_CLASS } from "@/components/shared/pageShell";
import { getCustomerNotifications } from "@/lib/customer/notifications";
import { getCurrentUser } from "@/lib/auth/auth";
import { DEFAULT_CUSTOMER_USER_ID } from "@/lib/customer/store";

export const metadata: Metadata = {
  title: "Notifications | Customer Portal",
  description: "Stay updated with recent activity, project progress & payment alerts on Stagen Build Progress OS.",
};

export default async function NotificationPage() {
  const user = await getCurrentUser();
  const userId = user?.id || DEFAULT_CUSTOMER_USER_ID;
  const initialNotifications = await getCustomerNotifications(userId);

  return (
    <div className={PAGE_SHELL_CLASS}>
      <NotificationContainer initialNotifications={initialNotifications} />
    </div>
  );
}
