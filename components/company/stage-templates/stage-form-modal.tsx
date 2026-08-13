"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { TemplateStage } from "./stage-templates-stats";

interface StageFormModalProps {
  stage: TemplateStage | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (stage: { id: string; name: string; weight: number }) => void;
}

export default function StageFormModal({
  stage,
  isOpen,
  onClose,
  onSave,
}: StageFormModalProps) {
  const isEdit = !!stage;

  const [name, setName] = useState("");
  const [weight, setWeight] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (stage) {
      setName(stage.name);
      setWeight(stage.weight);
    } else {
      setName("");
      setWeight(0);
    }
    setErrors({});
  }, [stage, isOpen]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = "Stage Name is required";
    if (weight < 0 || weight > 100) newErrors.weight = "Weight must be between 0 and 100";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;

    onSave({
      id: stage?.id || `stage-${Date.now()}`,
      name: name.trim(),
      weight: Number(weight),
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md bg-palladian text-blue-fantastic font-sans border border-blue-fantastic/20 max-h-[90vh] overflow-y-auto rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold font-sans text-blue-fantastic border-b border-blue-fantastic/5 pb-2">
            {isEdit ? "Edit Stage Details" : "Create New Stage"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-3">
          {/* Stage Name */}
          <div className="space-y-1">
            <Label htmlFor="name" className="text-xs font-bold text-blue-fantastic/70">
              Stage Name
            </Label>
            <Input
              id="name"
              placeholder="e.g. Slab, Frame, Lockup"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`bg-palladian border-blue-fantastic/15 text-blue-fantastic h-9 focus-visible:ring-truffle-trouble ${
                errors.name ? "border-red-500" : ""
              }`}
            />
            {errors.name && <p className="text-[10px] text-red-500 font-bold">{errors.name}</p>}
          </div>

          {/* Weight Percentage */}
          <div className="space-y-1">
            <Label htmlFor="weight" className="text-xs font-bold text-blue-fantastic/70">
              Progress Weight Percentage (%)
            </Label>
            <Input
              id="weight"
              type="number"
              min="0"
              max="100"
              placeholder="e.g. 15"
              value={weight || ""}
              onChange={(e) => setWeight(Number(e.target.value))}
              className={`bg-palladian border-blue-fantastic/15 text-blue-fantastic h-9 focus-visible:ring-truffle-trouble ${
                errors.weight ? "border-red-500" : ""
              }`}
            />
            {errors.weight && <p className="text-[10px] text-red-500 font-bold">{errors.weight}</p>}
          </div>
        </div>

        <div className="flex justify-end gap-2 border-t border-blue-fantastic/10 pt-3.5 mt-2">
          <Button
            variant="outline"
            onClick={onClose}
            className="text-xs font-bold border-blue-fantastic/20 text-blue-fantastic hover:bg-blue-fantastic/10 h-9 rounded-xl px-4"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            className="bg-truffle-trouble text-palladian hover:bg-truffle-trouble/85 text-xs font-bold h-9 rounded-xl px-5"
          >
            {isEdit ? "Save Changes" : "Create Stage"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
