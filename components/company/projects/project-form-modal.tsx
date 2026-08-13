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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Project, Stage } from "@/lib/db-mock/projectsData";

interface ProjectFormModalProps {
  project: Project | null;
  supervisors: { id: string; username: string }[];
  isOpen: boolean;
  onClose: () => void;
  onSave: (project: Project) => void;
}

const STAGES = [
  "Site Cut",
  "Slab",
  "Frame",
  "Lockup",
  "Fixing",
  "Completion",
  "Handover",
] as const;

export default function ProjectFormModal({
  project,
  supervisors,
  isOpen,
  onClose,
  onSave,
}: ProjectFormModalProps) {
  const isEdit = !!project;

  const [id, setId] = useState("");
  const [clientName, setClientName] = useState("");
  const [address, setAddress] = useState("");
  const [status, setStatus] = useState<Project["status"]>("On Track");
  const [currentStage, setCurrentStage] = useState<Project["currentStage"]>("Site Cut");
  const [progress, setProgress] = useState(0);
  const [startDate, setStartDate] = useState("");
  const [estHandover, setEstHandover] = useState("");
  const [supervisorName, setSupervisorName] = useState("Unassigned");

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (project) {
      setId(project.id);
      setClientName(project.clientName);
      setAddress(project.address);
      setStatus(project.status);
      setCurrentStage(project.currentStage);
      setProgress(project.progress);
      setStartDate(project.startDate);
      setEstHandover(project.estHandover);
      setSupervisorName(project.supervisorName || "Unassigned");
    } else {
      setId("");
      setClientName("");
      setAddress("");
      setStatus("On Track");
      setCurrentStage("Site Cut");
      setProgress(0);
      setStartDate(new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }));
      setEstHandover("");
      setSupervisorName("Unassigned");
    }
    setErrors({});
  }, [project, isOpen]);

  const handleStageChange = (stageName: Project["currentStage"]) => {
    setCurrentStage(stageName);
    const stageProgressDefaults: Record<Project["currentStage"], number> = {
      "Site Cut": 5,
      "Slab": 18,
      "Frame": 45,
      "Lockup": 60,
      "Fixing": 75,
      "Completion": 90,
      "Handover": 98,
    };
    setProgress(stageProgressDefaults[stageName]);
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!id.trim()) newErrors.id = "Lot ID is required";
    if (!clientName.trim()) newErrors.clientName = "Client Name is required";
    if (!address.trim()) newErrors.address = "Address is required";
    if (!startDate.trim()) newErrors.startDate = "Start Date is required";
    if (!estHandover.trim()) newErrors.estHandover = "Estimated Handover is required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;

    const originalStages = project?.stages || getDefaultStages();
    const updatedStages = originalStages.map((stage) => {
      const stageIndex = STAGES.indexOf(stage.name);
      const currentIndex = STAGES.indexOf(currentStage);

      let newStatus: Stage["status"] = "Pending";
      let stageProgress = 0;

      if (stageIndex < currentIndex) {
        newStatus = "Completed";
        stageProgress = 100;
      } else if (stageIndex === currentIndex) {
        newStatus = "Active";
        stageProgress = 50;
      } else {
        newStatus = "Pending";
        stageProgress = 0;
      }

      const updatedChecklist = stage.checklist.map((item) => ({
        ...item,
        completed: newStatus === "Completed",
      }));

      return {
        ...stage,
        status: newStatus,
        progress: stageProgress,
        checklist: updatedChecklist,
      };
    });

    const savedProject: Project = {
      id: id.trim(),
      clientName: clientName.trim(),
      address: address.trim(),
      status,
      currentStage,
      progress,
      startDate: startDate.trim(),
      estHandover: estHandover.trim(),
      imageGradient: project?.imageGradient || getRandomGradient(),
      stages: updatedStages,
      delays: project?.delays || [],
      questions: project?.questions || [],
      supervisorName: supervisorName === "Unassigned" ? undefined : supervisorName,
    };

    onSave(savedProject);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md bg-palladian text-blue-fantastic font-sans border border-blue-fantastic/20 max-h-[90vh] overflow-y-auto rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold font-sans text-blue-fantastic border-b border-blue-fantastic/5 pb-2">
            {isEdit ? "Edit Build Lot" : "Create New Build Lot"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-3">
          {/* Lot ID */}
          <div className="space-y-1">
            <Label htmlFor="id" className="text-xs font-bold text-blue-fantastic/70">
              Lot ID / Project ID
            </Label>
            <Input
              id="id"
              placeholder="e.g. lot-104"
              value={id}
              onChange={(e) => setId(e.target.value.toLowerCase())}
              disabled={isEdit}
              className={`bg-palladian border-blue-fantastic/15 text-blue-fantastic h-9 focus-visible:ring-truffle-trouble ${
                errors.id ? "border-red-500" : ""
              }`}
            />
            {errors.id && <p className="text-[10px] text-red-500 font-bold">{errors.id}</p>}
          </div>

          {/* Client Name */}
          <div className="space-y-1">
            <Label htmlFor="clientName" className="text-xs font-bold text-blue-fantastic/70">
              Client Name
            </Label>
            <Input
              id="clientName"
              placeholder="e.g. Anuradha Harshana"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              className={`bg-palladian border-blue-fantastic/15 text-blue-fantastic h-9 focus-visible:ring-truffle-trouble ${
                errors.clientName ? "border-red-500" : ""
              }`}
            />
            {errors.clientName && <p className="text-[10px] text-red-500 font-bold">{errors.clientName}</p>}
          </div>

          {/* Address */}
          <div className="space-y-1">
            <Label htmlFor="address" className="text-xs font-bold text-blue-fantastic/70">
              Site Address
            </Label>
            <Input
              id="address"
              placeholder="e.g. Lot 104, 12 Harrison Street, Richmond VIC"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className={`bg-palladian border-blue-fantastic/15 text-blue-fantastic h-9 focus-visible:ring-truffle-trouble ${
                errors.address ? "border-red-500" : ""
              }`}
            />
            {errors.address && <p className="text-[10px] text-red-500 font-bold">{errors.address}</p>}
          </div>

          {/* Supervisor Select */}
          <div className="space-y-1">
            <Label htmlFor="supervisor" className="text-xs font-bold text-blue-fantastic/70">
              Assigned Supervisor
            </Label>
            <Select value={supervisorName} onValueChange={setSupervisorName}>
              <SelectTrigger className="bg-palladian border-blue-fantastic/15 text-blue-fantastic h-9 text-sm focus:ring-truffle-trouble">
                <SelectValue placeholder="Select Supervisor" />
              </SelectTrigger>
              <SelectContent className="bg-palladian text-blue-fantastic border-blue-fantastic/10">
                <SelectItem value="Unassigned" className="text-xs font-bold font-sans">Unassigned</SelectItem>
                {supervisors.map((sup) => (
                  <SelectItem key={sup.id} value={sup.username} className="text-xs font-bold font-sans">
                    {sup.username}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Status Select */}
            <div className="space-y-1">
              <Label htmlFor="status" className="text-xs font-bold text-blue-fantastic/70">
                Project Status
              </Label>
              <Select value={status} onValueChange={(val: any) => setStatus(val)}>
                <SelectTrigger className="bg-palladian border-blue-fantastic/15 text-blue-fantastic h-9 text-sm focus:ring-truffle-trouble">
                  <SelectValue placeholder="Select Status" />
                </SelectTrigger>
                <SelectContent className="bg-palladian text-blue-fantastic border-blue-fantastic/10">
                  <SelectItem value="On Track" className="text-xs font-bold font-sans">On Track</SelectItem>
                  <SelectItem value="Delayed" className="text-xs font-bold font-sans">Delayed</SelectItem>
                  <SelectItem value="Action Required" className="text-xs font-bold font-sans">Action Required</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Current Stage */}
            <div className="space-y-1">
              <Label htmlFor="currentStage" className="text-xs font-bold text-blue-fantastic/70">
                Current Stage
              </Label>
              <Select value={currentStage} onValueChange={handleStageChange}>
                <SelectTrigger className="bg-palladian border-blue-fantastic/15 text-blue-fantastic h-9 text-sm focus:ring-truffle-trouble">
                  <SelectValue placeholder="Select Stage" />
                </SelectTrigger>
                <SelectContent className="bg-palladian text-blue-fantastic border-blue-fantastic/10">
                  {STAGES.map((stg) => (
                    <SelectItem key={stg} value={stg} className="text-xs font-bold font-sans">
                      {stg}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Progress Percent Slider */}
          <div className="space-y-1">
            <div className="flex justify-between items-center text-xs font-bold text-blue-fantastic/70">
              <Label htmlFor="progress">Overall Progress</Label>
              <span className="text-truffle-trouble">{progress}%</span>
            </div>
            <Input
              id="progress"
              type="range"
              min="0"
              max="100"
              value={progress}
              onChange={(e) => setProgress(Number(e.target.value))}
              className="accent-truffle-trouble h-8 w-full p-0 border-0 bg-transparent cursor-pointer"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Start Date */}
            <div className="space-y-1">
              <Label htmlFor="startDate" className="text-xs font-bold text-blue-fantastic/70">
                Start Date
              </Label>
              <Input
                id="startDate"
                placeholder="e.g. Mar 10, 2026"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className={`bg-palladian border-blue-fantastic/15 text-blue-fantastic h-9 focus-visible:ring-truffle-trouble ${
                  errors.startDate ? "border-red-500" : ""
                }`}
              />
              {errors.startDate && <p className="text-[10px] text-red-500 font-bold">{errors.startDate}</p>}
            </div>

            {/* Estimated Handover */}
            <div className="space-y-1">
              <Label htmlFor="estHandover" className="text-xs font-bold text-blue-fantastic/70">
                Est Handover Date
              </Label>
              <Input
                id="estHandover"
                placeholder="e.g. Nov 15, 2026"
                value={estHandover}
                onChange={(e) => setEstHandover(e.target.value)}
                className={`bg-palladian border-blue-fantastic/15 text-blue-fantastic h-9 focus-visible:ring-truffle-trouble ${
                  errors.estHandover ? "border-red-500" : ""
                }`}
              />
              {errors.estHandover && <p className="text-[10px] text-red-500 font-bold">{errors.estHandover}</p>}
            </div>
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
            {isEdit ? "Save Changes" : "Create Lot"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function getRandomGradient() {
  const gradients = [
    "from-blue-fantastic/40 to-abyssal-blue/80",
    "from-truffle-trouble/40 to-abyssal-blue/80",
    "from-burning-flame/30 to-abyssal-blue/80",
    "from-emerald-600/30 to-abyssal-blue/80",
  ];
  return gradients[Math.floor(Math.random() * gradients.length)];
}

function getDefaultStages(): Stage[] {
  return [
    {
      name: "Site Cut",
      status: "Pending",
      progress: 0,
      checklist: [
        { id: "sc-1", label: "Soil testing & site survey", completed: false },
        { id: "sc-2", label: "Excavation & site leveling", completed: false },
        { id: "sc-3", label: "Retaining walls (if required)", completed: false },
      ],
    },
    {
      name: "Slab",
      status: "Pending",
      progress: 0,
      checklist: [
        { id: "sl-1", label: "Under-slab plumbing drainage", completed: false },
        { id: "sl-2", label: "Formwork & steel reinforcement", completed: false },
        { id: "sl-3", label: "Concrete pour & curing check", completed: false },
        { id: "sl-4", label: "Termite protection collar install", completed: false },
      ],
    },
    {
      name: "Frame",
      status: "Pending",
      progress: 0,
      checklist: [
        { id: "fr-1", label: "Wall frames erection", completed: false },
        { id: "fr-2", label: "Roof trusses & bracing install", completed: false },
        { id: "fr-3", label: "Window & external door frames", completed: false },
        { id: "fr-4", label: "Structural steel lintels", completed: false },
      ],
    },
    {
      name: "Lockup",
      status: "Pending",
      progress: 0,
      checklist: [
        { id: "lk-1", label: "Roof cladding (tiles/colorbond)", completed: false },
        { id: "lk-2", label: "Brickwork / external cladding", completed: false },
        { id: "lk-3", label: "Electrical & plumbing rough-in", completed: false },
        { id: "lk-4", label: "External wall insulation", completed: false },
      ],
    },
    {
      name: "Fixing",
      status: "Pending",
      progress: 0,
      checklist: [
        { id: "fx-1", label: "Plasterboard lining & sheeting", completed: false },
        { id: "fx-2", label: "Architraves, skirting & doors fixing", completed: false },
        { id: "fx-3", label: "Waterproofing of wet areas", completed: false },
        { id: "fx-4", label: "Cabinetry & vanities install", completed: false },
      ],
    },
    {
      name: "Completion",
      status: "Pending",
      progress: 0,
      checklist: [
        { id: "cp-1", label: "Tiling & flooring installation", completed: false },
        { id: "cp-2", label: "Painting & electric trim fit-off", completed: false },
        { id: "cp-3", label: "PC items & tapware installation", completed: false },
        { id: "cp-4", label: "Final cleaning & quality audit", completed: false },
      ],
    },
    {
      name: "Handover",
      status: "Pending",
      progress: 0,
      checklist: [
        { id: "ho-1", label: "Practical Completion Inspection (PCI)", completed: false },
        { id: "ho-2", label: "Rectification of PCI items", completed: false },
        { id: "ho-3", label: "Final payment & keys handover", completed: false },
      ],
    },
  ];
}
