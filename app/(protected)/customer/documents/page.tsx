import { Suspense } from "react"
import { DocumentsHeader } from "@/components/Customer/Documents/DocumentsHeader"
import { DocumentsFilter } from "@/components/Customer/Documents/DocumentsFilter"
import { PhotoGrid } from "@/components/Customer/Documents/PhotoGrid"
import { DocumentList } from "@/components/Customer/Documents/DocumentList"
import { DocumentsSkeleton } from "@/components/Customer/Documents/DocumentsSkeleton"

function DocumentsContent() {
  return (
    <div className="flex flex-col gap-4 w-full">
      <DocumentsHeader />
      <DocumentsFilter />
      <PhotoGrid />
      <DocumentList />
    </div>
  )
}

export default function DocumentsPage() {
  return (
    <div className="min-h-full w-full bg-oatmeal px-5 py-6 md:px-8 md:py-8 space-y-6 pb-16">
      <Suspense fallback={<DocumentsSkeleton />}>
        <DocumentsContent />
      </Suspense>
    </div>
  )
}
