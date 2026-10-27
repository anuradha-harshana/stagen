"use client"

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { RefreshCw, Settings } from "lucide-react"
import PageHeader from "@/components/shared/PageHeader"
import { PAGE_SHELL_CLASS } from "@/components/shared/pageShell"

// Import modular settings components
import { Toast } from "@/components/ui/SettingsPage/Toast"
import { CompanyIdentityCard } from "@/components/ui/SettingsPage/CompanyIdentityCard"
import { BrandColorsCard } from "@/components/ui/SettingsPage/BrandColorsCard"
import { LocaleCard } from "@/components/ui/SettingsPage/LocaleCard"
import { TimezoneCard } from "@/components/ui/SettingsPage/TimezoneCard"
import { LivePreview } from "@/components/ui/SettingsPage/LivePreview"
import { useCompanyTheme } from "@/components/Providers/CompanyThemeProvider"

// Theme Preset Definition
interface ThemePreset {
  name: string
  primary: string
  secondary: string
  accent: string
  textColor: string
}

export default function SettingsPage() {
  const { applyThemeLive, setTheme } = useCompanyTheme()

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
  const [initialLoaded, setInitialLoaded] = useState(false)

  // --- FETCH SETTINGS FROM API ROUTE HANDLER ---
  useEffect(() => {
    fetch("/api/company/settings")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load company settings")
        return res.json()
      })
      .then((data) => {
        if (data) {
          if (data.logo) setLogo(data.logo)
          if (data.logoName) setLogoName(data.logoName)
          if (data.primaryColor) setPrimaryColor(data.primaryColor)
          if (data.secondaryColor) setSecondaryColor(data.secondaryColor)
          if (data.accentColor) setAccentColor(data.accentColor)
          if (data.selectedLocale) setSelectedLocale(data.selectedLocale)
          if (data.selectedTimezone) setSelectedTimezone(data.selectedTimezone)
          setTheme(data)
        }
        setInitialLoaded(true)
      })
      .catch((err) => {
        console.error("Failed to load company settings:", err)
        setInitialLoaded(true)
      })
  }, [setTheme])

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
    applyThemeLive({ logo: newLogo, logoName: name })
    showToast("Logo preview updated!", "success")
  }

  const handleResetLogo = () => {
    setLogo("/images/logo.png")
    setLogoName("logo.png")
    applyThemeLive({ logo: "/images/logo.png", logoName: "logo.png" })
    showToast("Logo reset to default.", "info")
  }

  const handleSetPrimary = (color: string) => {
    setPrimaryColor(color)
    applyThemeLive({ primaryColor: color })
  }

  const handleSetSecondary = (color: string) => {
    setSecondaryColor(color)
    applyThemeLive({ secondaryColor: color })
  }

  const handleSetAccent = (color: string) => {
    setAccentColor(color)
    applyThemeLive({ accentColor: color })
  }

  const applyPreset = (preset: ThemePreset) => {
    setPrimaryColor(preset.primary)
    setSecondaryColor(preset.secondary)
    setAccentColor(preset.accent)
    applyThemeLive({
      primaryColor: preset.primary,
      secondaryColor: preset.secondary,
      accentColor: preset.accent,
    })
    showToast(`Applied preset: ${preset.name}`, "success")
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const payload = {
        logo,
        logoName,
        primaryColor,
        secondaryColor,
        accentColor,
        selectedLocale,
        selectedTimezone,
      }

      const res = await fetch("/api/company/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}))
        throw new Error(errorData.error || "Failed to save settings")
      }

      const updated = await res.json()
      setTheme(updated)
      showToast("Company settings & localization synchronized across system!", "success")
    } catch (err: any) {
      console.error("Failed to save settings:", err)
      showToast(err.message || "Failed to save settings. Please try again.", "info")
    } finally {
      setIsSaving(false)
    }
  }

  const showToast = (message: string, type: "success" | "info" = "success") => {
    setToast({ show: true, message, type })
    setTimeout(() => {
      setToast(prev => ({ ...prev, show: false }))
    }, 3000)
  }

  return (
    <div className={PAGE_SHELL_CLASS}>
      <PageHeader
        icon={<Settings className="h-5 w-5 text-burning-flame" />}
        title="Company Settings"
        subtitle="Configure your brand identity, regional formats, and localization settings."
        rightContent={
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="border-blue-fantastic/20 text-blue-fantastic hover:bg-blue-fantastic/5 rounded-xl font-medium text-xs h-10"
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
              className="bg-blue-fantastic text-palladian hover:bg-blue-fantastic/90 rounded-xl font-medium shadow-sm text-xs h-10"
              disabled={isSaving}
              onClick={handleSave}
            >
              {isSaving ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 border-2 border-palladian border-t-transparent rounded-full animate-spin"></span>
                  Saving...
                </span>
              ) : (
                "Save Settings"
              )}
            </Button>
          </div>
        }
      />

      <Toast
        show={toast.show}
        message={toast.message}
        type={toast.type}
      />

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
            setPrimaryColor={handleSetPrimary}
            secondaryColor={secondaryColor}
            setSecondaryColor={handleSetSecondary}
            accentColor={accentColor}
            setAccentColor={handleSetAccent}
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
