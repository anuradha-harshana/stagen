export interface BillingPlan {
  id: string
  name: string
  price: number
  billingCycle: "Monthly" | "Annual"
  description: string
  features: string[]
  recommended?: boolean
}

export interface PaymentMethodInfo {
  brand: string
  last4: string
  expMonth: string
  expYear: string
  cardholderName: string
}

export interface InvoiceItem {
  id: string
  invoiceNumber: string
  date: string
  amount: number
  status: "Paid" | "Pending" | "Failed"
  pdfUrl?: string
  items: {
    description: string
    amount: number
  }[]
}

export interface SiteLicenceInfo {
  used: number
  total: number
  costPerLicence: number
}
