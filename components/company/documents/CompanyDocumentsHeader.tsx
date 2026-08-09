"use client"

import React from "react"
import { FileStack, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"

interface CompanyDocumentsHeaderProps {
  onOpenUploadModal: () => void
}

export function CompanyDocumentsHeader({
  onOpenUploadModal,
}: CompanyDocumentsHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-blue-fantastic/15 font-cream">
      <div className="flex items-center gap-3">
        <div className="h-11 w-11 rounded-2xl bg-blue-fantastic flex items-center justify-center shadow-sm shrink-0">
          <FileStack className="h-5 w-5 text-burning-flame" />
        </div>
        <div>
          <h1 className="text-blue-fantastic text-2xl font-bold leading-tight font-cream">
            Documents & Policies
          </h1>
          <p className="text-blue-fantastic/60 text-xs sm:text-sm font-medium font-cream mt-0.5">
            Manage global company documents and safety policies.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
        <Button
          onClick={onOpenUploadModal}
          className="h-10 px-4 bg-burning-flame text-blue-fantastic font-bold text-xs rounded-xl hover:bg-burning-flame/90 shadow-sm gap-2 transition-all shrink-0"
        >
          <Plus className="h-4 w-4 stroke-[3]" />
          <span>Upload Document</span>
        </Button>
      </div>
    </div>
  )
}
