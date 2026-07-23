import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Globe, Calendar, DollarSign, Languages } from "lucide-react"

interface LocaleOption {
  value: string
  label: string
  currency: string
  dateFormat: string
  numberFormat: string
  example: string
}

const LOCALE_OPTIONS: LocaleOption[] = [
  { 
    value: "en-AU", 
    label: "English (Australia)", 
    currency: "AUD ($)", 
    dateFormat: "DD/MM/YYYY", 
    numberFormat: "1,234.56", 
    example: "07/07/2026, $1,500.00 AUD" 
  },
  { 
    value: "en-GB", 
    label: "English (United Kingdom)", 
    currency: "GBP (£)", 
    dateFormat: "DD/MM/YYYY", 
    numberFormat: "1,234.56", 
    example: "07/07/2026, £1,500.00 GBP" 
  },
  { 
    value: "en-US", 
    label: "English (United States)", 
    currency: "USD ($)", 
    dateFormat: "MM/DD/YYYY", 
    numberFormat: "1,234.56", 
    example: "07/07/2026, $1,500.00 USD" 
  }
]

interface LocaleCardProps {
  selectedLocale: string
  setSelectedLocale: (locale: string) => void
  onToast: (msg: string, type?: "success" | "info") => void
}

export function LocaleCard({
  selectedLocale,
  setSelectedLocale,
  onToast,
}: LocaleCardProps) {
  const activeLocale = LOCALE_OPTIONS.find(l => l.value === selectedLocale) || LOCALE_OPTIONS[0]

  return (
    <Card className="border-2 border-[#eee9df]/50 shadow-sm rounded-3xl bg-white overflow-hidden transition-all duration-300 hover:shadow-md">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-[#ffb162]/10 text-[#a35139]">
            <Globe className="h-5 w-5" />
          </div>
          <div>
            <CardTitle className="text-lg font-semibold text-[#2c3b4d]">Locale & Regional Formats</CardTitle>
            <CardDescription className="text-xs text-[#2c3b4d]/60">
              Set your preferred numbering, currency, and date layouts.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Locale Dropdown */}
          <div className="space-y-2">
            <label htmlFor="locale-select" className="text-xs font-semibold text-[#2c3b4d]/60 uppercase tracking-wider block">
              Regional Locale
            </label>
            <select
              id="locale-select"
              value={selectedLocale}
              onChange={(e) => {
                setSelectedLocale(e.target.value)
                onToast(`Switched locale to ${e.target.value}`, "info")
              }}
              className="w-full h-9 rounded-xl border border-[#2c3b4d]/15 bg-white px-3 py-1 text-sm outline-none transition-[color,box-shadow] duration-200 focus-visible:border-[#ffb162] focus-visible:ring-2 focus-visible:ring-[#ffb162]/20"
            >
              {LOCALE_OPTIONS.map((loc) => (
                <option key={loc.value} value={loc.value}>
                  {loc.label} {loc.value === "en-AU" ? "🇦🇺 (Recommended)" : ""}
                </option>
              ))}
            </select>
          </div>

          {/* Country Indicator Display */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-[#2c3b4d]/60 uppercase tracking-wider block">
              Primary Region
            </label>
            <div className="h-9 px-3 flex items-center bg-[#c9c1b1]/15 border border-[#c9c1b1]/20 rounded-xl text-sm font-medium">
              🇦🇺 Australia
            </div>
          </div>
        </div>

        {/* Format Preview Cards */}
        <div className="p-4 rounded-2xl bg-[#c9c1b1]/10 border border-[#c9c1b1]/15 space-y-3">
          <span className="text-xs font-semibold text-[#2c3b4d]/65 uppercase tracking-wider block">
            Locale Format Previews ({activeLocale.value})
          </span>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-1">
            <div className="space-y-1">
              <span className="text-[10px] text-[#2c3b4d]/50 block">Date Layout</span>
              <span className="text-xs font-semibold flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-[#a35139]" />
                {activeLocale.dateFormat}
              </span>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] text-[#2c3b4d]/50 block">Currency</span>
              <span className="text-xs font-semibold flex items-center gap-1.5">
                <DollarSign className="h-3.5 w-3.5 text-[#a35139]" />
                {activeLocale.currency}
              </span>
            </div>
            <div className="space-y-1 col-span-2 sm:col-span-1">
              <span className="text-[10px] text-[#2c3b4d]/50 block">Number Format</span>
              <span className="text-xs font-semibold flex items-center gap-1.5">
                <Languages className="h-3.5 w-3.5 text-[#a35139]" />
                {activeLocale.numberFormat}
              </span>
            </div>
          </div>
          
          <div className="pt-2 mt-2 border-t border-[#c9c1b1]/10 text-xs text-[#2c3b4d]/60 flex items-center justify-between">
            <span>Sample output:</span>
            <span className="font-mono text-[#a35139] font-semibold bg-white px-2 py-0.5 rounded border border-[#c9c1b1]/10">
              {activeLocale.example}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}