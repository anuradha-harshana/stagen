"use client";

import React, { useState, useEffect } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { DelayLogEntry, TimelineStage } from "@/lib/timeline/data";
import { AlertTriangle, Upload, X, Check, Image as ImageIcon, Send } from "lucide-react";
import { toast } from "sonner";

interface LogDelayFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  stages: TimelineStage[];
  onSaveDelay: (newEntry: DelayLogEntry, autoNotify: boolean) => void;
  initialEntry?: DelayLogEntry | null;
}

export function LogDelayFormModal({
  isOpen,
  onClose,
  stages,
  onSaveDelay,
  initialEntry,
}: LogDelayFormModalProps) {
  const [stageName, setStageName] = useState<string>(stages[0]?.name || "Frame");
  const [title, setTitle] = useState<string>("");
  const [type, setType] = useState<DelayLogEntry["type"]>("weather");
  const [fromDate, setFromDate] = useState<string>("");
  const [toDate, setToDate] = useState<string>("");
  const [reason, setReason] = useState<string>("");
  const [attachedPhoto, setAttachedPhoto] = useState<string | null>(null);
  const [autoNotify, setAutoNotify] = useState<boolean>(true);

  useEffect(() => {
    if (initialEntry) {
      setStageName(initialEntry.stageName);
      setTitle(initialEntry.title);
      setType(initialEntry.type);
      setFromDate(initialEntry.fromDate);
      setToDate(initialEntry.toDate);
      setReason(initialEntry.reason);
    } else {
      setStageName(stages[0]?.name || "Frame");
      setTitle("");
      setType("weather");
      setFromDate(new Date().toISOString().split("T")[0]);
      
      const future = new Date();
      future.setDate(future.getDate() + 7);
      setToDate(future.toISOString().split("T")[0]);
      
      setReason("");
      setAttachedPhoto(null);
      setAutoNotify(true);
    }
  }, [initialEntry, isOpen, stages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error("Please enter a title for the delay entry");
      return;
    }

    const todayStr = new Date().toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

    const entryToSave: DelayLogEntry = {
      id: initialEntry ? Number(initialEntry.id) : Date.now(),
      date: todayStr,
      stageName,
      title: title.trim(),
      type,
      fromDate,
      toDate,
      reason: reason.trim() || "Schedule adjusted per supervisor site update.",
    };

    onSaveDelay(entryToSave, autoNotify);
    toast.success(initialEntry ? "Delay log updated successfully" : "New delay incident logged");
    onClose();
  };

  const handleSimulatedPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const fakeUrl = URL.createObjectURL(file);
      setAttachedPhoto(fakeUrl);
      toast.success("Supporting photo attached");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg bg-palladian border-blue-fantastic/20 text-blue-fantastic font-sans rounded-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-1">
          <div className="flex items-center gap-2 text-truffle-trouble font-bold font-sans">
            <AlertTriangle className="h-5 w-5" />
            <DialogTitle className="text-lg font-black font-sans text-blue-fantastic">
              {initialEntry ? "Edit Delay Incident" : "Log New Schedule Delay"}
            </DialogTitle>
          </div>
          <DialogDescription className="text-xs text-blue-fantastic/70">
            Log official schedule adjustments, weather delays, or material issues. This will update baseline estimates and customer timeline logs.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          {/* Construction Stage & Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-blue-fantastic">Affected Construction Stage</Label>
              <Select value={stageName} onValueChange={setStageName}>
                <SelectTrigger className="bg-palladian border-blue-fantastic/20 text-xs font-bold font-sans text-blue-fantastic h-9 rounded-xl">
                  <SelectValue placeholder="Select stage..." />
                </SelectTrigger>
                <SelectContent className="bg-palladian border-blue-fantastic/20">
                  {stages.map((stg) => (
                    <SelectItem key={stg.id} value={stg.name} className="text-xs">
                      {stg.name} Stage
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-bold text-blue-fantastic">Delay Category / Cause</Label>
              <Select value={type} onValueChange={(val) => setType(val as DelayLogEntry["type"])}>
                <SelectTrigger className="bg-palladian border-blue-fantastic/20 text-xs font-bold font-sans text-blue-fantastic h-9 rounded-xl">
                  <SelectValue placeholder="Category..." />
                </SelectTrigger>
                <SelectContent className="bg-palladian border-blue-fantastic/20">
                  <SelectItem value="weather" className="text-xs">Weather / Storm</SelectItem>
                  <SelectItem value="materials" className="text-xs">Material Delivery</SelectItem>
                  <SelectItem value="labor" className="text-xs">Labor Availability</SelectItem>
                  <SelectItem value="machinery" className="text-xs">Equipment Failure</SelectItem>
                  <SelectItem value="permits" className="text-xs">Permits & Inspection</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Title */}
          <div className="space-y-1.5">
            <Label className="text-xs font-bold text-blue-fantastic">Incident Title</Label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Heavy Storm Site Closure / Framing Timber Delay"
              className="bg-palladian border-blue-fantastic/20 text-xs font-semibold text-blue-fantastic h-9 rounded-xl"
            />
          </div>

          {/* Schedule Impact Dates */}
          <div className="p-3.5 bg-blue-fantastic/5 border border-blue-fantastic/10 rounded-xl space-y-3">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-truffle-trouble block">
              SCHEDULE IMPACT (DATES)
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-[11px] font-bold text-blue-fantastic/70">Original Target Date</Label>
                <Input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="bg-palladian border-blue-fantastic/20 text-xs h-8 rounded-lg"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-[11px] font-bold text-blue-fantastic">Revised Projected Date</Label>
                <Input
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="bg-palladian border-blue-fantastic/20 text-xs h-8 rounded-lg font-bold text-truffle-trouble"
                />
              </div>
            </div>
          </div>

          {/* Reason / Description */}
          <div className="space-y-1.5">
            <Label className="text-xs font-bold text-blue-fantastic">Description & Cause Details</Label>
            <Textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={3}
              placeholder="Provide context regarding the site conditions, safety precautions, or supplier communication..."
              className="bg-palladian border-blue-fantastic/20 text-xs text-blue-fantastic rounded-xl resize-none"
            />
          </div>

          {/* Supporting Photo Attachment Stub */}
          <div className="space-y-1.5">
            <Label className="text-xs font-bold text-blue-fantastic">Supporting Site Photo (Optional)</Label>
            {attachedPhoto ? (
              <div className="flex items-center justify-between p-2.5 bg-palladian border border-blue-fantastic/20 rounded-xl">
                <div className="flex items-center gap-2 truncate">
                  <ImageIcon className="h-4 w-4 text-emerald-600 shrink-0" />
                  <span className="text-xs font-semibold text-blue-fantastic truncate">site_inspection_photo.jpg</span>
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setAttachedPhoto(null)}
                  className="h-7 w-7 p-0 text-blue-fantastic/50 hover:text-truffle-trouble"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center p-3 bg-palladian border border-dashed border-blue-fantastic/20 rounded-xl cursor-pointer hover:bg-blue-fantastic/5 transition-colors">
                <Upload className="h-4 w-4 text-blue-fantastic/50 mb-1" />
                <span className="text-[11px] font-bold text-blue-fantastic/70">Click to upload photo evidence</span>
                <span className="text-[9px] text-blue-fantastic/50">PNG, JPG up to 10MB</span>
                <input type="file" accept="image/*" className="hidden" onChange={handleSimulatedPhotoUpload} />
              </label>
            )}
          </div>

          {/* Option to Auto-Notify Customer */}
          {!initialEntry && (
            <label className="flex items-center gap-2 p-2.5 bg-burning-flame/10 border border-burning-flame/20 rounded-xl cursor-pointer">
              <input
                type="checkbox"
                checked={autoNotify}
                onChange={(e) => setAutoNotify(e.target.checked)}
                className="h-4 w-4 rounded accent-truffle-trouble cursor-pointer"
              />
              <div className="flex items-center gap-1.5 text-xs font-bold text-blue-fantastic">
                <Send className="h-3.5 w-3.5 text-truffle-trouble shrink-0" />
                <span>Prompt to compose customer notification message after saving</span>
              </div>
            </label>
          )}

          <div className="flex items-center justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="bg-palladian border-blue-fantastic/20 text-blue-fantastic font-bold text-xs rounded-xl h-9"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-truffle-trouble hover:bg-truffle-trouble/90 text-palladian font-bold font-sans text-xs rounded-xl h-9 px-4 shadow-sm"
            >
              {initialEntry ? "Save Changes" : "Log Delay Incident"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
