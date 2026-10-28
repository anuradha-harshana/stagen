"use client";

import { DelayLogEntry } from "@/lib/supervisor/types";
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

// Empty initial state; records are fetched through the supervisor API.
export const INITIAL_DELAY_MESSAGES: DelayMessage[] = [];

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
