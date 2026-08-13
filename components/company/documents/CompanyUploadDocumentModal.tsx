"use client"

import React, { useState, useRef } from "react"
import { Upload, X, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"

export type RoleType = "All Roles" | "Admin" | "Management" | "Supervisor" | "Trade" | "Customer"

export type DocumentCategory =
  | "Safety"
  | "Legal"
  | "QA"
  | "Policy"
  | "Compliance"
  | "Technical"
  | "Standard"

export type FileExtensionType = "pdf" | "docx" | "txt" | "xlsx" | "other"

export interface CompanyDocument {
  id: string
  name: string
  category: DocumentCategory
  visibleTo: RoleType[]
  uploadDate: string
  fileName: string
  fileSize: string
  fileType: FileExtensionType
  description?: string
}

export const ALL_ROLES: RoleType[] = [
  "All Roles",
  "Admin",
  "Management",
  "Supervisor",
  "Trade",
  "Customer",
]

export const ALL_CATEGORIES: DocumentCategory[] = [
  "Safety",
  "Legal",
  "QA",
  "Policy",
  "Compliance",
  "Technical",
  "Standard",
]

interface CompanyUploadDocumentModalProps {
  isOpen: boolean
  onClose: () => void
  onUploadSuccess: (newDoc: CompanyDocument) => void
}

export function CompanyUploadDocumentModal({
  isOpen,
  onClose,
  onUploadSuccess,
}: CompanyUploadDocumentModalProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [documentName, setDocumentName] = useState("")
  const [category, setCategory] = useState<DocumentCategory>("Safety")
  const [selectedRoles, setSelectedRoles] = useState<RoleType[]>(["All Roles"])
  const [isDragging, setIsDragging] = useState(false)

  const [attachedFile, setAttachedFile] = useState<{
    file: File
    name: string
    sizeFormatted: string
    fileType: FileExtensionType
  } | null>(null)

  if (!isOpen) return null

  const handleRoleToggle = (role: RoleType) => {
    if (role === "All Roles") {
      if (selectedRoles.includes("All Roles")) {
        setSelectedRoles([])
      } else {
        setSelectedRoles(["All Roles"])
      }
      return
    }

    let updated = selectedRoles.filter((r) => r !== "All Roles")
    if (updated.includes(role)) {
      updated = updated.filter((r) => r !== role)
    } else {
      updated.push(role)
    }

    if (updated.length === ALL_ROLES.length - 1) {
      setSelectedRoles(["All Roles"])
    } else {
      setSelectedRoles(updated)
    }
  }

  const processFile = (file: File) => {
    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size is too large. Max allowed document size is 10MB.")
      return
    }

    const fileExt = file.name.substring(file.name.lastIndexOf(".")).toLowerCase()
    let fileType: FileExtensionType = "other"
    if (fileExt.includes("pdf")) fileType = "pdf"
    else if (fileExt.includes("doc")) fileType = "docx"
    else if (fileExt.includes("txt")) fileType = "txt"
    else if (fileExt.includes("xls")) fileType = "xlsx"

    const sizeKB = Math.round(file.size / 1024)
    const sizeFormatted = sizeKB > 1024 ? `${(sizeKB / 1024).toFixed(1)} MB` : `${sizeKB} KB`

    setAttachedFile({
      file,
      name: file.name,
      sizeFormatted,
      fileType,
    })

    if (!documentName) {
      const nameWithoutExt = file.name.substring(0, file.name.lastIndexOf(".")) || file.name
      setDocumentName(nameWithoutExt.replace(/[-_]/g, " "))
    }

    toast.success(`Attached "${file.name}" successfully!`)
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) processFile(file)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file) processFile(file)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!documentName.trim()) {
      toast.error("Please enter a document name.")
      return
    }

    if (selectedRoles.length === 0) {
      toast.error("Please select at least one visible role.")
      return
    }

    const todayStr = new Date().toISOString().split("T")[0]

    const newDocument: CompanyDocument = {
      id: `doc-${Date.now()}`,
      name: documentName.trim(),
      category: category,
      visibleTo: selectedRoles.length === 0 ? ["All Roles"] : selectedRoles,
      uploadDate: todayStr,
      fileName: attachedFile
        ? attachedFile.name
        : `${documentName.toLowerCase().replace(/\s+/g, "_")}.pdf`,
      fileSize: attachedFile ? attachedFile.sizeFormatted : "1.8 MB",
      fileType: attachedFile ? attachedFile.fileType : "pdf",
    }

    onUploadSuccess(newDocument)
    toast.success(`Document "${newDocument.name}" uploaded successfully!`)

    // Reset Form
    setDocumentName("")
    setCategory("Safety")
    setSelectedRoles(["All Roles"])
    setAttachedFile(null)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200 font-sans">
      <div className="bg-palladian rounded-3xl shadow-2xl border border-blue-fantastic/15 w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-blue-fantastic/15">
          <h2 className="text-lg font-bold text-blue-fantastic font-sans">Upload Document</h2>
          <button
            onClick={onClose}
            type="button"
            className="h-8 w-8 rounded-full flex items-center justify-center text-blue-fantastic/60 hover:text-blue-fantastic hover:bg-palladian transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* File Dropzone Area */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-200 ${
              isDragging
                ? "border-truffle-trouble bg-truffle-trouble/5 scale-[0.99]"
                : attachedFile
                ? "border-emerald-500/50 bg-emerald-500/5"
                : "border-blue-fantastic/15 bg-palladian/30 hover:border-blue-fantastic/40 hover:bg-palladian/60"
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileSelect}
              accept=".pdf,.docx,.doc,.txt,.xlsx,.xls"
              className="hidden"
            />

            {attachedFile ? (
              <div className="flex items-center gap-3 w-full justify-between bg-palladian p-3 rounded-xl border border-emerald-500/30 shadow-xs">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="h-10 w-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 shrink-0">
                    <CheckCircle2 className="h-5 w-5" />
                  </div>
                  <div className="flex flex-col text-left min-w-0">
                    <span className="text-xs font-bold text-blue-fantastic truncate">
                      {attachedFile.name}
                    </span>
                    <span className="text-[11px] text-blue-fantastic/60">
                      {attachedFile.sizeFormatted} • {attachedFile.fileType.toUpperCase()}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    setAttachedFile(null)
                  }}
                  className="p-1 text-blue-fantastic/40 hover:text-truffle-trouble transition-colors rounded-lg hover:bg-truffle-trouble/10"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <div className="h-12 w-12 rounded-2xl bg-truffle-trouble/10 flex items-center justify-center text-truffle-trouble mb-2">
                  <Upload className="h-6 w-6" />
                </div>
                <span className="text-sm font-bold text-blue-fantastic">Click to select a file</span>
                <span className="text-xs text-blue-fantastic/50 mt-1 font-medium">
                  PDF, DOCX, TXT (Max 10MB)
                </span>
              </div>
            )}
          </div>

          {/* Document Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-blue-fantastic block">
              Document Name <span className="text-truffle-trouble">*</span>
            </label>
            <Input
              type="text"
              value={documentName}
              onChange={(e) => setDocumentName(e.target.value)}
              placeholder="e.g. Site Safety Manual"
              className="bg-palladian border-blue-fantastic/15 text-blue-fantastic rounded-xl text-xs h-10 focus:border-truffle-trouble focus:ring-truffle-trouble/20 font-sans"
              required
            />
          </div>

          {/* Category */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-blue-fantastic block">
              Category <span className="text-truffle-trouble">*</span>
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as DocumentCategory)}
              className="w-full h-10 px-3 text-xs font-bold bg-palladian border border-blue-fantastic/15 rounded-xl text-blue-fantastic focus:border-truffle-trouble focus:ring-1 focus:ring-truffle-trouble outline-none cursor-pointer font-sans"
            >
              {ALL_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Visible To role pill selector */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-blue-fantastic block">
              Visible To <span className="text-truffle-trouble">*</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {ALL_ROLES.map((role) => {
                const isSelected = selectedRoles.includes(role)
                return (
                  <button
                    key={role}
                    type="button"
                    onClick={() => handleRoleToggle(role)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-150 border ${
                      isSelected
                        ? "bg-blue-fantastic text-palladian border-blue-fantastic shadow-xs"
                        : "bg-palladian text-blue-fantastic/70 border-blue-fantastic/15 hover:bg-palladian/40 hover:text-blue-fantastic"
                    }`}
                  >
                    {role}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Footer Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-blue-fantastic/15">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="rounded-xl border-blue-fantastic/15 text-blue-fantastic font-bold text-xs h-10 px-5 hover:bg-palladian/30"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="rounded-xl bg-burning-flame text-blue-fantastic font-bold text-xs h-10 px-5 hover:bg-burning-flame/90 shadow-sm transition-all"
            >
              Upload Document
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
