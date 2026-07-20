"use client";

import React, { useState } from "react";
import { AvailabilityStatus, SupervisorProfile } from "@/lib/types/profile";
import { Edit2, X, Phone, Mail, MapPin, Shield, Check } from "lucide-react";
import { OFFICE_BRANCH_OPTIONS } from "@/lib/db-mock/profileMock";

interface PersonalInfoCardProps {
  profile: SupervisorProfile;
  onUpdateProfile: (updated: Partial<SupervisorProfile>) => void;
}

export default function PersonalInfoCard({ profile, onUpdateProfile }: PersonalInfoCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: profile.fullName,
    employeeId: profile.employeeId,
    contactNumber: profile.contactNumber,
    emailAddress: profile.emailAddress,
    officeBranch: profile.officeBranch,
    status: profile.status,
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleEditClick = () => {
    setFormData({
      fullName: profile.fullName,
      employeeId: profile.employeeId,
      contactNumber: profile.contactNumber,
      emailAddress: profile.emailAddress,
      officeBranch: profile.officeBranch,
      status: profile.status,
    });
    setErrors({});
    setIsEditing(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Clear error for this field as the user type/change
    if (errors[name]) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy[name];
        return copy;
      });
    }
  };

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    
    // Full Name validation
    const nameTrim = formData.fullName.trim();
    if (!nameTrim) {
      newErrors.fullName = "Full Name is required";
    } else if (nameTrim.length < 2) {
      newErrors.fullName = "Full Name must be at least 2 characters";
    } else if (!/^[A-Za-z\s'\-]+$/.test(nameTrim)) {
      newErrors.fullName = "Full Name can only contain letters, spaces, hyphens, and apostrophes";
    }

    // Employee ID validation
    const empIdTrim = formData.employeeId.trim();
    if (!empIdTrim) {
      newErrors.employeeId = "Employee ID is required";
    } else if (!/^EMP-\d{4}-\d{4}$/i.test(empIdTrim)) {
      newErrors.employeeId = "Employee ID format must be 'EMP-YYYY-XXXX' (e.g. EMP-2026-9843)";
    }

    // Contact Number validation
    const phoneTrim = formData.contactNumber.trim();
    if (!phoneTrim) {
      newErrors.contactNumber = "Contact Number is required";
    } else if (!/^\+?[0-9\s\-()]{8,20}$/.test(phoneTrim)) {
      newErrors.contactNumber = "Invalid format (min 8 digits, only digits/spaces/dashes/parentheses/+)";
    }

    // Email Address validation
    const emailTrim = formData.emailAddress.trim();
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailTrim) {
      newErrors.emailAddress = "Email Address is required";
    } else if (!emailRegex.test(emailTrim)) {
      newErrors.emailAddress = "Please enter a valid email address (e.g. name@domain.com)";
    }

    // Office/Branch validation
    if (!formData.officeBranch) {
      newErrors.officeBranch = "Office/Branch is required";
    } else if (!OFFICE_BRANCH_OPTIONS.includes(formData.officeBranch)) {
      newErrors.officeBranch = "Invalid Office/Branch selected";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onUpdateProfile(formData);
      setIsEditing(false);
    }
  };

  const getStatusBadgeClass = (status: AvailabilityStatus) => {
    const base = "px-2.5 py-0.5 rounded text-xs font-semibold border";
    switch (status) {
      case "Available":
        return `${base} bg-green-500/10 text-green-600 border-green-500/30`;
      case "Onsite":
        return `${base} bg-burning-flame/15 text-truffle-trouble border-burning-flame/30`;
      case "Leave":
        return `${base} bg-truffle-trouble/10 text-truffle-trouble border-truffle-trouble/30`;
      default:
        return base;
    }
  };

  return (
    <div className="bg-white rounded-2xl p-8 shadow-sm border border-oatmeal/30 flex flex-col gap-6 transition-all duration-200 hover:shadow-md">
      <div className="flex justify-between items-center border-b border-oatmeal/30 pb-4">
        <h3 className="text-lg font-bold text-abyssal-blue flex items-center gap-2">
          <Shield size={20} className="text-blue-fantastic" />
          Personal Information
        </h3>
        {!isEditing && (
          <button
            type="button"
            className="flex items-center gap-1.5 text-xs font-semibold text-blue-fantastic px-3 py-1.5 rounded bg-oatmeal/20 hover:bg-oatmeal hover:text-abyssal-blue transition-all"
            onClick={handleEditClick}
          >
            <Edit2 size={12} />
            Edit Profile
          </button>
        )}
      </div>

      {!isEditing ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-6">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-oatmeal">Full Name</span>
            <span className="text-sm font-medium text-abyssal-blue">{profile.fullName}</span>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-oatmeal">Employee ID</span>
            <span className="text-sm font-medium text-abyssal-blue">{profile.employeeId}</span>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-oatmeal">Contact Number</span>
            <span className="text-sm font-medium text-abyssal-blue flex items-center gap-2">
              <Phone size={13} className="text-oatmeal" />
              {profile.contactNumber}
            </span>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-oatmeal">Email Address</span>
            <span className="text-sm font-medium text-abyssal-blue flex items-center gap-2">
              <Mail size={13} className="text-oatmeal" />
              {profile.emailAddress}
            </span>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-oatmeal">Office/Branch</span>
            <span className="text-sm font-medium text-abyssal-blue flex items-center gap-2">
              <MapPin size={13} className="text-oatmeal" />
              {profile.officeBranch}
            </span>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-blue-fantastic">Full Name</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 rounded border text-sm bg-palladian/30 focus:outline-none focus:bg-white transition-all ${
                  errors.fullName
                    ? "border-truffle-trouble focus:border-truffle-trouble"
                    : "border-oatmeal focus:border-burning-flame"
                }`}
              />
              {errors.fullName && (
                <span className="text-[11px] font-medium text-truffle-trouble mt-0.5">{errors.fullName}</span>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-blue-fantastic">Employee ID</label>
              <input
                type="text"
                name="employeeId"
                value={formData.employeeId}
                onChange={handleInputChange}
                placeholder="e.g. EMP-2026-9843"
                className={`w-full px-3 py-2 rounded border text-sm bg-palladian/30 focus:outline-none focus:bg-white transition-all ${
                  errors.employeeId
                    ? "border-truffle-trouble focus:border-truffle-trouble"
                    : "border-oatmeal focus:border-burning-flame"
                }`}
              />
              {errors.employeeId && (
                <span className="text-[11px] font-medium text-truffle-trouble mt-0.5">{errors.employeeId}</span>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-blue-fantastic">Contact Number</label>
              <input
                type="text"
                name="contactNumber"
                value={formData.contactNumber}
                onChange={handleInputChange}
                placeholder="e.g. +61 491 570 156"
                className={`w-full px-3 py-2 rounded border text-sm bg-palladian/30 focus:outline-none focus:bg-white transition-all ${
                  errors.contactNumber
                    ? "border-truffle-trouble focus:border-truffle-trouble"
                    : "border-oatmeal focus:border-burning-flame"
                }`}
              />
              {errors.contactNumber && (
                <span className="text-[11px] font-medium text-truffle-trouble mt-0.5">{errors.contactNumber}</span>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-blue-fantastic">Email Address</label>
              <input
                type="text"
                name="emailAddress"
                value={formData.emailAddress}
                onChange={handleInputChange}
                placeholder="e.g. name@stagen.com.au"
                className={`w-full px-3 py-2 rounded border text-sm bg-palladian/30 focus:outline-none focus:bg-white transition-all ${
                  errors.emailAddress
                    ? "border-truffle-trouble focus:border-truffle-trouble"
                    : "border-oatmeal focus:border-burning-flame"
                }`}
              />
              {errors.emailAddress && (
                <span className="text-[11px] font-medium text-truffle-trouble mt-0.5">{errors.emailAddress}</span>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-blue-fantastic">Office/Branch</label>
              <select
                name="officeBranch"
                value={formData.officeBranch}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 rounded border text-sm bg-palladian/30 focus:outline-none focus:bg-white transition-all ${
                  errors.officeBranch
                    ? "border-truffle-trouble focus:border-truffle-trouble"
                    : "border-oatmeal focus:border-burning-flame"
                }`}
              >
                {OFFICE_BRANCH_OPTIONS.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
              {errors.officeBranch && (
                <span className="text-[11px] font-medium text-truffle-trouble mt-0.5">{errors.officeBranch}</span>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-3 border-t border-oatmeal/30 pt-4 mt-2">
            <button
              type="button"
              className="px-4 py-2 rounded border border-oatmeal text-xs font-semibold text-blue-fantastic hover:bg-oatmeal/20 transition-all flex items-center gap-1.5"
              onClick={() => setIsEditing(false)}
            >
              <X size={14} />
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-burning-flame text-xs font-bold text-abyssal-blue hover:bg-[#ffa447] transition-all flex items-center gap-1.5"
            >
              <Check size={14} />
              Save Changes
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
