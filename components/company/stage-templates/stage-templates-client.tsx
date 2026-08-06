"use client";

import React, { useState, useEffect } from "react";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import StageTemplatesHeader from "./stage-templates-header";
import StageTemplatesStats, { TemplateStage } from "./stage-templates-stats";
import StageCard from "./stage-card";
import StageFormModal from "./stage-form-modal";

const DEFAULT_STAGE_TEMPLATES: TemplateStage[] = [
  {
    id: "site-cut",
    name: "Site Cut",
    weight: 10,
    checklist: [
      { id: "sc-1", label: "Soil testing & site survey" },
      { id: "sc-2", label: "Excavation & site leveling" },
      { id: "sc-3", label: "Retaining walls (if required)" }
    ]
  },
  {
    id: "slab",
    name: "Slab",
    weight: 15,
    checklist: [
      { id: "sl-1", label: "Under-slab plumbing drainage" },
      { id: "sl-2", label: "Formwork & steel reinforcement" },
      { id: "sl-3", label: "Concrete pour & curing check" },
      { id: "sl-4", label: "Termite protection collar install" }
    ]
  },
  {
    id: "frame",
    name: "Frame",
    weight: 20,
    checklist: [
      { id: "fr-1", label: "Wall frames erection" },
      { id: "fr-2", label: "Roof trusses & bracing install" },
      { id: "fr-3", label: "Window & external door frames" },
      { id: "fr-4", label: "Structural steel lintels" }
    ]
  },
  {
    id: "lockup",
    name: "Lockup",
    weight: 15,
    checklist: [
      { id: "lk-1", label: "Roof cladding (tiles/colorbond)" },
      { id: "lk-2", label: "Brickwork / external cladding" },
      { id: "lk-3", label: "Electrical & plumbing rough-in" },
      { id: "lk-4", label: "External wall insulation" }
    ]
  },
  {
    id: "fixing",
    name: "Fixing",
    weight: 15,
    checklist: [
      { id: "fx-1", label: "Plasterboard lining & sheeting" },
      { id: "fx-2", label: "Architraves, skirting & doors fixing" },
      { id: "fx-3", label: "Waterproofing of wet areas" },
      { id: "fx-4", label: "Cabinetry & vanities install" }
    ]
  },
  {
    id: "completion",
    name: "Completion",
    weight: 15,
    checklist: [
      { id: "cp-1", label: "Tiling & flooring installation" },
      { id: "cp-2", label: "Painting & electric trim fit-off" },
      { id: "cp-3", label: "PC items & tapware installation" },
      { id: "cp-4", label: "Final cleaning & quality audit" }
    ]
  },
  {
    id: "handover",
    name: "Handover",
    weight: 10,
    checklist: [
      { id: "ho-1", label: "Practical Completion Inspection (PCI)" },
      { id: "ho-2", label: "Rectification of PCI items" },
      { id: "ho-3", label: "Final payment & keys handover" }
    ]
  }
];

export default function StageTemplatesClient() {
  const [stages, setStages] = useState<TemplateStage[]>(DEFAULT_STAGE_TEMPLATES);
  const [isHydrated, setIsHydrated] = useState(false);

  // Modal states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingStage, setEditingStage] = useState<TemplateStage | null>(null);

  // Sync state with localStorage
  useEffect(() => {
    const saved = localStorage.getItem("stagen_stage_templates");
    if (saved) {
      try {
        setStages(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse templates from localStorage", e);
      }
    }
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem("stagen_stage_templates", JSON.stringify(stages));
    }
  }, [stages, isHydrated]);

  const totalWeight = stages.reduce((acc, s) => acc + (s.weight || 0), 0);
  const isWeightValid = totalWeight === 100;

  // Move stage up
  const handleMoveUp = (id: string) => {
    const idx = stages.findIndex((s) => s.id === id);
    if (idx <= 0) return;
    const nextStages = [...stages];
    const temp = nextStages[idx];
    nextStages[idx] = nextStages[idx - 1];
    nextStages[idx - 1] = temp;
    setStages(nextStages);
  };

  // Move stage down
  const handleMoveDown = (id: string) => {
    const idx = stages.findIndex((s) => s.id === id);
    if (idx === -1 || idx === stages.length - 1) return;
    const nextStages = [...stages];
    const temp = nextStages[idx];
    nextStages[idx] = nextStages[idx + 1];
    nextStages[idx + 1] = temp;
    setStages(nextStages);
  };

  // Save new/edit stage
  const handleSaveStage = (savedStage: { id: string; name: string; weight: number }) => {
    const exists = stages.some((s) => s.id === savedStage.id);
    if (exists) {
      setStages(
        stages.map((s) =>
          s.id === savedStage.id
            ? { ...s, name: savedStage.name, weight: savedStage.weight }
            : s
        )
      );
    } else {
      const newStage: TemplateStage = {
        id: savedStage.id,
        name: savedStage.name,
        weight: savedStage.weight,
        checklist: [],
      };
      setStages([...stages, newStage]);
    }
    setIsFormOpen(false);
    setEditingStage(null);
  };

  // Delete stage
  const handleDeleteStage = (id: string) => {
    setStages(stages.filter((s) => s.id !== id));
  };

  // Add checklist item
  const handleAddChecklistItem = (stageId: string, label: string) => {
    setStages(
      stages.map((stage) => {
        if (stage.id !== stageId) return stage;
        return {
          ...stage,
          checklist: [
            ...(stage.checklist || []),
            { id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`, label }
          ]
        };
      })
    );
  };

  // Delete checklist item
  const handleDeleteChecklistItem = (stageId: string, itemId: string) => {
    setStages(
      stages.map((stage) => {
        if (stage.id !== stageId) return stage;
        return {
          ...stage,
          checklist: (stage.checklist || []).filter((item) => item.id !== itemId)
        };
      })
    );
  };

  return (
    <div className="flex flex-col gap-6 w-full px-5 py-6 md:px-8 md:py-8 font-cream">
      {/* Page Header */}
      <StageTemplatesHeader onAddClick={() => {
        setEditingStage(null);
        setIsFormOpen(true);
      }} />

      {/* Summary stats */}
      <StageTemplatesStats stages={stages} />

      {/* Weight mismatch banner */}
      {!isWeightValid && (
        <Alert variant="destructive" className="bg-burning-flame/15 border-burning-flame/20 text-truffle-trouble rounded-2xl">
          <AlertCircle className="h-4 w-4 text-truffle-trouble" />
          <AlertTitle className="font-extrabold">Progress Weight Mismatch</AlertTitle>
          <AlertDescription className="text-xs font-semibold mt-0.5">
            The combined progress weights of all stages currently sum up to <strong>{totalWeight}%</strong>. 
            For exact progress tracking, please ensure the total stage weights equal <strong>100%</strong>. (Difference: {100 - totalWeight}%)
          </AlertDescription>
        </Alert>
      )}

      {/* Template Stages Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stages.map((stage, idx) => (
          <StageCard
            key={stage.id}
            stage={stage}
            index={idx}
            totalStages={stages.length}
            onMoveUp={handleMoveUp}
            onMoveDown={handleMoveDown}
            onEdit={(stg) => {
              setEditingStage(stg);
              setIsFormOpen(true);
            }}
            onDelete={handleDeleteStage}
            onAddChecklistItem={handleAddChecklistItem}
            onDeleteChecklistItem={handleDeleteChecklistItem}
          />
        ))}
      </div>

      {/* Add / Edit Form Modal */}
      <StageFormModal
        stage={editingStage}
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingStage(null);
        }}
        onSave={handleSaveStage}
      />
    </div>
  );
}
