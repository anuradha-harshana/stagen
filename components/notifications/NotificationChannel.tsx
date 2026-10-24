"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { SlidersHorizontal, Smartphone, Mail, BellRing, Loader2 } from "lucide-react"
import { toast } from "sonner"

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
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true
    async function loadChannels() {
      try {
        const res = await fetch("/api/customer/notifications/channels")
        if (res.ok) {
          const data = await res.json()
          if (isMounted && data?.channels) {
            setChannels(data.channels)
          }
        }
      } catch (err) {
        console.error("Failed to load notification channels:", err)
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    loadChannels()
    return () => {
      isMounted = false
    }
  }, [])

  const toggleChannel = async (key: keyof ChannelState) => {
    const nextValue = !channels[key]
    const prev = { ...channels }
    
    // Optimistic update
    setChannels((curr) => ({ ...curr, [key]: nextValue }))

    const label =
      key === "inApp"
        ? "In-App Alerts"
        : key === "email"
        ? "Email Digest"
        : "Push Notifications"

    try {
      const res = await fetch("/api/customer/notifications/channels", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [key]: nextValue }),
      })

      if (!res.ok) {
        throw new Error("Failed to save channel preference")
      }

      toast.success(`${label} ${nextValue ? "enabled" : "disabled"}`)
    } catch (err) {
      // Revert on error
      setChannels(prev)
      toast.error(`Unable to update ${label}`)
    }
  }

  const items: { key: keyof ChannelState; label: string; icon: React.ElementType }[] = [
    { key: "inApp", label: "In-App Alerts", icon: BellRing },
    { key: "email", label: "Email Digest", icon: Mail },
    { key: "push", label: "Push Notifications", icon: Smartphone },
  ]

  return (
    <Card className="bg-white border border-blue-fantastic/15 shadow-sm font-sans rounded-2xl overflow-hidden p-0">
      <div className="border-b border-blue-fantastic/10 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded-lg bg-truffle-trouble/10 flex items-center justify-center">
            <SlidersHorizontal className="h-3.5 w-3.5 text-truffle-trouble" />
          </div>
          <h2 className="text-blue-fantastic text-sm font-bold font-sans">
            Notification Channels
          </h2>
        </div>
        {loading && <Loader2 className="h-3 w-3 animate-spin text-blue-fantastic/40" />}
      </div>

      <div className="p-3 space-y-2">
        {items.map(({ key, label, icon: Icon }) => {
          const enabled = channels[key]
          return (
            <div
              key={key}
              onClick={() => toggleChannel(key)}
              className="flex items-center justify-between px-3 py-2 rounded-xl hover:bg-blue-fantastic/5 transition-colors cursor-pointer select-none"
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