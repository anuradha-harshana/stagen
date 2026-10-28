"use client";

import { useState } from "react";
import { User, Phone, MapPin, Globe, Clock, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { CustomerProfile } from "@/lib/types/types";
import { saveCustomerProfileAction } from "@/lib/customer/actions";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: CustomerProfile;
  onProfileUpdated: (updated: CustomerProfile) => void;
}

export default function EditProfileModal({
  isOpen,
  onClose,
  profile,
  onProfileUpdated,
}: EditProfileModalProps) {
  const [fullName, setFullName] = useState(profile.fullName || "");
  const [phone, setPhone] = useState(profile.phone || "");
  const [homeAddress, setHomeAddress] = useState(profile.homeAddress || "");
  const [preferredLanguage, setPreferredLanguage] = useState(
    profile.preferredLanguage || "English"
  );
  const [timeZone, setTimeZone] = useState(
    profile.timeZone || "(AEST) Australia/Sydney"
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      toast.error("Full name cannot be empty");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await saveCustomerProfileAction({
        fullName: fullName.trim(),
        phone: phone.trim(),
        homeAddress: homeAddress.trim(),
        preferredLanguage,
        timeZone,
      });

      if (res.success && res.profile) {
        toast.success("Profile updated successfully!");
        onProfileUpdated(res.profile);
        onClose();
      } else {
        toast.error(res.error || "Failed to save profile changes");
      }
    } catch (err: any) {
      toast.error(err.message || "An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-xl bg-truffle-trouble/10 flex items-center justify-center">
              <User className="h-4 w-4 text-truffle-trouble" />
            </div>
            <DialogTitle className="text-blue-fantastic text-base font-bold font-sans">
              Edit Personal Information
            </DialogTitle>
          </div>
          <DialogDescription className="text-blue-fantastic/60 text-xs">
            Update your personal details below. Changes will be saved to your account.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2 font-sans">
          {/* Full Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-blue-fantastic/70 uppercase tracking-wider block">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-3 top-2.5 h-4 w-4 text-blue-fantastic/40" />
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                placeholder="e.g. Anuradha Jayasuriya"
                className="w-full h-10 pl-9 pr-3 rounded-xl border border-blue-fantastic/15 bg-white text-blue-fantastic text-sm outline-none transition-all duration-200 focus-visible:border-truffle-trouble focus-visible:ring-2 focus-visible:ring-truffle-trouble/20 font-sans"
              />
            </div>
          </div>

          {/* Email (Read-Only) */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-blue-fantastic/70 uppercase tracking-wider block">
              Email Address (Account Credential)
            </label>
            <input
              type="email"
              value={profile.email || ""}
              disabled
              className="w-full h-10 px-3 rounded-xl border border-blue-fantastic/10 bg-blue-fantastic/5 text-blue-fantastic/60 text-sm outline-none cursor-not-allowed font-sans"
            />
          </div>

          {/* Phone */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-blue-fantastic/70 uppercase tracking-wider block">
              Contact Number
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-2.5 h-4 w-4 text-blue-fantastic/40" />
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+61 412 345 678"
                className="w-full h-10 pl-9 pr-3 rounded-xl border border-blue-fantastic/15 bg-white text-blue-fantastic text-sm outline-none transition-all duration-200 focus-visible:border-truffle-trouble focus-visible:ring-2 focus-visible:ring-truffle-trouble/20 font-sans"
              />
            </div>
          </div>

          {/* Home Address */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-blue-fantastic/70 uppercase tracking-wider block">
              Home Address
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-blue-fantastic/40" />
              <input
                type="text"
                value={homeAddress}
                onChange={(e) => setHomeAddress(e.target.value)}
                placeholder="12 Willow Street, Melbourne, VIC 3000"
                className="w-full h-10 pl-9 pr-3 rounded-xl border border-blue-fantastic/15 bg-white text-blue-fantastic text-sm outline-none transition-all duration-200 focus-visible:border-truffle-trouble focus-visible:ring-2 focus-visible:ring-truffle-trouble/20 font-sans"
              />
            </div>
          </div>

          {/* Language & Time Zone */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-blue-fantastic/70 uppercase tracking-wider block">
                Preferred Language
              </label>
              <div className="relative">
                <Globe className="absolute left-3 top-2.5 h-4 w-4 text-blue-fantastic/40" />
                <select
                  value={preferredLanguage}
                  onChange={(e) => setPreferredLanguage(e.target.value)}
                  className="w-full h-10 pl-9 pr-3 rounded-xl border border-blue-fantastic/15 bg-white text-blue-fantastic text-sm outline-none transition-all duration-200 focus-visible:border-truffle-trouble focus-visible:ring-2 focus-visible:ring-truffle-trouble/20 font-sans"
                >
                  <option value="English">English</option>
                  <option value="Spanish">Español (Spanish)</option>
                  <option value="French">Français (French)</option>
                  <option value="German">Deutsch (German)</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-blue-fantastic/70 uppercase tracking-wider block">
                Time Zone
              </label>
              <div className="relative">
                <Clock className="absolute left-3 top-2.5 h-4 w-4 text-blue-fantastic/40" />
                <select
                  value={timeZone}
                  onChange={(e) => setTimeZone(e.target.value)}
                  className="w-full h-10 pl-9 pr-3 rounded-xl border border-blue-fantastic/15 bg-white text-blue-fantastic text-sm outline-none transition-all duration-200 focus-visible:border-truffle-trouble focus-visible:ring-2 focus-visible:ring-truffle-trouble/20 font-sans"
                >
                  <option value="(AEST) Australia/Sydney">(AEST) Australia/Sydney</option>
                  <option value="(AWST) Australia/Perth">(AWST) Australia/Perth</option>
                  <option value="(ACST) Australia/Adelaide">(ACST) Australia/Adelaide</option>
                  <option value="(UTC) UTC">(UTC) UTC</option>
                </select>
              </div>
            </div>
          </div>

          <DialogFooter className="pt-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
              className="border-blue-fantastic/20 text-blue-fantastic hover:bg-blue-fantastic/10 text-xs font-semibold"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-truffle-trouble text-palladian hover:bg-truffle-trouble/85 text-xs font-semibold shadow-sm"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Changes"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
