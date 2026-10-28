import { Metadata } from "next";
import { NotificationContainer } from "@/components/notifications/NotificationContainer";
import { PAGE_SHELL_CLASS } from "@/components/shared/pageShell";
import { getCustomerNotifications } from "@/lib/customer/notifications";
import { requireRole } from "@/lib/auth/auth";

export const metadata: Metadata = {
  title: "Notifications | Customer Portal",
  description: "Stay updated with recent activity, project progress & payment alerts on Stagen Build Progress OS.",
};

export default async function NotificationPage() {
  const user = await requireRole(["customer"]);
  const userId = user.id;
  const initialNotifications = await getCustomerNotifications(userId);

  return (
    <div className={PAGE_SHELL_CLASS}>
      <NotificationContainer initialNotifications={initialNotifications} />
    </div>
  );
}
