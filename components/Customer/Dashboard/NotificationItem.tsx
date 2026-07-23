"use client";

import React from "react";
import { AlertTriangle, Info, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import { NotificationData } from "@/lib/dashboard/data";

interface NotificationItemProps {
  notification: NotificationData;
}

export default function NotificationItem({ notification }: NotificationItemProps) {
  const isUrgent = notification.type === "urgent";

  return (
    <div
      className={cn(
        "flex items-start gap-3.5 p-4 rounded-2xl transition-all duration-300 border",
        isUrgent
          ? "bg-truffle-trouble/5 border-truffle-trouble/20 border-l-4 border-l-truffle-trouble hover:bg-truffle-trouble/[0.08]"
          : "bg-white border-blue-fantastic/[0.03] hover:border-truffle-trouble/10 hover:shadow-[0_4px_12px_rgba(27,38,50,0.02)]"
      )}
    >
      {/* Icon Section */}
      <div
        className={cn(
          "flex items-center justify-center w-9 h-9 rounded-xl shrink-0 mt-0.5",
          isUrgent
            ? "bg-truffle-trouble/10 text-truffle-trouble"
            : "bg-blue-fantastic/10 text-blue-fantastic"
        )}
      >
        {isUrgent ? (
          <AlertTriangle className="h-4.5 w-4.5 text-truffle-trouble animate-pulse" />
        ) : (
          <Info className="h-4.5 w-4.5 text-blue-fantastic/80" />
        )}
      </div>

      {/* Description & Timestamp */}
      <div className="flex-1 min-w-0 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-4">
        <p
          className={cn(
            "text-sm font-semibold truncate-2-lines leading-snug",
            isUrgent ? "text-truffle-trouble font-bold" : "text-blue-fantastic/85"
          )}
        >
          {notification.title}
        </p>
        
        <div className="flex items-center gap-1.5 shrink-0 text-blue-fantastic/45 text-xs font-semibold">
          <Calendar className="h-3.5 w-3.5 text-blue-fantastic/30" />
          <span>{notification.date}</span>
        </div>
      </div>
    </div>
  );
}
