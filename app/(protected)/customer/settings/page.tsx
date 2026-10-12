"use client"

import { useState } from "react"
import SettingHeader from "@/components/Customer/Setting/SettingHeader"
import GeneralSettings from "@/components/Customer/Setting/GeneralSettings"
import NotificationSettings from "@/components/Customer/Setting/NotificationSettings"
import SecuritySettings from "@/components/Customer/Setting/SecuritySettings"
import PrivacySettings from "@/components/Customer/Setting/PrivacySettings"
import BillingSettings from "@/components/Customer/Setting/BillingSettings"

import { PAGE_SHELL_CLASS } from "@/components/shared/pageShell"

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("General")

  const renderActiveSetting = () => {
    switch (activeTab) {
      case "General":
        return <GeneralSettings />
      case "Notifications":
        return <NotificationSettings />
      case "Security":
        return <SecuritySettings />
      case "Privacy":
        return <PrivacySettings />
      case "Billing":
        return <BillingSettings />

      default:
        return <GeneralSettings />
    }
  }

  return (
    <div className={PAGE_SHELL_CLASS}>
      <SettingHeader activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="w-full mt-2 flex justify-center">
        {renderActiveSetting()}
      </div>
    </div>
  )
}