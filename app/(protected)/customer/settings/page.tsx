"use client"

import { useState } from "react"
import SettingHeader from "@/components/Customer/Setting/setting-header"
import GeneralSettings from "@/components/Customer/Setting/general-settings"
import NotificationSettings from "@/components/Customer/Setting/notification-settings"
import SecuritySettings from "@/components/Customer/Setting/security-settings"
import PrivacySettings from "@/components/Customer/Setting/privacy-settings"
import BillingSettings from "@/components/Customer/Setting/billing-settings"

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
    <div className="flex flex-col gap-4 w-full px-5 py-1">
      <SettingHeader activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="w-full mt-2 flex justify-center">
        {renderActiveSetting()}
      </div>
    </div>
  )
}