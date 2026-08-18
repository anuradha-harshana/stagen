"use client";

import React, { useState } from "react";
import { Project } from "@/lib/db-mock/projectsData";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertTriangle, ShieldCheck, Check } from "lucide-react";

interface MitigationModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
  onSaveAction: (projectId: string, actionNote: string, newSeverity: string) => void;
}

export function MitigationModal({ project, isOpen, onClose, onSaveAction }: MitigationModalProps) {
  const [actionNote, setActionNote] = useState("");
  const [newSeverity, setNewSeverity] = useState("Medium");
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!project) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveAction(project.id, actionNote, newSeverity);
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setActionNote("");
      onClose();
    }, 1000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-lg bg-white border border-blue-fantastic/15 rounded-3xl p-6 font-sans">
        <DialogHeader className="space-y-1 text-left">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-truffle-trouble" />
            <DialogTitle className="text-xl font-bold text-blue-fantastic font-sans">
              Log Mitigation Action - {project.id}
            </DialogTitle>
          </div>
          <DialogDescription className="text-xs text-blue-fantastic/60">
            {project.clientName} ({project.address}) - Current Stage: <strong>{project.currentStage}</strong>
          </DialogDescription>
        </DialogHeader>

        {isSubmitted ? (
          <div className="py-8 flex flex-col items-center justify-center text-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <Check className="h-6 w-6" />
            </div>
            <h4 className="font-bold text-base text-blue-fantastic font-sans">
              Mitigation Recorded!
            </h4>
            <p className="text-xs text-blue-fantastic/60">
              The mitigation action has been logged into the project timeline and assigned supervisors notified.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 pt-2">
            <div className="p-3 bg-red-50 border border-red-200 rounded-2xl text-xs space-y-1 text-red-900">
              <span className="font-bold block">Current Delay Impact: {project.delayDays || 5} Days</span>
              <p className="text-[11px] text-red-800 font-medium">
                {project.delays?.[0]?.description || "Trade contractor delay and material delivery hold."}
              </p>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-blue-fantastic block">Updated Severity Level</label>
              <Select value={newSeverity} onValueChange={setNewSeverity}>
                <SelectTrigger className="bg-surface-inset border-blue-fantastic/15 rounded-xl text-xs font-bold text-blue-fantastic h-9">
                  <SelectValue placeholder="Select severity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Critical">Critical (&gt; 7 Days Delay)</SelectItem>
                  <SelectItem value="High">High (5-7 Days Delay)</SelectItem>
                  <SelectItem value="Medium">Medium (3-5 Days Delay)</SelectItem>
                  <SelectItem value="Low">Low (&lt; 3 Days Delay)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-blue-fantastic block">Mitigating Action / Note</label>
              <Textarea
                required
                rows={3}
                placeholder="Detail action taken (e.g. Expedited bricklayer trade assignment, arranged weekend site work)..."
                value={actionNote}
                onChange={(e) => setActionNote(e.target.value)}
                className="bg-surface-inset border-blue-fantastic/15 rounded-xl text-xs text-blue-fantastic placeholder:text-blue-fantastic/40 font-medium"
              />
            </div>

            <DialogFooter className="pt-2 flex gap-2">
              <Button type="button" variant="outline" onClick={onClose} className="rounded-xl text-xs font-bold">
                Cancel
              </Button>
              <Button type="submit" className="bg-truffle-trouble hover:bg-truffle-trouble/90 text-white rounded-xl text-xs font-bold cursor-pointer">
                Save & Notify Team
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
