"use client";

import React from "react";
import { 
  CloudRain, 
  Package, 
  FileCheck, 
  Wrench, 
  Users, 
  AlertTriangle, 
  CalendarDays, 
  Trash2,
  Clock
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DelayLogEntry } from "@/lib/timeline/data";

interface SupervisorDelayLogProps {
  delayLog: DelayLogEntry[];
  onDeleteLogEntry?: (id: number) => void;
}

export function SupervisorDelayLog({
  delayLog,
  onDeleteLogEntry,
}: SupervisorDelayLogProps) {
  if (!delayLog || delayLog.length === 0) {
    return (
      <Card className="bg-palladian/40 border border-blue-fantastic/15 shadow-xs font-cream">
        <CardContent className="py-8 px-4 text-center">
          <div className="h-10 w-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-700 mx-auto mb-2">
            <Clock className="h-5 w-5" />
          </div>
          <h4 className="text-sm font-bold font-cream text-blue-fantastic">No Schedule Adjustments Logged</h4>
          <p className="text-xs text-blue-fantastic/60 font-sans mt-1">
            Build schedule is running without recorded delays or timeline adjustments.
          </p>
        </CardContent>
      </Card>
    );
  }

  const getCategoryIcon = (type: DelayLogEntry["type"]) => {
    switch (type) {
      case "weather":
        return <CloudRain className="h-4 w-4 text-blue-600" />;
      case "materials":
        return <Package className="h-4 w-4 text-truffle-trouble" />;
      case "permits":
        return <FileCheck className="h-4 w-4 text-purple-600" />;
      case "machinery":
        return <Wrench className="h-4 w-4 text-amber-600" />;
      case "labor":
        return <Users className="h-4 w-4 text-emerald-600" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-truffle-trouble" />;
    }
  };

  return (
    <div className="space-y-3 font-cream">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-blue-fantastic font-cream">
            Schedule Adjustments Log
          </h3>
          <p className="text-xs text-blue-fantastic/60 font-sans">
            Official build adjustments, weather delays, and structural timeline revisions visible to customer
          </p>
        </div>
        <Badge variant="outline" className="bg-truffle-trouble/10 text-truffle-trouble border-truffle-trouble/30 text-xs font-bold">
          {delayLog.length} {delayLog.length === 1 ? "Adjustment" : "Adjustments"}
        </Badge>
      </div>

      <div className="space-y-3">
        {delayLog.map((entry) => (
          <Card
            key={entry.id}
            className="bg-palladian border border-blue-fantastic/15 shadow-xs hover:border-truffle-trouble/40 transition-all font-sans overflow-hidden"
          >
            <CardContent className="p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-start gap-3.5 flex-1">
                <div className="h-10 w-10 rounded-2xl bg-palladian/90 border border-blue-fantastic/15 flex items-center justify-center shrink-0 shadow-xs">
                  {getCategoryIcon(entry.type)}
                </div>

                <div className="space-y-1 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge className="bg-blue-fantastic/10 text-blue-fantastic border-blue-fantastic/20 text-[10px] font-bold font-cream">
                      {entry.stageName} Stage
                    </Badge>
                    <span className="text-[11px] text-blue-fantastic/50 font-mono">
                      Logged: {entry.date}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold font-cream text-blue-fantastic">
                    {entry.title}
                  </h4>

                  <p className="text-xs text-blue-fantastic/75 leading-relaxed">
                    {entry.reason}
                  </p>
                </div>
              </div>

              {/* Impact Card & Delete */}
              <div className="flex items-center gap-3 shrink-0 self-end md:self-center">
                <div className="bg-palladian/80 border border-truffle-trouble/30 px-3.5 py-2 rounded-xl text-right">
                  <span className="text-[9px] text-blue-fantastic/50 uppercase tracking-wider font-semibold block">
                    Schedule Impact
                  </span>
                  <div className="flex items-center gap-1.5 text-xs font-mono font-bold mt-0.5">
                    <span className="text-blue-fantastic/40 line-through">{entry.fromDate}</span>
                    <span className="text-blue-fantastic/40">→</span>
                    <span className="text-truffle-trouble font-bold">{entry.toDate}</span>
                  </div>
                </div>

                {onDeleteLogEntry && (
                  <button
                    type="button"
                    onClick={() => onDeleteLogEntry(entry.id)}
                    className="h-8 w-8 rounded-xl hover:bg-red-500/10 text-blue-fantastic/40 hover:text-red-600 flex items-center justify-center transition-colors"
                    title="Remove Log Entry"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
