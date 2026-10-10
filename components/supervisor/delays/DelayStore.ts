"use client";

import { DelayLogEntry } from "@/lib/timeline/data";
import { 
  INITIAL_SUPERVISOR_TIMELINES, 
  recalculateTimelineStats 
} from "@/components/supervisor/timeline/supervisor-timeline-store";

export interface DelayMessage {
  id: string;
  projectId: string;
  delayId?: string;
  recipientName: string;
  recipientEmail: string;
  stageName: string;
  subject: string;
  body: string;
  sentAt: string;
  status: "sent" | "delivered" | "read";
}

// Initial mock customer delay messages
export const INITIAL_DELAY_MESSAGES: DelayMessage[] = [
  {
    id: "msg-1",
    projectId: "lot-104",
    delayId: "delay-1",
    recipientName: "Eleanor Vance",
    recipientEmail: "eleanor.vance@example.com",
    stageName: "Frame",
    subject: "Build Schedule Impact: Heavy Storm Delay (Frame Stage)",
    body: "Hi Eleanor, due to severe storm conditions experienced on site over the past week, framing work was safely paused to protect structural materials. Work has resumed today, and our revised projected completion date is now Sep 16, 2024.",
    sentAt: "Jun 16, 2024 at 09:30 AM",
    status: "read",
  },
  {
    id: "msg-2",
    projectId: "lot-104",
    delayId: "delay-2",
    recipientName: "Eleanor Vance",
    recipientEmail: "eleanor.vance@example.com",
    stageName: "Lockup",
    subject: "Supply Adjustment: Window Fixture Delivery",
    body: "Hi Eleanor, customized double-glazed window units have been re-routed by our supplier. Work on Lockup stage will proceed seamlessly once delivered on Sep 22, 2024.",
    sentAt: "Jun 20, 2024 at 02:15 PM",
    status: "delivered",
  },
  {
    id: "msg-3",
    projectId: "lot-208",
    delayId: "delay-208-1",
    recipientName: "Marcus Sterling",
    recipientEmail: "m.sterling@example.com",
    stageName: "Site Cut",
    subject: "Site Excavation Adjustment: Drainage Permit",
    body: "Hi Marcus, local council inspection for perimeter drainage required a 4-day administrative review. Excavation completed on May 06, 2026.",
    sentAt: "May 03, 2026 at 11:00 AM",
    status: "read",
  },
];

/**
 * Returns delay category metadata for visual styling and icon selection.
 */
export function getDelayCategoryMeta(type: DelayLogEntry["type"] | string) {
  switch (type) {
    case "weather":
      return {
        label: "Weather / Storm",
        bgClass: "bg-sky-50 text-sky-800 border-sky-200",
        badgeBg: "bg-sky-100 text-sky-800",
        iconName: "CloudRain",
      };
    case "materials":
      return {
        label: "Material Supply",
        bgClass: "bg-burning-flame/10 text-truffle-trouble border-burning-flame/20",
        badgeBg: "bg-burning-flame/20 text-truffle-trouble",
        iconName: "Package",
      };
    case "permits":
      return {
        label: "Permits & Inspections",
        bgClass: "bg-purple-50 text-purple-800 border-purple-200",
        badgeBg: "bg-purple-100 text-purple-800",
        iconName: "FileCheck",
      };
    case "machinery":
      return {
        label: "Equipment Breakdown",
        bgClass: "bg-amber-50 text-amber-800 border-amber-200",
        badgeBg: "bg-amber-100 text-amber-800",
        iconName: "Wrench",
      };
    case "labor":
      return {
        label: "Labor Availability",
        bgClass: "bg-teal-50 text-teal-800 border-teal-200",
        badgeBg: "bg-teal-100 text-teal-800",
        iconName: "Users",
      };
    default:
      return {
        label: "General Schedule Adjustment",
        bgClass: "bg-blue-fantastic/10 text-blue-fantastic border-blue-fantastic/20",
        badgeBg: "bg-blue-fantastic/15 text-blue-fantastic",
        iconName: "AlertTriangle",
      };
  }
}
