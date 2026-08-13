"use client";

import React, { useState } from "react";
import { 
  Camera, 
  ZoomIn, 
  CalendarDays, 
  User, 
  MoreVertical, 
  Trash2, 
  Edit3, 
  RefreshCw, 
  MessageSquare,
  FileImage,
  Sparkles
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SitePhoto } from "@/app/(protected)/supervisor/photos/site-photos-store";

interface PhotoGalleryGridProps {
  photos: SitePhoto[];
  stageName: string;
  onPhotoClick: (photo: SitePhoto) => void;
  onEditCaption: (photo: SitePhoto) => void;
  onReplacePhoto: (photo: SitePhoto) => void;
  onDeletePhoto: (photo: SitePhoto) => void;
  onOpenUpload: () => void;
}

export function PhotoGalleryGrid({
  photos,
  stageName,
  onPhotoClick,
  onEditCaption,
  onReplacePhoto,
  onDeletePhoto,
  onOpenUpload,
}: PhotoGalleryGridProps) {
  if (photos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10 px-4 bg-palladian/30 border border-dashed border-blue-fantastic/20 rounded-2xl text-center">
        <div className="h-12 w-12 rounded-2xl bg-blue-fantastic/10 flex items-center justify-center text-blue-fantastic/50 mb-3">
          <Camera className="h-6 w-6" />
        </div>
        <h4 className="text-sm font-bold font-sans text-blue-fantastic">
          No photos uploaded for {stageName}
        </h4>
        <p className="text-xs text-blue-fantastic/60 font-sans mt-1 max-w-sm">
          Keep site documentation up to date by attaching progress photos for your customer and audit logs.
        </p>
        <Button
          type="button"
          onClick={onOpenUpload}
          variant="outline"
          className="mt-4 border-blue-fantastic/20 hover:bg-blue-fantastic/10 text-blue-fantastic font-sans font-bold text-xs h-8 px-4 rounded-xl"
        >
          <Camera className="h-3.5 w-3.5 mr-1.5 text-truffle-trouble" />
          Add First Photo
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {photos.map((photo) => (
        <Card
          key={photo.id}
          className="group relative bg-palladian/60 border border-blue-fantastic/15 shadow-xs hover:shadow-md hover:border-truffle-trouble/40 transition-all duration-200 overflow-hidden flex flex-col font-sans"
        >
          {/* Image Thumbnail Container */}
          <div className="relative aspect-4/3 w-full bg-abyssal-blue/10 overflow-hidden">
            {photo.url ? (
              <img
                src={photo.url}
                alt={photo.caption || photo.fileName}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = "none";
                  const parent = (e.target as HTMLElement).parentElement;
                  if (parent) {
                    parent.classList.add("bg-gradient-to-br", "from-blue-fantastic/40", "to-abyssal-blue/80");
                  }
                }}
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-blue-fantastic/40 to-abyssal-blue/80 flex items-center justify-center">
                <FileImage className="h-8 w-8 text-palladian/50" />
              </div>
            )}

            {/* Hover overlay for zoom preview */}
            <div className="absolute inset-0 bg-abyssal-blue/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2">
              <Button
                type="button"
                onClick={() => onPhotoClick(photo)}
                size="sm"
                className="bg-palladian/90 hover:bg-palladian text-blue-fantastic font-sans font-bold text-xs h-8 px-3 rounded-xl backdrop-blur-xs shadow-sm"
              >
                <ZoomIn className="h-3.5 w-3.5 mr-1" />
                View
              </Button>
            </div>

            {/* Dropdown Menu */}
            <div className="absolute top-2 right-2 z-10">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    className="h-7 w-7 rounded-lg bg-abyssal-blue/60 hover:bg-abyssal-blue text-palladian flex items-center justify-center backdrop-blur-xs transition-colors shadow-xs"
                  >
                    <MoreVertical className="h-3.5 w-3.5" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-44 font-sans bg-palladian border-blue-fantastic/20">
                  <DropdownMenuItem onClick={() => onPhotoClick(photo)} className="cursor-pointer text-xs">
                    <ZoomIn className="h-3.5 w-3.5 mr-2 text-blue-fantastic" />
                    View Details
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onEditCaption(photo)} className="cursor-pointer text-xs">
                    <Edit3 className="h-3.5 w-3.5 mr-2 text-truffle-trouble" />
                    Edit Caption
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onReplacePhoto(photo)} className="cursor-pointer text-xs">
                    <RefreshCw className="h-3.5 w-3.5 mr-2 text-blue-fantastic" />
                    Replace Photo
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-blue-fantastic/10" />
                  <DropdownMenuItem onClick={() => onDeletePhoto(photo)} className="cursor-pointer text-xs text-red-600 focus:text-red-700 focus:bg-red-50">
                    <Trash2 className="h-3.5 w-3.5 mr-2" />
                    Delete Photo
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Stage badge */}
            <div className="absolute bottom-2 left-2 pointer-events-none">
              <Badge className="bg-abyssal-blue/80 text-palladian text-[10px] font-bold px-2 py-0.5 rounded-md backdrop-blur-xs border border-palladian/20">
                {photo.stageName}
              </Badge>
            </div>
          </div>

          {/* Card Content & Metadata */}
          <CardContent className="p-3 flex-1 flex flex-col justify-between font-sans">
            <div>
              {/* Caption or placeholder */}
              <p
                onClick={() => onEditCaption(photo)}
                className={`text-xs leading-snug cursor-pointer transition-colors ${
                  photo.caption
                    ? "text-blue-fantastic font-medium line-clamp-2 hover:text-truffle-trouble"
                    : "text-blue-fantastic/40 italic hover:text-blue-fantastic/70"
                }`}
              >
                {photo.caption || "+ Add caption or site note..."}
              </p>
            </div>

            <div className="mt-3 pt-2 border-t border-blue-fantastic/10 flex items-center justify-between text-[10px] text-blue-fantastic/60">
              <div className="flex items-center gap-1 truncate max-w-[55%]">
                <User className="h-3 w-3 shrink-0 text-truffle-trouble" />
                <span className="truncate">{photo.uploaderName}</span>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <CalendarDays className="h-3 w-3 text-blue-fantastic/40" />
                <span>{photo.timestamp.split(" ")[0]} {photo.timestamp.split(" ")[1]}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
