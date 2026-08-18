"use client"

import { Lock, ShieldCheck, Laptop, LogOut, ChevronRight } from "lucide-react"
import { toast } from "sonner"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function SecuritySettings() {
  const handleItemClick = (label: string) => {
    toast.info(`Clicked: ${label}`)
  }

  const handleLogoutAll = () => {
    toast.success("Successfully logged out from all devices!")
  }

  return (
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
          onClick={() => handleItemClick("Change Password")}
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
        <button
          onClick={() => handleItemClick("Two-Factor Authentication")}
          className="w-full text-left flex items-center justify-between rounded-2xl border border-blue-fantastic/15 bg-white p-4 hover:bg-blue-fantastic/5 transition-all duration-200 shadow-xs cursor-pointer group"
        >
          <div className="flex items-center gap-3.5">
            <div className="h-9 w-9 rounded-xl bg-blue-fantastic/5 border border-blue-fantastic/10 flex items-center justify-center shrink-0">
              <ShieldCheck className="h-4 w-4 text-truffle-trouble group-hover:scale-105 transition-transform" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-blue-fantastic">
                Two-Factor Authentication
              </h4>
              <p className="text-xs text-blue-fantastic/60 mt-0.5">
                Add an extra layer of security
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <Badge
              variant="outline"
              className="bg-emerald-500/10 text-emerald-700 border-emerald-500/25 text-xs font-semibold px-2 py-0.5 rounded-lg"
            >
              Enabled
            </Badge>
            <ChevronRight className="h-4 w-4 text-blue-fantastic/40 group-hover:text-blue-fantastic transition-colors" />
          </div>
        </button>


        {/* Logout All Devices */}
        <button
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
                Sign out from all devices
              </p>
            </div>
          </div>
          <ChevronRight className="h-4 w-4 text-red-500/40 group-hover:text-red-600 transition-colors" />
        </button>
      </CardContent>
    </Card>
  )
}
