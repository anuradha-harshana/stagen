"use client"

import { useState } from "react"
import SettingHeader from "@/components/supervisor/setting/setting-header"
import GeneralSettings from "@/components/supervisor/setting/general-settings"
import NotificationSettings from "@/components/supervisor/setting/notification-settings"
import SecuritySettings from "@/components/supervisor/setting/security-settings"
import SitePreferences from "@/components/supervisor/setting/site-preferences"

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
      case "Site Preferences":
        return <SitePreferences />

      default:
        return <GeneralSettings />
    }
  }

  return (
    <div className="min-h-full w-full bg-oatmeal px-5 py-6 md:px-8 md:py-8 space-y-6 pb-16">
      <SettingHeader activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="w-full mt-2 flex justify-center">
        {renderActiveSetting()}
      </div>
    </div>
  )
}
