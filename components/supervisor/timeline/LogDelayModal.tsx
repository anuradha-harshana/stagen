"use client";

import React, { useState } from "react";
import { 
  AlertTriangle, 
  CalendarDays, 
  FileText, 
  CloudRain, 
  Package, 
  FileCheck, 
  Wrench, 
  Users, 
  Save, 
  X 
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { DelayLogEntry, TimelineStage } from "@/lib/timeline/data";

interface LogDelayModalProps {
  isOpen: boolean;
  onClose: () => void;
  stages: TimelineStage[];
  onSaveDelayLog: (entry: DelayLogEntry) => void;
}

export function LogDelayModal({
  isOpen,
  onClose,
  stages,
  onSaveDelayLog,
}: LogDelayModalProps) {
  const [stageName, setStageName] = useState<string>(stages[0]?.name || "Slab");
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<"weather" | "materials" | "permits" | "machinery" | "labor">("weather");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [reason, setReason] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error("Please enter a title for the schedule adjustment");
      return;
    }
    if (!fromDate || !toDate) {
      toast.error("Please select both the old date and new adjusted date");
      return;
    }

    const todayStr = new Date().toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

    const newEntry: DelayLogEntry = {
      id: Date.now(),
      date: todayStr,
      stageName,
      title: title.trim(),
      fromDate,
      toDate,
      reason: reason.trim() || "Schedule adjusted per supervisor site update.",
      type: category,
    };

    onSaveDelayLog(newEntry);
    toast.success(`Schedule adjustment logged for ${stageName}!`);

    // Reset fields & close
    setTitle("");
    setFromDate("");
    setToDate("");
    setReason("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md w-[92vw] bg-white border-blue-fantastic/20 p-5 font-sans rounded-2xl">
        <DialogHeader className="pb-3 border-b border-blue-fantastic/10 text-left">
          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-truffle-trouble/15 border border-truffle-trouble/30 flex items-center justify-center text-truffle-trouble">
              <AlertTriangle className="h-4 w-4" />
            </div>
            <div>
              <DialogTitle className="text-blue-fantastic font-sans font-bold text-base leading-tight">
                Log Schedule Adjustment
              </DialogTitle>
              <DialogDescription className="text-xs text-blue-fantastic/60 font-sans mt-0.5">
                Record a milestone shift or site delay cause for customer timeline visibility
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-3 font-sans text-xs">
          {/* Stage Selection */}
          <div>
            <label className="block text-xs font-bold font-sans text-blue-fantastic mb-1">
              Affected Construction Stage
            </label>
            <Select value={stageName} onValueChange={setStageName}>
              <SelectTrigger className="w-full bg-white border-blue-fantastic/20 text-blue-fantastic font-sans font-bold text-xs h-9 rounded-xl">
                <SelectValue placeholder="Select Stage..." />
              </SelectTrigger>
              <SelectContent className="bg-white border-blue-fantastic/20 font-sans">
                {stages.map((s) => (
                  <SelectItem key={s.id} value={s.name} className="text-xs cursor-pointer">
                    {s.name} Stage
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Adjustment Title */}
          <div>
            <label className="block text-xs font-bold font-sans text-blue-fantastic mb-1">
              Adjustment Title
            </label>
            <Input
              placeholder="e.g. Slab Concrete Pour Postponed"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-white border-blue-fantastic/20 text-blue-fantastic placeholder:text-blue-fantastic/40 h-9 text-xs font-sans rounded-xl focus-visible:ring-truffle-trouble"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-bold font-sans text-blue-fantastic mb-1">
              Delay Category / Type
            </label>
            <Select
              value={category}
              onValueChange={(val: any) => setCategory(val)}
            >
              <SelectTrigger className="w-full bg-white border-blue-fantastic/20 text-blue-fantastic font-sans text-xs h-9 rounded-xl">
                <SelectValue placeholder="Select Category..." />
              </SelectTrigger>
              <SelectContent className="bg-white border-blue-fantastic/20 font-sans">
                <SelectItem value="weather" className="text-xs">🌧️ Weather Impact</SelectItem>
                <SelectItem value="materials" className="text-xs">📦 Materials Supply Delay</SelectItem>
                <SelectItem value="permits" className="text-xs">📋 Council Permits / Inspection</SelectItem>
                <SelectItem value="machinery" className="text-xs">🚜 Machinery / Equipment</SelectItem>
                <SelectItem value="labor" className="text-xs">👷 Trade Labor Availability</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Date Shift */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold font-sans text-blue-fantastic/70 mb-1">
                Original Date
              </label>
              <Input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="bg-white border-blue-fantastic/20 text-blue-fantastic h-8 text-xs font-sans rounded-xl"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold font-sans text-truffle-trouble mb-1">
                New Adjusted Date
              </label>
              <Input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="bg-white border-truffle-trouble/30 text-blue-fantastic h-8 text-xs font-sans rounded-xl"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold font-sans text-blue-fantastic mb-1">
              Site Reason / Notes
            </label>
            <Textarea
              placeholder="Explain cause of delay (e.g. 3 days of torrential rain prevented concrete truck site access)..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="bg-white border-blue-fantastic/20 text-blue-fantastic placeholder:text-blue-fantastic/40 min-h-[75px] text-xs font-sans rounded-xl focus-visible:ring-truffle-trouble"
            />
          </div>

          {/* Action Footer */}
          <div className="flex gap-2 justify-end pt-2 border-t border-blue-fantastic/10">
            <Button
              type="button"
              onClick={onClose}
              variant="ghost"
              className="h-8 text-xs px-3 text-blue-fantastic/70"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="h-8 text-xs px-4 bg-truffle-trouble hover:bg-truffle-trouble/90 text-palladian font-sans font-bold rounded-xl shadow-xs"
            >
              <Save className="h-3.5 w-3.5 mr-1" />
              Log Adjustment
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
