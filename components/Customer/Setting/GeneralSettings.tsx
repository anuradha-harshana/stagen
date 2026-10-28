"use client"

import { useState, useEffect } from "react"
import { Globe, Save } from "lucide-react"
import { toast } from "sonner"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CustomerSettings } from "@/lib/types/types"
import { saveCustomerSettingsAction } from "@/lib/customer/actions"

interface GeneralSettingsProps {
  settings?: CustomerSettings | null
  onUpdate?: (updated: CustomerSettings) => void
}

export default function GeneralSettings({ settings, onUpdate }: GeneralSettingsProps = {}) {
  const [language, setLanguage] = useState(settings?.general?.language || "English")
  const [timeZone, setTimeZone] = useState(settings?.general?.timeZone || "(AEST) Australia/Sydney")
  const [dateFormat, setDateFormat] = useState(settings?.general?.dateFormat || "DD MMM YYYY")
  const [currency, setCurrency] = useState(settings?.general?.currency || "AUD - Australian Dollar")
  const [measurement, setMeasurement] = useState(settings?.general?.measurement || "Metric (m², km)")
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (settings?.general) {
      setLanguage(settings.general.language || "English")
      setTimeZone(settings.general.timeZone || "(AEST) Australia/Sydney")
      setDateFormat(settings.general.dateFormat || "DD MMM YYYY")
      setCurrency(settings.general.currency || "AUD - Australian Dollar")
      setMeasurement(settings.general.measurement || "Metric (m², km)")
    }
  }, [settings])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      const res = await saveCustomerSettingsAction({
        general: {
          language,
          timeZone,
          dateFormat,
          currency,
          measurement,
        },
      })

      if (res.success && res.settings) {
        toast.success("General settings saved successfully!")
        onUpdate?.(res.settings)
      } else {
        toast.error(res.error || "Failed to save settings")
      }
    } catch (err: any) {
      toast.error(err.message || "An error occurred while saving")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Card className="bg-white border border-blue-fantastic/15 shadow-sm font-sans w-[1000px] max-w-2xl">
      <CardHeader className="border-b border-blue-fantastic/10 pb-4">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-xl bg-truffle-trouble/10 flex items-center justify-center">
            <Globe className="h-4 w-4 text-truffle-trouble" />
          </div>
          <CardTitle className="text-blue-fantastic text-base font-bold font-sans">
            General Settings
          </CardTitle>
        </div>
      </CardHeader>

      <CardContent className="pt-6">
        <form onSubmit={handleSave} className="space-y-5">
          {/* Language select */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-blue-fantastic/60 uppercase tracking-wider block">
              Language
            </label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full h-10 rounded-xl border border-blue-fantastic/15 bg-white text-blue-fantastic px-3 py-1.5 text-sm outline-none transition-all duration-200 focus-visible:border-truffle-trouble focus-visible:ring-2 focus-visible:ring-truffle-trouble/20 font-sans"
            >
              <option value="English">English</option>
              <option value="Spanish">Español (Spanish)</option>
              <option value="French">Français (French)</option>
              <option value="German">Deutsch (German)</option>
            </select>
          </div>

          {/* Time Zone select */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-blue-fantastic/60 uppercase tracking-wider block">
              Time Zone
            </label>
            <select
              value={timeZone}
              onChange={(e) => setTimeZone(e.target.value)}
              className="w-full h-10 rounded-xl border border-blue-fantastic/15 bg-white text-blue-fantastic px-3 py-1.5 text-sm outline-none transition-all duration-200 focus-visible:border-truffle-trouble focus-visible:ring-2 focus-visible:ring-truffle-trouble/20 font-sans"
            >
              <option value="(AEST) Australia/Sydney">(AEST) Australia/Sydney</option>
              <option value="(PST) US/Pacific">(PST) US/Pacific</option>
              <option value="(EST) US/Eastern">(EST) US/Eastern</option>
              <option value="(GMT) UK/London">(GMT) UK/London</option>
            </select>
          </div>

          {/* Date Format select */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-blue-fantastic/60 uppercase tracking-wider block">
              Date Format
            </label>
            <select
              value={dateFormat}
              onChange={(e) => setDateFormat(e.target.value)}
              className="w-full h-10 rounded-xl border border-blue-fantastic/15 bg-white text-blue-fantastic px-3 py-1.5 text-sm outline-none transition-all duration-200 focus-visible:border-truffle-trouble focus-visible:ring-2 focus-visible:ring-truffle-trouble/20 font-sans"
            >
              <option value="DD MMM YYYY">DD MMM YYYY (e.g. 23 Jul 2026)</option>
              <option value="DD/MM/YYYY">DD/MM/YYYY (e.g. 23/07/2026)</option>
              <option value="MM/DD/YYYY">MM/DD/YYYY (e.g. 07/23/2026)</option>
              <option value="YYYY-MM-DD">YYYY-MM-DD (e.g. 2026-07-23)</option>
            </select>
          </div>

          {/* Currency select */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-blue-fantastic/60 uppercase tracking-wider block">
              Currency
            </label>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="w-full h-10 rounded-xl border border-blue-fantastic/15 bg-white text-blue-fantastic px-3 py-1.5 text-sm outline-none transition-all duration-200 focus-visible:border-truffle-trouble focus-visible:ring-2 focus-visible:ring-truffle-trouble/20 font-sans"
            >
              <option value="AUD - Australian Dollar">AUD - Australian Dollar</option>
              <option value="USD - US Dollar">USD - US Dollar</option>
              <option value="GBP - British Pound">GBP - British Pound</option>
              <option value="EUR - Euro">EUR - Euro</option>
            </select>
          </div>

          {/* Measurement System select */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-blue-fantastic/60 uppercase tracking-wider block">
              Measurement System
            </label>
            <select
              value={measurement}
              onChange={(e) => setMeasurement(e.target.value)}
              className="w-full h-10 rounded-xl border border-blue-fantastic/15 bg-white text-blue-fantastic px-3 py-1.5 text-sm outline-none transition-all duration-200 focus-visible:border-truffle-trouble focus-visible:ring-2 focus-visible:ring-truffle-trouble/20 font-sans"
            >
              <option value="Metric (m², km)">Metric (m², km)</option>
              <option value="Imperial (sq ft, mi)">Imperial (sq ft, mi)</option>
            </select>
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              disabled={isSaving}
              className="bg-truffle-trouble text-palladian hover:bg-truffle-trouble/85 font-semibold text-sm px-5 h-10 rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
            >
              {isSaving ? (
                <>
                  <span className="h-4 w-4 border-2 border-palladian border-t-transparent rounded-full animate-spin"></span>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
