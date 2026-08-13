"use client"

import React, { useState } from "react"
import { toast } from "sonner"
import {
  SupervisorDocumentsHeader,
  SUPERVISOR_PROJECTS,
} from "./SupervisorDocumentsHeader"
import { SupervisorDocumentsSummaryCards } from "./SupervisorDocumentsSummaryCards"
import { DocumentUploadForm, DocumentUploadPayload } from "./DocumentUploadForm"
import { RecentDocumentsList } from "./RecentDocumentsList"

export function SupervisorDocumentsOverview() {
  const [selectedProject, setSelectedProject] = useState(SUPERVISOR_PROJECTS[0])

  // Initial Data for Recent Documents linked to specific site codes
  const [recentDocuments, setRecentDocuments] = useState<DocumentUploadPayload[]>([
    {
      id: "1",
      projectCode: "PRO-233",
      title: "Wall Framing Stage 2 Approval Cert",
      documentType: "Inspection Certificate",
      dateOfUpdate: "Jun 24, 2026 - 3:45 PM",
      visibility: "Visible to Customer",
      description: "Wall framing structural sign-off certificate issued by certified structural inspector.",
      fileName: "wall_framing_cert_pro233.pdf",
      fileSize: "2.4 MB",
      fileType: "pdf",
    },
    {
      id: "2",
      projectCode: "PRO-233",
      title: "Slab Engineering Sign-off & Inspection",
      documentType: "Engineering Report",
      dateOfUpdate: "Jun 24, 2026 - 11:20 AM",
      visibility: "Visible to Customer",
      description: "Concrete pour test results and engineering rebar compliance document.",
      fileName: "slab_engineering_report.pdf",
      fileSize: "4.1 MB",
      fileType: "pdf",
    },
    {
      id: "3",
      projectCode: "PRO-233",
      title: "SWMS Site Safety Sign-off Sheet",
      documentType: "SWMS & Safety Compliance",
      dateOfUpdate: "Jun 20, 2026 - 9:15 AM",
      visibility: "Internal Team Only",
      description: "Safety risk matrix and high-risk work compliance sign-off.",
      fileName: "swms_groove_inn.docx",
      fileSize: "1.1 MB",
      fileType: "docx",
    },
    {
      id: "4",
      projectCode: "PRO-234",
      title: "Foundation Piling Inspection Certificate",
      documentType: "Inspection Certificate",
      dateOfUpdate: "Jun 23, 2026 - 2:10 PM",
      visibility: "Visible to Customer",
      description: "Piling log and load-bearing test sign-off for Sunset Villas site.",
      fileName: "piling_cert_pro234.pdf",
      fileSize: "3.2 MB",
      fileType: "pdf",
    },
    {
      id: "5",
      projectCode: "PRO-234",
      title: "Plumbing Rough-in Compliance Report",
      documentType: "Engineering Report",
      dateOfUpdate: "Jun 21, 2026 - 4:00 PM",
      visibility: "Internal Team Only",
      description: "Sub-floor hydraulic inspection and pipe pressure test results.",
      fileName: "plumbing_roughin_pro234.pdf",
      fileSize: "1.8 MB",
      fileType: "pdf",
    },
    {
      id: "6",
      projectCode: "PRO-235",
      title: "Structural Steel Load Sign-Off",
      documentType: "Engineering Report",
      dateOfUpdate: "Jun 22, 2026 - 10:30 AM",
      visibility: "Visible to Customer",
      description: "Structural engineering approval for high-rise steel column connections.",
      fileName: "horizon_steel_signoff.pdf",
      fileSize: "5.4 MB",
      fileType: "pdf",
    },
    {
      id: "7",
      projectCode: "PRO-236",
      title: "Council Building Permit #8849",
      documentType: "Permit & License",
      dateOfUpdate: "Jun 19, 2026 - 1:45 PM",
      visibility: "Visible to Customer",
      description: "Official council approval permit for Parkview Residence stage 1 work.",
      fileName: "parkview_council_permit.pdf",
      fileSize: "890 KB",
      fileType: "pdf",
    },
  ])

  const handleDocumentUploaded = (newDoc: DocumentUploadPayload) => {
    setRecentDocuments((prev) => [newDoc, ...prev])
  }

  const handleUpdateVisibility = (
    docId: string,
    newVisibility: DocumentUploadPayload["visibility"]
  ) => {
    setRecentDocuments((prev) =>
      prev.map((doc) =>
        doc.id === docId ? { ...doc, visibility: newVisibility } : doc
      )
    )
  }

  // Filter documents by currently selected site number (projectCode)
  const activeSiteDocuments = recentDocuments.filter(
    (doc) => doc.projectCode === selectedProject.code
  )

  const publicCount = activeSiteDocuments.filter(
    (d) => d.visibility === "Visible to Customer"
  ).length

  const latestDoc = activeSiteDocuments[0]

  return (
    <div className="flex flex-col gap-4 w-full font-sans">
      {/* Header */}
      <SupervisorDocumentsHeader
        selectedProject={selectedProject}
        onSelectProject={setSelectedProject}
      />

      {/* Summary KPI Cards dynamically updated for active site */}
      <SupervisorDocumentsSummaryCards
        selectedProject={selectedProject}
        totalCount={activeSiteDocuments.length}
        publicCount={publicCount}
        latestDoc={latestDoc}
      />

      {/* Main Content Layout: 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 w-full">
        {/* Left Column: Document Upload Form bound to active site */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <DocumentUploadForm
            selectedProject={selectedProject}
            onDocumentUploaded={handleDocumentUploaded}
          />
        </div>

        {/* Right Side Column: Recent Uploaded Documents for active site */}
        <div className="lg:col-span-5 flex flex-col gap-4">
          <RecentDocumentsList
            selectedProject={selectedProject}
            documents={activeSiteDocuments}
            onUpdateVisibility={handleUpdateVisibility}
            onViewAll={() =>
              toast.info(`Viewing all uploaded site documents for ${selectedProject.code} ${selectedProject.name}.`)
            }
          />
        </div>
      </div>
    </div>
  )
}
