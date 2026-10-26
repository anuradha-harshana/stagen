"use client"

import { useState, useEffect } from "react"
import { Eye, Download, Trash2, ShieldAlert, Loader2 } from "lucide-react"
import { toast } from "sonner"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CustomerSettings } from "@/lib/types/types"
import { saveCustomerSettingsAction, exportCustomerDataAction } from "@/lib/customer/actions"

interface PrivacySettingsProps {
  settings?: CustomerSettings | null
  onUpdate?: (updated: CustomerSettings) => void
}

export default function PrivacySettings({ settings, onUpdate }: PrivacySettingsProps = {}) {
  const [profileVisibility, setProfileVisibility] = useState(
    settings?.privacy?.profileVisibility || "Only Construction Team"
  )
  const [isDownloading, setIsDownloading] = useState(false)
  const [isVisibilityModalOpen, setIsVisibilityModalOpen] = useState(false)
  const [selectedVisibility, setSelectedVisibility] = useState(profileVisibility)
  const [isSavingVisibility, setIsSavingVisibility] = useState(false)

  useEffect(() => {
    if (settings?.privacy) {
      setProfileVisibility(settings.privacy.profileVisibility || "Only Construction Team")
      setSelectedVisibility(settings.privacy.profileVisibility || "Only Construction Team")
    }
  }, [settings])

  const handleDownloadData = async () => {
    setIsDownloading(true)
    try {
      const res = await exportCustomerDataAction()
      if (res.success && res.data) {
        const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
          JSON.stringify(res.data, null, 2)
        )}`
        const downloadAnchor = document.createElement("a")
        downloadAnchor.setAttribute("href", jsonString)
        downloadAnchor.setAttribute("download", `customer_data_${new Date().toISOString().split("T")[0]}.json`)
        document.body.appendChild(downloadAnchor)
        downloadAnchor.click()
        downloadAnchor.remove()
        toast.success("Your customer data package has been downloaded!")
      } else {
        toast.error(res.error || "Failed to export customer data")
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to download data")
    } finally {
      setIsDownloading(false)
    }
  }

  const handleSaveVisibility = async () => {
    setIsSavingVisibility(true)
    try {
      const res = await saveCustomerSettingsAction({
        privacy: {
          profileVisibility: selectedVisibility,
          dataSharing: settings?.privacy?.dataSharing ?? false,
        },
      })

      if (res.success && res.settings) {
        setProfileVisibility(selectedVisibility)
        onUpdate?.(res.settings)
        toast.success("Profile visibility updated successfully!")
        setIsVisibilityModalOpen(false)
      } else {
        toast.error(res.error || "Failed to update profile visibility")
      }
    } catch (err: any) {
      toast.error(err.message || "An error occurred while saving")
    } finally {
      setIsSavingVisibility(false)
    }
  }

  const handleDeleteAccount = () => {
    toast.error("Account deletion request logged. An administrator will contact you.")
  }

  return (
    <>
      <Card className="bg-white border border-blue-fantastic/15 shadow-sm font-sans w-[1000px] max-w-2xl">
        <CardHeader className="border-b border-blue-fantastic/10 pb-4">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-xl bg-truffle-trouble/10 flex items-center justify-center">
              <ShieldAlert className="h-4 w-4 text-truffle-trouble" />
            </div>
            <CardTitle className="text-blue-fantastic text-base font-bold font-sans">
              Privacy Settings
            </CardTitle>
          </div>
        </CardHeader>

        <CardContent className="pt-6 space-y-4">
          {/* Profile Visibility */}
          <button
            type="button"
            onClick={() => {
              setSelectedVisibility(profileVisibility)
              setIsVisibilityModalOpen(true)
            }}
            className="w-full text-left flex items-center justify-between rounded-2xl border border-blue-fantastic/15 bg-white p-4 hover:bg-blue-fantastic/5 transition-all duration-200 shadow-xs cursor-pointer group"
          >
            <div className="flex items-center gap-3.5">
              <div className="h-9 w-9 rounded-xl bg-blue-fantastic/5 border border-blue-fantastic/10 flex items-center justify-center shrink-0">
                <Eye className="h-4 w-4 text-truffle-trouble group-hover:scale-105 transition-transform" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-blue-fantastic">
                  Profile Visibility
                </h4>
                <p className="text-xs text-blue-fantastic/60 mt-0.5">
                  Control who can see your profile information
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className="bg-blue-fantastic/5 text-blue-fantastic border-blue-fantastic/20 text-xs font-semibold px-2 py-0.5 rounded-lg"
              >
                {profileVisibility}
              </Badge>
            </div>
          </button>

          {/* Download My Data */}
          <button
            type="button"
            onClick={handleDownloadData}
            disabled={isDownloading}
            className="w-full text-left flex items-center justify-between rounded-2xl border border-blue-fantastic/15 bg-white p-4 hover:bg-blue-fantastic/5 transition-all duration-200 shadow-xs cursor-pointer group disabled:opacity-50"
          >
            <div className="flex items-center gap-3.5">
              <div className="h-9 w-9 rounded-xl bg-blue-fantastic/5 border border-blue-fantastic/10 flex items-center justify-center shrink-0">
                <Download className="h-4 w-4 text-truffle-trouble group-hover:scale-105 transition-transform" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-blue-fantastic">
                  Download My Data
                </h4>
                <p className="text-xs text-blue-fantastic/60 mt-0.5">
                  Download a JSON copy of your profile and settings data
                </p>
              </div>
            </div>
            <div>
              {isDownloading ? (
                <Loader2 className="h-4 w-4 text-truffle-trouble animate-spin" />
              ) : (
                <span className="text-xs font-semibold text-truffle-trouble group-hover:underline">
                  Export JSON
                </span>
              )}
            </div>
          </button>

          {/* Delete Account */}
          <button
            type="button"
            onClick={handleDeleteAccount}
            className="w-full text-left flex items-center justify-between rounded-2xl border border-red-500/20 bg-white p-4 hover:bg-red-50/30 dark:hover:bg-red-950/10 transition-all duration-200 shadow-xs cursor-pointer group"
          >
            <div className="flex items-center gap-3.5">
              <div className="h-9 w-9 rounded-xl bg-red-500/10 border border-red-500/15 flex items-center justify-center shrink-0">
                <Trash2 className="h-4 w-4 text-red-600 group-hover:scale-105 transition-transform" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-red-600">
                  Delete Account
                </h4>
                <p className="text-xs text-red-500/80 mt-0.5">
                  Permanently delete your account and personal data
                </p>
              </div>
            </div>
            <span className="text-xs font-semibold text-red-600 group-hover:underline">
              Request
            </span>
          </button>
        </CardContent>
      </Card>

      {/* Visibility Modal */}
      <Dialog open={isVisibilityModalOpen} onOpenChange={setIsVisibilityModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-xl bg-truffle-trouble/10 flex items-center justify-center">
                <Eye className="h-4 w-4 text-truffle-trouble" />
              </div>
              <DialogTitle className="text-blue-fantastic text-base font-bold font-sans">
                Profile Visibility
              </DialogTitle>
            </div>
            <DialogDescription className="text-blue-fantastic/60 text-xs">
              Choose who is permitted to view your customer profile and project association.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3 pt-2 font-sans">
            {[
              {
                id: "Only Construction Team",
                title: "Only Construction Team",
                desc: "Visible only to your assigned supervisors and builder company.",
              },
              {
                id: "Public",
                title: "Public Directory",
                desc: "Visible to other verified customers and project members.",
              },
              {
                id: "Private",
                title: "Strictly Private",
                desc: "Hidden from directories, accessible only to organization admins.",
              },
            ].map((option) => (
              <label
                key={option.id}
                onClick={() => setSelectedVisibility(option.id)}
                className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                  selectedVisibility === option.id
                    ? "border-truffle-trouble bg-truffle-trouble/5"
                    : "border-blue-fantastic/15 bg-white hover:bg-blue-fantastic/5"
                }`}
              >
                <input
                  type="radio"
                  name="visibility"
                  value={option.id}
                  checked={selectedVisibility === option.id}
                  onChange={() => setSelectedVisibility(option.id)}
                  className="mt-1 text-truffle-trouble focus:ring-truffle-trouble cursor-pointer"
                />
                <div>
                  <h5 className="text-xs font-bold text-blue-fantastic">{option.title}</h5>
                  <p className="text-xs text-blue-fantastic/60 mt-0.5">{option.desc}</p>
                </div>
              </label>
            ))}
          </div>

          <DialogFooter className="pt-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsVisibilityModalOpen(false)}
              disabled={isSavingVisibility}
              className="border-blue-fantastic/20 text-blue-fantastic hover:bg-blue-fantastic/10 text-xs font-semibold cursor-pointer"
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleSaveVisibility}
              disabled={isSavingVisibility}
              className="bg-truffle-trouble text-palladian hover:bg-truffle-trouble/85 text-xs font-semibold shadow-sm cursor-pointer"
            >
              {isSavingVisibility ? (
                <>
                  <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Visibility"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
