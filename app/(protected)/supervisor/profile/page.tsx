"use client";

import { useSupervisorData, DataState } from "@/components/supervisor/useSupervisorData";
import React, { useState, useRef } from "react";
import { toast } from "sonner";
import { HeaderSection } from "@/components/supervisor/profile/HeaderSection";
import { PersonalInformation } from "@/components/supervisor/profile/PersonalInformation";
import { ProfessionalInformation } from "@/components/supervisor/profile/ProfessionalInformation";
import { QualificationsCertifications, Certification } from "@/components/supervisor/profile/QualificationsCertifications";

export default function SupervisorProfilePage() {
  const api = useSupervisorData<{ avatar: string; availability: "Available" | "Onsite" | "Leave"; personalInfo: { fullName: string; employeeId: string; contactNumber: string; emailAddress: string; officeBranch: string }; professionalInfo: { yearsOfExperience: number; expertise: string[] }; certifications: Certification[] } | null>("profile", null);
  const [avatarPreview, setAvatar] = useState("");
  const avatarInputRef = useRef<HTMLInputElement>(null);

  // --- Handlers ---
  
  // 1. Avatar Update with Type Validation
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error("Invalid file type. Please select a valid image file (PNG, JPG, JPEG, SVG).");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image file is too large. Max size is 5MB.");
        return;
      }
      
      const objectUrl = URL.createObjectURL(file);
      setAvatar(objectUrl);
      toast.success("Profile photo updated successfully!");
    }
  };

  const handleSavePersonalInfo = async (personalInfo: NonNullable<typeof api.data>["personalInfo"]) => api.mutate("PUT", { personalInfo });
  const handleSaveProfessionalInfo = async (professionalInfo: NonNullable<typeof api.data>["professionalInfo"]) => api.mutate("PUT", { professionalInfo });
  const handleAddCert = async (cert: Certification) => api.mutate("PUT", { certifications: [...(api.data?.certifications ?? []), cert] });
  const handleEditCert = async (cert: Certification) => api.mutate("PUT", { certifications: api.data?.certifications.map(c => c.id === cert.id ? cert : c) });
  const handleDeleteCert = async (id: string) => { if (confirm("Delete this certification?")) await api.mutate("PUT", { certifications: api.data?.certifications.filter(c => c.id !== id) }); };
  if (api.loading || api.error || !api.data) return <DataState loading={api.loading} error={api.error} />;
  const { personalInfo, professionalInfo, certifications, availability } = api.data;
  const avatar = avatarPreview || api.data.avatar;
  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto font-sans">
      
      {/* Header Section */}
      <HeaderSection 
        avatar={avatar}
        fullName={personalInfo.fullName}
        employeeId={personalInfo.employeeId}
        availability={availability}
        onAvatarChange={handleAvatarChange}
        onAvailabilityChange={availability => { void api.mutate("PATCH", { availability }); }}
        avatarInputRef={avatarInputRef}
      />

      {/* Personal Information */}
      <PersonalInformation 
        fullName={personalInfo.fullName}
        employeeId={personalInfo.employeeId}
        contactNumber={personalInfo.contactNumber}
        emailAddress={personalInfo.emailAddress}
        officeBranch={personalInfo.officeBranch}
        onSave={handleSavePersonalInfo}
      />

      {/* Professional Information */}
      <ProfessionalInformation 
        yearsOfExperience={professionalInfo.yearsOfExperience}
        expertise={professionalInfo.expertise}
        onSave={handleSaveProfessionalInfo}
      />

      {/* Qualifications & Certifications */}
      <QualificationsCertifications 
        certifications={certifications}
        onAddCert={handleAddCert}
        onEditCert={handleEditCert}
        onDeleteCert={handleDeleteCert}
      />

    </div>
  );
}
