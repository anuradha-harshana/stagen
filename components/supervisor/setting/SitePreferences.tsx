"use client"

import { useState } from "react"
import { ClipboardCheck, Save } from "lucide-react"
import { toast } from "sonner"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function SitePreferences() {
  const [defaultChecklist, setDefaultChecklist] = useState("Standard Frame Inspection")
  const [autoDelayThreshold, setAutoDelayThreshold] = useState("5 Days")
  const [photoQuality, setPhotoQuality] = useState("Standard High-Res")
  const [weatherRadius, setWeatherRadius] = useState("10km Radius")
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setTimeout(() => {
      setIsSaving(false)
      toast.success("Site preferences saved successfully!")
    }, 800)
  }

  return (
    <Card className="bg-palladian border border-blue-fantastic/15 shadow-sm font-cream w-[1000px] max-w-2xl">
      <CardHeader className="border-b border-blue-fantastic/10 pb-4">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-xl bg-truffle-trouble/10 flex items-center justify-center">
            <ClipboardCheck className="h-4 w-4 text-truffle-trouble" />
          </div>
          <CardTitle className="text-blue-fantastic text-base font-bold font-cream">
            Site Preferences
          </CardTitle>
        </div>
      </CardHeader>

      <CardContent className="pt-6">
        <form onSubmit={handleSave} className="space-y-5">
          {/* Default Checklist select */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-blue-fantastic/60 uppercase tracking-wider block">
              Default Inspection Checklist
            </label>
            <select
              value={defaultChecklist}
              onChange={(e) => setDefaultChecklist(e.target.value)}
              className="w-full h-10 rounded-xl border border-blue-fantastic/15 bg-white text-blue-fantastic px-3 py-1.5 text-sm outline-none transition-all duration-200 focus-visible:border-truffle-trouble focus-visible:ring-2 focus-visible:ring-truffle-trouble/20 font-cream"
            >
              <option value="Standard Frame Inspection">Standard Frame Inspection</option>
              <option value="Structural Concrete Pour">Structural Concrete Pour</option>
              <option value="Pre-Handover Walkthrough">Pre-Handover Walkthrough</option>
              <option value="Electrical Rough-in Audit">Electrical Rough-in Audit</option>
            </select>
          </div>

          {/* Auto-delay threshold select */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-blue-fantastic/60 uppercase tracking-wider block">
              Auto-Delay Flagging Threshold
            </label>
            <select
              value={autoDelayThreshold}
              onChange={(e) => setAutoDelayThreshold(e.target.value)}
              className="w-full h-10 rounded-xl border border-blue-fantastic/15 bg-white text-blue-fantastic px-3 py-1.5 text-sm outline-none transition-all duration-200 focus-visible:border-truffle-trouble focus-visible:ring-2 focus-visible:ring-truffle-trouble/20 font-cream"
            >
              <option value="3 Days">Notify after 3 days of site inactivity</option>
              <option value="5 Days">Notify after 5 days of site inactivity</option>
              <option value="7 Days">Notify after 7 days of site inactivity</option>
              <option value="Disabled">Never flag automatically</option>
            </select>
          </div>

          {/* Default Photo Upload Quality select */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-blue-fantastic/60 uppercase tracking-wider block">
              Site Photo Upload Quality
            </label>
            <select
              value={photoQuality}
              onChange={(e) => setPhotoQuality(e.target.value)}
              className="w-full h-10 rounded-xl border border-blue-fantastic/15 bg-white text-blue-fantastic px-3 py-1.5 text-sm outline-none transition-all duration-200 focus-visible:border-truffle-trouble focus-visible:ring-2 focus-visible:ring-truffle-trouble/20 font-cream"
            >
              <option value="Ultra-HD (Uncompressed)">Ultra-HD (Uncompressed - WiFi required)</option>
              <option value="Standard High-Res">Standard High-Res (Optimized size)</option>
              <option value="Compressed (Data Saver)">Compressed (Fastest uploads, data-saver)</option>
            </select>
          </div>

          {/* Weather Alert Radius select */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-blue-fantastic/60 uppercase tracking-wider block">
              Severe Weather Alert Radius
            </label>
            <select
              value={weatherRadius}
              onChange={(e) => setWeatherRadius(e.target.value)}
              className="w-full h-10 rounded-xl border border-blue-fantastic/15 bg-white text-blue-fantastic px-3 py-1.5 text-sm outline-none transition-all duration-200 focus-visible:border-truffle-trouble focus-visible:ring-2 focus-visible:ring-truffle-trouble/20 font-cream"
            >
              <option value="5km Radius">Within 5km of build site</option>
              <option value="10km Radius">Within 10km of build site</option>
              <option value="25km Radius">Within 25km of build site</option>
              <option value="Disabled">Disable weather alerts</option>
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
