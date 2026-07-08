import { Check } from "lucide-react"

interface ToastProps {
  show: boolean
  message: string
  type: "success" | "info"
}

export function Toast({ show, message, type }: ToastProps) {
  if (!show) return null

  return (
    <div className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-2xl shadow-xl transition-all duration-300 transform translate-y-0 border text-sm ${
      type === "success" 
        ? "bg-[#2c3b4d] text-[#ffb162] border-[#ffb162]/20" 
        : "bg-[#a35139] text-[#eee9df] border-white/10"
    } animate-in fade-in slide-in-from-top-4`}>
      <Check className="h-4 w-4 shrink-0" />
      <span className="font-medium">{message}</span>
    </div>
  )
}
