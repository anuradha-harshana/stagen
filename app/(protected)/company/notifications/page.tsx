import { CompanyNotificationsOverview } from "@/components/company/notifications/CompanyNotificationsOverview"
import { PAGE_SHELL_CLASS } from "@/components/shared/pageShell"

export const metadata = {
  title: "Notifications & Rules | Company Portal",
  description: "Configure automated communication templates and alert rules.",
}

export default function CompanyNotificationsPage() {
  return (
    <div className={PAGE_SHELL_CLASS}>
      <CompanyNotificationsOverview />
    </div>
  )
}
