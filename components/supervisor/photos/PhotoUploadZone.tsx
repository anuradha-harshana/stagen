"use client";

import React, { useState, useRef } from "react";
import { UploadCloud, Camera, Image as ImageIcon, AlertCircle, CheckCircle2, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { SitePhoto } from "@/app/(protected)/supervisor/photos/site-photos-store";

interface PhotoUploadZoneProps {
  projectId: string;
  stageName: string;
  uploaderName: string;
  uploaderId: string;
  onUploadSuccess: (newPhotos: SitePhoto[]) => void;
  compact?: boolean;
}

const MAX_FILE_SIZE_MB = 10;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/heic", "image/gif"];

export function PhotoUploadZone({
  projectId,
  stageName,
  uploaderName,
  uploaderId,
  onUploadSuccess,
  compact = false,
}: PhotoUploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadingFilesCount, setUploadingFilesCount] = useState(0);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const cameraInputRef = useRef<HTMLInputElement | null>(null);

  const validateFiles = (files: File[]): { validFiles: File[]; errors: string[] } => {
    const validFiles: File[] = [];
    const errors: string[] = [];

    for (const file of files) {
      if (!file.type.startsWith("image/") && !ALLOWED_TYPES.includes(file.type)) {
        errors.push(`"${file.name}" is not a valid image file. Only JPG, PNG, WEBP & HEIC are allowed.`);
        continue;
      }
      if (file.size > MAX_FILE_SIZE_BYTES) {
        const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
        errors.push(`"${file.name}" exceeds max limit of ${MAX_FILE_SIZE_MB}MB (${sizeMb}MB).`);
        continue;
      }
      validFiles.push(file);
    }

    return { validFiles, errors };
  };

  const processFiles = (filesList: FileList | File[]) => {
    const filesArray = Array.from(filesList);
    if (filesArray.length === 0) return;

    setUploadError(null);
    const { validFiles, errors } = validateFiles(filesArray);

    if (errors.length > 0) {
      errors.forEach((err) => toast.error(err));
      setUploadError(errors[0]);
    }

    if (validFiles.length === 0) return;

    // Start upload process
    setIsUploading(true);
    setUploadProgress(15);
    setUploadingFilesCount(validFiles.length);

    // Simulate progress animation for realistic feedback
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + 25;
      });
    }, 200);

    setTimeout(() => {
      clearInterval(interval);
      setUploadProgress(100);

      // Create SitePhoto objects
      const createdPhotos: SitePhoto[] = validFiles.map((file, idx) => {
        const objectUrl = URL.createObjectURL(file);
        const dateStr = new Date().toLocaleString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        });

        return {
          id: `photo-${Date.now()}-${idx}-${Math.random().toString(36).substring(2, 7)}`,
          projectId,
          stageName,
          url: objectUrl,
          fileName: file.name,
          fileSize: file.size,
          uploaderName: uploaderName || "Site Supervisor",
          uploaderId: uploaderId || "sup-current",
          timestamp: dateStr,
          caption: "",
        };
      });

      setTimeout(() => {
        setIsUploading(false);
        setUploadProgress(0);
        onUploadSuccess(createdPhotos);
        toast.success(
          `Successfully uploaded ${createdPhotos.length} photo${createdPhotos.length > 1 ? "s" : ""} to ${stageName}!`
        );
      }, 300);
    }, 1000);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
      e.target.value = ""; // Reset input
    }
  };

  return (
    <div className="w-full">
      {/* Hidden inputs */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Upload Box */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-2xl transition-all duration-200 ${
          isDragging
            ? "border-truffle-trouble bg-truffle-trouble/10 shadow-inner"
            : "border-blue-fantastic/20 hover:border-blue-fantastic/40 bg-palladian/40 hover:bg-palladian/70"
        } ${compact ? "p-4" : "p-6 sm:p-8"}`}
      >
        {isUploading ? (
          <div className="flex flex-col items-center justify-center py-4 text-center">
            <div className="h-10 w-10 rounded-full bg-blue-fantastic/10 flex items-center justify-center mb-3">
              <Loader2 className="h-5 w-5 text-blue-fantastic animate-spin" />
            </div>
            <p className="text-sm font-bold font-sans text-blue-fantastic">
              Uploading {uploadingFilesCount} photo{uploadingFilesCount > 1 ? "s" : ""}...
            </p>
            <p className="text-xs text-blue-fantastic/60 font-sans mt-0.5 mb-3">
              Processing image optimization and metadata
            </p>
            <div className="w-full max-w-md px-4">
              <Progress value={uploadProgress} className="h-2 bg-blue-fantastic/15" />
              <div className="flex justify-between text-[11px] text-blue-fantastic/70 font-semibold font-sans mt-1.5">
                <span>Uploading to {stageName}</span>
                <span>{uploadProgress}%</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center text-center">
            <div className="flex items-center gap-2 mb-2">
              <div className="h-10 w-10 rounded-2xl bg-blue-fantastic/10 border border-blue-fantastic/15 flex items-center justify-center text-blue-fantastic">
                <UploadCloud className="h-5 w-5" />
              </div>
              <div className="h-10 w-10 rounded-2xl bg-burning-flame/15 border border-burning-flame/30 flex items-center justify-center text-truffle-trouble">
                <Camera className="h-5 w-5" />
              </div>
            </div>

            <h3 className="text-blue-fantastic font-sans font-bold text-base mb-1">
              Upload Site Photos for <span className="text-truffle-trouble">{stageName}</span>
            </h3>
            <p className="text-xs text-blue-fantastic/60 font-sans max-w-sm mb-4">
              Drag & drop photos here, or select from device. Mobile camera capture supported on-site.
            </p>

            {/* Action buttons */}
            <div className="flex flex-wrap items-center justify-center gap-2">
              <Button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="bg-blue-fantastic hover:bg-abyssal-blue text-palladian font-sans font-bold text-xs px-4 h-9 rounded-xl shadow-xs"
              >
                <ImageIcon className="h-4 w-4 mr-1.5" />
                Browse Photos
              </Button>

              <Button
                type="button"
                onClick={() => cameraInputRef.current?.click()}
                variant="outline"
                className="border-blue-fantastic/20 hover:bg-blue-fantastic/10 text-blue-fantastic font-sans font-bold text-xs px-4 h-9 rounded-xl"
              >
                <Camera className="h-4 w-4 mr-1.5 text-truffle-trouble" />
                Take Photo (Mobile)
              </Button>
            </div>

            {/* Subtext info */}
            <p className="text-[11px] text-blue-fantastic/45 font-sans mt-3">
              Supports JPG, PNG, WEBP · Max {MAX_FILE_SIZE_MB}MB per file
            </p>
          </div>
        )}
      </div>

      {uploadError && (
        <div className="mt-2 p-2.5 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-2 text-xs text-red-700 font-sans">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span className="flex-1">{uploadError}</span>
          <button onClick={() => setUploadError(null)} className="text-red-700 hover:opacity-75">
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
