"use client"

import { useState } from "react"
import SettingHeader from "@/components/Customer/Setting/SettingHeader"
import GeneralSettings from "@/components/Customer/Setting/GeneralSettings"
import NotificationSettings from "@/components/Customer/Setting/NotificationSettings"
import SecuritySettings from "@/components/Customer/Setting/SecuritySettings"
import PrivacySettings from "@/components/Customer/Setting/PrivacySettings"
import BillingSettings from "@/components/Customer/Setting/BillingSettings"
import { CustomerSettings } from "@/lib/types/types"
import { PAGE_SHELL_CLASS } from "@/components/shared/pageShell"

interface CustomerSettingsClientProps {
  initialSettings: CustomerSettings | null
}

export default function CustomerSettingsClient({
  initialSettings,
}: CustomerSettingsClientProps) {
  const [activeTab, setActiveTab] = useState("General")
  const [settings, setSettings] = useState<CustomerSettings | null>(initialSettings)

  const handleSettingsUpdated = (updated: CustomerSettings) => {
    setSettings(updated)
  }

  const renderActiveSetting = () => {
    switch (activeTab) {
      case "General":
        return (
          <GeneralSettings
            settings={settings}
            onUpdate={handleSettingsUpdated}
          />
        )
      case "Notifications":
        return (
          <NotificationSettings
            settings={settings}
            onUpdate={handleSettingsUpdated}
          />
        )
      case "Security":
        return (
          <SecuritySettings
            settings={settings}
            onUpdate={handleSettingsUpdated}
          />
        )
      case "Privacy":
        return (
          <PrivacySettings
            settings={settings}
            onUpdate={handleSettingsUpdated}
          />
        )
      case "Billing":
        return (
          <BillingSettings
            settings={settings}
            onUpdate={handleSettingsUpdated}
          />
        )
      default:
        return (
          <GeneralSettings
            settings={settings}
            onUpdate={handleSettingsUpdated}
          />
        )
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
