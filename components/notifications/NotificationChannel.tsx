"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { SlidersHorizontal, Smartphone, Mail, BellRing } from "lucide-react"

interface ChannelState {
  inApp: boolean
  email: boolean
  push: boolean
}

export function NotificationChannel() {
  const [channels, setChannels] = useState<ChannelState>({
    inApp: true,
    email: true,
    push: true,
  })

  const toggleChannel = (key: keyof ChannelState) => {
    setChannels((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const items: { key: keyof ChannelState; label: string; icon: React.ElementType }[] = [
    { key: "inApp", label: "In-App Alerts", icon: BellRing },
    { key: "email", label: "Email Digest", icon: Mail },
    { key: "push", label: "Push Notifications", icon: Smartphone },
  ]

  return (
    <Card className="bg-white border border-blue-fantastic/15 shadow-sm font-sans rounded-2xl overflow-hidden p-0">
      <div className="border-b border-blue-fantastic/10 px-4 py-3 flex items-center gap-2">
        <div className="h-6 w-6 rounded-lg bg-truffle-trouble/10 flex items-center justify-center">
          <SlidersHorizontal className="h-3.5 w-3.5 text-truffle-trouble" />
        </div>
        <h2 className="text-blue-fantastic text-sm font-bold font-sans">
          Notification Channels
        </h2>
      </div>

      <div className="p-3 space-y-2">
        {items.map(({ key, label, icon: Icon }) => {
          const enabled = channels[key]
          return (
            <div
              key={key}
              onClick={() => toggleChannel(key)}
              className="flex items-center justify-between px-3 py-2 rounded-xl hover:bg-blue-fantastic/5 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2.5">
                <Icon className="h-3.5 w-3.5 text-blue-fantastic/60" />
                <span className="text-xs font-semibold text-blue-fantastic font-sans">
                  {label}
                </span>
              </div>

              <div
                className={`w-8 h-4.5 flex items-center rounded-full p-0.5 transition-colors duration-200 ease-in-out ${
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

export default NotificationChannel