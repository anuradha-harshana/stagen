"use client"

import { useState } from "react"
import { Bell, Globe, FileText, Sparkles, Mail, Save } from "lucide-react"
import { toast } from "sonner"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export default function NotificationSettings() {
  const [projectUpdates, setProjectUpdates] = useState(true)
  const [invoiceReminders, setInvoiceReminders] = useState(true)
  const [aiNotifications, setAiNotifications] = useState(true)
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [pushNotifications, setPushNotifications] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setTimeout(() => {
      setIsSaving(false)
      toast.success("Notification settings saved successfully!")
    }, 800)
  }

  const toggleItems = [
    {
      id: "projectUpdates",
      label: "Project updates",
      desc: "Get notified about project progress and activities",
      icon: <Globe className="h-4 w-4 text-truffle-trouble" />,
      checked: projectUpdates,
      onChange: setProjectUpdates,
    },
    {
      id: "invoiceReminders",
      label: "Invoice reminders",
      desc: "Receive notifications for invoices and payments",
      icon: <FileText className="h-4 w-4 text-truffle-trouble" />,
      checked: invoiceReminders,
      onChange: setInvoiceReminders,
    },
    {
      id: "aiNotifications",
      label: "AI assistant notifications",
      desc: "Get notified about AI assistant responses",
      icon: <Sparkles className="h-4 w-4 text-truffle-trouble" />,
      checked: aiNotifications,
      onChange: setAiNotifications,
    },
    {
      id: "emailNotifications",
      label: "Email notifications",
      desc: "Receive email notifications",
      icon: <Mail className="h-4 w-4 text-truffle-trouble" />,
      checked: emailNotifications,
      onChange: setEmailNotifications,
    },
    {
      id: "pushNotifications",
      label: "Push notifications",
      desc: "Receive push notifications in the app",
      icon: <Bell className="h-4 w-4 text-truffle-trouble" />,
      checked: pushNotifications,
      onChange: setPushNotifications,
    },
  ]

  return (
    <Card className="bg-palladian border border-blue-fantastic/15 shadow-sm font-cream w-[1000px] max-w-2xl">
      <CardHeader className="border-b border-blue-fantastic/10 pb-4">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-xl bg-truffle-trouble/10 flex items-center justify-center">
            <Bell className="h-4 w-4 text-truffle-trouble" />
          </div>
          <CardTitle className="text-blue-fantastic text-base font-bold font-cream">
            Notification Settings
          </CardTitle>
        </div>
      </CardHeader>

      <CardContent className="pt-6">
        <form onSubmit={handleSave} className="space-y-6">
          <div className="divide-y divide-blue-fantastic/10">
            {toggleItems.map((item, idx) => (
              <div
                key={item.id}
                className={cn(
                  "flex items-center justify-between gap-4 py-4",
                  idx === 0 && "pt-0",
                  idx === toggleItems.length - 1 && "pb-0"
                )}
              >
                <div className="flex items-start gap-3.5">
                  <div className="h-8 w-8 rounded-lg bg-blue-fantastic/5 border border-blue-fantastic/10 flex items-center justify-center shrink-0 mt-0.5">
                    {item.icon}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-blue-fantastic">
                      {item.label}
                    </h4>
                    <p className="text-xs text-blue-fantastic/60 mt-0.5">
                      {item.desc}
                    </p>
                  </div>
                </div>

                {/* Custom Toggle Switch */}
                <button
                  type="button"
                  role="switch"
                  aria-checked={item.checked}
                  onClick={() => item.onChange(!item.checked)}
                  className={cn(
                    "relative inline-flex h-5.5 w-10.5 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none",
                    item.checked ? "bg-truffle-trouble" : "bg-blue-fantastic/20"
                  )}
                >
                  <span
                    className={cn(
                      "pointer-events-none inline-block h-4.5 w-4.5 transform rounded-full bg-palladian shadow-md ring-0 transition duration-200 ease-in-out",
                      item.checked ? "translate-x-5" : "translate-x-0"
                    )}
                  />
                </button>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-blue-fantastic/10">
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
