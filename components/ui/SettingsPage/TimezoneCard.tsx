import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock } from "lucide-react"

interface TimezoneOption {
  value: string
  label: string
  offset: string
  state: string
}

const AUSTRALIAN_TIMEZONES: TimezoneOption[] = [
  { value: "Australia/Sydney", label: "Sydney / Canberra (AEST/AEDT)", offset: "UTC+10/+11", state: "NSW/ACT" },
  { value: "Australia/Melbourne", label: "Melbourne (AEST/AEDT)", offset: "UTC+10/+11", state: "VIC" },
  { value: "Australia/Brisbane", label: "Brisbane (AEST - No DST)", offset: "UTC+10", state: "QLD" },
  { value: "Australia/Adelaide", label: "Adelaide (ACST/ACDT)", offset: "UTC+9.5/+10.5", state: "SA" },
  { value: "Australia/Darwin", label: "Darwin (ACST - No DST)", offset: "UTC+9.5", state: "NT" },
  { value: "Australia/Perth", label: "Perth (AWST)", offset: "UTC+8", state: "WA" },
  { value: "Australia/Hobart", label: "Hobart (AEST/AEDT)", offset: "UTC+10/+11", state: "TAS" }
]

interface TimezoneCardProps {
  selectedTimezone: string
  setSelectedTimezone: (timezone: string) => void
  currentTime: string
  currentDate: string
  onToast: (msg: string, type?: "success" | "info") => void
}

export function TimezoneCard({
  selectedTimezone,
  setSelectedTimezone,
  currentTime,
  currentDate,
  onToast,
}: TimezoneCardProps) {
  const activeTimezone = AUSTRALIAN_TIMEZONES.find(t => t.value === selectedTimezone) || AUSTRALIAN_TIMEZONES[0]

  return (
    <Card className="border-2 border-[#eee9df]/50 shadow-sm rounded-3xl bg-white overflow-hidden transition-all duration-300 hover:shadow-md">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-[#ffb162]/10 text-[#a35139]">
            <Clock className="h-5 w-5" />
          </div>
          <div>
            <CardTitle className="text-lg font-semibold text-[#2c3b4d]">Date & Timezone</CardTitle>
            <CardDescription className="text-xs text-[#2c3b4d]/60">
              Select the timezone matching your operations to synchronize activity feeds.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Timezone Select */}
          <div className="space-y-2">
            <label htmlFor="timezone-select" className="text-xs font-semibold text-[#2c3b4d]/60 uppercase tracking-wider block">
              Australian Timezone
            </label>
            <select
              id="timezone-select"
              value={selectedTimezone}
              onChange={(e) => {
                setSelectedTimezone(e.target.value)
                onToast(`Timezone changed to ${e.target.value}`, "info")
              }}
              className="w-full h-9 rounded-xl border border-[#2c3b4d]/15 bg-white px-3 py-1 text-sm outline-none transition-[color,box-shadow] duration-200 focus-visible:border-[#ffb162] focus-visible:ring-2 focus-visible:ring-[#ffb162]/20"
            >
              {AUSTRALIAN_TIMEZONES.map((tz) => (
                <option key={tz.value} value={tz.value}>
                  {tz.label} ({tz.state})
                </option>
              ))}
            </select>
          </div>

          {/* State display */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-[#2c3b4d]/60 uppercase tracking-wider block">
              Active Offset
            </label>
            <div className="h-9 px-3 flex items-center bg-[#c9c1b1]/15 border border-[#c9c1b1]/20 rounded-xl text-sm font-medium">
              {activeTimezone.offset}
            </div>
          </div>
        </div>

        {/* Clock widget */}
        <div className="p-5 rounded-2xl bg-gradient-to-br from-[#2c3b4d] to-[#1b2632] text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-inner">
          <div className="space-y-1 text-center sm:text-left">
            <span className="text-[10px] text-[#ffb162] font-bold uppercase tracking-widest block">
              Live timezone clock
            </span>
            <div className="text-2xl font-mono font-bold tracking-tight text-white">
              {currentTime || "00:00:00 AM"}
            </div>
            <div className="text-xs text-[#eee9df]/75 font-medium">
              {currentDate || "Loading local date..."}
            </div>
          </div>
          <div className="flex flex-col items-center sm:items-end justify-center">
            <span className="px-3 py-1 rounded-full bg-white/10 border border-white/10 text-[10px] font-semibold tracking-wider uppercase text-[#ffb162]">
              {selectedTimezone.split("/")[1]?.replace("_", " ") || "Sydney"}
            </span>
            <span className="text-[9px] text-[#eee9df]/50 mt-1 block">
              Synchronized with UTC
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
