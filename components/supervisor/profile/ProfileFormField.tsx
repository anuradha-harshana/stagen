import React from "react";
import { AlertCircle } from "lucide-react";

interface ProfileFormFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  required?: boolean;
}

export const ProfileFormField = React.forwardRef<HTMLInputElement, ProfileFormFieldProps>(
  ({ label, error, required, className = "", ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1">
        <label className="text-[10px] font-bold text-oatmeal uppercase tracking-wider">
          {label} {required && <span className="text-rose-400">*</span>}
        </label>
        <input
          ref={ref}
          {...props}
          className={`px-3.5 py-2 text-sm bg-white border-2 rounded-2xl text-blue-fantastic outline-none transition-all font-sans font-medium ${error
              ? "border-rose-400 focus:border-rose-500 bg-rose-50/30"
              : "border-oatmeal/35 focus:border-[#ffb162]"
            } ${className}`}
        />
        {error && (
          <div className="flex items-center gap-1 mt-1">
            <AlertCircle className="h-3 w-3 text-rose-500 shrink-0" />
            <span className="text-[10px] text-rose-500 font-semibold">{error}</span>
          </div>
        )}
      </div>
    );
  }
);

ProfileFormField.displayName = "ProfileFormField";
