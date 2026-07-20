"use client";

import React, { useState } from "react";
import { AvailabilityStatus, SupervisorProfile } from "@/lib/types/profile";
import { Camera, Upload, Trash2 } from "lucide-react";

interface ProfileHeaderProps {
  profile: SupervisorProfile;
  onUpdateProfile: (updated: Partial<SupervisorProfile>) => void;
}

export default function ProfileHeader({ profile, onUpdateProfile }: ProfileHeaderProps) {
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [photoUrlInput, setPhotoUrlInput] = useState(profile.profilePhoto);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  const handleStatusChange = (newStatus: AvailabilityStatus) => {
    onUpdateProfile({ status: newStatus });
  };

  const handleSavePhoto = () => {
    onUpdateProfile({ profilePhoto: photoUrlInput });
    setIsPhotoModalOpen(false);
  };

  const handlePhotoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Size limit of 1.5MB to fit in localStorage safely
    if (file.size > 1.5 * 1024 * 1024) {
      alert("File size exceeds the 1.5MB limit. Please upload a smaller image.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setPhotoUrlInput(base64String);
    };
    reader.readAsDataURL(file);
  };

  const getStatusPillClass = (pillStatus: AvailabilityStatus) => {
    const baseClass = "px-4 py-1.5 rounded-full text-xs font-semibold border transition-all duration-200";
    if (profile.status !== pillStatus) {
      return `${baseClass} border-oatmeal text-blue-fantastic bg-transparent hover:border-blue-fantastic hover:bg-oatmeal/10`;
    }

    switch (pillStatus) {
      case "Available":
        return `${baseClass} bg-green-500/10 border-green-500 text-green-600 hover:bg-green-500/15 hover:border-green-600`;
      case "Onsite":
        return `${baseClass} bg-burning-flame/15 border-burning-flame text-truffle-trouble hover:bg-burning-flame/20`;
      case "Leave":
        return `${baseClass} bg-truffle-trouble/10 border-truffle-trouble text-truffle-trouble hover:bg-truffle-trouble/15`;
      default:
        return baseClass;
    }
  };

  return (
    <>
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-oatmeal/30 flex flex-col md:flex-row items-center gap-8 transition-all duration-255 hover:shadow-md hover:-translate-y-0.5">
        {/* Profile Avatar with Photo Edit Trigger */}
        <div 
          className="group relative w-[100px] h-[100px] rounded-full overflow-hidden shrink-0 border-4 border-oatmeal bg-blue-fantastic flex items-center justify-center cursor-pointer transition-all duration-200 hover:border-burning-flame"
          onClick={() => {
            setPhotoUrlInput(profile.profilePhoto);
            setIsPhotoModalOpen(true);
          }}
        >
          {profile.profilePhoto ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={profile.profilePhoto}
              alt={profile.fullName}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.style.display = "none";
                const parent = e.currentTarget.parentElement;
                if (parent) {
                  const fallback = parent.querySelector(".avatar-fallback");
                  if (fallback) (fallback as HTMLElement).style.display = "block";
                }
              }}
            />
          ) : null}
          <span
            className="avatar-fallback text-palladian text-3xl font-bold tracking-wider"
            style={{ display: profile.profilePhoto ? "none" : "block" }}
          >
            {getInitials(profile.fullName)}
          </span>
          <div className="absolute inset-0 bg-abyssal-blue/60 opacity-0 flex flex-col items-center justify-center transition-all duration-200 text-white text-[11px] font-semibold group-hover:opacity-100">
            <Camera size={16} className="mb-1" />
            Edit Photo
          </div>
        </div>

        {/* Name, Employee ID and Role */}
        <div className="flex flex-col gap-2 flex-grow text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-3 flex-wrap">
            <span className="text-truffle-trouble font-bold text-xs tracking-wider uppercase">
              Lead Site Supervisor
            </span>
            <span className="bg-oatmeal/20 text-blue-fantastic px-2.5 py-0.5 rounded text-[11px] font-semibold tracking-wider">
              {profile.employeeId}
            </span>
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-abyssal-blue leading-tight">
            {profile.fullName}
          </h2>

          {/* Quick Work Availability Status Toggles */}
          <div className="flex flex-col gap-1.5 mt-2">
            <span className="text-[10px] uppercase tracking-wider text-oatmeal font-bold">
              Availability Status
            </span>
            <div className="flex justify-center md:justify-start gap-2">
              {(["Available", "Onsite", "Leave"] as AvailabilityStatus[]).map((status) => (
                <button
                  key={status}
                  className={getStatusPillClass(status)}
                  onClick={() => handleStatusChange(status)}
                  type="button"
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modal for editing profile photo & uploading */}
      {isPhotoModalOpen && (
        <div 
          className="fixed inset-0 bg-abyssal-blue/50 backdrop-blur-sm flex items-center justify-center z-50 animate-[fadeIn_0.2s_ease-out]"
          onClick={() => setIsPhotoModalOpen(false)}
        >
          <div 
            className="bg-white rounded-2xl p-6 w-[420px] max-w-[95%] shadow-xl border border-oatmeal flex flex-col gap-5 animate-[scaleIn_0.2s_ease-out]"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold text-abyssal-blue border-b border-oatmeal/30 pb-2 flex items-center gap-2">
              <Camera size={18} className="text-truffle-trouble" />
              Update Profile Photo
            </h3>

            {/* Live Preview & Clear Button */}
            {photoUrlInput && (
              <div className="flex items-center gap-4 bg-oatmeal/10 border border-oatmeal/20 rounded-xl p-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={photoUrlInput} 
                  alt="Live Preview" 
                  className="w-14 h-14 rounded-full object-cover border-2 border-oatmeal shrink-0" 
                />
                <div className="flex-grow min-w-0">
                  <span className="text-xs font-bold text-blue-fantastic block leading-snug">Photo Preview</span>
                  <span className="text-[10px] text-oatmeal block mt-0.5 truncate">Click Save to apply changes.</span>
                </div>
                <button
                  type="button"
                  className="text-truffle-trouble p-1.5 rounded hover:bg-truffle-trouble/10 shrink-0"
                  onClick={() => setPhotoUrlInput("")}
                  title="Remove photo"
                >
                  <Trash2 size={15} />
                </button>
              </div>
            )}

            {/* File Upload Box */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-blue-fantastic">Upload Image File</label>
              <div className="relative">
                <input
                  type="file"
                  id="profile-photo-upload"
                  accept="image/*"
                  className="hidden"
                  onChange={handlePhotoFileChange}
                />
                <label
                  htmlFor="profile-photo-upload"
                  className="flex flex-col items-center justify-center border-2 border-dashed border-oatmeal/50 hover:border-burning-flame hover:bg-burning-flame/5 rounded-lg p-5 text-center cursor-pointer transition-all duration-200"
                >
                  <Upload size={18} className="text-oatmeal mb-1" />
                  <span className="text-xs font-semibold text-blue-fantastic">Choose image file...</span>
                  <span className="text-[9px] text-oatmeal mt-0.5">PNG, JPG, JPEG, or GIF (max 1.5MB)</span>
                </label>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 border-t border-oatmeal/20 pt-4 mt-1">
              <button
                type="button"
                className="px-4 py-2 rounded border border-oatmeal text-xs font-semibold text-blue-fantastic hover:bg-oatmeal/20 transition-all"
                onClick={() => setIsPhotoModalOpen(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="px-4 py-2 rounded bg-burning-flame text-xs font-bold text-abyssal-blue hover:bg-[#ffa447] transition-all"
                onClick={handleSavePhoto}
              >
                Save Photo
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
