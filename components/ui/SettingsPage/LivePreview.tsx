import React from "react"
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card"
import { Eye, LayoutDashboard, UserRoundPen, Building2, Settings as SettingsIcon, BellRing } from "lucide-react"

interface LivePreviewProps {
  logo: string
  primaryColor: string
  secondaryColor: string
  accentColor: string
  selectedLocale: string
  currentTime: string
}

export function LivePreview({
  logo,
  primaryColor,
  secondaryColor,
  accentColor,
  selectedLocale,
  currentTime,
}: LivePreviewProps) {
  return (
    <div className="relative group">
      {/* Background design glow */}
      <div className="absolute -inset-1.5 bg-gradient-to-r from-[#ffb162] to-[#a35139] rounded-3xl opacity-20 blur-lg transition duration-1000 group-hover:opacity-30"></div>
      
      <Card className="relative border-2 border-[#eee9df]/50 shadow-lg rounded-3xl bg-[#c9c1b1] overflow-hidden">
        <CardHeader className="pb-2 bg-[#2c3b4d]/5 border-b border-[#eee9df]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4 text-[#a35139]" />
              <span className="text-xs font-bold uppercase tracking-wider text-[#2c3b4d]/75">
                Live Branding Preview
              </span>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-[#ffb162] text-[#2c3b4d] font-semibold text-[9px] uppercase tracking-wider shadow-sm animate-pulse">
              Interactive
            </span>
          </div>
        </CardHeader>
        
        <CardContent className="p-5">
          <p className="text-xs text-[#2c3b4d]/60 mb-4 text-center">
            See how your colors and logo render live in the platform layout.
          </p>

          {/* Mockup Container */}
          <div className="aspect-[4/3] w-full rounded-2xl border-2 border-[#eee9df]/60 shadow-xl overflow-hidden bg-[#c9c1b1] flex flex-row transition-all duration-300">
            
            {/* Mock Sidebar */}
            <div 
              className="w-1/3 shrink-0 flex flex-col justify-between p-3 border-r transition-all duration-300 text-white"
              style={{ 
                backgroundColor: secondaryColor,
                borderColor: accentColor + "30"
              }}
            >
              {/* Sidebar Header */}
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center overflow-hidden border border-white/10">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={logo} alt="Mock Logo" className="w-full h-full object-contain p-0.5" />
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="font-bebas-neue text-lg leading-none truncate text-white" style={{ color: "#eee9df" }}>
                      Stagen
                    </span>
                    <span className="text-[7px] uppercase tracking-widest text-[#eee9df]/60 truncate">
                      Build OS
                    </span>
                  </div>
                </div>

                {/* Mock Navigation links */}
                <div className="space-y-1">
                  <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg text-[9px] font-medium bg-white/10 border border-white/5" style={{ borderColor: accentColor + "40" }}>
                    <LayoutDashboard className="h-3 w-3 shrink-0" style={{ color: primaryColor }} />
                    <span className="truncate">Dashboard</span>
                  </div>
                  <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg text-[9px] font-medium text-[#eee9df]/75 hover:bg-white/5 transition-colors">
                    <UserRoundPen className="h-3 w-3 shrink-0" />
                    <span className="truncate">Users</span>
                  </div>
                  <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg text-[9px] font-medium text-[#eee9df]/75 hover:bg-white/5 transition-colors">
                    <Building2 className="h-3 w-3 shrink-0" />
                    <span className="truncate">Profile</span>
                  </div>
                  <div className="flex items-center gap-2 px-2 py-1.5 rounded-lg text-[9px] font-medium text-[#eee9df]/75 hover:bg-white/5 transition-colors">
                    <SettingsIcon className="h-3 w-3 shrink-0" />
                    <span className="truncate">Settings</span>
                  </div>
                </div>
              </div>

              {/* Sidebar Footer */}
              <div className="flex items-center gap-1.5 rounded-lg bg-black/20 p-1.5 border border-white/5">
                <div className="h-5 w-5 shrink-0 rounded-full flex items-center justify-center text-[8px] font-bold text-[#2c3b4d]" style={{ backgroundColor: primaryColor }}>
                  CA
                </div>
                <div className="flex flex-col min-w-0">
                  <span className="text-[7px] font-semibold text-[#eee9df] truncate">Company Admin</span>
                  <span className="text-[6px] text-[#eee9df]/50 truncate">Active session</span>
                </div>
              </div>
            </div>

            {/* Mock Page Content */}
            <div className="flex-1 bg-white p-3 flex flex-col justify-between text-[#2c3b4d] font-sans">
              {/* Mock Page Header */}
              <div className="flex items-center justify-between border-b border-[#c9c1b1]/10 pb-1.5 mb-2">
                <span className="text-[10px] font-heading font-bold text-[#2c3b4d]">
                  Dashboard
                </span>
                <div className="flex items-center gap-1">
                  <div className="h-3.5 w-3.5 rounded-full bg-[#c9c1b1]/20 flex items-center justify-center">
                    <BellRing className="h-2 w-2 text-[#2c3b4d]/60" />
                  </div>
                  <div className="h-3.5 w-3.5 rounded-full bg-[#2c3b4d]/10 flex items-center justify-center font-bold text-[7px]">
                    CA
                  </div>
                </div>
              </div>

              {/* Mock Page Cards */}
              <div className="space-y-2 flex-1">
                {/* Metric Card */}
                <div className="border border-[#c9c1b1]/10 rounded-xl p-2 bg-[#c9c1b1]/5 flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="text-[7px] text-[#2c3b4d]/55 block">Project Completion</span>
                    <span className="text-xs font-bold text-[#2c3b4d]">89.4%</span>
                  </div>
                  {/* Custom colored mock progress bar circle */}
                  <div className="w-6 h-6 rounded-full border-3 border-[#c9c1b1]/25 flex items-center justify-center" style={{ borderTopColor: primaryColor }}>
                    <span className="text-[6px] font-bold">89%</span>
                  </div>
                </div>

                {/* Mock Chart Area */}
                <div className="border border-[#c9c1b1]/10 rounded-xl p-2 bg-[#c9c1b1]/5 flex-1 flex flex-col justify-between h-[52px]">
                  <span className="text-[7px] text-[#2c3b4d]/55">Weekly Trades Performance</span>
                  <div className="flex items-end justify-between gap-1 h-6 pt-1">
                    <div className="w-full bg-[#2c3b4d]/20 rounded-sm h-[40%]" />
                    <div className="w-full bg-[#2c3b4d]/20 rounded-sm h-[60%]" />
                    <div className="w-full bg-[#2c3b4d]/20 rounded-sm h-[90%]" />
                    <div className="w-full rounded-sm h-[80%]" style={{ backgroundColor: primaryColor }} />
                    <div className="w-full bg-[#2c3b4d]/20 rounded-sm h-[50%]" />
                  </div>
                </div>
              </div>

              {/* Mock Page Footer/Locale Info */}
              <div className="border-t border-[#c9c1b1]/10 pt-1.5 mt-2 flex items-center justify-between text-[7px] text-[#2c3b4d]/50 font-mono">
                <span>{selectedLocale}</span>
                <span className="truncate max-w-[80px] text-right">{currentTime || "Clock loading"}</span>
              </div>
            </div>

          </div>
        </CardContent>

        <CardFooter className="py-3 px-5 bg-[#2c3b4d]/5 border-t border-[#eee9df] flex justify-between items-center text-[10px] text-[#2c3b4d]/70">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: primaryColor }} />
            Highlight: <strong className="font-semibold">{primaryColor}</strong>
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: secondaryColor }} />
            Sidebar: <strong className="font-semibold">{secondaryColor}</strong>
          </span>
        </CardFooter>
      </Card>
    </div>
  )
}
