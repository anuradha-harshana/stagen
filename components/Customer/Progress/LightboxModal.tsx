"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight, Calendar, Tag } from "lucide-react";
import { ProgressPhoto } from "@/lib/progress/data";

interface LightboxModalProps {
  isOpen: boolean;
  onClose: () => void;
  photos: ProgressPhoto[];
  currentIndex: number;
  onIndexChange: (index: number) => void;
}

export default function LightboxModal({
  isOpen,
  onClose,
  photos,
  currentIndex,
  onIndexChange,
}: LightboxModalProps) {
  useEffect(() => {
    if (!isOpen) return;

    // Prevent body scroll when open
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, currentIndex, photos.length]);

  if (!isOpen || photos.length === 0) return null;

  const currentPhoto = photos[currentIndex];

  const handlePrev = () => {
    const newIndex = (currentIndex - 1 + photos.length) % photos.length;
    onIndexChange(newIndex);
  };

  const handleNext = () => {
    const newIndex = (currentIndex + 1) % photos.length;
    onIndexChange(newIndex);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-abyssal-blue/95 backdrop-blur-md animate-fade-in">
      {/* Absolute Close Backdrop Button */}
      <div className="absolute inset-0 cursor-zoom-out" onClick={onClose} />

      {/* Main Container */}
      <div className="relative w-full max-w-5xl h-full flex flex-col justify-between p-4 md:p-8 z-10 pointer-events-none">
        
        {/* Top Control Bar */}
        <div className="flex items-center justify-between w-full pb-4 pointer-events-auto">
          <div className="text-white space-y-0.5">
            <span className="text-[9px] font-extrabold uppercase tracking-widest text-burning-flame bg-burning-flame/10 px-2 py-0.5 rounded-full border border-burning-flame/20">
              {currentPhoto.stageName}
            </span>
            <h3 className="text-lg font-bold font-sans">{currentPhoto.label}</h3>
          </div>
          
          <button
            onClick={onClose}
            className="h-10 w-10 rounded-full bg-white/10 text-white hover:bg-white/20 border border-white/10 flex items-center justify-center transition-colors duration-200 cursor-pointer"
            aria-label="Close Lightbox"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Center Gallery Area */}
        <div className="flex-1 flex items-center justify-between gap-4 pointer-events-auto relative my-auto">
          {/* Left Arrow */}
          <button
            onClick={handlePrev}
            className="h-12 w-12 rounded-full bg-white/5 border border-white/10 hover:bg-white/15 text-white flex items-center justify-center shrink-0 transition-all duration-200 cursor-pointer disabled:opacity-30"
            disabled={photos.length <= 1}
          >
            <ChevronLeft className="h-6 w-6" />
          </button>

          {/* Image View */}
          <div className="relative flex-1 h-[50vh] md:h-[65vh] w-full rounded-2xl overflow-hidden shadow-2xl border border-white/10 bg-black/40">
            <Image
              src={currentPhoto.url}
              alt={currentPhoto.label}
              fill
              sizes="(max-width: 1200px) 100vw, 1200px"
              className="object-contain"
              priority
            />
          </div>

          {/* Right Arrow */}
          <button
            onClick={handleNext}
            className="h-12 w-12 rounded-full bg-white/5 border border-white/10 hover:bg-white/15 text-white flex items-center justify-center shrink-0 transition-all duration-200 cursor-pointer disabled:opacity-30"
            disabled={photos.length <= 1}
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>

        {/* Bottom Details Bar */}
        <div className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 md:p-6 text-white backdrop-blur-md pointer-events-auto mt-4 max-w-3xl mx-auto flex flex-col md:flex-row justify-between gap-4">
          <div className="space-y-2 flex-1">
            <h4 className="text-sm font-bold flex items-center gap-1.5 text-burning-flame uppercase tracking-wider">
              <Tag className="h-4 w-4" />
              <span>Details</span>
            </h4>
            <p className="text-xs md:text-sm text-white/80 leading-relaxed font-sans">
              {currentPhoto.description}
            </p>
          </div>
          
          <div className="flex flex-col justify-end items-start md:items-end shrink-0 gap-1 text-xs text-white/50 border-t md:border-t-0 md:border-l border-white/10 pt-3.5 md:pt-0 md:pl-6">
            <div className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" />
              <span>Captured: <strong>{currentPhoto.date}</strong></span>
            </div>
            <div className="mt-1">
              <span>Photo {currentIndex + 1} of {photos.length}</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
