"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { SlidersHorizontal, Smartphone, Mail, BellRing } from "lucide-react"

interface ChannelState {
  inApp: boolean
  email: boolean
  sms: boolean
}

export function SupervisorNotificationChannel() {
  const [channels, setChannels] = useState<ChannelState>({
    inApp: true,
    email: true,
    sms: false,
  })

  const toggleChannel = (key: keyof ChannelState) => {
    setChannels((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const items: { key: keyof ChannelState; label: string; subLabel: string; icon: React.ElementType }[] = [
    { key: "inApp", label: "In-App Alerts", subLabel: "Live platform notifications", icon: BellRing },
    { key: "email", label: "Email Digest", subLabel: "Daily summary of site actions", icon: Mail },
    { key: "sms", label: "SMS/Push Alerts", subLabel: "Urgent delay & weather flags", icon: Smartphone },
  ]

  return (
    <Card className="bg-white border border-blue-fantastic/15 shadow-sm  rounded-2xl overflow-hidden p-0">
      <div className="border-b border-blue-fantastic/10 px-4 py-3 flex items-center gap-2">
        <div className="h-6 w-6 rounded-lg bg-truffle-trouble/10 flex items-center justify-center">
          <SlidersHorizontal className="h-3.5 w-3.5 text-truffle-trouble" />
        </div>
        <h2 className="text-blue-fantastic text-sm font-bold ">
          Notification Channels
        </h2>
      </div>

      <div className="p-3 space-y-2">
        {items.map(({ key, label, subLabel, icon: Icon }) => {
          const enabled = channels[key]
          return (
            <div
              key={key}
              onClick={() => toggleChannel(key)}
              className="flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-blue-fantastic/5 transition-colors cursor-pointer group"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <Icon className="h-4 w-4 text-blue-fantastic/60 group-hover:text-blue-fantastic shrink-0" />
                <div className="flex flex-col min-w-0">
                  <span className="text-xs font-semibold text-blue-fantastic ">
                    {label}
                  </span>
                  <span className="text-[10px] text-blue-fantastic/50  truncate">
                    {subLabel}
                  </span>
                </div>
              </div>

              <div
                className={`w-8 h-4.5 flex items-center rounded-full p-0.5 transition-colors duration-200 ease-in-out shrink-0 ${
                  enabled ? "bg-truffle-trouble" : "bg-blue-fantastic/20"
                }`}
              >
                <div
                  className={`bg-white w-3.5 h-3.5 rounded-full shadow-md transform transition-transform duration-200 ease-in-out ${
                    enabled ? "translate-x-3.5" : "translate-x-0"
                  }`}
                />
              </div>
            </div>
          )
        })}
      </div>
    </Card>
  )
}

export default SupervisorNotificationChannel
