"use client";

import React, { useState } from "react";
import { 
  Camera, 
  Building2, 
  Search, 
  Filter, 
  Plus, 
  ChevronDown, 
  ChevronUp, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  FileImage,
  FolderOpen,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Layers
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useUser } from "@/components/Providers/UserProvider";
import { Project } from "@/lib/db-mock/projectsData";
import { 
  SitePhoto, 
  INITIAL_SITE_PHOTOS, 
  STAGE_NAMES, 
  StageName, 
  getAssignedProjects 
} from "./site-photos-store";
import { PhotoUploadZone } from "@/components/supervisor/photos/PhotoUploadZone";
import { PhotoGalleryGrid } from "@/components/supervisor/photos/PhotoGalleryGrid";
import { PhotoDetailModal } from "@/components/supervisor/photos/PhotoDetailModal";

export default function SupervisorSitePhotosPage() {
  const user = useUser();

  // Load assigned projects for current supervisor
  const assignedProjects = getAssignedProjects(user?.id);

  // State management
  const [selectedProjectId, setSelectedProjectId] = useState<string>(assignedProjects[0]?.id || "lot-104");
  const [photos, setPhotos] = useState<SitePhoto[]>(INITIAL_SITE_PHOTOS);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStageFilter, setSelectedStageFilter] = useState<string>("All");
  
  // Track open state for upload zones per stage
  const [activeUploadStage, setActiveUploadStage] = useState<string | null>(null);

  // Track expanded stages (default to active and completed stages open)
  const [expandedStages, setExpandedStages] = useState<Record<string, boolean>>({
    "Site Cut": true,
    "Slab": true,
    "Frame": true,
    "Lockup": true,
    "Fixing": true,
    "Completion": false,
    "Handover": false,
  });

  // Selected photo for detail modal
  const [selectedPhoto, setSelectedPhoto] = useState<SitePhoto | null>(null);

  // Active selected project index & object
  const activeProjectIndex = assignedProjects.findIndex((p) => p.id === selectedProjectId);
  const activeProject = assignedProjects[activeProjectIndex] || assignedProjects[0];

  // Quick next / previous project navigation
  const handlePrevProject = () => {
    if (activeProjectIndex > 0) {
      setSelectedProjectId(assignedProjects[activeProjectIndex - 1].id);
    }
  };

  const handleNextProject = () => {
    if (activeProjectIndex < assignedProjects.length - 1) {
      setSelectedProjectId(assignedProjects[activeProjectIndex + 1].id);
    }
  };

  // Toggle stage expansion
  const toggleStageExpand = (stageName: string) => {
    setExpandedStages((prev) => ({
      ...prev,
      [stageName]: !prev[stageName],
    }));
  };

  // Filter photos for active project and active filters
  const projectPhotos = photos.filter((p) => p.projectId === selectedProjectId);

  const getPhotosForStage = (stageName: string) => {
    return projectPhotos.filter((p) => {
      const matchesStage = p.stageName === stageName;
      const matchesSearch =
        !searchTerm ||
        (p.caption && p.caption.toLowerCase().includes(searchTerm.toLowerCase())) ||
        p.fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.uploaderName.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesStage && matchesSearch;
    });
  };

  // Handlers for Photo CRUD
  const handleUploadSuccess = (newPhotos: SitePhoto[]) => {
    setPhotos((prev) => [...newPhotos, ...prev]);
    setActiveUploadStage(null);
  };

  const handleUpdateCaption = (photoId: string, newCaption: string) => {
    setPhotos((prev) =>
      prev.map((p) => (p.id === photoId ? { ...p, caption: newCaption } : p))
    );
    if (selectedPhoto && selectedPhoto.id === photoId) {
      setSelectedPhoto((prev) => (prev ? { ...prev, caption: newCaption } : null));
    }
  };

  const handleReplacePhoto = (photoId: string, newFile: File) => {
    const objectUrl = URL.createObjectURL(newFile);
    const updatedTimestamp = new Date().toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });

    setPhotos((prev) =>
      prev.map((p) =>
        p.id === photoId
          ? {
              ...p,
              url: objectUrl,
              fileName: newFile.name,
              fileSize: newFile.size,
              timestamp: updatedTimestamp,
            }
          : p
      )
    );

    if (selectedPhoto && selectedPhoto.id === photoId) {
      setSelectedPhoto((prev) =>
        prev
          ? {
              ...prev,
              url: objectUrl,
              fileName: newFile.name,
              fileSize: newFile.size,
              timestamp: updatedTimestamp,
            }
          : null
      );
    }
  };

  const handleDeletePhoto = (photoId: string) => {
    setPhotos((prev) => prev.filter((p) => p.id !== photoId));
    if (selectedPhoto && selectedPhoto.id === photoId) {
      setSelectedPhoto(null);
    }
  };

  // Calculate statistics
  const totalPhotosCount = projectPhotos.length;
  const stagesWithPhotosCount = STAGE_NAMES.filter(
    (stage) => getPhotosForStage(stage).length > 0
  ).length;

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto font-sans">
      {/* 1. Header & Quick Overview */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-1 border-b border-blue-fantastic/10 pb-5">
        <div className="flex items-center gap-3.5">
          <div className="h-12 w-12 rounded-2xl bg-blue-fantastic flex items-center justify-center shadow-sm shrink-0">
            <Camera className="h-6 w-6 text-burning-flame" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-blue-fantastic text-2xl font-sans font-bold leading-tight">
                Site Progress Photos
              </h1>
            </div>
            <p className="text-blue-fantastic/60 text-xs sm:text-sm mt-0.5 font-sans">
              Capture and organize stage photos for assigned construction lots
            </p>
          </div>
        </div>

        {/* Stats summary pill */}
        <div className="flex items-center gap-3 bg-palladian border border-blue-fantastic/15 p-2 px-4 rounded-2xl shadow-xs self-start md:self-auto">
          <div className="text-center pr-3 border-r border-blue-fantastic/15">
            <p className="text-[10px] text-blue-fantastic/60 font-sans uppercase tracking-wider font-semibold">Assigned Lots</p>
            <p className="text-base font-bold text-blue-fantastic">{assignedProjects.length}</p>
          </div>
          <div className="text-center pr-3 border-r border-blue-fantastic/15">
            <p className="text-[10px] text-blue-fantastic/60 font-sans uppercase tracking-wider font-semibold">Lot Photos</p>
            <p className="text-base font-bold text-truffle-trouble">{totalPhotosCount}</p>
          </div>
          <div className="text-center">
            <p className="text-[10px] text-blue-fantastic/60 font-sans uppercase tracking-wider font-semibold">Documented</p>
            <p className="text-base font-bold text-blue-fantastic">{stagesWithPhotosCount} / 7 Stages</p>
          </div>
        </div>
      </div>

      {/* 2. Enhanced Controls Bar: Responsive Project Selector (Tabs + Dropdown for 4+ Projects) */}
      <div className="flex flex-col gap-3 bg-palladian/40 p-3.5 rounded-2xl border border-blue-fantastic/15">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          {/* Left: Project Selector Controls */}
          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap flex-1">
            {/* Quick Step Buttons */}
            <div className="flex items-center gap-1">
              <Button
                type="button"
                onClick={handlePrevProject}
                disabled={activeProjectIndex <= 0}
                variant="outline"
                size="sm"
                className="h-9 w-9 p-0 rounded-xl border-blue-fantastic/20 hover:bg-blue-fantastic/10 text-blue-fantastic disabled:opacity-30"
                title="Previous Project"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                onClick={handleNextProject}
                disabled={activeProjectIndex >= assignedProjects.length - 1}
                variant="outline"
                size="sm"
                className="h-9 w-9 p-0 rounded-xl border-blue-fantastic/20 hover:bg-blue-fantastic/10 text-blue-fantastic disabled:opacity-30"
                title="Next Project"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            {/* Project Selection Dropdown */}
            <div className="w-full sm:w-72">
              <Select value={selectedProjectId} onValueChange={setSelectedProjectId}>
                <SelectTrigger className="w-full bg-palladian border-blue-fantastic/20 text-blue-fantastic font-sans font-bold text-xs h-9 rounded-xl focus:ring-truffle-trouble">
                  <div className="flex items-center gap-2 truncate">
                    <Building2 className="h-3.5 w-3.5 text-truffle-trouble shrink-0" />
                    <SelectValue placeholder="Select Project Lot..." />
                  </div>
                </SelectTrigger>
                <SelectContent className="bg-palladian border-blue-fantastic/20 font-sans">
                  {assignedProjects.map((proj) => {
                    const count = photos.filter((p) => p.projectId === proj.id).length;
                    return (
                      <SelectItem
                        key={proj.id}
                        value={proj.id}
                        className="text-xs cursor-pointer focus:bg-blue-fantastic/10 focus:text-blue-fantastic"
                      >
                        <div className="flex items-center justify-between w-full gap-3">
                          <span className="font-bold font-sans">{proj.id.toUpperCase()}</span>
                          <span className="text-blue-fantastic/60 text-[11px] truncate max-w-[140px]">{proj.clientName}</span>
                          <Badge className="bg-blue-fantastic/10 text-blue-fantastic text-[10px] px-1.5 h-4">
                            {count} photos
                          </Badge>
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Right: Search and Stage Filter Inputs */}
          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap shrink-0">
            <div className="relative flex-1 sm:w-56">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-blue-fantastic/40 pointer-events-none" />
              <Input
                placeholder="Search captions or file names..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 bg-palladian border-blue-fantastic/15 text-blue-fantastic placeholder:text-blue-fantastic/40 h-9 text-xs font-sans focus-visible:ring-truffle-trouble rounded-xl"
              />
            </div>

            <div className="flex gap-1 bg-blue-fantastic/8 p-0.5 rounded-xl border border-blue-fantastic/10">
              {["All", "Site Cut", "Slab", "Frame", "Lockup", "Fixing"].map((stageFilter) => (
                <button
                  key={stageFilter}
                  onClick={() => setSelectedStageFilter(stageFilter)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold font-sans transition-all ${
                    selectedStageFilter === stageFilter
                      ? "bg-blue-fantastic text-palladian shadow-xs"
                      : "text-blue-fantastic/70 hover:text-blue-fantastic hover:bg-blue-fantastic/5"
                  }`}
                >
                  {stageFilter}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 3. Active Project Info Card */}
      <Card className="bg-palladian border border-blue-fantastic/15 shadow-xs font-sans overflow-hidden">
        <CardContent className="p-4 sm:p-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg font-bold text-blue-fantastic">
                  {activeProject.clientName}
                </h2>
                <Badge className="bg-blue-fantastic/10 text-blue-fantastic border-blue-fantastic/20 text-xs font-semibold">
                  {activeProject.id.toUpperCase()}
                </Badge>
                <Badge
                  className={`text-xs font-bold ${
                    activeProject.status === "On Track"
                      ? "bg-emerald-500/15 text-emerald-800 border border-emerald-500/30"
                      : "bg-amber-500/15 text-amber-900 border border-amber-500/30"
                  }`}
                >
                  {activeProject.status}
                </Badge>
              </div>
              <p className="text-xs text-blue-fantastic/60 font-sans mt-1">
                {activeProject.address}
              </p>
            </div>

            <div className="flex items-center gap-4 text-xs font-sans text-blue-fantastic/70 border-t sm:border-t-0 pt-2 sm:pt-0 border-blue-fantastic/10">
              <div>
                <span className="text-blue-fantastic/50 block text-[10px] uppercase font-semibold">Current Stage</span>
                <span className="font-bold text-truffle-trouble">{activeProject.currentStage}</span>
              </div>
              <div>
                <span className="text-blue-fantastic/50 block text-[10px] uppercase font-semibold">Est. Handover</span>
                <span className="font-semibold text-blue-fantastic">{activeProject.estHandover}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 4. Construction Stages Sections */}
      <div className="space-y-5">
        {STAGE_NAMES.filter(
          (stage) => selectedStageFilter === "All" || selectedStageFilter === stage
        ).map((stageName) => {
          const stagePhotos = getPhotosForStage(stageName);
          const isExpanded = expandedStages[stageName] !== false;
          const isUploadOpen = activeUploadStage === stageName;

          // Find stage status from active project data
          const stageInfo = activeProject.stages.find((s) => s.name === stageName);
          const stageStatus = stageInfo?.status || "Pending";

          return (
            <Card
              key={stageName}
              className="bg-palladian/40 border border-blue-fantastic/15 shadow-xs font-sans overflow-hidden transition-all"
            >
              {/* Stage Header Bar */}
              <CardHeader className="p-4 sm:px-6 bg-palladian border-b border-blue-fantastic/10 flex flex-row items-center justify-between space-y-0 cursor-pointer select-none">
                <div
                  onClick={() => toggleStageExpand(stageName)}
                  className="flex items-center gap-3 flex-1"
                >
                  <div className="h-8 w-8 rounded-xl bg-blue-fantastic/10 border border-blue-fantastic/15 flex items-center justify-center text-blue-fantastic">
                    {stageStatus === "Completed" ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    ) : stageStatus === "Active" ? (
                      <Clock className="h-4 w-4 text-truffle-trouble animate-pulse" />
                    ) : (
                      <FolderOpen className="h-4 w-4 text-blue-fantastic/40" />
                    )}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-blue-fantastic font-sans">
                        {stageName} Stage
                      </h3>

                      <Badge
                        variant="outline"
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          stageStatus === "Completed"
                            ? "bg-emerald-500/10 text-emerald-800 border-emerald-500/30"
                            : stageStatus === "Active"
                            ? "bg-truffle-trouble/10 text-truffle-trouble border-truffle-trouble/30"
                            : "bg-blue-fantastic/5 text-blue-fantastic/50 border-blue-fantastic/15"
                        }`}
                      >
                        {stageStatus}
                      </Badge>

                      <Badge className="bg-blue-fantastic/10 text-blue-fantastic text-xs font-bold font-sans">
                        {stagePhotos.length} {stagePhotos.length === 1 ? "photo" : "photos"}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveUploadStage(isUploadOpen ? null : stageName);
                      if (!isExpanded) toggleStageExpand(stageName);
                    }}
                    size="sm"
                    className="bg-blue-fantastic hover:bg-abyssal-blue text-palladian font-sans font-bold text-xs h-8 px-3 rounded-xl shadow-xs"
                  >
                    <Plus className="h-3.5 w-3.5 mr-1 text-burning-flame" />
                    Upload Photo
                  </Button>

                  <button
                    type="button"
                    onClick={() => toggleStageExpand(stageName)}
                    className="h-8 w-8 rounded-xl hover:bg-blue-fantastic/10 flex items-center justify-center text-blue-fantastic/60 transition-colors"
                  >
                    {isExpanded ? (
                      <ChevronUp className="h-4 w-4" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </CardHeader>

              {/* Stage Body */}
              {isExpanded && (
                <CardContent className="p-4 sm:p-6 space-y-4">
                  {/* Embedded Upload Zone when triggered */}
                  {isUploadOpen && (
                    <div className="mb-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-bold font-sans text-truffle-trouble">
                          New Photo Upload — {stageName}
                        </span>
                        <button
                          onClick={() => setActiveUploadStage(null)}
                          className="text-xs text-blue-fantastic/50 hover:text-blue-fantastic"
                        >
                          Cancel
                        </button>
                      </div>
                      <PhotoUploadZone
                        projectId={selectedProjectId}
                        stageName={stageName}
                        uploaderName={user?.username || "Eric (Supervisor)"}
                        uploaderId={user?.id || "sup-current"}
                        onUploadSuccess={handleUploadSuccess}
                        compact
                      />
                    </div>
                  )}

                  {/* Photo Gallery Grid */}
                  <PhotoGalleryGrid
                    photos={stagePhotos}
                    stageName={stageName}
                    onPhotoClick={(photo) => setSelectedPhoto(photo)}
                    onEditCaption={(photo) => setSelectedPhoto(photo)}
                    onReplacePhoto={(photo) => setSelectedPhoto(photo)}
                    onDeletePhoto={(photo) => handleDeletePhoto(photo.id)}
                    onOpenUpload={() => {
                      setActiveUploadStage(stageName);
                    }}
                  />
                </CardContent>
              )}
            </Card>
          );
        })}
      </div>

      {/* 5. Detail & Edit Lightbox Modal */}
      <PhotoDetailModal
        photo={selectedPhoto}
        isOpen={Boolean(selectedPhoto)}
        onClose={() => setSelectedPhoto(null)}
        onUpdateCaption={handleUpdateCaption}
        onReplacePhoto={handleReplacePhoto}
        onDeletePhoto={handleDeletePhoto}
      />
    </div>
  );
}
