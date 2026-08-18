import React from "react";
import { Upload } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface HeaderSectionProps {
  avatar: string;
  fullName: string;
  employeeId: string;
  availability: "Available" | "Onsite" | "Leave";
  onAvatarChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onAvailabilityChange: (status: "Available" | "Onsite" | "Leave") => void;
  avatarInputRef: React.RefObject<HTMLInputElement | null>;
}

export function HeaderSection({
  avatar,
  fullName,
  employeeId,
  availability,
  onAvatarChange,
  onAvailabilityChange,
  avatarInputRef
}: HeaderSectionProps) {
  return (
    <div className="bg-white rounded-3xl p-8 shadow-sm border border-oatmeal/30 flex flex-col md:flex-row items-center justify-between gap-8 transition-all duration-200 hover:shadow-md">
      <div className="flex flex-col sm:flex-row items-center gap-6 w-full md:w-auto">
        {/* Avatar Container with Upload Overlay */}
        <div 
          className="relative group w-24 h-24 rounded-full overflow-hidden border-4 border-palladian bg-oatmeal/20 shrink-0 cursor-pointer shadow-inner" 
          onClick={() => avatarInputRef.current?.click()}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src={avatar} 
            alt={fullName} 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-abyssal-blue/50 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Upload className="h-5 w-5 text-white mb-0.5" />
            <span className="text-[9px] text-white font-bold uppercase tracking-wider">Photo</span>
          </div>
          <input 
            type="file" 
            ref={avatarInputRef}
            onChange={onAvatarChange}
            accept="image/*"
            className="hidden"
          />
        </div>

        <div className="flex flex-col gap-1.5 text-center sm:text-left">
          <div className="flex flex-wrap justify-center sm:justify-start items-center gap-2.5">
            <span className="text-truffle-trouble font-bold text-xs tracking-wider uppercase">
              Lead Site Supervisor
            </span>
            <Badge variant="outline" className="bg-surface-inset border-oatmeal/50 text-blue-fantastic font-semibold text-[10px]">
              {employeeId}
            </Badge>
          </div>
          <h2 className="text-3xl font-extrabold text-abyssal-blue leading-none">
            {fullName}
          </h2>
          
          {/* Availability Switcher */}
          <div className="mt-2.5 flex flex-col gap-2">
            <span className="text-[10px] font-bold tracking-widest text-blue-fantastic/40 uppercase text-center sm:text-left">
              Availability Status
            </span>
            <div className="flex items-center gap-2 justify-center sm:justify-start">
              <button
                onClick={() => {
                  onAvailabilityChange("Available");
                  toast.success("Status set to Available");
                }}
                className={`px-4 py-1.5 rounded-full text-xs font-bold border-2 transition-all ${
                  availability === "Available"
                    ? "border-emerald-500 bg-emerald-50 text-emerald-600 shadow-sm"
                    : "border-oatmeal/40 bg-white text-blue-fantastic/70 hover:bg-surface-inset"
                }`}
              >
                Available
              </button>
              <button
                onClick={() => {
                  onAvailabilityChange("Onsite");
                  toast.success("Status set to Onsite");
                }}
                className={`px-4 py-1.5 rounded-full text-xs font-bold border-2 transition-all ${
                  availability === "Onsite"
                    ? "border-blue-fantastic bg-blue-fantastic/5 text-blue-fantastic shadow-sm"
                    : "border-oatmeal/40 bg-white text-blue-fantastic/70 hover:bg-surface-inset"
                }`}
              >
                Onsite
              </button>
              <button
                onClick={() => {
                  onAvailabilityChange("Leave");
                  toast.success("Status set to On Leave");
                }}
                className={`px-4 py-1.5 rounded-full text-xs font-bold border-2 transition-all ${
                  availability === "Leave"
                    ? "border-truffle-trouble bg-truffle-trouble/5 text-truffle-trouble shadow-sm"
                    : "border-oatmeal/40 bg-white text-blue-fantastic/70 hover:bg-surface-inset"
                }`}
              >
                Leave
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
