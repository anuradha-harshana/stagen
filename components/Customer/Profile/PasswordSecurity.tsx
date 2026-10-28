"use client";

import { useState } from "react";
import { Lock, ShieldCheck, KeyRound, Loader2, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { CustomerProfile } from "@/lib/types/types";
import { changePasswordAction } from "@/lib/customer/actions";

interface PasswordSecurityProps {
  profile: CustomerProfile | null;
}

export default function PasswordSecurity({ profile }: PasswordSecurityProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Compute password status text
  const getPasswordStatusText = () => {
    if (!profile?.passwordUpdatedAt) {
      return "Default password active";
    }
    try {
      const updatedDate = new Date(profile.passwordUpdatedAt);
      const diffDays = Math.floor(
        (Date.now() - updatedDate.getTime()) / (1000 * 60 * 60 * 24)
      );
      if (diffDays <= 0) return "Updated today";
      if (diffDays === 1) return "Updated yesterday";
      if (diffDays < 30) return `Updated ${diffDays} days ago`;
      return `Updated on ${updatedDate.toLocaleDateString("en-AU", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })}`;
    } catch {
      return "Secured";
    }
  };

  const handleResetForm = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setShowCurrent(false);
    setShowNew(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentPassword) {
      toast.error("Please enter your current password");
      return;
    }
    if (newPassword.length < 8) {
      toast.error("New password must be at least 8 characters long");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await changePasswordAction(currentPassword, newPassword);

      if (res.success) {
        toast.success("Password changed successfully!");
        handleResetForm();
        setIsModalOpen(false);
      } else {
        toast.error(res.error || "Failed to update password");
      }
    } catch (err: any) {
      toast.error(err.message || "An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Card className="bg-white border border-blue-fantastic/15 shadow-sm font-sans">
        <CardHeader className="border-b border-blue-fantastic/10 pb-3">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-xl bg-truffle-trouble/10 flex items-center justify-center">
              <Lock className="h-4 w-4 text-truffle-trouble" />
            </div>
            <div>
              <CardTitle className="text-blue-fantastic text-base font-bold font-sans">
                Password & Security
              </CardTitle>
              <CardDescription className="text-blue-fantastic/60 text-xs font-medium font-sans mt-0.5">
                Keep your account credentials safe
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="pt-4 space-y-3">
          <div className="flex items-center justify-between p-3 rounded-xl bg-blue-fantastic/5 border border-blue-fantastic/10">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-truffle-trouble" />
              <span className="text-xs font-semibold text-blue-fantastic">Password status</span>
            </div>
            <span className="text-xs text-blue-fantastic/70 font-medium">
              {getPasswordStatusText()}
            </span>
          </div>

          <Button
            onClick={() => {
              handleResetForm();
              setIsModalOpen(true);
            }}
            className="w-full bg-truffle-trouble text-palladian hover:bg-truffle-trouble/85 font-semibold text-xs h-9 justify-center gap-2 shadow-sm cursor-pointer"
          >
            <Lock className="h-3.5 w-3.5" />
            Change Password
          </Button>
        </CardContent>
      </Card>

      {/* Change Password Dialog */}
      <Dialog
        open={isModalOpen}
        onOpenChange={(open) => {
          if (!open) {
            handleResetForm();
            setIsModalOpen(false);
          }
        }}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-xl bg-truffle-trouble/10 flex items-center justify-center">
                <KeyRound className="h-4 w-4 text-truffle-trouble" />
              </div>
              <DialogTitle className="text-blue-fantastic text-base font-bold font-sans">
                Change Password
              </DialogTitle>
            </div>
            <DialogDescription className="text-blue-fantastic/60 text-xs">
              Enter your current password and choose a secure new password.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 pt-2 font-sans">
            {/* Current Password */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-blue-fantastic/70 uppercase tracking-wider block">
                Current Password
              </label>
              <div className="relative">
                <input
                  type={showCurrent ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                  required
                  className="w-full h-10 pl-3 pr-9 rounded-xl border border-blue-fantastic/15 bg-white text-blue-fantastic text-sm outline-none transition-all duration-200 focus-visible:border-truffle-trouble focus-visible:ring-2 focus-visible:ring-truffle-trouble/20 font-sans"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrent(!showCurrent)}
                  className="absolute right-3 top-2.5 text-blue-fantastic/40 hover:text-blue-fantastic"
                >
                  {showCurrent ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-blue-fantastic/70 uppercase tracking-wider block">
                New Password
              </label>
              <div className="relative">
                <input
                  type={showNew ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Minimum 8 characters"
                  required
                  minLength={8}
                  className="w-full h-10 pl-3 pr-9 rounded-xl border border-blue-fantastic/15 bg-white text-blue-fantastic text-sm outline-none transition-all duration-200 focus-visible:border-truffle-trouble focus-visible:ring-2 focus-visible:ring-truffle-trouble/20 font-sans"
                />
                <button
                  type="button"
                  onClick={() => setShowNew(!showNew)}
                  className="absolute right-3 top-2.5 text-blue-fantastic/40 hover:text-blue-fantastic"
                >
                  {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Confirm New Password */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-blue-fantastic/70 uppercase tracking-wider block">
                Confirm New Password
              </label>
              <input
                type={showNew ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter new password"
                required
                className="w-full h-10 px-3 rounded-xl border border-blue-fantastic/15 bg-white text-blue-fantastic text-sm outline-none transition-all duration-200 focus-visible:border-truffle-trouble focus-visible:ring-2 focus-visible:ring-truffle-trouble/20 font-sans"
              />
            </div>

            <DialogFooter className="pt-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  handleResetForm();
                  setIsModalOpen(false);
                }}
                disabled={isSubmitting}
                className="border-blue-fantastic/20 text-blue-fantastic hover:bg-blue-fantastic/10 text-xs font-semibold cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-truffle-trouble text-palladian hover:bg-truffle-trouble/85 text-xs font-semibold shadow-sm cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                    Updating...
                  </>
                ) : (
                  "Update Password"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}