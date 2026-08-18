import { Metadata } from "next"
import { SupervisorNotificationContainer } from "@/components/supervisor/notifications/SupervisorNotificationContainer"
import { PAGE_SHELL_CLASS } from "@/components/shared/pageShell"

export const metadata: Metadata = {
  title: "Supervisor Notifications | Stagen",
  description: "Manage site-level alerts, client messages, schedule delays, and warranty actions on Stagen Build Progress OS.",
}

export default function SupervisorNotificationsPage() {
  return (
    <div className={PAGE_SHELL_CLASS}>
      <SupervisorNotificationContainer />
    </div>
  )
}
