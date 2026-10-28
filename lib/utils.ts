import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/** Calendar value without shifting a saved date through UTC. */
export function toDateInputValue(value: string | Date): string {
  if (!value) return ""
  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}(?:$|T)/.test(value)) return value.slice(0, 10)
  const date = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(date.getTime())) return ""
  return [date.getFullYear(), String(date.getMonth() + 1).padStart(2, "0"), String(date.getDate()).padStart(2, "0")].join("-")
}
