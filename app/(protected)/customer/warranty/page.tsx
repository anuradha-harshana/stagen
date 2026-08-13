import { Suspense } from "react"
import { WarrantyHeader } from "@/components/Customer/Warranty/WarrantyHeader"
import { WarrantyCards } from "@/components/Customer/Warranty/WarrantyCards"
import { MaintenanceTimeline } from "@/components/Customer/Warranty/MaintenanceTimeline"
import { DefectLog } from "@/components/Customer/Warranty/DefectLog"
import { WarrantySkeleton } from "@/components/Customer/Warranty/WarrantySkeleton"

function WarrantyContent() {
  return (
    <div className="flex flex-col gap-4 w-full">
      <WarrantyHeader />
      <WarrantyCards />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <MaintenanceTimeline />
        <DefectLog />
      </div>
    </div>
  )
}

export default function WarrantyPage() {
  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto font-sans">
      <Suspense fallback={<WarrantySkeleton />}>
        <WarrantyContent />
      </Suspense>
    </div>
  )
}
