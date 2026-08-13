"use client"

import { Eye, Download, Trash2, ChevronRight, ShieldAlert } from "lucide-react"
import { toast } from "sonner"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function PrivacySettings() {
  const handleItemClick = (label: string) => {
    toast.info(`Clicked: ${label}`)
  }

  const handleDeleteAccount = () => {
    toast.error("Account deletion requested. Please check your email to confirm.")
  }

  return (
    <Card className="bg-palladian border border-blue-fantastic/15 shadow-sm font-sans w-[1000px] max-w-2xl">
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
          onClick={() => handleItemClick("Profile Visibility")}
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
          <ChevronRight className="h-4 w-4 text-blue-fantastic/40 group-hover:text-blue-fantastic transition-colors" />
        </button>

        {/* Download My Data */}
        <button
          onClick={() => handleItemClick("Download My Data")}
          className="w-full text-left flex items-center justify-between rounded-2xl border border-blue-fantastic/15 bg-white p-4 hover:bg-blue-fantastic/5 transition-all duration-200 shadow-xs cursor-pointer group"
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
                Download a copy of your data
              </p>
            </div>
          </div>
          <ChevronRight className="h-4 w-4 text-blue-fantastic/40 group-hover:text-blue-fantastic transition-colors" />
        </button>

        {/* Delete Account */}
        <button
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
                Permanently delete your account and data
              </p>
            </div>
          </div>
          <ChevronRight className="h-4 w-4 text-red-500/40 group-hover:text-red-600 transition-colors" />
        </button>
      </CardContent>
    </Card>
  )
}
