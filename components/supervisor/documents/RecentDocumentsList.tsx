"use client"

import React from "react"
import { FileText, FileSpreadsheet, Download, Eye, ChevronRight, Shield } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { DocumentUploadPayload } from "./DocumentUploadForm"

interface RecentDocumentsListProps {
  selectedProject: { code: string; name: string }
  documents: DocumentUploadPayload[]
  onUpdateVisibility?: (
    docId: string,
    newVisibility: DocumentUploadPayload["visibility"]
  ) => void
  onViewAll?: () => void
}

export function RecentDocumentsList({
  selectedProject,
  documents,
  onUpdateVisibility,
  onViewAll,
}: RecentDocumentsListProps) {
  const getFileStyle = (fileType: DocumentUploadPayload["fileType"]) => {
    switch (fileType) {
      case "pdf":
        return {
          icon: <FileText className="h-4.5 w-4.5 text-truffle-trouble" />,
          label: "PDF",
          badge: "bg-truffle-trouble/10 text-truffle-trouble border-truffle-trouble/30 font-bold",
          iconBg: "bg-truffle-trouble/15 border-truffle-trouble/20",
        }
      case "xlsx":
        return {
          icon: <FileSpreadsheet className="h-4.5 w-4.5 text-truffle-trouble" />,
          label: "XLSX",
          badge: "bg-burning-flame/15 text-truffle-trouble border-burning-flame/30 font-bold",
          iconBg: "bg-burning-flame/20 border-burning-flame/20",
        }
      case "docx":
        return {
          icon: <FileText className="h-4.5 w-4.5 text-blue-fantastic" />,
          label: "DOCX",
          badge: "bg-blue-fantastic/10 text-blue-fantastic border-blue-fantastic/30 font-bold",
          iconBg: "bg-blue-fantastic/15 border-blue-fantastic/20",
        }
      default:
        return {
          icon: <FileText className="h-4.5 w-4.5 text-blue-fantastic/80" />,
          label: "DOC",
          badge: "bg-blue-fantastic/5 text-blue-fantastic/80 border-blue-fantastic/20 font-bold",
          iconBg: "bg-blue-fantastic/10 border-blue-fantastic/10",
        }
    }
  }

  return (
    <Card className="bg-palladian border border-blue-fantastic/15 shadow-sm font-sans">
      <CardHeader className="border-b border-blue-fantastic/10 pb-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-xl bg-truffle-trouble/10 flex items-center justify-center">
              <FileText className="h-4 w-4 text-truffle-trouble" />
            </div>
            <CardTitle className="text-blue-fantastic text-sm font-bold font-sans">
              Recent Site Documents
            </CardTitle>
          </div>
          <Badge
            variant="outline"
            className="ml-auto text-xs text-blue-fantastic/70 border-blue-fantastic/20 bg-blue-fantastic/5 font-semibold"
          >
            {documents.length} files
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="pt-3 font-sans">
        <div className="space-y-2">
          {documents.map((doc) => {
            const style = getFileStyle(doc.fileType)
            return (
              <div
                key={doc.id}
                className="group flex flex-col gap-2 p-3 rounded-2xl border border-transparent hover:bg-blue-fantastic/5 hover:border-blue-fantastic/15 transition-all duration-200"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`h-9 w-9 rounded-2xl flex items-center justify-center shrink-0 border ${style.iconBg}`}
                    >
                      {style.icon}
                    </div>
                    <div className="flex flex-col min-w-0 pr-1">
                      <span className="text-sm font-bold text-blue-fantastic truncate group-hover:text-truffle-trouble transition-colors">
                        {doc.title}
                      </span>
                      <span className="text-xs text-blue-fantastic/60 font-semibold truncate">
                        {doc.dateOfUpdate} · {doc.documentType}
                      </span>
                    </div>
                  </div>

                  <Badge variant="outline" className={`text-xs border ${style.badge} shrink-0`}>
                    {style.label}
                  </Badge>
                </div>

                {doc.description && (
                  <p className="text-xs text-blue-fantastic/70 line-clamp-2 bg-blue-fantastic/5 p-2 rounded-xl border border-blue-fantastic/10 font-medium">
                    {doc.description}
                  </p>
                )}

                <div className="flex items-center justify-between pt-1 border-t border-blue-fantastic/10">
                  {/* Interactive Visibility Selector */}
                  <div className="flex items-center gap-1.5">
                    <Shield className="h-3 w-3 text-truffle-trouble shrink-0" />
                    <select
                      value={doc.visibility}
                      onChange={(e) => {
                        const newVis = e.target.value as DocumentUploadPayload["visibility"]
                        if (onUpdateVisibility) {
                          onUpdateVisibility(doc.id, newVis)
                          toast.success(`Access updated to "${newVis}" for ${doc.title}`)
                        }
                      }}
                      className="text-[10px] font-bold text-blue-fantastic bg-palladian border border-blue-fantastic/25 rounded-lg px-2 py-0.5 focus:border-truffle-trouble focus:ring-1 focus:ring-truffle-trouble outline-none cursor-pointer hover:border-blue-fantastic/40 transition-colors font-sans"
                      title="Change Access & Visibility Level"
                    >
                      <option value="Visible to Customer">Visible to Customer</option>
                      <option value="Internal Team Only">Internal Team Only</option>
                    </select>
                    <span className="text-[11px] text-blue-fantastic/60 font-bold ml-1">
                      {doc.fileSize}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 opacity-90 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="icon-xs"
                      onClick={() => toast.info(`Viewing preview of ${doc.fileName}...`)}
                      className="text-blue-fantastic/60 hover:text-blue-fantastic hover:bg-blue-fantastic/10"
                      title="View Document"
                    >
                      <Eye className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-xs"
                      onClick={() => toast.success(`Simulating download of ${doc.fileName}...`)}
                      className="text-blue-fantastic/60 hover:text-truffle-trouble hover:bg-truffle-trouble/10"
                      title="Download Document"
                    >
                      <Download className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              </div>
            )
          })}

          {documents.length === 0 && (
            <div className="py-10 text-center border border-dashed border-blue-fantastic/20 rounded-2xl flex flex-col items-center justify-center gap-2">
              <FileText className="h-8 w-8 text-blue-fantastic/30" />
              <p className="text-sm font-bold text-blue-fantastic">
                No documents uploaded for {selectedProject.code} yet.
              </p>
              <p className="text-xs text-blue-fantastic/60 font-semibold">
                Use the form to record your first update for {selectedProject.name}.
              </p>
            </div>
          )}
        </div>

        <div className="flex justify-end pt-3 border-t border-blue-fantastic/10 mt-3">
          <button
            onClick={onViewAll}
            className="text-xs font-bold text-truffle-trouble hover:text-blue-fantastic flex items-center gap-0.5 transition-colors font-sans"
          >
            View All <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </CardContent>
    </Card>
  )
}
