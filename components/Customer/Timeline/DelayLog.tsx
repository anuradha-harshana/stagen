"use client";

import React from "react";
import { DelayLogEntry } from "@/lib/timeline/data";
import DelayLogItem from "./DelayLogItem";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { CalendarClock, ShieldCheck } from "lucide-react";

interface DelayLogProps {
  logs: DelayLogEntry[];
}

export default function DelayLog({ logs }: DelayLogProps) {
  const hasLogs = logs.length > 0;

  return (
    <Card className="bg-palladian border border-blue-fantastic/5 shadow-[0_6px_20px_rgba(27,38,50,0.03)] rounded-2xl overflow-hidden">
      <CardHeader className="border-b border-blue-fantastic/[0.03] pb-4 pt-5 px-6">
        <div className="flex items-center gap-2.5">
          <div className="h-8 w-8 rounded-xl bg-truffle-trouble/10 flex items-center justify-center text-truffle-trouble">
            <CalendarClock className="h-4.5 w-4.5" />
          </div>
          <div>
            <CardTitle className="text-blue-fantastic text-base font-extrabold font-cream leading-tight">
              Schedule Adjustments Log
            </CardTitle>
            <p className="text-[10px] text-blue-fantastic/55 font-bold uppercase tracking-wider mt-0.5">
              Transparent history of construction date modifications
            </p>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-6">
        {hasLogs ? (
          <div className="space-y-4">
            {logs.map((log) => (
              <DelayLogItem key={log.id} entry={log} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-10 px-4 text-center border-2 border-dashed border-emerald-500/10 bg-emerald-500/[0.01] rounded-2xl">
            <div className="h-12 w-12 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 mb-3 shadow-sm">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h4 className="text-sm font-extrabold text-blue-fantastic font-sans">
              Perfect Schedule Baseline
            </h4>
            <p className="text-xs text-blue-fantastic/60 font-medium max-w-sm mt-1">
              No date revisions or delay events have been recorded. Your project is pacing exactly as originally estimated!
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
