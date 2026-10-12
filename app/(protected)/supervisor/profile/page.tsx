"use client";

import React, { useState, useRef } from "react";
import { toast } from "sonner";
import { HeaderSection } from "@/components/supervisor/profile/HeaderSection";
import { PersonalInformation } from "@/components/supervisor/profile/PersonalInformation";
import { ProfessionalInformation } from "@/components/supervisor/profile/ProfessionalInformation";
import { QualificationsCertifications, Certification } from "@/components/supervisor/profile/QualificationsCertifications";

export default function SupervisorProfilePage() {
  // --- Profile State ---
  const [avatar, setAvatar] = useState<string>("/images/user.jpg");
  const [availability, setAvailability] = useState<"Available" | "Onsite" | "Leave">("Available");
  
  const [personalInfo, setPersonalInfo] = useState({
    fullName: "Marcus Vance",
    employeeId: "EMP-2026-9843",
    contactNumber: "+61 491 570 156",
    emailAddress: "marcus.vance@stagen.com.au",
    officeBranch: "Sydney Head Office (HQ)"
  });

  const [professionalInfo, setProfessionalInfo] = useState({
    yearsOfExperience: 8,
    expertise: ["Commercial", "Residential", "Infrastructure"]
  });

  const [certifications, setCertifications] = useState<Certification[]>([
    {
      id: "1",
      name: "White Card Induction",
      licenseNo: "WC-NSW-88776655",
      issuedDate: "2021-04-12",
      expiryDate: "Never Expires",
      status: "VERIFIED"
    },
    {
      id: "2",
      name: "First Aid Level II & CPR",
      licenseNo: "FA-992384",
      issuedDate: "2024-02-15",
      expiryDate: "2027-02-15",
      status: "ACTIVE",
      fileName: "first_aid_cert_marcus.pdf"
    },
    {
      id: "3",
      name: "OHS Construction Supervisor Certificate",
      licenseNo: "OHS-SUP-40112",
      issuedDate: "2023-08-10",
      expiryDate: "2026-08-10",
      status: "ACTIVE"
    },
    {
      id: "4",
      name: "SWMS Electrical & Structural Agreement",
      licenseNo: "SWMS-STG-2026",
      issuedDate: "2026-01-10",
      expiryDate: "2027-01-10",
      status: "VERIFIED"
    }
  ]);

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

  // 2. Personal Info Update
  const handleSavePersonalInfo = (updated: typeof personalInfo) => {
    setPersonalInfo(updated);
    toast.success("Personal information updated.");
  };

  // 3. Professional Info Update
  const handleSaveProfessionalInfo = (updated: typeof professionalInfo) => {
    setProfessionalInfo(updated);
    toast.success("Professional details updated.");
  };

  // 4. Certification Handlers
  const handleAddCert = (cert: Certification) => {
    setCertifications(prev => [...prev, cert]);
    toast.success("New certification added.");
  };

  const handleEditCert = (updatedCert: Certification) => {
    setCertifications(prev => prev.map(cert => cert.id === updatedCert.id ? updatedCert : cert));
    toast.success("Certification details updated.");
  };

  const handleDeleteCert = (id: string) => {
    if (confirm("Are you sure you want to delete this certification?")) {
      setCertifications(prev => prev.filter(cert => cert.id !== id));
      toast.success("Certification deleted.");
    }
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto font-sans">
      
      {/* Header Section */}
      <HeaderSection 
        avatar={avatar}
        fullName={personalInfo.fullName}
        employeeId={personalInfo.employeeId}
        availability={availability}
        onAvatarChange={handleAvatarChange}
        onAvailabilityChange={setAvailability}
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
