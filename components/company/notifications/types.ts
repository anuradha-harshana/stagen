export type DeliveryChannel = "email" | "in_app" | "push"

export interface TemplateVariable {
  key: string
  label: string
}

export interface NotificationTemplate {
  id: string
  title: string
  channels: DeliveryChannel[]
  subject: string
  body: string
  updatedAt?: string
}

export type TriggerEventType = 
  | "stage_completed" 
  | "milestone_overdue" 
  | "document_uploaded" 
  | "invoice_issued" 
  | "inspection_scheduled"
  | "warranty_claim_submitted"

export interface AutomationRule {
  id: string
  name: string
  event: TriggerEventType
  eventLabel: string
  templateId: string
  templateName: string
  targetRoles: string[]
  active: boolean
  channels: DeliveryChannel[]
  delayMinutes?: number
}
