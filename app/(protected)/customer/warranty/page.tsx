import { WarrantyHeader } from "@/components/Customer/Warranty/WarrantyHeader"
import { WarrantyCards } from "@/components/Customer/Warranty/WarrantyCards"
import { MaintenanceTimeline } from "@/components/Customer/Warranty/MaintenanceTimeline"
import { DefectLog } from "@/components/Customer/Warranty/DefectLog"
import { PAGE_SHELL_CLASS } from "@/components/shared/pageShell"

export default function WarrantyPage() {
  return (
    <div className={PAGE_SHELL_CLASS}>
      <WarrantyHeader />
      <WarrantyCards />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <MaintenanceTimeline />
        <DefectLog />
      </div>
    </div>
  )
}
