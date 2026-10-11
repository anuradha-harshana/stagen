"use client"

import { useSupervisorData, supervisorRequest, DataState } from "@/components/supervisor/useSupervisorData";
import React, { useState } from "react"
import { toast } from "sonner"
import {
  SupervisorDocumentsHeader,
} from "./SupervisorDocumentsHeader"
import { SupervisorDocumentsSummaryCards } from "./SupervisorDocumentsSummaryCards"
import { DocumentUploadForm, DocumentUploadPayload } from "./DocumentUploadForm"
import { RecentDocumentsList } from "./RecentDocumentsList"

export function SupervisorDocumentsOverview() {
  const [selectedId, setSelectedId] = useState("");
  const projectApi = useSupervisorData<{ id: string; lot: string }[]>("projects", []);
  const projectOptions = projectApi.data.map(p => ({ code: p.id, name: p.lot }));
  const selectedProject = projectOptions.find(p => p.code === selectedId) ?? projectOptions[0];
  const api = useSupervisorData<DocumentUploadPayload[]>("documents", []);
  const recentDocuments = api.data;
  const handleDocumentUploaded = async (doc: DocumentUploadPayload, file: File) => {
    const form = new FormData();
    Object.entries(doc).forEach(([key, value]) => form.set(key, String(value)));
    form.set("file", file);
    return api.mutate("POST", form);
  };
  const handleUpdateVisibility = async (id: string, visibility: DocumentUploadPayload["visibility"]) => api.mutate("PUT", { id, visibility });
  if (api.loading || projectApi.loading || api.error || projectApi.error || !selectedProject) return <DataState loading={api.loading || projectApi.loading} error={api.error || projectApi.error} empty />;

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
        projects={projectOptions}
        onSelectProject={p => setSelectedId(p.code)}
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
            onDelete={id => api.mutate("DELETE", { id })}
          />
        </div>
      </div>
    </div>
  )
}
