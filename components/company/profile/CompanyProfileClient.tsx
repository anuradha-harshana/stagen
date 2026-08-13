"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
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
  Bell
} from "lucide-react";
import { toast } from "sonner";

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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const INITIAL_PROFILE = {
  companyName: "STAGEN Constructions",
  abn: "98 123 456 789",
  businessAddress: "Level 14, 100 St Kilda Road, Melbourne VIC 3004",
  contactNumber: "+61 3 9876 5432",
  primaryEmail: "admin@stagen.com.au",
  websiteUrl: "https://stagen.com.au",
  timezone: "Australia/Melbourne",
  defaultCurrency: "AUD ($)",
  logoUrl: "/images/logo.png",
};

export default function CompanyProfileClient() {
  const router = useRouter();

  // Form State
  const [profile, setProfile] = useState(INITIAL_PROFILE);
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Handle Input Changes
  const handleChange = (field: keyof typeof INITIAL_PROFILE, value: string) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  // Save Changes Handler
  const handleSave = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setIsSaving(true);

    setTimeout(() => {
      setIsSaving(false);
      setHasChanges(false);
      toast.success("Company Profile updated successfully!", {
        description: "All core business details and regional preferences saved.",
      });
    }, 1000);
  };

  // Reset Changes Handler
  const handleReset = () => {
    setProfile(INITIAL_PROFILE);
    setHasChanges(false);
    toast.info("Form reset to original company details.");
  };

  return (
    <div className="w-full min-h-screen p-4 sm:p-6 md:p-8 space-y-6 md:space-y-8 font-sans text-blue-fantastic">
      {/* ================= HEADER SECTION ================= */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-sans font-semibold text-blue-fantastic tracking-tight">
            Company Profile
          </h1>
          <p className="text-sm text-blue-fantastic/70 mt-0.5">
            Manage your company details and core settings.
          </p>
        </div>

        {/* Action Header Controls */}
        <div className="flex items-center gap-3 self-end sm:self-auto">
          {hasChanges && (
            <Button
              type="button"
              variant="outline"
              onClick={handleReset}
              className="rounded-xl border-blue-fantastic/20 text-blue-fantastic hover:bg-blue-fantastic/5 text-xs font-medium h-10 px-4"
            >
              <RotateCcw className="mr-1.5 h-3.5 w-3.5" />
              Reset
            </Button>
          )}

          <Button
            type="button"
            onClick={() => handleSave()}
            disabled={isSaving}
            className="bg-[#ffb162] hover:bg-[#ffb162]/90 text-blue-fantastic font-semibold rounded-xl h-10 px-5 shadow-xs transition-all flex items-center gap-2 text-xs sm:text-sm"
          >
            {isSaving ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 border-2 border-blue-fantastic border-t-transparent rounded-full animate-spin" />
                Saving...
              </span>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Save Changes
              </>
            )}
          </Button>

          {/* User Avatar Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="h-9 w-9 rounded-full bg-blue-fantastic text-white text-xs font-semibold flex items-center justify-center border-2 border-white shadow-xs hover:opacity-90 transition-opacity">
                ST
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 rounded-2xl">
              <DropdownMenuLabel className="font-normal text-xs text-gray-500">
                STAGEN Admin
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => router.push("/company/dashboard")} className="cursor-pointer">
                <Building2 className="mr-2 h-4 w-4" /> Dashboard
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push("/company/settings")} className="cursor-pointer">
                <Globe className="mr-2 h-4 w-4" /> Settings
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* ================= MAIN PROFILE FORM CARD ================= */}
      <Card className="bg-palladian rounded-3xl p-6 sm:p-8 md:p-10 shadow-xs border border-blue-fantastic/15">
        <CardContent className="p-0">
          <form onSubmit={handleSave} className="space-y-6">
            
            {/* Top Logo & Branding Banner */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-gray-100 gap-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16 border-2 border-gray-100 shadow-xs bg-[#eee9df]">
                  <AvatarImage src={profile.logoUrl} alt="Company Logo" />
                  <AvatarFallback className="bg-blue-fantastic text-white font-bold text-lg">
                    ST
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-sans font-semibold text-blue-fantastic">
                      {profile.companyName || "STAGEN Constructions"}
                    </h2>
                    <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-none text-[11px] font-medium">
                      Verified Organization
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">
                    ABN: {profile.abn || "98 123 456 789"} • Enterprise Subscription
                  </p>
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                onClick={() => toast.info("Brand Logo update dialog opened.")}
                className="rounded-xl border-gray-200 text-xs text-blue-fantastic hover:bg-gray-50 h-9"
              >
                <Upload className="mr-1.5 h-3.5 w-3.5" />
                Change Logo
              </Button>
            </div>

            {/* FORM FIELDS GRID - Exact match to Figma layout */}
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
                  className="rounded-xl border-gray-200 focus:border-blue-fantastic text-xs h-11 bg-palladian shadow-2xs"
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
                  className="rounded-xl border-gray-200 focus:border-blue-fantastic text-xs h-11 bg-palladian shadow-2xs"
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
                  className="rounded-xl border-gray-200 focus:border-blue-fantastic text-xs h-11 bg-palladian shadow-2xs"
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
                  className="rounded-xl border-gray-200 focus:border-blue-fantastic text-xs h-11 bg-palladian shadow-2xs"
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
                  className="rounded-xl border-gray-200 focus:border-blue-fantastic text-xs h-11 bg-palladian shadow-2xs"
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
                  className="rounded-xl border-gray-200 focus:border-blue-fantastic text-xs h-11 bg-palladian shadow-2xs"
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
                  <SelectTrigger className="rounded-xl border-gray-200 focus:border-blue-fantastic text-xs h-11 bg-palladian shadow-2xs">
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
                  <SelectTrigger className="rounded-xl border-gray-200 focus:border-blue-fantastic text-xs h-11 bg-palladian shadow-2xs">
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
                Changes auto-synced across build site tools
              </span>

              <Button
                type="submit"
                disabled={isSaving}
                className="bg-[#ffb162] hover:bg-[#ffb162]/90 text-blue-fantastic font-semibold rounded-xl h-10 px-6 shadow-xs text-xs sm:text-sm"
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
