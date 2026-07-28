"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  X, 
  Trash2, 
  RefreshCw, 
  Save, 
  CalendarDays, 
  User, 
  FileText, 
  HardDrive, 
  Building2, 
  Tag, 
  Edit3,
  CheckCircle2
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { SitePhoto } from "@/app/(protected)/supervisor/photos/site-photos-store";

interface PhotoDetailModalProps {
  photo: SitePhoto | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdateCaption: (photoId: string, newCaption: string) => void;
  onReplacePhoto: (photoId: string, newFile: File) => void;
  onDeletePhoto: (photoId: string) => void;
}

export function PhotoDetailModal({
  photo,
  isOpen,
  onClose,
  onUpdateCaption,
  onReplacePhoto,
  onDeletePhoto,
}: PhotoDetailModalProps) {
  const [captionText, setCaptionText] = useState("");
  const [isEditingCaption, setIsEditingCaption] = useState(false);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const fileReplaceInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (photo) {
      setCaptionText(photo.caption || "");
      setIsEditingCaption(false);
      setIsConfirmingDelete(false);
    }
  }, [photo]);

  if (!photo) return null;

  const formatFileSize = (bytes: number) => {
    if (!bytes) return "Unknown size";
    if (bytes < 1024 * 1024) {
      return `${(bytes / 1024).toFixed(0)} KB`;
    }
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const handleSaveCaption = () => {
    onUpdateCaption(photo.id, captionText);
    setIsEditingCaption(false);
    toast.success("Photo caption updated successfully");
  };

  const handleReplaceFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (!file.type.startsWith("image/")) {
        toast.error("Selected file is not an image.");
        return;
      }
      onReplacePhoto(photo.id, file);
      toast.success("Photo replaced successfully");
      e.target.value = "";
    }
  };

  const handleDelete = () => {
    onDeletePhoto(photo.id);
    toast.success("Photo deleted from site record");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl w-[92vw] max-h-[90vh] overflow-y-auto bg-palladian border-blue-fantastic/20 p-0 font-cream sm:rounded-2xl">
        <input
          ref={fileReplaceInputRef}
          type="file"
          accept="image/*"
          onChange={handleReplaceFileChange}
          className="hidden"
        />

        <div className="flex flex-col lg:flex-row h-full">
          {/* Left / Top: High-Res Photo View */}
          <div className="relative flex-1 bg-abyssal-blue/95 flex items-center justify-center min-h-[300px] sm:min-h-[420px] p-4">
            {photo.url ? (
              <img
                src={photo.url}
                alt={photo.caption || photo.fileName}
                className="max-h-[70vh] w-auto max-w-full object-contain rounded-lg shadow-lg"
              />
            ) : (
              <div className="text-palladian/60 flex flex-col items-center">
                <FileText className="h-12 w-12 mb-2" />
                <p>No Image Preview Available</p>
              </div>
            )}

            <Badge className="absolute top-3 left-3 bg-blue-fantastic/90 text-palladian font-bold font-cream text-xs border border-palladian/20">
              {photo.stageName}
            </Badge>
          </div>

          {/* Right / Bottom: Metadata & Actions Panel */}
          <div className="w-full lg:w-80 p-5 flex flex-col justify-between bg-palladian border-t lg:border-t-0 lg:border-l border-blue-fantastic/15 font-sans">
            <div>
              <DialogHeader className="pb-3 border-b border-blue-fantastic/10 text-left">
                <DialogTitle className="text-blue-fantastic font-cream font-bold text-lg leading-tight">
                  Photo Details
                </DialogTitle>
                <DialogDescription className="text-xs text-blue-fantastic/60 truncate font-sans mt-0.5">
                  {photo.fileName}
                </DialogDescription>
              </DialogHeader>

              {/* Metadata Details */}
              <div className="py-4 space-y-2.5 text-xs text-blue-fantastic/80 border-b border-blue-fantastic/10">
                <div className="flex items-center justify-between">
                  <span className="flex items-center text-blue-fantastic/60">
                    <Building2 className="h-3.5 w-3.5 mr-1.5 text-truffle-trouble" />
                    Project:
                  </span>
                  <span className="font-bold text-blue-fantastic">{photo.projectId.toUpperCase()}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="flex items-center text-blue-fantastic/60">
                    <Tag className="h-3.5 w-3.5 mr-1.5 text-blue-fantastic" />
                    Stage:
                  </span>
                  <span className="font-semibold text-blue-fantastic">{photo.stageName}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="flex items-center text-blue-fantastic/60">
                    <User className="h-3.5 w-3.5 mr-1.5 text-truffle-trouble" />
                    Uploaded By:
                  </span>
                  <span className="font-medium text-blue-fantastic">{photo.uploaderName}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="flex items-center text-blue-fantastic/60">
                    <CalendarDays className="h-3.5 w-3.5 mr-1.5 text-blue-fantastic" />
                    Timestamp:
                  </span>
                  <span className="font-medium text-blue-fantastic">{photo.timestamp}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="flex items-center text-blue-fantastic/60">
                    <HardDrive className="h-3.5 w-3.5 mr-1.5 text-blue-fantastic" />
                    File Size:
                  </span>
                  <span className="font-medium text-blue-fantastic">{formatFileSize(photo.fileSize)}</span>
                </div>
              </div>

              {/* Caption Section */}
              <div className="py-4">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold font-cream text-blue-fantastic flex items-center">
                    <Edit3 className="h-3.5 w-3.5 mr-1 text-truffle-trouble" />
                    Supervisor Note / Caption
                  </label>
                  {!isEditingCaption && (
                    <button
                      onClick={() => setIsEditingCaption(true)}
                      className="text-[11px] text-truffle-trouble hover:underline font-bold"
                    >
                      Edit
                    </button>
                  )}
                </div>

                {isEditingCaption ? (
                  <div className="space-y-2">
                    <Textarea
                      value={captionText}
                      onChange={(e) => setCaptionText(e.target.value)}
                      placeholder="Add an optional site observation or note..."
                      className="bg-palladian/80 border-blue-fantastic/20 text-xs font-sans text-blue-fantastic placeholder:text-blue-fantastic/40 focus-visible:ring-truffle-trouble min-h-[90px]"
                    />
                    <div className="flex gap-2 justify-end">
                      <Button
                        type="button"
                        onClick={() => {
                          setCaptionText(photo.caption || "");
                          setIsEditingCaption(false);
                        }}
                        variant="ghost"
                        className="h-7 text-xs px-2.5 text-blue-fantastic/70"
                      >
                        Cancel
                      </Button>
                      <Button
                        type="button"
                        onClick={handleSaveCaption}
                        className="h-7 text-xs px-3 bg-blue-fantastic text-palladian font-cream font-bold"
                      >
                        <Save className="h-3 w-3 mr-1" />
                        Save Note
                      </Button>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-blue-fantastic/80 leading-relaxed bg-palladian/60 p-3 rounded-xl border border-blue-fantastic/10 italic">
                    {photo.caption || "No note recorded for this photo."}
                  </p>
                )}
              </div>
            </div>

            {/* Action Bar */}
            <div className="pt-4 border-t border-blue-fantastic/10 space-y-2">
              <Button
                type="button"
                onClick={() => fileReplaceInputRef.current?.click()}
                variant="outline"
                className="w-full border-blue-fantastic/20 hover:bg-blue-fantastic/10 text-blue-fantastic font-cream font-bold text-xs h-9 rounded-xl justify-center"
              >
                <RefreshCw className="h-3.5 w-3.5 mr-1.5 text-blue-fantastic" />
                Replace Photo File
              </Button>

              {isConfirmingDelete ? (
                <div className="p-2.5 bg-red-500/10 border border-red-500/20 rounded-xl space-y-2 text-center">
                  <p className="text-xs font-bold text-red-700">Delete this site photo?</p>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      onClick={() => setIsConfirmingDelete(false)}
                      variant="ghost"
                      className="flex-1 h-7 text-xs text-blue-fantastic"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="button"
                      onClick={handleDelete}
                      className="flex-1 h-7 text-xs bg-red-600 hover:bg-red-700 text-white font-bold"
                    >
                      Confirm
                    </Button>
                  </div>
                </div>
              ) : (
                <Button
                  type="button"
                  onClick={() => setIsConfirmingDelete(true)}
                  variant="ghost"
                  className="w-full text-red-600 hover:text-red-700 hover:bg-red-50 font-cream font-bold text-xs h-9 rounded-xl justify-center"
                >
                  <Trash2 className="h-3.5 w-3.5 mr-1.5" />
                  Delete Photo
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
