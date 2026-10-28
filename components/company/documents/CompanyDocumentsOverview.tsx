"use client"

import React, { useState, useEffect } from "react"
import { toast } from "sonner"
import { CompanyDocument } from "./CompanyUploadDocumentModal"
import { CompanyDocumentsHeader } from "./CompanyDocumentsHeader"
import { CompanyDocumentsTable } from "./CompanyDocumentsTable"
import { CompanyUploadDocumentModal } from "./CompanyUploadDocumentModal"
import { CompanyDocumentDetailsModal } from "./CompanyDocumentDetailsModal"
import {
  fetchCompanyDocumentsAction,
  createCompanyDocumentAction,
  updateCompanyDocumentAction,
  removeCompanyDocumentAction,
} from "@/lib/company/actions"

// Empty until the company document JSON has loaded.
const INITIAL_COMPANY_DOCUMENTS: CompanyDocument[] = []

export function CompanyDocumentsOverview() {
  const [documents, setDocuments] = useState<CompanyDocument[]>(INITIAL_COMPANY_DOCUMENTS)
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false)
  const [selectedDocument, setSelectedDocument] = useState<CompanyDocument | null>(null)
  const [detailsModalMode, setDetailsModalMode] = useState<"view" | "edit">("view")

  // Load from JSON file on mount
  useEffect(() => {
    fetchCompanyDocumentsAction()
      .then((docs) => {
        if (docs) {
          setDocuments(docs)
        }
      })
      .catch((err) => {
        console.error("Failed to fetch company documents from JSON:", err)
      })
  }, [])

  // Add uploaded document
  const handleUploadDocument = async (newDoc: CompanyDocument) => {
    try {
      const savedDoc = await createCompanyDocumentAction({
        name: newDoc.name,
        category: newDoc.category,
        visibleTo: newDoc.visibleTo,
        fileName: newDoc.fileName,
        fileSize: newDoc.fileSize,
        fileType: newDoc.fileType,
        description: newDoc.description,
      })
      setDocuments((prev) => [savedDoc, ...prev.filter((d) => d.id !== savedDoc.id)])
    } catch (err) {
      console.error("Failed to save uploaded document to JSON:", err)
      setDocuments((prev) => [newDoc, ...prev])
    }
  }

  // Delete document
  const handleDeleteDocument = async (docId: string) => {
    const docToDelete = documents.find((d) => d.id === docId)
    setDocuments((prev) => prev.filter((d) => d.id !== docId))
    try {
      await removeCompanyDocumentAction(docId)
      if (docToDelete) {
        toast.success(`Deleted "${docToDelete.name}"`)
      }
    } catch (err) {
      console.error("Failed to delete document from JSON:", err)
      if (docToDelete) {
        setDocuments((prev) => [...prev, docToDelete])
      }
      toast.error("Failed to delete document.")
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
  const handleSaveDocument = async (updatedDoc: CompanyDocument) => {
    setDocuments((prev) => prev.map((d) => (d.id === updatedDoc.id ? updatedDoc : d)))
    try {
      await updateCompanyDocumentAction(updatedDoc.id, {
        name: updatedDoc.name,
        category: updatedDoc.category,
        visibleTo: updatedDoc.visibleTo,
        fileName: updatedDoc.fileName,
        fileSize: updatedDoc.fileSize,
        fileType: updatedDoc.fileType,
        description: updatedDoc.description,
      })
      toast.success(`Updated "${updatedDoc.name}"`)
    } catch (err) {
      console.error("Failed to update document in JSON:", err)
      toast.error("Failed to save changes.")
    }
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
