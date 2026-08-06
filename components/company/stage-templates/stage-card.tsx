"use client";

import React, { useState } from "react";
import {
  ArrowUp,
  ArrowDown,
  Trash2,
  Plus,
  Edit2,
  CheckCircle,
  FileCheck
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { TemplateStage } from "./stage-templates-stats";

interface StageCardProps {
  stage: TemplateStage;
  index: number;
  totalStages: number;
  onMoveUp: (id: string) => void;
  onMoveDown: (id: string) => void;
  onEdit: (stage: TemplateStage) => void;
  onDelete: (id: string) => void;
  onAddChecklistItem: (stageId: string, itemLabel: string) => void;
  onDeleteChecklistItem: (stageId: string, itemId: string) => void;
}

export default function StageCard({
  stage,
  index,
  totalStages,
  onMoveUp,
  onMoveDown,
  onEdit,
  onDelete,
  onAddChecklistItem,
  onDeleteChecklistItem,
}: StageCardProps) {
  const [newItemText, setNewItemText] = useState("");

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemText.trim()) return;
    onAddChecklistItem(stage.id, newItemText.trim());
    setNewItemText("");
  };

  const padZero = (n: number) => (n < 10 ? `0${n}` : `${n}`);

  return (
    <Card className="group relative overflow-hidden bg-palladian border border-blue-fantastic/15 shadow-sm hover:shadow-md hover:border-blue-fantastic/30 transition-all duration-200 flex flex-col justify-between h-full font-cream">
      {/* Accent Line */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-burning-flame/50 via-truffle-trouble/50 to-transparent" />

      <div>
        <CardHeader className="pb-3 border-b border-blue-fantastic/5">
          <div className="flex items-center justify-between gap-3">
            {/* Index & Name */}
            <div className="flex items-center gap-2 min-w-0">
              <span className="h-8 w-8 rounded-xl bg-burning-flame/15 border border-burning-flame/20 flex items-center justify-center font-extrabold text-truffle-trouble text-sm shrink-0">
                {padZero(index + 1)}
              </span>
              <CardTitle className="text-blue-fantastic text-base font-extrabold font-cream truncate">
                {stage.name}
              </CardTitle>
            </div>

            {/* Estimated weight badge */}
            <Badge className="bg-truffle-trouble/10 text-truffle-trouble border border-truffle-trouble/30 text-xs font-extrabold px-2 py-0.5 shrink-0">
              {stage.weight}% Weight
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-4 pt-4">
          {/* Checklist header */}
          <div className="flex items-center gap-1.5 text-xs text-blue-fantastic/60 font-bold uppercase tracking-wider">
            <FileCheck className="h-4 w-4 text-blue-fantastic/50" />
            <span>Checklist Requirements ({stage.checklist?.length || 0})</span>
          </div>

          {/* Checklist List */}
          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {!stage.checklist || stage.checklist.length === 0 ? (
              <p className="text-xs text-blue-fantastic/45 font-medium italic py-2 pl-1">
                No default checklist items defined.
              </p>
            ) : (
              stage.checklist.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between gap-2 p-2 bg-blue-fantastic/4 border border-blue-fantastic/5 rounded-xl text-xs font-semibold text-blue-fantastic/80 group/item hover:bg-blue-fantastic/8 transition-colors"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <CheckCircle className="h-3.5 w-3.5 text-blue-fantastic/30 shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </div>
                  <button
                    onClick={() => onDeleteChecklistItem(stage.id, item.id)}
                    className="opacity-0 group-hover/item:opacity-100 hover:text-burning-flame text-blue-fantastic/40 transition-all p-0.5 rounded cursor-pointer"
                    title="Remove item"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Add Checklist Item Inline Form */}
          <form onSubmit={handleAddItem} className="flex gap-2 pt-1">
            <Input
              placeholder="Add checklist item..."
              value={newItemText}
              onChange={(e) => setNewItemText(e.target.value)}
              className="bg-palladian border-blue-fantastic/15 text-blue-fantastic placeholder:text-blue-fantastic/35 h-8 text-xs font-sans w-full focus-visible:ring-truffle-trouble"
            />
            <Button
              type="submit"
              size="icon"
              className="h-8 w-8 bg-blue-fantastic text-palladian hover:bg-blue-fantastic/90 shrink-0"
              title="Add Item"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </form>
        </CardContent>
      </div>

      {/* Footer controls */}
      <div className="px-6 pb-6 pt-3 border-t border-blue-fantastic/5 flex items-center justify-between mt-3 bg-blue-fantastic/[0.01]">
        {/* Reordering Sequence arrows */}
        <div className="flex items-center gap-1">
          <Button
            size="icon"
            variant="outline"
            disabled={index === 0}
            onClick={() => onMoveUp(stage.id)}
            className="h-7 w-7 border-blue-fantastic/10 text-blue-fantastic/60 hover:text-blue-fantastic hover:bg-blue-fantastic/5 disabled:opacity-30 rounded-lg"
            title="Move Up"
          >
            <ArrowUp className="h-3.5 w-3.5" />
          </Button>
          <Button
            size="icon"
            variant="outline"
            disabled={index === totalStages - 1}
            onClick={() => onMoveDown(stage.id)}
            className="h-7 w-7 border-blue-fantastic/10 text-blue-fantastic/60 hover:text-blue-fantastic hover:bg-blue-fantastic/5 disabled:opacity-30 rounded-lg"
            title="Move Down"
          >
            <ArrowDown className="h-3.5 w-3.5" />
          </Button>
        </div>

        {/* Edit and Delete buttons */}
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => onEdit(stage)}
            className="border-blue-fantastic/20 text-blue-fantastic hover:bg-blue-fantastic/10 text-xs font-semibold h-8 rounded-xl flex items-center gap-1"
          >
            <Edit2 className="h-3.5 w-3.5" />
            <span>Edit</span>
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => onDelete(stage.id)}
            className="border-red-200 text-red-600 hover:bg-red-50 text-xs font-semibold h-8 rounded-xl flex items-center gap-1"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span>Delete</span>
          </Button>
        </div>
      </div>
    </Card>
  );
}
