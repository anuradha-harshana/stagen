"use client"

import React, { useState, useEffect } from "react"
import { X, FileText, Download, Calendar, UserCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { CompanyDocument, DocumentCategory, RoleType, ALL_ROLES, ALL_CATEGORIES } from "./CompanyUploadDocumentModal"

interface CompanyDocumentDetailsModalProps {
  document: CompanyDocument | null
  mode: "view" | "edit"
  onClose: () => void
  onSave: (updatedDoc: CompanyDocument) => void
}

export function CompanyDocumentDetailsModal({
  document,
  mode,
  onClose,
  onSave,
}: CompanyDocumentDetailsModalProps) {
  const [name, setName] = useState("")
  const [category, setCategory] = useState<DocumentCategory>("Safety")
  const [visibleTo, setVisibleTo] = useState<RoleType[]>(["All Roles"])

  useEffect(() => {
    if (document) {
      setName(document.name)
      setCategory(document.category)
      setVisibleTo(document.visibleTo)
    }
  }, [document])

  if (!document) return null

  const handleRoleToggle = (role: RoleType) => {
    if (role === "All Roles") {
      setVisibleTo(visibleTo.includes("All Roles") ? [] : ["All Roles"])
      return
    }

    let updated = visibleTo.filter((r) => r !== "All Roles")
    if (updated.includes(role)) {
      updated = updated.filter((r) => r !== role)
    } else {
      updated.push(role)
    }

    if (updated.length === ALL_ROLES.length - 1) {
      setVisibleTo(["All Roles"])
    } else {
      setVisibleTo(updated)
    }
  }

  const handleSaveSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) {
      toast.error("Document name cannot be empty")
      return
    }

    const updated: CompanyDocument = {
      ...document,
      name: name.trim(),
      category,
      visibleTo: visibleTo.length === 0 ? ["All Roles"] : visibleTo,
    }

    onSave(updated)
    toast.success(`Updated "${updated.name}" successfully!`)
    onClose()
  }

  const handleDownload = () => {
    toast.success(`Downloading ${document.fileName}...`)
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200 font-cream">
      <div className="bg-white rounded-3xl shadow-2xl border border-oatmeal/30 w-full max-w-lg overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-oatmeal/20">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-truffle-trouble/10 border border-truffle-trouble/20 flex items-center justify-center text-truffle-trouble">
              <FileText className="h-4.5 w-4.5" />
            </div>
            <h2 className="text-base font-bold text-blue-fantastic font-cream">
              {mode === "edit" ? "Edit Document Settings" : "Document Details"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="h-8 w-8 rounded-full flex items-center justify-center text-blue-fantastic/60 hover:text-blue-fantastic hover:bg-palladian transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Content */}
        {mode === "edit" ? (
          <form onSubmit={handleSaveSubmit} className="p-6 space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-blue-fantastic block">Document Name</label>
              <Input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-white border-oatmeal/50 text-blue-fantastic rounded-xl text-xs h-10 font-cream"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-blue-fantastic block">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as DocumentCategory)}
                className="w-full h-10 px-3 text-xs font-bold bg-white border border-oatmeal/50 rounded-xl text-blue-fantastic focus:border-truffle-trouble outline-none cursor-pointer font-cream"
              >
                {ALL_CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-blue-fantastic block">Visible To</label>
              <div className="flex flex-wrap gap-2">
                {ALL_ROLES.map((role) => {
                  const isSelected = visibleTo.includes(role)
                  return (
                    <button
                      key={role}
                      type="button"
                      onClick={() => handleRoleToggle(role)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all border ${
                        isSelected
                          ? "bg-blue-fantastic text-palladian border-blue-fantastic shadow-xs"
                          : "bg-white text-blue-fantastic/70 border-oatmeal/50 hover:bg-palladian/40"
                      }`}
                    >
                      {role}
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-oatmeal/20">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="rounded-xl border-oatmeal/50 text-blue-fantastic font-bold text-xs h-10 px-4"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="rounded-xl bg-burning-flame text-blue-fantastic font-bold text-xs h-10 px-5 hover:bg-burning-flame/90"
              >
                Save Changes
              </Button>
            </div>
          </form>
        ) : (
          <div className="p-6 space-y-5">
            <div className="bg-palladian/40 border border-oatmeal/30 rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="bg-truffle-trouble/15 text-truffle-trouble border-truffle-trouble/30 font-bold">
                  {document.category}
                </Badge>
              </div>
              <div>
                <h3 className="text-base font-bold text-blue-fantastic">{document.name}</h3>
                <p className="text-xs text-blue-fantastic/60 font-medium mt-0.5">
                  File: {document.fileName} ({document.fileSize})
                </p>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center gap-3 text-blue-fantastic/80 font-medium">
                <Calendar className="h-4 w-4 text-blue-fantastic/50 shrink-0" />
                <span>Uploaded on: <strong>{document.uploadDate}</strong></span>
              </div>

              <div className="flex items-start gap-3 text-blue-fantastic/80 font-medium">
                <UserCheck className="h-4 w-4 text-blue-fantastic/50 shrink-0 mt-0.5" />
                <div>
                  <span>Visible to Roles:</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {document.visibleTo.map((role) => (
                      <span
                        key={role}
                        className="px-2 py-0.5 text-[10px] font-bold bg-palladian text-blue-fantastic border border-oatmeal/50 rounded-md"
                      >
                        {role}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-oatmeal/20">
              <Button
                variant="outline"
                onClick={handleDownload}
                className="rounded-xl border-oatmeal/50 text-blue-fantastic font-bold text-xs h-10 px-4 gap-2"
              >
                <Download className="h-4 w-4 text-blue-fantastic/70" />
                Download File
              </Button>
              <Button
                onClick={onClose}
                className="rounded-xl bg-blue-fantastic text-palladian font-bold text-xs h-10 px-5 hover:bg-blue-fantastic/90"
              >
                Close
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
