"use client";

import React from "react";
import Image from "next/image";
import { ZoomIn, CalendarDays, Camera } from "lucide-react";
import { SitePhoto } from "@/lib/dashboard/data";

interface PhotoCardProps {
  photo: SitePhoto;
}

export default function PhotoCard({ photo }: PhotoCardProps) {
  return (
    <div className="group flex flex-col bg-white border border-blue-fantastic/[0.04] shadow-[0_4px_15px_rgba(27,38,50,0.02)] hover:shadow-[0_12px_25px_rgba(27,38,50,0.06)] rounded-2xl overflow-hidden cursor-pointer transition-all duration-300">
      {/* Image Container with aspect ratio */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-palladian/35 z-10">
        <Image
          src={photo.url}
          alt={photo.label}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 25vw"
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-105"
        />

        {/* Hover Overlay with glassmorphic effect */}
        <div className="absolute inset-0 bg-abyssal-blue/0 group-hover:bg-abyssal-blue/50 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
          <div className="flex flex-col items-center gap-1.5 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
            <div className="h-10 w-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30 text-white hover:bg-white/30 transition-colors duration-200">
              <ZoomIn className="h-5 w-5" />
            </div>
            <span className="text-white text-[11px] font-bold tracking-wide uppercase font-sans">
              View Photo
            </span>
          </div>
        </div>

        {/* Top-left Stage Tag */}
        <div className="absolute top-3 left-3 z-20">
          <span className="inline-flex text-[9px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-full border border-white/20 backdrop-blur-md bg-white/85 text-truffle-trouble shadow-sm">
            {photo.stage}
          </span>
        </div>
      </div>

      {/* Info Section */}
      <div className="p-3.5 border-t border-blue-fantastic/[0.04] bg-white flex flex-col justify-between">
        <h4 className="text-[13px] font-bold text-blue-fantastic truncate font-cream">
          {photo.label}
        </h4>
        <div className="flex items-center gap-1.5 mt-1 text-blue-fantastic/50 text-[10px] font-medium">
          <CalendarDays className="h-3 w-3 text-blue-fantastic/30" />
          <span>Uploaded {photo.date}</span>
        </div>
      </div>
    </div>
  );
}
