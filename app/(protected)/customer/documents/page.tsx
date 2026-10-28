import { DocumentsHeader } from "@/components/Customer/Documents/DocumentsHeader"
import { DocumentsFilter } from "@/components/Customer/Documents/DocumentsFilter"
import { PhotoGrid } from "@/components/Customer/Documents/PhotoGrid"
import { DocumentList } from "@/components/Customer/Documents/DocumentList"
import { PAGE_SHELL_CLASS } from "@/components/shared/pageShell"

import { requireRole } from "@/lib/auth/auth";
import { getCustomerDocuments, getCustomerPhotos, getCustomerProjects } from "@/lib/tenant/projects";
export default async function DocumentsPage() {
  const user = await requireRole(["customer"]);
  const projects = await getCustomerProjects(user.id, user.companyId);
  const [documents, photos] = await Promise.all([getCustomerDocuments(user.id, user.companyId), getCustomerPhotos(projects.map(p => "tenant-" + p.id))]);
  return (
    <div className={PAGE_SHELL_CLASS}>
      <DocumentsHeader />

      <PhotoGrid photos={photos.map(p => ({ id: p.id, label: p.label, date: p.timestamp, stage: p.stage_name, url: p.url }))} />
      <DocumentList documents={documents} />
    </div>
  )
}
