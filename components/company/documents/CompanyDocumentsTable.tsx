"use client"

import React, { useState } from "react"
import {
  Search,
  Download,
  Eye,
  Pencil,
  Trash2,
  FileText,
  FileSpreadsheet,
  FileCheck,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { CompanyDocument, DocumentCategory, ALL_CATEGORIES } from "./CompanyUploadDocumentModal"

interface CompanyDocumentsTableProps {
  documents: CompanyDocument[]
  onDeleteDocument: (docId: string) => void
  onPreviewDocument: (doc: CompanyDocument) => void
  onEditDocument: (doc: CompanyDocument) => void
}

export function CompanyDocumentsTable({
  documents,
  onDeleteDocument,
  onPreviewDocument,
  onEditDocument,
}: CompanyDocumentsTableProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("All Categories")

  // Category Badge style generator
  const getCategoryBadgeStyle = (category: DocumentCategory) => {
    switch (category) {
      case "Safety":
        return "bg-truffle-trouble/15 text-truffle-trouble border-truffle-trouble/30 font-bold"
      case "Legal":
        return "bg-blue-fantastic/15 text-blue-fantastic border-blue-fantastic/30 font-bold"
      case "QA":
        return "bg-burning-flame/25 text-blue-fantastic border-burning-flame/40 font-bold"
      case "Policy":
        return "bg-oatmeal/40 text-blue-fantastic border-oatmeal/60 font-bold"
      case "Compliance":
        return "bg-emerald-500/15 text-emerald-700 border-emerald-500/30 font-bold"
      default:
        return "bg-blue-fantastic/10 text-blue-fantastic border-blue-fantastic/20 font-bold"
    }
  }

  // File type icon generator
  const getFileIcon = (fileType: CompanyDocument["fileType"]) => {
    switch (fileType) {
      case "pdf":
        return <FileText className="h-4 w-4 text-truffle-trouble" />
      case "xlsx":
        return <FileSpreadsheet className="h-4 w-4 text-emerald-600" />
      case "docx":
      case "txt":
        return <FileCheck className="h-4 w-4 text-blue-fantastic" />
      default:
        return <FileText className="h-4 w-4 text-blue-fantastic/70" />
    }
  }

  // Filtered documents calculation
  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch =
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.fileName.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory =
      selectedCategory === "All Categories" || doc.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleDownload = (doc: CompanyDocument) => {
    toast.success(`Downloading "${doc.fileName}"...`)
  }

  return (
    <div className="bg-white border border-blue-fantastic/15 rounded-3xl shadow-sm overflow-hidden font-cream">
      {/* Top Filter Bar inside Card */}
      <div className="p-4 bg-white border-b border-oatmeal/20 flex items-center justify-between gap-3">
        {/* Search Bar Input */}
        <div className="relative flex-1 max-w-xs sm:max-w-sm">
          <label htmlFor="search-documents" className="sr-only">
            Search documents
          </label>
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-blue-fantastic/40" />
          <input
            id="search-documents"
            aria-label="Search documents"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search documents..."
            className="w-full pl-9 pr-3 py-2 text-xs font-medium bg-palladian/40 border border-oatmeal/50 rounded-xl text-blue-fantastic placeholder:text-blue-fantastic/40 focus:border-truffle-trouble focus:ring-1 focus:ring-truffle-trouble outline-none transition-all"
          />
        </div>

        {/* Category Dropdown */}
        <div className="shrink-0">
          <label htmlFor="category-select" className="sr-only">
            Filter by category
          </label>
          <select
            id="category-select"
            aria-label="Filter by category"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 text-xs font-bold bg-palladian/40 border border-oatmeal/50 rounded-xl text-blue-fantastic focus:border-truffle-trouble focus:ring-1 focus:ring-truffle-trouble outline-none cursor-pointer"
          >
            <option value="All Categories">All Categories</option>
            {ALL_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-palladian/50 border-b border-oatmeal/20 text-[11px] font-bold text-blue-fantastic/70 uppercase tracking-wider">
              <th className="py-3 px-5">Document Name</th>
              <th className="py-3 px-4">Category</th>
              <th className="py-3 px-4">Visible To</th>
              <th className="py-3 px-4">Upload Date</th>
              <th className="py-3 px-5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-oatmeal/10 text-xs">
            {filteredDocuments.length > 0 ? (
              filteredDocuments.map((doc) => (
                <tr
                  key={doc.id}
                  className="hover:bg-palladian/20 transition-colors duration-150 group"
                >
                  {/* Document Name */}
                  <td className="py-4 px-5">
                    <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-palladian/80 border border-oatmeal/30 flex items-center justify-center shrink-0">
                        {getFileIcon(doc.fileType)}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-bold text-blue-fantastic group-hover:text-truffle-trouble transition-colors">
                          {doc.name}
                        </span>
                        <span className="text-[11px] text-blue-fantastic/50 font-medium">
                          {doc.fileName} ({doc.fileSize})
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Category Badge */}
                  <td className="py-4 px-4">
                    <Badge
                      variant="outline"
                      className={`text-[11px] rounded-lg px-2.5 py-0.5 ${getCategoryBadgeStyle(
                        doc.category
                      )}`}
                    >
                      {doc.category}
                    </Badge>
                  </td>

                  {/* Visible To Badges */}
                  <td className="py-4 px-4">
                    <div className="flex flex-wrap gap-1">
                      {doc.visibleTo.map((role) => (
                        <span
                          key={role}
                          className="px-2 py-0.5 text-[10px] font-bold bg-palladian/70 text-blue-fantastic/90 border border-oatmeal/40 rounded-md"
                        >
                          {role}
                        </span>
                      ))}
                    </div>
                  </td>

                  {/* Upload Date */}
                  <td className="py-4 px-4 font-medium text-blue-fantastic/70">
                    {doc.uploadDate}
                  </td>

                  {/* Actions */}
                  <td className="py-4 px-5 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => onPreviewDocument(doc)}
                        title="View details"
                        className="p-1.5 text-blue-fantastic/60 hover:text-blue-fantastic hover:bg-palladian/60 rounded-lg transition-colors"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDownload(doc)}
                        title="Download file"
                        className="p-1.5 text-blue-fantastic/60 hover:text-blue-fantastic hover:bg-palladian/60 rounded-lg transition-colors"
                      >
                        <Download className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => onEditDocument(doc)}
                        title="Edit document"
                        className="p-1.5 text-blue-fantastic/60 hover:text-truffle-trouble hover:bg-palladian/60 rounded-lg transition-colors"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => onDeleteDocument(doc.id)}
                        title="Delete document"
                        className="p-1.5 text-blue-fantastic/40 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="py-12 text-center text-blue-fantastic/50 font-medium">
                  <div className="flex flex-col items-center gap-2">
                    <FileText className="h-8 w-8 text-blue-fantastic/30" />
                    <p className="text-sm font-bold text-blue-fantastic/70">No documents found</p>
                    <p className="text-xs text-blue-fantastic/50">
                      Try adjusting your search query or category filter.
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
