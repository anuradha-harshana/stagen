"use client"

import React, { useState, useRef } from "react"
import { Upload, FileText, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"

export interface DocumentUploadPayload {
  id: string
  projectCode: string
  title: string
  documentType: string
  dateOfUpdate: string
  visibility: "Visible to Customer" | "Internal Team Only" | "Management Only"
  description: string
  fileName: string
  fileSize: string
  fileType: "pdf" | "docx" | "xlsx" | "dwg" | "other"
}

interface DocumentUploadFormProps {
  selectedProject: { code: string; name: string }
  onDocumentUploaded: (doc: DocumentUploadPayload) => void
}

const DOCUMENT_TYPES = [
  "Inspection Certificate",
  "Architectural Plan",
  "Permit & License",
  "SWMS & Safety Compliance",
  "Engineering Report",
  "Contract & Variation",
  "Daily Progress Report",
]

export function DocumentUploadForm({ selectedProject, onDocumentUploaded }: DocumentUploadFormProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [title, setTitle] = useState("")
  const [documentType, setDocumentType] = useState(DOCUMENT_TYPES[0])
  const [dateOfUpdate, setDateOfUpdate] = useState("2026-07-22")
  const [visibility, setVisibility] = useState<DocumentUploadPayload["visibility"]>("Visible to Customer")
  const [description, setDescription] = useState("")

  const [attachedFile, setAttachedFile] = useState<{
    file: File
    name: string
    sizeFormatted: string
    typeExt: DocumentUploadPayload["fileType"]
  } | null>(null)

  const [isDragging, setIsDragging] = useState(false)

  const processFile = (file: File) => {
    if (file.type.startsWith("image/")) {
      toast.error("Images/Photos are not allowed in Document Upload. Please select a valid document (PDF, Word, Excel, CAD).")
      return
    }

    const fileExt = file.name.substring(file.name.lastIndexOf(".")).toLowerCase()
    const allowedDocExts = [".pdf", ".docx", ".doc", ".xlsx", ".xls", ".dwg", ".txt", ".pptx"]

    if (!allowedDocExts.includes(fileExt) && file.type !== "application/pdf") {
      toast.error("Unsupported file type. Please upload a valid document (.pdf, .docx, .xlsx, .dwg).")
      return
    }

    if (file.size > 25 * 1024 * 1024) {
      toast.error("File size is too large. Max allowed document size is 25MB.")
      return
    }

    const sizeKB = Math.round(file.size / 1024)
    const sizeFormatted = sizeKB > 1024 ? `${(sizeKB / 1024).toFixed(1)} MB` : `${sizeKB} KB`

    let typeExt: DocumentUploadPayload["fileType"] = "other"
    if (fileExt.includes("pdf")) typeExt = "pdf"
    else if (fileExt.includes("doc")) typeExt = "docx"
    else if (fileExt.includes("xls")) typeExt = "xlsx"
    else if (fileExt.includes("dwg")) typeExt = "dwg"

    setAttachedFile({
      file,
      name: file.name,
      sizeFormatted,
      typeExt,
    })

    toast.success(`Attached ${file.name} successfully.`)
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
    if (!title.trim()) {
      toast.error("Please enter a document title.")
      return
    }
    if (!attachedFile) {
      toast.error("Please attach a document file before submitting.")
      return
    }

    const payload: DocumentUploadPayload = {
      id: crypto.randomUUID(),
      projectCode: selectedProject.code,
      title: title.trim(),
      documentType,
      dateOfUpdate,
      visibility,
      description: description.trim(),
      fileName: attachedFile.name,
      fileSize: attachedFile.sizeFormatted,
      fileType: attachedFile.typeExt,
    }

    onDocumentUploaded(payload)
    toast.success(`Document uploaded for ${selectedProject.code} ${selectedProject.name}!`)

    // Reset form
    setTitle("")
    setDescription("")
    setAttachedFile(null)
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  return (
    <Card className="bg-palladian border border-blue-fantastic/15 shadow-sm font-cream">
      <CardHeader className="border-b border-blue-fantastic/10 pb-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-xl bg-burning-flame/15 flex items-center justify-center">
              <Upload className="h-4 w-4 text-truffle-trouble" />
            </div>
            <CardTitle className="text-blue-fantastic text-sm font-bold font-cream">
              Add Document Details
            </CardTitle>
          </div>
          <span className="text-xs font-bold text-truffle-trouble bg-burning-flame/15 px-2.5 py-0.5 rounded-full border border-burning-flame/20 font-cream">
            {selectedProject.code} {selectedProject.name}
          </span>
        </div>
      </CardHeader>

      <CardContent className="pt-5 font-cream">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Document Title */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-blue-fantastic/70 uppercase tracking-wider font-cream">
              Document / Update Title <span className="text-burning-flame">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Wall Framing Stage 2 Approval Certificate"
              className="w-full px-3.5 py-2.5 text-sm bg-palladian border border-blue-fantastic/20 rounded-xl text-blue-fantastic placeholder:text-blue-fantastic/40 focus:border-truffle-trouble focus:ring-1 focus:ring-truffle-trouble outline-none transition-all font-medium font-cream"
            />
          </div>

          {/* Document Type */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-blue-fantastic/70 uppercase tracking-wider font-cream">
              Document Type <span className="text-burning-flame">*</span>
            </label>
            <select
              value={documentType}
              onChange={(e) => setDocumentType(e.target.value)}
              className="w-full px-3.5 py-2.5 text-sm bg-palladian border border-blue-fantastic/20 rounded-xl text-blue-fantastic focus:border-truffle-trouble focus:ring-1 focus:ring-truffle-trouble outline-none transition-all font-medium font-cream cursor-pointer"
            >
              {DOCUMENT_TYPES.map((dt) => (
                <option key={dt} value={dt}>
                  {dt}
                </option>
              ))}
            </select>
          </div>

          {/* Row 2: Date of Update & Visibility */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-blue-fantastic/70 uppercase tracking-wider font-cream">
                Date of Update <span className="text-burning-flame">*</span>
              </label>
              <input
                type="date"
                required
                value={dateOfUpdate}
                onChange={(e) => setDateOfUpdate(e.target.value)}
                className="w-full px-3.5 py-2.5 text-sm bg-palladian border border-blue-fantastic/20 rounded-xl text-blue-fantastic focus:border-truffle-trouble focus:ring-1 focus:ring-truffle-trouble outline-none transition-all font-medium font-cream"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-bold text-blue-fantastic/70 uppercase tracking-wider font-cream">
                Access &amp; Visibility Level
              </label>
              <select
                value={visibility}
                onChange={(e) =>
                  setVisibility(e.target.value as DocumentUploadPayload["visibility"])
                }
                className="w-full px-3.5 py-2.5 text-sm bg-palladian border border-blue-fantastic/20 rounded-xl text-blue-fantastic focus:border-truffle-trouble focus:ring-1 focus:ring-truffle-trouble outline-none transition-all font-medium font-cream cursor-pointer"
              >
                <option value="Visible to Customer">Visible to Customer</option>
                <option value="Internal Team Only">Internal Team Only</option>
              </select>
            </div>
          </div>

          {/* Update Description */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-blue-fantastic/70 uppercase tracking-wider font-cream">
              Document Description / Notes
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add any relevant notes, stage sign-off comments, or document summaries..."
              className="w-full px-3.5 py-2.5 text-sm bg-palladian border border-blue-fantastic/20 rounded-xl text-blue-fantastic placeholder:text-blue-fantastic/40 focus:border-truffle-trouble focus:ring-1 focus:ring-truffle-trouble outline-none transition-all font-medium resize-none font-cream"
            />
          </div>

          {/* Upload Documents Box */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-blue-fantastic/70 uppercase tracking-wider font-cream">
              Upload Document File <span className="text-burning-flame">*</span>
            </label>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              accept=".pdf,.docx,.doc,.xlsx,.xls,.dwg,.txt,.pptx"
              className="hidden"
            />

            {!attachedFile ? (
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all ${isDragging
                    ? "border-burning-flame bg-burning-flame/15 scale-[0.99]"
                    : "border-blue-fantastic/25 bg-blue-fantastic/5 hover:bg-blue-fantastic/10 hover:border-blue-fantastic/40"
                  }`}
              >
                <div className="p-3 rounded-2xl bg-blue-fantastic/10 border border-blue-fantastic/15 text-truffle-trouble shadow-sm mb-2">
                  <Upload className="h-5 w-5" />
                </div>
                <p className="text-sm font-bold text-blue-fantastic font-cream">
                  Drag &amp; drop your document here, or{" "}
                  <span className="text-truffle-trouble underline">browse</span>
                </p>
                <p className="text-xs text-blue-fantastic/60 mt-1 font-semibold font-cream">
                  Supported formats: PDF, Word (DOCX), Excel (XLSX), CAD (DWG) up to 25MB.
                </p>
              </div>
            ) : (
              <div className="border border-truffle-trouble/30 bg-truffle-trouble/10 rounded-xl p-3 flex items-center justify-between">
                <div className="flex items-center gap-3 min-w-0 pr-2">
                  <div className="p-2 rounded-xl bg-palladian text-truffle-trouble shrink-0 shadow-sm border border-blue-fantastic/15">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="text-xs font-bold text-blue-fantastic truncate font-cream">
                      {attachedFile.name}
                    </span>
                    <span className="text-[11px] text-blue-fantastic/60 font-semibold font-cream">
                      {attachedFile.sizeFormatted} • {attachedFile.typeExt.toUpperCase()}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setAttachedFile(null)}
                  className="p-1.5 rounded-xl hover:bg-red-500/15 text-red-600 transition-colors"
                  title="Remove attached document"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>

          {/* Submit Action */}
          <div className="flex items-center justify-end pt-2">
            <Button
              type="submit"
              className="bg-truffle-trouble text-palladian hover:bg-truffle-trouble/90 rounded-xl px-6 py-2 text-sm font-bold shadow-sm font-cream"
            >
              Upload &amp; Update Progress
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
