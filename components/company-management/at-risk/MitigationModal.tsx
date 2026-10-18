"use client";

import React, { useState } from "react";
import { Project } from "@/lib/types/project";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertTriangle, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

interface MitigationModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
  onSaveAction?: (projectId: string, actionNote: string, newSeverity: string) => void;
}

export function MitigationModal({ project, isOpen, onClose, onSaveAction }: MitigationModalProps) {
  const [actionNote, setActionNote] = useState("");
  const [newSeverity, setNewSeverity] = useState("Medium");
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!project) return null;

  const topDelay = project.delays?.[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSaveAction) {
      onSaveAction(project.id, actionNote, newSeverity);
    }
    toast.success(`Mitigation action recorded for Lot ${project.id}`);
    setIsSubmitted(true);
    setTimeout(() => {
      setIsSubmitted(false);
      setActionNote("");
      onClose();
    }, 800);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-lg bg-white border border-blue-fantastic/15 rounded-2xl p-6 font-sans">
        <DialogHeader className="space-y-1 text-left">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-burning-flame/15 flex items-center justify-center text-truffle-trouble">
              <AlertTriangle className="h-4 w-4" />
            </div>
            <DialogTitle className="text-xl font-bold text-blue-fantastic font-sans">
              Log Mitigation Action – Lot {project.id}
            </DialogTitle>
          </div>
          <DialogDescription className="text-xs text-blue-fantastic/60">
            {project.clientName} • {project.address} (Current Stage: <strong>{project.currentStage}</strong>)
          </DialogDescription>
        </DialogHeader>

        {isSubmitted ? (
          <div className="py-8 flex flex-col items-center justify-center text-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <h4 className="text-sm font-bold text-blue-fantastic">Action Logged Successfully</h4>
            <p className="text-xs text-blue-fantastic/60">
              Mitigation record saved for management and supervisor review.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 pt-2">
            {/* Active delay summary box */}
            {topDelay && (
              <div className="p-3 rounded-xl bg-burning-flame/10 border border-burning-flame/20 text-xs">
                <span className="font-bold text-truffle-trouble block mb-1">
                  Active Delay: {topDelay.type} ({topDelay.durationDays} Days)
                </span>
                <p className="text-blue-fantastic/80 font-medium">
                  {topDelay.description}
                </p>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-blue-fantastic">
                Follow-up Priority
              </label>
              <Select value={newSeverity} onValueChange={setNewSeverity}>
                <SelectTrigger className="w-full bg-surface-inset border-blue-fantastic/15 rounded-xl text-xs font-semibold text-blue-fantastic h-10">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Critical">Critical – Stop work / immediate intervention</SelectItem>
                  <SelectItem value="High">High – Supervisor check required today</SelectItem>
                  <SelectItem value="Medium">Medium – Monitor milestone progression</SelectItem>
                  <SelectItem value="Resolved">Resolved – Delay absorbed in buffer</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-blue-fantastic">
                Management Mitigation Plan / Supervisor Note
              </label>
              <Textarea
                required
                placeholder="Detail agreed actions (e.g. approved secondary trade team, re-scheduled inspection with private certifier)..."
                value={actionNote}
                onChange={(e) => setActionNote(e.target.value)}
                rows={4}
                className="bg-surface-inset border-blue-fantastic/15 rounded-xl text-xs text-blue-fantastic placeholder:text-blue-fantastic/40 font-medium p-3"
              />
            </div>

            <DialogFooter className="flex items-center justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="border-blue-fantastic/20 text-blue-fantastic hover:bg-blue-fantastic/5 text-xs font-bold h-9 px-4 rounded-xl cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-truffle-trouble text-palladian hover:bg-truffle-trouble/90 text-xs font-bold h-9 px-4 rounded-xl cursor-pointer shadow-xs"
              >
                Save Action Note
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
