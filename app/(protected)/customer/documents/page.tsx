import { DocumentsHeader } from "@/components/Customer/Documents/DocumentsHeader"
import { DocumentsFilter } from "@/components/Customer/Documents/DocumentsFilter"
import { PhotoGrid } from "@/components/Customer/Documents/PhotoGrid"
import { DocumentList } from "@/components/Customer/Documents/DocumentList"
import { PAGE_SHELL_CLASS } from "@/components/shared/pageShell"

export default function DocumentsPage() {
  return (
    <div className={PAGE_SHELL_CLASS}>
      <DocumentsHeader />
      <DocumentsFilter />
      <PhotoGrid />
      <DocumentList />
    </div>
  )
}
