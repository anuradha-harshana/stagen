"use client";

import { useCompanySection, DataState } from "@/components/supervisor/useSupervisorData";
import React, { useState, useEffect } from "react";
import {
  Save,
  RotateCcw,
  Building2,
  Mail,
  Phone,
  Globe,
  MapPin,
  Clock,
  DollarSign,
  FileText,
  Upload,
  CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";
import PageHeader from "@/components/shared/PageHeader";
import { PAGE_SHELL_CLASS } from "@/components/shared/pageShell";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CompanyProfileData } from "@/lib/company/companyProfile";

const INITIAL_PROFILE = { companyName: "", abn: "", businessAddress: "", contactNumber: "", primaryEmail: "", websiteUrl: "", timezone: "Australia/Sydney", defaultCurrency: "AUD ($)", logoUrl: "" };

interface CompanyProfileClientProps {
  initialProfile?: CompanyProfileData | null;
}

  const stored = useCompanySection("profile", INITIAL_PROFILE);
  useEffect(() => { setProfile(stored.data); }, [stored.data]);
  // Form State
  const [profile, setProfile] = useState(INITIAL_PROFILE);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(!initialProfile);
  const [hasChanges, setHasChanges] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch from API route if initialProfile wasn't supplied
  useEffect(() => {
    if (!initialProfile) {
      setIsLoading(true);
      fetch("/api/company/profile")
        .then((res) => {
          if (!res.ok) throw new Error("Failed to load profile");
          return res.json();
        })
        .then((data: CompanyProfileData) => {
          if (data && data.companyId) {
            setProfile(data);
            setSavedProfile(data);
          }
        })
        .catch((err) => {
          console.error("Error fetching company profile:", err);
          toast.error("Could not fetch latest profile from server.");
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [initialProfile]);

  // Handle Input Changes
  const handleChange = (field: keyof CompanyProfileData, value: string) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  // Save Changes Handler
  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSaving(true);

    if (await stored.save(profile)) setHasChanges(false);
    setIsSaving(false);
  };

  // Reset Changes Handler
  const handleReset = () => {
    setProfile(stored.data);
    setHasChanges(false);
    toast.info("Form reset to original company details.");
  };

  if (stored.loading || stored.error) return <DataState loading={stored.loading} error={stored.error} />;
  return (
    <div className={PAGE_SHELL_CLASS}>
      <PageHeader
        icon={<Building2 className="h-5 w-5 text-burning-flame" />}
        title="Company Profile"
        subtitle="Manage your company details and core settings."
        rightContent={
          <div className="flex items-center gap-3">
            {hasChanges && (
              <Button
                type="button"
                variant="outline"
                onClick={handleReset}
                className="rounded-xl border-blue-fantastic/20 text-blue-fantastic hover:bg-blue-fantastic/5 text-xs font-semibold h-10 px-4"
              >
                <RotateCcw className="mr-1.5 h-3.5 w-3.5" />
                Reset
              </Button>
            )}

            <Button
              type="button"
              onClick={() => handleSave()}
              disabled={isSaving}
              className="bg-truffle-trouble hover:bg-truffle-trouble/90 text-palladian font-semibold rounded-xl h-10 px-5 shadow-sm text-xs sm:text-sm"
            >
              {isSaving ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 border-2 border-palladian border-t-transparent rounded-full animate-spin" />
                  Saving...
                </span>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-1.5" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        }
      />

      {/* ================= MAIN PROFILE FORM CARD ================= */}
      <Card className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-blue-fantastic/15">
        <CardContent className="p-0">
          <form onSubmit={handleSave} className="space-y-6">

            {/* Top Logo & Branding Banner */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-gray-100 gap-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16 border-2 border-gray-100 shadow-xs bg-[#eee9df]">
                  <AvatarImage src={profile.logoUrl} alt="Company Logo" />
                  <AvatarFallback className="bg-blue-fantastic text-white font-bold text-lg">
                    {profile.companyName ? profile.companyName.slice(0, 2).toUpperCase() : "ST"}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-sans font-semibold text-blue-fantastic">
                      {profile.companyName || "Company profile"}
                    </h2>
                    <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-none text-[11px] font-medium">
                      Company Details
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">
                    ABN: {profile.abn || "Not recorded"}
                  </p>
                </div>
              </div>

              <div>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleLogoFileChange}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="rounded-xl border-gray-200 text-xs text-blue-fantastic hover:bg-gray-50 h-9"
                >
                  <Upload className="mr-1.5 h-3.5 w-3.5" />
                  Change Logo
                </Button>
              </div>
            </div>

            {/* FORM FIELDS GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              {/* Field 1: Company Name */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-blue-fantastic flex items-center gap-1.5">
                  <Building2 className="h-3.5 w-3.5 text-gray-400" />
                  Company Name
                </label>
                <Input
                  type="text"
                  value={profile.companyName}
                  onChange={(e) => handleChange("companyName", e.target.value)}
                  placeholder="Enter company name"
                  className="rounded-xl border-gray-200 focus:border-blue-fantastic text-xs h-11 bg-white shadow-2xs"
                />
              </div>

              {/* Field 2: ABN / Registration No. */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-blue-fantastic flex items-center gap-1.5">
                  <FileText className="h-3.5 w-3.5 text-gray-400" />
                  ABN / Registration No.
                </label>
                <Input
                  type="text"
                  value={profile.abn}
                  onChange={(e) => handleChange("abn", e.target.value)}
                  placeholder="e.g. 98 123 456 789"
                  className="rounded-xl border-gray-200 focus:border-blue-fantastic text-xs h-11 bg-white shadow-2xs"
                />
              </div>

              {/* Field 3: Business Address (Full width across 2 cols) */}
              <div className="space-y-2 md:col-span-2">
                <label className="text-xs font-semibold text-blue-fantastic flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-gray-400" />
                  Business Address
                </label>
                <Input
                  type="text"
                  value={profile.businessAddress}
                  onChange={(e) => handleChange("businessAddress", e.target.value)}
                  placeholder="Street address, suburb, state, postcode"
                  className="rounded-xl border-gray-200 focus:border-blue-fantastic text-xs h-11 bg-white shadow-2xs"
                />
              </div>

              {/* Field 4: Contact Number */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-blue-fantastic flex items-center gap-1.5">
                  <Phone className="h-3.5 w-3.5 text-gray-400" />
                  Contact Number
                </label>
                <Input
                  type="text"
                  value={profile.contactNumber}
                  onChange={(e) => handleChange("contactNumber", e.target.value)}
                  placeholder="+61 3 9876 5432"
                  className="rounded-xl border-gray-200 focus:border-blue-fantastic text-xs h-11 bg-white shadow-2xs"
                />
              </div>

              {/* Field 5: Primary Email */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-blue-fantastic flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5 text-gray-400" />
                  Primary Email
                </label>
                <Input
                  type="email"
                  value={profile.primaryEmail}
                  onChange={(e) => handleChange("primaryEmail", e.target.value)}
                  placeholder="admin@company.com.au"
                  className="rounded-xl border-gray-200 focus:border-blue-fantastic text-xs h-11 bg-white shadow-2xs"
                />
              </div>

              {/* Field 6: Website URL */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-blue-fantastic flex items-center gap-1.5">
                  <Globe className="h-3.5 w-3.5 text-gray-400" />
                  Website URL
                </label>
                <Input
                  type="text"
                  value={profile.websiteUrl}
                  onChange={(e) => handleChange("websiteUrl", e.target.value)}
                  placeholder="https://yourwebsite.com.au"
                  className="rounded-xl border-gray-200 focus:border-blue-fantastic text-xs h-11 bg-white shadow-2xs"
                />
              </div>

              {/* Field 7: Timezone */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-blue-fantastic flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-gray-400" />
                  Timezone
                </label>
                <Select
                  value={profile.timezone}
                  onValueChange={(val) => handleChange("timezone", val)}
                >
                  <SelectTrigger className="rounded-xl border-gray-200 focus:border-blue-fantastic text-xs h-11 bg-white shadow-2xs">
                    <SelectValue placeholder="Select Timezone" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl text-xs">
                    <SelectItem value="Australia/Melbourne">Australia/Melbourne (AEST, UTC+10)</SelectItem>
                    <SelectItem value="Australia/Sydney">Australia/Sydney (AEDT, UTC+11)</SelectItem>
                    <SelectItem value="Australia/Brisbane">Australia/Brisbane (AEST, UTC+10)</SelectItem>
                    <SelectItem value="Australia/Perth">Australia/Perth (AWST, UTC+8)</SelectItem>
                    <SelectItem value="Australia/Adelaide">Australia/Adelaide (ACDT, UTC+10:30)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Field 8: Default Currency */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-blue-fantastic flex items-center gap-1.5">
                  <DollarSign className="h-3.5 w-3.5 text-gray-400" />
                  Default Currency
                </label>
                <Select
                  value={profile.defaultCurrency}
                  onValueChange={(val) => handleChange("defaultCurrency", val)}
                >
                  <SelectTrigger className="rounded-xl border-gray-200 focus:border-blue-fantastic text-xs h-11 bg-white shadow-2xs">
                    <SelectValue placeholder="Select Currency" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl text-xs">
                    <SelectItem value="AUD ($)">AUD ($) - Australian Dollar</SelectItem>
                    <SelectItem value="USD ($)">USD ($) - US Dollar</SelectItem>
                    <SelectItem value="NZD ($)">NZD ($) - New Zealand Dollar</SelectItem>
                    <SelectItem value="EUR (€)">EUR (€) - Euro</SelectItem>
                    <SelectItem value="GBP (£)">GBP (£) - British Pound</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Bottom Actions Bar */}
            <div className="pt-6 border-t border-gray-100 flex items-center justify-between">
              <span className="text-xs text-gray-400 flex items-center gap-1">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                Save changes to update your company profile
              </span>

              <Button
                type="submit"
                disabled={isSaving}
                className="bg-truffle-trouble hover:bg-truffle-trouble/90 text-palladian font-semibold rounded-xl h-10 px-6 shadow-sm text-xs sm:text-sm"
              >
                {isSaving ? "Saving Changes..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
