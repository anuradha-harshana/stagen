"use client"

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"

// Import modular settings components
import { Toast } from "@/components/ui/SettingsPage/Toast"
import { CompanyIdentityCard } from "@/components/ui/SettingsPage/CompanyIdentityCard"
import { BrandColorsCard } from "@/components/ui/SettingsPage/BrandColorsCard"
import { LocaleCard } from "@/components/ui/SettingsPage/LocaleCard"
import { TimezoneCard } from "@/components/ui/SettingsPage/TimezoneCard"
import { LivePreview } from "@/components/ui/SettingsPage/LivePreview"

// Theme Preset Definition
interface ThemePreset {
  name: string
  primary: string
  secondary: string
  accent: string
  textColor: string
}

export default function SettingsPage() {
  // --- STATE MANAGEMENT ---
  const [logo, setLogo] = useState<string>("/images/logo.png")
  const [logoName, setLogoName] = useState<string>("logo.png")
  const [primaryColor, setPrimaryColor] = useState<string>("#ffb162")
  const [secondaryColor, setSecondaryColor] = useState<string>("#2c3b4d")
  const [accentColor, setAccentColor] = useState<string>("#a35139")
  const [selectedLocale, setSelectedLocale] = useState<string>("en-AU")
  const [selectedTimezone, setSelectedTimezone] = useState<string>("Australia/Sydney")
  
  // Dynamic clock state
  const [currentTime, setCurrentTime] = useState<string>("")
  const [currentDate, setCurrentDate] = useState<string>("")

  // Notification Toast state
  const [toast, setToast] = useState<{ show: boolean; message: string; type: "success" | "info" }>({
    show: false,
    message: "",
    type: "success"
  })
  
  const [isSaving, setIsSaving] = useState(false)

  // --- TIMEZONE CLOCK LOGIC ---
  useEffect(() => {
    const updateTime = () => {
      try {
        const now = new Date()
        
        // Format time
        const timeString = now.toLocaleTimeString("en-AU", {
          timeZone: selectedTimezone,
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true
        })

        // Format date
        const dateString = now.toLocaleDateString("en-AU", {
          timeZone: selectedTimezone,
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric"
        })

        setCurrentTime(timeString)
        setCurrentDate(dateString)
      } catch (err) {
        console.error("Error formatting timezone date/time:", err)
      }
    }

    updateTime()
    const timer = setInterval(updateTime, 1000)
    return () => clearInterval(timer)
  }, [selectedTimezone])

  // --- HANDLERS ---
  const handleLogoUpload = (newLogo: string, name: string) => {
    setLogo(newLogo)
    setLogoName(name)
    showToast("Logo preview updated!", "success")
  }

  const handleResetLogo = () => {
    setLogo("/images/logo.png")
    setLogoName("logo.png")
    showToast("Logo reset to default.", "info")
  }

  const applyPreset = (preset: ThemePreset) => {
    setPrimaryColor(preset.primary)
    setSecondaryColor(preset.secondary)
    setAccentColor(preset.accent)
    showToast(`Applied preset: ${preset.name}`, "success")
  }

  const handleSave = () => {
    setIsSaving(true)
    setTimeout(() => {
      setIsSaving(false)
      showToast("Company settings saved successfully!", "success")
    }, 1200)
  }

  const showToast = (message: string, type: "success" | "info" = "success") => {
    setToast({ show: true, message, type })
    setTimeout(() => {
      setToast(prev => ({ ...prev, show: false }))
    }, 3000)
  }

  return (
    <div className="relative min-h-screen p-6 md:p-8 font-sans text-[#2c3b4d] max-w-7xl mx-auto">
      
      {/* Toast Alert */}
      <Toast 
        show={toast.show} 
        message={toast.message} 
        type={toast.type} 
      />

      {/* Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-heading font-semibold text-[#2c3b4d] leading-tight">
            Company Settings
          </h1>
          <p className="text-sm text-[#2c3b4d]/70 mt-1">
            Configure your brand identity, regional formats, and localization settings for Australia.
          </p>
        </div>
        <div className="flex gap-3">
          <Button 
            variant="outline"
            className="border-[#2c3b4d]/20 text-[#2c3b4d] hover:bg-[#2c3b4d]/5 rounded-2xl font-medium"
            onClick={() => {
              applyPreset({
                name: "Stagen Classic",
                primary: "#ffb162",
                secondary: "#2c3b4d",
                accent: "#a35139",
                textColor: "#eee9df"
              })
              setSelectedLocale("en-AU")
              setSelectedTimezone("Australia/Sydney")
              showToast("Settings reset to defaults.", "info")
            }}
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Reset Changes
          </Button>
          <Button 
            className="bg-[#2c3b4d] text-white hover:bg-[#2c3b4d]/90 rounded-2xl font-medium shadow-md transition-all duration-200"
            disabled={isSaving}
            onClick={handleSave}
          >
            {isSaving ? (
              <span className="flex items-center gap-2">
                <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                Saving...
              </span>
            ) : (
              "Save Settings"
            )}
          </Button>
        </div>
      </div>

      {/* Grid Layout: Config on Left, Live Mockup Preview on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* LEFT COLUMN: Controls (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-8">
          
          <CompanyIdentityCard 
            logo={logo}
            logoName={logoName}
            onLogoUpload={handleLogoUpload}
            onResetLogo={handleResetLogo}
          />

          <BrandColorsCard 
            primaryColor={primaryColor}
            setPrimaryColor={setPrimaryColor}
            secondaryColor={secondaryColor}
            setSecondaryColor={setSecondaryColor}
            accentColor={accentColor}
            setAccentColor={setAccentColor}
            onApplyPreset={applyPreset}
          />

          <LocaleCard 
            selectedLocale={selectedLocale}
            setSelectedLocale={setSelectedLocale}
            onToast={showToast}
          />

          <TimezoneCard 
            selectedTimezone={selectedTimezone}
            setSelectedTimezone={setSelectedTimezone}
            currentTime={currentTime}
            currentDate={currentDate}
            onToast={showToast}
          />
          
        </div>

        {/* RIGHT COLUMN: Live Mockup Preview (5 cols) */}
        <div className="lg:col-span-5 lg:sticky lg:top-8">
          <LivePreview 
            logo={logo}
            primaryColor={primaryColor}
            secondaryColor={secondaryColor}
            accentColor={accentColor}
            selectedLocale={selectedLocale}
            currentTime={currentTime}
          />
        </div>

      </div>

    </div>
  )
}
