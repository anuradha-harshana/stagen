import { NotificationContainer } from "@/components/notifications/NotificationContainer"
import { PAGE_SHELL_CLASS } from "@/components/shared/pageShell"

export default function NotificationPage() {
  return (
    <div className={PAGE_SHELL_CLASS}>
      <NotificationContainer />
    </div>
  )
}
