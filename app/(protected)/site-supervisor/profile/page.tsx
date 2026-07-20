"use client";

import React, { useState, useEffect } from "react";
import ProfileHeader from "@/components/SiteSupervisor/ProfileHeader";
import PersonalInfoCard from "@/components/SiteSupervisor/PersonalInfoCard";
import ProfessionalInfoCard from "@/components/SiteSupervisor/ProfessionalInfoCard";
import QualificationsCard from "@/components/SiteSupervisor/QualificationsCard";
import { initialProfile } from "@/lib/db-mock/profileMock";
import { SupervisorProfile } from "@/lib/types/profile";

export default function SiteSupervisorProfilePage() {
  const [profile, setProfile] = useState<SupervisorProfile | null>(null);
  const [formattedDate, setFormattedDate] = useState<string>("");

  useEffect(() => {
    const savedProfile = localStorage.getItem("stagen_supervisor_profile");
    if (savedProfile) {
      try {
        setProfile(JSON.parse(savedProfile));
      } catch (e) {
        console.error("Failed to parse saved profile", e);
        setProfile(initialProfile);
      }
    } else {
      setProfile(initialProfile);
      localStorage.setItem("stagen_supervisor_profile", JSON.stringify(initialProfile));
    }

    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    };
    const now = new Date();
    setFormattedDate(now.toLocaleDateString("en-AU", options).toUpperCase());
  }, []);

  const handleUpdateProfile = (updatedFields: Partial<SupervisorProfile>) => {
    setProfile((prev) => {
      if (!prev) return null;
      const updatedProfile = { ...prev, ...updatedFields };
      localStorage.setItem("stagen_supervisor_profile", JSON.stringify(updatedProfile));
      return updatedProfile;
    });
  };

  if (!profile) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[50vh]">
        <div className="text-blue-fantastic font-semibold text-sm animate-pulse">
          Loading Profile...
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8 flex flex-col gap-4">
      {/* Page Title & Meta Info */}
      
      {/* Profile Header (Section 01 Overview) */}
      <ProfileHeader profile={profile} onUpdateProfile={handleUpdateProfile} />

      {/* Sections Stack */}
      <div className="flex flex-col gap-6">
        <PersonalInfoCard profile={profile} onUpdateProfile={handleUpdateProfile} />
        <ProfessionalInfoCard profile={profile} onUpdateProfile={handleUpdateProfile} />
        <QualificationsCard profile={profile} onUpdateProfile={handleUpdateProfile} />
      </div>
    </div>
  );
}
