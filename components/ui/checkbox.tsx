import * as React from "react"
import { cn } from "@/lib/utils"
import { Check } from "lucide-react"

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  checked?: boolean
  onCheckedChange?: (checked: boolean) => void
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, checked, onCheckedChange, ...props }, ref) => {
    return (
      <label className="relative flex items-center justify-center cursor-pointer select-none shrink-0">
        <input
          type="checkbox"
          ref={ref}
          checked={checked}
          onChange={(e) => onCheckedChange?.(e.target.checked)}
          className="sr-only"
          {...props}
        />
        <div
          className={cn(
            "h-5 w-5 rounded-md border border-blue-fantastic/30 transition-all flex items-center justify-center",
            checked
              ? "bg-truffle-trouble border-truffle-trouble text-palladian"
              : "bg-palladian hover:border-blue-fantastic/50",
            className
          )}
        >
          {checked && <Check className="h-3.5 w-3.5 stroke-[3.5] text-palladian" />}
        </div>
      </label>
    )
  }
)
Checkbox.displayName = "Checkbox"

export { Checkbox }
