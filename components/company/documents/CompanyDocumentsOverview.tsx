"use client"

import React, { useState } from "react"
import { toast } from "sonner"
import { CompanyDocument } from "./CompanyUploadDocumentModal"
import { CompanyDocumentsHeader } from "./CompanyDocumentsHeader"
import { CompanyDocumentsTable } from "./CompanyDocumentsTable"
import { CompanyUploadDocumentModal } from "./CompanyUploadDocumentModal"
import { CompanyDocumentDetailsModal } from "./CompanyDocumentDetailsModal"

// Initial mock data matching the user's provided images
const INITIAL_COMPANY_DOCUMENTS: CompanyDocument[] = [
  {
    id: "doc-101",
    name: "Site Safety Manual",
    category: "Safety",
    visibleTo: ["All Roles"],
    uploadDate: "2023-11-15",
    fileName: "site_safety_manual.pdf",
    fileSize: "2.4 MB",
    fileType: "pdf",
    description: "Master workplace health and safety compliance manual for high-risk operations.",
  },
  {
    id: "doc-102",
    name: "Contractor Agreement Template",
    category: "Legal",
    visibleTo: ["Admin", "Management"],
    uploadDate: "2023-12-01",
    fileName: "subcontractor_agreement.docx",
    fileSize: "1.2 MB",
    fileType: "docx",
    description: "Standard terms and conditions agreement template for external sub-contractors.",
  },
  {
    id: "doc-103",
    name: "Quality Assurance Checklist",
    category: "QA",
    visibleTo: ["Admin", "Supervisor"],
    uploadDate: "2023-12-20",
    fileName: "quality_assurance_checklist.pdf",
    fileSize: "850 KB",
    fileType: "pdf",
    description: "Mandatory quality check criteria before handoff and lock-up stages.",
  },
  {
    id: "doc-104",
    name: "Environmental Compliance Guide",
    category: "Compliance",
    visibleTo: ["All Roles"],
    uploadDate: "2024-01-10",
    fileName: "environmental_guidelines_2024.pdf",
    fileSize: "3.1 MB",
    fileType: "pdf",
    description: "Waste management and noise control standards across all site developments.",
  },
  {
    id: "doc-105",
    name: "Customer Handover & Defect Policy",
    category: "Policy",
    visibleTo: ["Admin", "Management", "Customer"],
    uploadDate: "2024-02-05",
    fileName: "customer_handover_policy.docx",
    fileSize: "940 KB",
    fileType: "docx",
    description: "Protocol for defect inspection sign-off and key handover guarantees.",
  },
]

export function CompanyDocumentsOverview() {
  const [documents, setDocuments] = useState<CompanyDocument[]>(INITIAL_COMPANY_DOCUMENTS)
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)
  const [selectedDocument, setSelectedDocument] = useState<CompanyDocument | null>(null)
  const [detailsModalMode, setDetailsModalMode] = useState<"view" | "edit">("view")

  // Add uploaded document
  const handleUploadDocument = (newDoc: CompanyDocument) => {
    setDocuments((prev) => [newDoc, ...prev])
  }

  // Delete document
  const handleDeleteDocument = (docId: string) => {
    const docToDelete = documents.find((d) => d.id === docId)
    setDocuments((prev) => prev.filter((d) => d.id !== docId))
    if (docToDelete) {
      toast.success(`Deleted "${docToDelete.name}"`)
    }
  }

  // Preview document
  const handlePreviewDocument = (doc: CompanyDocument) => {
    setSelectedDocument(doc)
    setDetailsModalMode("view")
  }

  // Edit document
  const handleEditDocument = (doc: CompanyDocument) => {
    setSelectedDocument(doc)
    setDetailsModalMode("edit")
  }

  // Save updated document
  const handleSaveDocument = (updatedDoc: CompanyDocument) => {
    setDocuments((prev) => prev.map((d) => (d.id === updatedDoc.id ? updatedDoc : d)))
  }

  return (
    <div className="flex flex-col gap-5 w-full font-sans">
      {/* Header */}
      <CompanyDocumentsHeader
        onOpenUploadModal={() => setIsUploadModalOpen(true)}
      />

      {/* Documents Table */}
      <CompanyDocumentsTable
        documents={documents}
        onDeleteDocument={handleDeleteDocument}
        onPreviewDocument={handlePreviewDocument}
        onEditDocument={handleEditDocument}
      />

      {/* Upload Document Modal */}
      <CompanyUploadDocumentModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUploadSuccess={handleUploadDocument}
      />

      {/* Details / Edit Document Modal */}
      <CompanyDocumentDetailsModal
        document={selectedDocument}
        mode={detailsModalMode}
        onClose={() => setSelectedDocument(null)}
        onSave={handleSaveDocument}
      />
    </div>
  )
}
