"use client";

import React, { useState } from "react";
import { SupervisorProfile } from "@/lib/types/profile";
import { Edit2, X, Award, Check } from "lucide-react";
import { AVAILABLE_EXPERTISE_OPTIONS } from "@/lib/db-mock/profileMock";

interface ProfessionalInfoCardProps {
  profile: SupervisorProfile;
  onUpdateProfile: (updated: Partial<SupervisorProfile>) => void;
}

export default function ProfessionalInfoCard({ profile, onUpdateProfile }: ProfessionalInfoCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [yearsInput, setYearsInput] = useState<number>(profile.yearsOfExperience);
  const [selectedExpertise, setSelectedExpertise] = useState<string[]>(profile.expertise);
  const [error, setError] = useState<string>("");

  const handleEditClick = () => {
    setYearsInput(profile.yearsOfExperience);
    setSelectedExpertise(profile.expertise);
    setError("");
    setIsEditing(true);
  };

  const handleExpertiseToggle = (option: string) => {
    setSelectedExpertise((prev) => {
      if (prev.includes(option)) {
        return prev.filter((item) => item !== option);
      } else {
        return [...prev, option];
      }
    });
  };

  const validate = () => {
    if (yearsInput < 0 || isNaN(yearsInput)) {
      setError("Years of experience must be a valid positive number");
      return false;
    }
    setError("");
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onUpdateProfile({
        yearsOfExperience: yearsInput,
        expertise: selectedExpertise,
      });
      setIsEditing(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-8 shadow-sm border border-oatmeal/30 flex flex-col gap-6 transition-all duration-200 hover:shadow-md">
      <div className="flex justify-between items-center border-b border-oatmeal/30 pb-4">
        <h3 className="text-lg font-bold text-abyssal-blue flex items-center gap-2">
          <Award size={20} className="text-blue-fantastic" />
          Professional Information 
        </h3>
        {!isEditing && (
          <button
            type="button"
            className="flex items-center gap-1.5 text-xs font-semibold text-blue-fantastic px-3 py-1.5 rounded bg-oatmeal/20 hover:bg-oatmeal hover:text-abyssal-blue transition-all"
            onClick={handleEditClick}
          >
            <Edit2 size={12} />
            Edit Info
          </button>
        )}
      </div>

      {!isEditing ? (
        <div className="flex flex-col gap-6">
          {/* Years of Experience */}
          <div className="flex items-center gap-4">
            <span className="text-5xl font-extrabold text-blue-fantastic leading-none">
              {profile.yearsOfExperience}
            </span>
            <div className="flex flex-col justify-center">
              <span className="text-sm font-bold text-abyssal-blue">Years of Experience</span>
              <span className="text-xs text-oatmeal font-semibold">In Construction Management & Supervision</span>
            </div>
          </div>

          {/* Areas of Expertise */}
          <div className="flex flex-col gap-2.5">
            <span className="text-[10px] font-bold uppercase tracking-wider text-oatmeal">Areas of Expertise</span>
            <div className="flex flex-wrap gap-2">
              {profile.expertise.length > 0 ? (
                profile.expertise.map((area) => (
                  <span
                    key={area}
                    className="bg-oatmeal/15 text-blue-fantastic px-3.5 py-1.5 rounded-full text-xs font-semibold border border-oatmeal/30 transition-all duration-200 hover:bg-oatmeal/30 hover:-translate-y-0.5"
                  >
                    {area}
                  </span>
                ))
              ) : (
                <span className="text-xs text-oatmeal font-medium italic">
                  No areas of expertise specified.
                </span>
              )}
            </div>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          {/* Years of Experience Input */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-blue-fantastic">Years of Experience</label>
            <input
              type="number"
              min="0"
              max="60"
              value={yearsInput}
              onChange={(e) => setYearsInput(parseInt(e.target.value) || 0)}
              className="w-[120px] px-3 py-2 rounded border border-oatmeal text-sm bg-palladian/30 focus:outline-none focus:border-burning-flame focus:bg-white transition-all"
            />
            {error && <span className="text-[11px] font-medium text-truffle-trouble">{error}</span>}
          </div>

          {/* Areas of Expertise Tag Selector */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-blue-fantastic">
              Areas of Expertise (Select all that apply)
            </label>
            <div className="flex flex-wrap gap-2 mt-1">
              {AVAILABLE_EXPERTISE_OPTIONS.map((option) => {
                const isSelected = selectedExpertise.includes(option);
                return (
                  <button
                    key={option}
                    type="button"
                    className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition-all duration-250 ${
                      isSelected
                        ? "bg-burning-flame/15 border-burning-flame text-truffle-trouble hover:bg-burning-flame/25"
                        : "border-oatmeal text-blue-fantastic bg-transparent hover:border-blue-fantastic hover:bg-oatmeal/15"
                    }`}
                    onClick={() => handleExpertiseToggle(option)}
                  >
                    {option}
                  </button>
                );
              })}
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
