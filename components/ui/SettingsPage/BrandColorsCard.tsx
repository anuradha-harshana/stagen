import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Palette } from "lucide-react"

interface ThemePreset {
  name: string
  primary: string
  secondary: string
  accent: string
  textColor: string
}

const COLOR_PRESETS: ThemePreset[] = [
  {
    name: "Stagen Classic",
    primary: "#ffb162",
    secondary: "#2c3b4d",
    accent: "#a35139",
    textColor: "#eee9df"
  },
  {
    name: "Aura Sunset",
    primary: "#f43f5e",
    secondary: "#1e1b4b",
    accent: "#fb7185",
    textColor: "#f1f5f9"
  },
  {
    name: "Forest Timber",
    primary: "#eab308",
    secondary: "#14532d",
    accent: "#16a34a",
    textColor: "#f4f3ee"
  },
  {
    name: "Terracotta Clay",
    primary: "#f97316",
    secondary: "#27272a",
    accent: "#ea580c",
    textColor: "#fafafa"
  },
  {
    name: "Abyssal Deep",
    primary: "#38bdf8",
    secondary: "#0f172a",
    accent: "#0284c7",
    textColor: "#f8fafc"
  }
]

interface BrandColorsCardProps {
  primaryColor: string
  setPrimaryColor: (color: string) => void
  secondaryColor: string
  setSecondaryColor: (color: string) => void
  accentColor: string
  setAccentColor: (color: string) => void
  onApplyPreset: (preset: ThemePreset) => void
}

export function BrandColorsCard({
  primaryColor,
  setPrimaryColor,
  secondaryColor,
  setSecondaryColor,
  accentColor,
  setAccentColor,
  onApplyPreset,
}: BrandColorsCardProps) {
  return (
    <Card className="border-2 border-[#eee9df]/50 shadow-sm rounded-3xl bg-white overflow-hidden transition-all duration-300 hover:shadow-md">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-[#ffb162]/10 text-[#a35139]">
            <Palette className="h-5 w-5" />
          </div>
          <div>
            <CardTitle className="text-lg font-semibold text-[#2c3b4d]">Brand Aesthetics</CardTitle>
            <CardDescription className="text-xs text-[#2c3b4d]/60">
              Define the color themes for your client workspace and admin panels.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Presets Grid */}
        <div className="space-y-3">
          <label className="text-xs font-semibold text-[#2c3b4d]/60 uppercase tracking-wider block">
            Quick Presets
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
            {COLOR_PRESETS.map((preset) => {
              const isSelected = 
                primaryColor.toLowerCase() === preset.primary.toLowerCase() &&
                secondaryColor.toLowerCase() === preset.secondary.toLowerCase()

              return (
                <button
                  key={preset.name}
                  type="button"
                  onClick={() => onApplyPreset(preset)}
                  className={`flex flex-col items-center gap-1.5 p-2 rounded-xl border text-center transition-all duration-200 hover:border-[#2c3b4d] hover:scale-102 ${
                    isSelected 
                      ? "border-[#2c3b4d] bg-[#2c3b4d]/5 ring-1 ring-[#2c3b4d]" 
                      : "border-[#c9c1b1]/20 bg-white"
                  }`}
                >
                  <div className="flex gap-1">
                    <span className="w-4 h-4 rounded-full border border-black/10" style={{ backgroundColor: preset.primary }} />
                    <span className="w-4 h-4 rounded-full border border-black/10" style={{ backgroundColor: preset.secondary }} />
                    <span className="w-4 h-4 rounded-full border border-black/10" style={{ backgroundColor: preset.accent }} />
                  </div>
                  <span className="text-[10px] font-medium text-[#2c3b4d] truncate w-full">
                    {preset.name}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        <Separator className="bg-[#c9c1b1]/20" />

        {/* Custom Color Pickers */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {/* Primary Color */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-[#2c3b4d]/60 uppercase tracking-wider block">
              Highlight / Primary
            </label>
            <div className="flex items-center gap-2">
              <div className="relative w-9 h-9 rounded-xl border border-[#c9c1b1]/30 overflow-hidden shrink-0 cursor-pointer shadow-sm">
                <input 
                  type="color" 
                  value={primaryColor} 
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="absolute inset-0 w-full h-full p-0 border-0 cursor-pointer scale-150"
                />
              </div>
              <Input 
                value={primaryColor.toUpperCase()} 
                onChange={(e) => setPrimaryColor(e.target.value)}
                maxLength={7}
                className="font-mono text-xs rounded-xl h-9 uppercase border-[#2c3b4d]/15 bg-white text-[#2c3b4d]"
              />
            </div>
          </div>

          {/* Secondary Color */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-[#2c3b4d]/60 uppercase tracking-wider block">
              Sidebar / Secondary
            </label>
            <div className="flex items-center gap-2">
              <div className="relative w-9 h-9 rounded-xl border border-[#c9c1b1]/30 overflow-hidden shrink-0 cursor-pointer shadow-sm">
                <input 
                  type="color" 
                  value={secondaryColor} 
                  onChange={(e) => setSecondaryColor(e.target.value)}
                  className="absolute inset-0 w-full h-full p-0 border-0 cursor-pointer scale-150"
                />
              </div>
              <Input 
                value={secondaryColor.toUpperCase()} 
                onChange={(e) => setSecondaryColor(e.target.value)}
                maxLength={7}
                className="font-mono text-xs rounded-xl h-9 uppercase border-[#2c3b4d]/15 bg-white text-[#2c3b4d]"
              />
            </div>
          </div>

          {/* Accent Color */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-[#2c3b4d]/60 uppercase tracking-wider block">
              Borders / Accent
            </label>
            <div className="flex items-center gap-2">
              <div className="relative w-9 h-9 rounded-xl border border-[#c9c1b1]/30 overflow-hidden shrink-0 cursor-pointer shadow-sm">
                <input 
                  type="color" 
                  value={accentColor} 
                  onChange={(e) => setAccentColor(e.target.value)}
                  className="absolute inset-0 w-full h-full p-0 border-0 cursor-pointer scale-150"
                />
              </div>
              <Input 
                value={accentColor.toUpperCase()} 
                onChange={(e) => setAccentColor(e.target.value)}
                maxLength={7}
                className="font-mono text-xs rounded-xl h-9 uppercase border-[#2c3b4d]/15 bg-white text-[#2c3b4d]"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
