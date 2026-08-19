export interface ChecklistItem {
  id: string;
  label: string;
  completed: boolean;
}

export interface Stage {
  name: string;
  status: "Completed" | "Active" | "Pending";
  progress: number;
  checklist: ChecklistItem[];
}

export interface DelayLog {
  id: string;
  type: "Weather" | "Materials" | "Inspections" | "Trade Availability";
  durationDays: number;
  description: string;
  date: string;
}

export interface CustomerQuestion {
  id: string;
  customerName: string;
  questionText: string;
  date: string;
  replied: boolean;
  replyText?: string;
}

export interface Project {
  id: string;
  clientName: string;
  address: string;
  status: "On Track" | "Delayed" | "Action Required" | "Completed";
  progress: number;
  currentStage: string;
  startDate: string;
  estHandover: string;
  imageGradient: string;
  stages: Stage[];
  delays: DelayLog[];
  questions: CustomerQuestion[];
  supervisorName?: string;
  delayDays?: number;
  lastUpdate?: string;
}