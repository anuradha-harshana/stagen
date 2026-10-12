"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Project } from "@/lib/db-mock/projectsData";

interface ReassignModalProps {
  project: Project | null;
  supervisors: string[];
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (projectId: string, supervisorName: string) => void;
}

export default function ReassignModal({
  project,
  supervisors,
  isOpen,
  onClose,
  onConfirm,
}: ReassignModalProps) {
  const [selectedSupervisor, setSelectedSupervisor] = useState("Unassigned");

  useEffect(() => {
    if (project) {
      setSelectedSupervisor(project.supervisorName || "Unassigned");
    }
  }, [project, isOpen]);

  const handleSave = () => {
    if (project) {
      onConfirm(project.id, selectedSupervisor);
    }
  };

  if (!project) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md bg-white text-blue-fantastic font-sans border border-blue-fantastic/20 max-h-[90vh] overflow-y-auto rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold font-sans text-blue-fantastic border-b border-blue-fantastic/5 pb-2">
            Reassign Supervisor: Lot {project.id}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-3">
          <div className="p-3.5 bg-blue-fantastic/4 rounded-xl border border-blue-fantastic/5 text-xs font-semibold space-y-1 text-blue-fantastic/80">
            <p>Client: <strong>{project.clientName}</strong></p>
            <p>Address: <strong>{project.address}</strong></p>
            <p>Current stage: <strong>{project.currentStage} ({project.progress}% completed)</strong></p>
          </div>

          {/* Supervisor dropdown */}
          <div className="space-y-1.5">
            <Label className="text-xs font-bold text-blue-fantastic/70">
              Select Site Construction Supervisor
            </Label>
            <Select value={selectedSupervisor} onValueChange={setSelectedSupervisor}>
              <SelectTrigger className="bg-white border-blue-fantastic/15 text-blue-fantastic h-9 text-sm focus:ring-truffle-trouble">
                <SelectValue placeholder="Select Supervisor" />
              </SelectTrigger>
              <SelectContent className="bg-white text-blue-fantastic border-blue-fantastic/10">
                <SelectItem value="Unassigned" className="text-xs font-bold font-sans text-blue-fantastic/60">
                  Unassigned
                </SelectItem>
                {supervisors.map((sup) => (
                  <SelectItem key={sup} value={sup} className="text-xs font-bold font-sans">
                    {sup}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex justify-end gap-2 border-t border-blue-fantastic/10 pt-3.5 mt-2">
          <Button
            variant="outline"
            onClick={onClose}
            className="text-xs font-bold border-blue-fantastic/20 text-blue-fantastic hover:bg-blue-fantastic/10 h-9 rounded-xl px-4 cursor-pointer"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            className="bg-truffle-trouble text-palladian hover:bg-truffle-trouble/85 text-xs font-bold h-9 rounded-xl px-5 cursor-pointer"
          >
            Confirm Reassignment
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
