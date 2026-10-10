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
import { DefectItem } from "./WarrantyStats";

interface DefectManagementModalProps {
  defect: DefectItem | null;
  supervisors: string[];
  isOpen: boolean;
  onClose: () => void;
  onSave: (id: string, updates: Partial<DefectItem>) => void;
}

export default function DefectManagementModal({
  defect,
  supervisors,
  isOpen,
  onClose,
  onSave,
}: DefectManagementModalProps) {
  const [status, setStatus] = useState<"open" | "in-progress" | "resolved">( "open");
  const [priority, setPriority] = useState<"Low" | "Medium" | "High">("Low");
  const [assignedSupervisor, setAssignedSupervisor] = useState("Unassigned");

  useEffect(() => {
    if (defect) {
      setStatus(defect.status);
      setPriority(defect.priority);
      setAssignedSupervisor(defect.assignedSupervisor);
    }
  }, [defect, isOpen]);

  const handleSave = () => {
    if (defect) {
      onSave(defect.id, {
        status,
        priority,
        assignedSupervisor,
      });
    }
  };

  if (!defect) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md bg-white text-blue-fantastic font-sans border border-blue-fantastic/20 max-h-[90vh] overflow-y-auto rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold font-sans text-blue-fantastic border-b border-blue-fantastic/5 pb-2">
            Manage Defect Ticket: {defect.id}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-3">
          {/* Summary info */}
          <div className="p-3.5 bg-blue-fantastic/4 rounded-xl border border-blue-fantastic/5 space-y-1.5 text-xs font-semibold">
            <p>
              Title: <strong className="text-blue-fantastic">{defect.title}</strong>
            </p>
            <p>
              Client: <strong>{defect.clientName}</strong> (Lot {defect.projectId.toUpperCase()})
            </p>
            <p>
              Area: <strong>{defect.area}</strong> · Reported: <strong>{defect.reported}</strong>
            </p>
            {defect.description && (
              <p className="text-[11px] text-blue-fantastic/75 leading-relaxed pt-1.5 border-t border-blue-fantastic/5 mt-1.5">
                Description: {defect.description}
              </p>
            )}
          </div>

          {/* Status field */}
          <div className="space-y-1">
            <Label className="text-xs font-bold text-blue-fantastic/70">Ticket Status</Label>
            <Select
              value={status}
              onValueChange={(val: "open" | "in-progress" | "resolved") => setStatus(val)}
            >
              <SelectTrigger className="bg-white border-blue-fantastic/15 text-blue-fantastic h-9 text-sm focus:ring-truffle-trouble">
                <SelectValue placeholder="Select Status" />
              </SelectTrigger>
              <SelectContent className="bg-white text-blue-fantastic border-blue-fantastic/10">
                <SelectItem value="open" className="text-xs font-bold font-sans">
                  Open / New
                </SelectItem>
                <SelectItem value="in-progress" className="text-xs font-bold font-sans">
                  In Progress
                </SelectItem>
                <SelectItem value="resolved" className="text-xs font-bold font-sans">
                  Resolved
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Priority field */}
          <div className="space-y-1">
            <Label className="text-xs font-bold text-blue-fantastic/70">Severity Priority</Label>
            <Select
              value={priority}
              onValueChange={(val: "Low" | "Medium" | "High") => setPriority(val)}
            >
              <SelectTrigger className="bg-white border-blue-fantastic/15 text-blue-fantastic h-9 text-sm focus:ring-truffle-trouble">
                <SelectValue placeholder="Select Priority" />
              </SelectTrigger>
              <SelectContent className="bg-white text-blue-fantastic border-blue-fantastic/10">
                <SelectItem value="Low" className="text-xs font-bold font-sans text-blue-700">
                  Low
                </SelectItem>
                <SelectItem value="Medium" className="text-xs font-bold font-sans text-amber-700">
                  Medium
                </SelectItem>
                <SelectItem value="High" className="text-xs font-bold font-sans text-red-700">
                  High Priority
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Supervisor Assignee field */}
          <div className="space-y-1">
            <Label className="text-xs font-bold text-blue-fantastic/70">Assigned Site Supervisor</Label>
            <Select
              value={assignedSupervisor}
              onValueChange={(val) => setAssignedSupervisor(val)}
            >
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
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
