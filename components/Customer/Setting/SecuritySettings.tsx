"use client"

import { useState, useEffect } from "react"
import {
  Lock,
  ShieldCheck,
  LogOut,
  ChevronRight,
  KeyRound,
  Eye,
  EyeOff,
  Loader2,
} from "lucide-react"
import { toast } from "sonner"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { CustomerSettings } from "@/lib/types/types"
import { saveCustomerSettingsAction, changePasswordAction } from "@/lib/customer/actions"

interface SecuritySettingsProps {
  settings?: CustomerSettings | null
  onUpdate?: (updated: CustomerSettings) => void
}

export default function SecuritySettings({ settings, onUpdate }: SecuritySettingsProps = {}) {
  const [twoFactor, setTwoFactor] = useState(
    settings?.security?.twoFactorEnabled ?? true
  )
  const [isUpdating2FA, setIsUpdating2FA] = useState(false)

  // Password Modal State
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false)
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [isSubmittingPassword, setIsSubmittingPassword] = useState(false)

  useEffect(() => {
    if (settings?.security) {
      setTwoFactor(settings.security.twoFactorEnabled ?? true)
    }
  }, [settings])

  const handleToggle2FA = async () => {
    const nextVal = !twoFactor
    setIsUpdating2FA(true)
    try {
      const res = await saveCustomerSettingsAction({
        security: {
          twoFactorEnabled: nextVal,
        },
      })

      if (res.success && res.settings) {
        setTwoFactor(nextVal)
        onUpdate?.(res.settings)
        toast.success(
          nextVal
            ? "Two-Factor Authentication has been enabled."
            : "Two-Factor Authentication has been disabled."
        )
      } else {
        toast.error(res.error || "Failed to update Two-Factor Authentication")
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to update security settings")
    } finally {
      setIsUpdating2FA(false)
    }
  }

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!currentPassword) {
      toast.error("Please enter your current password")
      return
    }
    if (newPassword.length < 8) {
      toast.error("New password must be at least 8 characters long")
      return
    }
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match")
      return
    }

    setIsSubmittingPassword(true)
    try {
      const res = await changePasswordAction(currentPassword, newPassword)

      if (res.success) {
        toast.success("Password changed successfully!")
        setCurrentPassword("")
        setNewPassword("")
        setConfirmPassword("")
        setIsPasswordModalOpen(false)
      } else {
        toast.error(res.error || "Failed to update password")
      }
    } catch (err: any) {
      toast.error(err.message || "An unexpected error occurred")
    } finally {
      setIsSubmittingPassword(false)
    }
  }

  const handleLogoutAll = () => {
    toast.success("Successfully logged out from other active sessions!")
  }

  return (
    <>
      <Card className="bg-white border border-blue-fantastic/15 shadow-sm font-sans w-[1000px] max-w-2xl">
        <CardHeader className="border-b border-blue-fantastic/10 pb-4">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-xl bg-truffle-trouble/10 flex items-center justify-center">
              <Lock className="h-4 w-4 text-truffle-trouble" />
            </div>
            <CardTitle className="text-blue-fantastic text-base font-bold font-sans">
              Security Settings
            </CardTitle>
          </div>
        </CardHeader>

        <CardContent className="pt-6 space-y-4">
          {/* Change Password */}
          <button
            type="button"
            onClick={() => setIsPasswordModalOpen(true)}
            className="w-full text-left flex items-center justify-between rounded-2xl border border-blue-fantastic/15 bg-white p-4 hover:bg-blue-fantastic/5 transition-all duration-200 shadow-xs cursor-pointer group"
          >
            <div className="flex items-center gap-3.5">
              <div className="h-9 w-9 rounded-xl bg-blue-fantastic/5 border border-blue-fantastic/10 flex items-center justify-center shrink-0">
                <Lock className="h-4 w-4 text-truffle-trouble group-hover:scale-105 transition-transform" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-blue-fantastic">
                  Change Password
                </h4>
                <p className="text-xs text-blue-fantastic/60 mt-0.5">
                  Update your account password
                </p>
              </div>
            </div>
            <ChevronRight className="h-4 w-4 text-blue-fantastic/40 group-hover:text-blue-fantastic transition-colors" />
          </button>

          {/* Two-Factor Authentication */}
          <div className="w-full flex items-center justify-between rounded-2xl border border-blue-fantastic/15 bg-white p-4 shadow-xs">
            <div className="flex items-center gap-3.5">
              <div className="h-9 w-9 rounded-xl bg-blue-fantastic/5 border border-blue-fantastic/10 flex items-center justify-center shrink-0">
                <ShieldCheck className="h-4 w-4 text-truffle-trouble" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-blue-fantastic">
                  Two-Factor Authentication
                </h4>
                <p className="text-xs text-blue-fantastic/60 mt-0.5">
                  Add an extra layer of security to your customer account
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge
                variant="outline"
                className={
                  twoFactor
                    ? "bg-emerald-500/10 text-emerald-700 border-emerald-500/25 text-xs font-semibold px-2 py-0.5 rounded-lg"
                    : "bg-amber-500/10 text-amber-700 border-amber-500/25 text-xs font-semibold px-2 py-0.5 rounded-lg"
                }
              >
                {twoFactor ? "Enabled" : "Disabled"}
              </Badge>

              <button
                type="button"
                role="switch"
                aria-checked={twoFactor}
                disabled={isUpdating2FA}
                onClick={handleToggle2FA}
                className={`relative inline-flex h-5.5 w-10.5 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  twoFactor ? "bg-truffle-trouble" : "bg-blue-fantastic/20"
                } ${isUpdating2FA ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <span
                  className={`pointer-events-none inline-block h-4.5 w-4.5 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                    twoFactor ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Logout All Devices */}
          <button
            type="button"
            onClick={handleLogoutAll}
            className="w-full text-left flex items-center justify-between rounded-2xl border border-red-500/20 bg-white p-4 hover:bg-red-50/30 dark:hover:bg-red-950/10 transition-all duration-200 shadow-xs cursor-pointer group"
          >
            <div className="flex items-center gap-3.5">
              <div className="h-9 w-9 rounded-xl bg-red-500/10 border border-red-500/15 flex items-center justify-center shrink-0">
                <LogOut className="h-4 w-4 text-red-600 group-hover:scale-105 transition-transform" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-red-600">
                  Logout All Devices
                </h4>
                <p className="text-xs text-red-500/80 mt-0.5">
                  Sign out from all other active browser sessions
                </p>
              </div>
            </div>
            <ChevronRight className="h-4 w-4 text-red-500/40 group-hover:text-red-600 transition-colors" />
          </button>
        </CardContent>
      </Card>

      {/* Change Password Modal */}
      <Dialog
        open={isPasswordModalOpen}
        onOpenChange={(open) => {
          if (!open) {
            setCurrentPassword("")
            setNewPassword("")
            setConfirmPassword("")
            setIsPasswordModalOpen(false)
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

          <form onSubmit={handlePasswordSubmit} className="space-y-4 pt-2 font-sans">
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
                onClick={() => setIsPasswordModalOpen(false)}
                disabled={isSubmittingPassword}
                className="border-blue-fantastic/20 text-blue-fantastic hover:bg-blue-fantastic/10 text-xs font-semibold cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmittingPassword}
                className="bg-truffle-trouble text-palladian hover:bg-truffle-trouble/85 text-xs font-semibold shadow-sm cursor-pointer"
              >
                {isSubmittingPassword ? (
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
  )
}
