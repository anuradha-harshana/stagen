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

interface Supervisor {
  id: string;
  username: string;
}

export interface ProjectFormPayload {
  // tenants.json
  tenant: {
    tenant_id: string;
    display_name: string;
    client_name: string;
    address: string;
    status: Project["status"];
    progress: number;
    current_stage: Project["currentStage"];
    start_date: string;
    est_handover: string;
    image_gradient: string;
  };

  // tenant_stages.json
  stages: {
    tenant_id: string;
    stages: Stage[];
  };

  // tenant_timelines.json
  timeline: {
    tenant_id: string;
    percentage: number;
    start_date: string;
    original_est_completion: string;
    current_projected_completion: string;
    status_flag: "on-track" | "delayed";
    delay_days: number;
    stages: [];
  };

  // tenant_assignments.json
  assignment: {
    id: string;
    tenant_id: string;
    user_id: string;
    role: "supervisor";
  } | null;

  // Used by the existing dashboard/application
  project: Project;
}

interface ProjectFormModalProps {
  project: Project | null;
  supervisors: Supervisor[];
  stageTemplates: Stage[];
  isOpen: boolean;
  onClose: () => void;
  onSave: (payload: ProjectFormPayload) => void;
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
  stageTemplates,
  isOpen,
  onClose,
  onSave,
}: ProjectFormModalProps) {
  const isEdit = !!project;

  const [id, setId] = useState("");
  const [clientName, setClientName] = useState("");
  const [address, setAddress] = useState("");

  const [status, setStatus] =
    useState<Project["status"]>("On Track");

  const [currentStage, setCurrentStage] =
    useState<Project["currentStage"]>("Site Cut");

  const [progress, setProgress] = useState(0);

  const [startDate, setStartDate] = useState("");
  const [estHandover, setEstHandover] = useState("");

  // IMPORTANT:
  // Store supervisor ID, not supervisor username.
  const [supervisorId, setSupervisorId] = useState("");

  const [errors, setErrors] =
    useState<Record<string, string>>({});

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

      // Try to recover supervisor ID from the supplied supervisors list.
      const existingSupervisor = supervisors.find(
        (sup) => sup.username === project.supervisorName
      );

      setSupervisorId(existingSupervisor?.id || "");
    } else {
      setId("");
      setClientName("");
      setAddress("");

      setStatus("On Track");
      setCurrentStage("Site Cut");
      setProgress(5);

      setStartDate(
        new Date().toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })
      );

      setEstHandover("");
      setSupervisorId("");
    }

    setErrors({});
  }, [project, isOpen, supervisors]);

  const handleStageChange = (
    stageName: Project["currentStage"]
  ) => {
    setCurrentStage(stageName);

    const stageProgressDefaults: Record<
      Project["currentStage"],
      number
    > = {
      "Site Cut": 5,
      Slab: 18,
      Frame: 45,
      Lockup: 60,
      Fixing: 75,
      Completion: 90,
      Handover: 98,
    };

    setProgress(stageProgressDefaults[stageName]);
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!id.trim()) {
      newErrors.id = "Lot ID is required";
    }

    if (!clientName.trim()) {
      newErrors.clientName = "Client Name is required";
    }

    if (!address.trim()) {
      newErrors.address = "Address is required";
    }

    if (!startDate.trim()) {
      newErrors.startDate = "Start Date is required";
    }

    if (!estHandover.trim()) {
      newErrors.estHandover =
        "Estimated Handover is required";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;

    const tenantId = id.trim();

    /*
     * ---------------------------------------------------------
     * 1. STAGES
     * ---------------------------------------------------------
     *
     * If editing an existing project, preserve its existing
     * checklist structure.
     *
     * If creating a new project, use the default stage structure.
     */
    const originalStages =
      project?.stages ||
      (stageTemplates.length > 0
        ? stageTemplates
        : getDefaultStages());

    const updatedStages = originalStages.map((stage) => {
      const stageIndex = STAGES.indexOf(
        stage.name as (typeof STAGES)[number]
      );

      const currentIndex = STAGES.indexOf(currentStage);

      let newStatus: Stage["status"] = "Pending";
      let stageProgress = 0;

      if (stageIndex < currentIndex) {
        newStatus = "Completed";
        stageProgress = 100;
      } else if (stageIndex === currentIndex) {
        newStatus = "Active";

        // Keep the current overall project progress for
        // the current stage rather than forcing it to 50%.
        stageProgress = progress;
      } else {
        newStatus = "Pending";
        stageProgress = 0;
      }

      const updatedChecklist = stage.checklist.map(
        (item) => ({
          ...item,
          completed:
            newStatus === "Completed"
              ? true
              : newStatus === "Pending"
                ? false
                : item.completed,
        })
      );

      return {
        ...stage,
        status: newStatus,
        progress: stageProgress,
        checklist: updatedChecklist,
      };
    });

    /*
     * ---------------------------------------------------------
     * 2. SUPERVISOR
     * ---------------------------------------------------------
     */

    const selectedSupervisor = supervisors.find(
      (sup) => sup.id === supervisorId
    );

    /*
     * ---------------------------------------------------------
     * 3. PROJECT OBJECT
     * ---------------------------------------------------------
     *
     * This keeps compatibility with the existing dashboard.
     */
    const savedProject: Project = {
      id: tenantId,
      clientName: clientName.trim(),
      address: address.trim(),
      status,
      currentStage,
      progress,
      startDate: startDate.trim(),
      estHandover: estHandover.trim(),

      imageGradient:
        project?.imageGradient || getRandomGradient(),

      stages: updatedStages,

      // These remain empty/preserved because they have
      // their own JSON files.
      delays: project?.delays || [],
      questions: project?.questions || [],

      supervisorName:
        selectedSupervisor?.username || undefined,
    };

    /*
     * ---------------------------------------------------------
     * 4. tenants.json
     * ---------------------------------------------------------
     */
    const tenant = {
      tenant_id: tenantId,

      // This can be changed later if you want a different
      // display-name convention.
      display_name: clientName.trim(),

      client_name: clientName.trim(),

      address: address.trim(),

      status,

      progress,

      current_stage: currentStage,

      start_date: startDate.trim(),

      est_handover: estHandover.trim(),

      image_gradient:
        project?.imageGradient || getRandomGradient(),
    };

    /*
     * ---------------------------------------------------------
     * 5. tenant_stages.json
     * ---------------------------------------------------------
     */
    const stages = {
      tenant_id: tenantId,
      stages: updatedStages,
    };

    /*
     * ---------------------------------------------------------
     * 6. tenant_timelines.json
     * ---------------------------------------------------------
     *
     * A new project starts with no delay.
     *
     * If editing an existing delayed project, preserve the
     * existing delay information where possible.
     */
    const existingTimelineDelayDays =
      project?.delayDays || 0;

    const timeline = {
      tenant_id: tenantId,

      percentage: progress,

      start_date: startDate.trim(),

      original_est_completion: estHandover.trim(),

      current_projected_completion:
        estHandover.trim(),

      status_flag:
        status === "Delayed"
          ? ("delayed" as const)
          : ("on-track" as const),

      delay_days: existingTimelineDelayDays,

      // The individual stage timeline data will be populated
      // by the timeline helper later.
      stages: [] as [],
    };

    /*
     * ---------------------------------------------------------
     * 7. tenant_assignments.json
     * ---------------------------------------------------------
     *
     * IMPORTANT:
     * The relationship uses supervisor USER ID.
     *
     * If no supervisor is selected, no assignment record
     * should be created.
     */
    const assignment =
      selectedSupervisor
        ? {
            id:
              project
                ? `assign-${tenantId}-supervisor`
                : `assign-${tenantId}-supervisor`,
            tenant_id: tenantId,
            user_id: selectedSupervisor.id,
            role: "supervisor" as const,
          }
        : null;

    /*
     * ---------------------------------------------------------
     * 8. SEND EVERYTHING TO THE DATABASE/helper LAYER
     * ---------------------------------------------------------
     */
    onSave({
      tenant,
      stages,
      timeline,
      assignment,
      project: savedProject,
    });
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) =>
        !open && onClose()
      }
    >
      <div className="flex justify-center">
        <DialogContent
          className="
            max-w-[60vw]
            bg-white
            text-blue-fantastic
            font-sans
            border
            border-blue-fantastic/20
            max-h-[100vh]
            overflow-y-auto
            no-scrollbar
            rounded-2xl
          "
        >
          <DialogHeader>
            <DialogTitle
              className="
                text-xl
                font-bold
                font-sans
                text-blue-fantastic
                border-b
                border-blue-fantastic/5
                pb-2
              "
            >
              {isEdit
                ? "Edit Build Lot"
                : "Create New Build Lot"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-3">

            {/* ------------------------------------------------ */}
            {/* LOT / PROJECT ID                                 */}
            {/* ------------------------------------------------ */}

            <div className="space-y-1">
              <Label
                htmlFor="id"
                className="text-xs font-bold text-blue-fantastic/70"
              >
                Lot ID / Project ID
              </Label>

              <Input
                id="id"
                placeholder="e.g. lot-104"
                value={id}
                onChange={(e) =>
                  setId(
                    e.target.value.toLowerCase()
                  )
                }
                disabled={isEdit}
                className={`bg-white border-blue-fantastic/15 text-blue-fantastic h-9 focus-visible:ring-truffle-trouble ${
                  errors.id
                    ? "border-red-500"
                    : ""
                }`}
              />

              {errors.id && (
                <p className="text-[10px] text-red-500 font-bold">
                  {errors.id}
                </p>
              )}
            </div>

            {/* ------------------------------------------------ */}
            {/* CLIENT NAME                                      */}
            {/* ------------------------------------------------ */}

            <div className="space-y-1">
              <Label
                htmlFor="clientName"
                className="text-xs font-bold text-blue-fantastic/70"
              >
                Client Name
              </Label>

              <Input
                id="clientName"
                placeholder="e.g. Anuradha Harshana"
                value={clientName}
                onChange={(e) =>
                  setClientName(e.target.value)
                }
                className={`bg-white border-blue-fantastic/15 text-blue-fantastic h-9 focus-visible:ring-truffle-trouble ${
                  errors.clientName
                    ? "border-red-500"
                    : ""
                }`}
              />

              {errors.clientName && (
                <p className="text-[10px] text-red-500 font-bold">
                  {errors.clientName}
                </p>
              )}
            </div>

            {/* ------------------------------------------------ */}
            {/* SITE ADDRESS                                     */}
            {/* ------------------------------------------------ */}

            <div className="space-y-1">
              <Label
                htmlFor="address"
                className="text-xs font-bold text-blue-fantastic/70"
              >
                Site Address
              </Label>

              <Input
                id="address"
                placeholder="e.g. Lot 104, 12 Harrison Street, Richmond VIC"
                value={address}
                onChange={(e) =>
                  setAddress(e.target.value)
                }
                className={`bg-white border-blue-fantastic/15 text-blue-fantastic h-9 focus-visible:ring-truffle-trouble ${
                  errors.address
                    ? "border-red-500"
                    : ""
                }`}
              />

              {errors.address && (
                <p className="text-[10px] text-red-500 font-bold">
                  {errors.address}
                </p>
              )}
            </div>

            {/* ------------------------------------------------ */}
            {/* SUPERVISOR                                      */}
            {/* ------------------------------------------------ */}

            <div className="space-y-1">
              <Label
                htmlFor="supervisor"
                className="text-xs font-bold text-blue-fantastic/70"
              >
                Assigned Supervisor
              </Label>

              <Select
                value={supervisorId || "Unassigned"}
                onValueChange={(value) =>
                  setSupervisorId(
                    value === "Unassigned"
                      ? ""
                      : value
                  )
                }
              >
                <SelectTrigger
                  className="
                    bg-white
                    border-blue-fantastic/15
                    text-blue-fantastic
                    h-9
                    text-sm
                    focus:ring-truffle-trouble
                  "
                >
                  <SelectValue placeholder="Select Supervisor" />
                </SelectTrigger>

                <SelectContent
                  className="
                    bg-white
                    text-blue-fantastic
                    border-blue-fantastic/10
                  "
                >
                  <SelectItem
                    value="Unassigned"
                    className="text-xs font-bold font-sans"
                  >
                    Unassigned
                  </SelectItem>

                  {supervisors.map((sup) => (
                    <SelectItem
                      key={sup.id}
                      value={sup.id}
                      className="text-xs font-bold font-sans"
                    >
                      {sup.username}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* ------------------------------------------------ */}
            {/* STATUS + CURRENT STAGE                           */}
            {/* ------------------------------------------------ */}

            <div className="grid grid-cols-2 gap-4">

              {/* STATUS */}
              <div className="space-y-1">
                <Label
                  htmlFor="status"
                  className="text-xs font-bold text-blue-fantastic/70"
                >
                  Project Status
                </Label>

                <Select
                  value={status}
                  onValueChange={(val) =>
                    setStatus(
                      val as Project["status"]
                    )
                  }
                >
                  <SelectTrigger
                    className="
                      bg-white
                      border-blue-fantastic/15
                      text-blue-fantastic
                      h-9
                      text-sm
                      focus:ring-truffle-trouble
                    "
                  >
                    <SelectValue placeholder="Select Status" />
                  </SelectTrigger>

                  <SelectContent
                    className="
                      bg-white
                      text-blue-fantastic
                      border-blue-fantastic/10
                    "
                  >
                    <SelectItem value="On Track">
                      On Track
                    </SelectItem>

                    <SelectItem value="Delayed">
                      Delayed
                    </SelectItem>

                    <SelectItem value="Action Required">
                      Action Required
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* CURRENT STAGE */}
              <div className="space-y-1">
                <Label
                  htmlFor="currentStage"
                  className="text-xs font-bold text-blue-fantastic/70"
                >
                  Current Stage
                </Label>

                <Select
                  value={currentStage}
                  onValueChange={handleStageChange}
                >
                  <SelectTrigger
                    className="
                      bg-white
                      border-blue-fantastic/15
                      text-blue-fantastic
                      h-9
                      text-sm
                      focus:ring-truffle-trouble
                    "
                  >
                    <SelectValue placeholder="Select Stage" />
                  </SelectTrigger>

                  <SelectContent
                    className="
                      bg-white
                      text-blue-fantastic
                      border-blue-fantastic/10
                    "
                  >
                    {STAGES.map((stage) => (
                      <SelectItem
                        key={stage}
                        value={stage}
                        className="text-xs font-bold font-sans"
                      >
                        {stage}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* ------------------------------------------------ */}
            {/* PROGRESS                                         */}
            {/* ------------------------------------------------ */}

            <div className="space-y-1">

              <div
                className="
                  flex
                  justify-between
                  items-center
                  text-xs
                  font-bold
                  text-blue-fantastic/70
                "
              >
                <Label htmlFor="progress">
                  Overall Progress
                </Label>

                <span className="text-truffle-trouble">
                  {progress}%
                </span>
              </div>

              <Input
                id="progress"
                type="range"
                min="0"
                max="100"
                value={progress}
                onChange={(e) =>
                  setProgress(
                    Number(e.target.value)
                  )
                }
                className="
                  accent-truffle-trouble
                  h-8
                  w-full
                  p-0
                  border-0
                  bg-transparent
                  cursor-pointer
                "
              />
            </div>

            {/* ------------------------------------------------ */}
            {/* DATES                                            */}
            {/* ------------------------------------------------ */}

            <div className="grid grid-cols-2 gap-4">

              {/* START DATE */}
              <div className="space-y-1">
                <Label
                  htmlFor="startDate"
                  className="text-xs font-bold text-blue-fantastic/70"
                >
                  Start Date
                </Label>

                <Input
                  id="startDate"
                  placeholder="e.g. Mar 10, 2026"
                  value={startDate}
                  onChange={(e) =>
                    setStartDate(
                      e.target.value
                    )
                  }
                  className={`bg-white border-blue-fantastic/15 text-blue-fantastic h-9 focus-visible:ring-truffle-trouble ${
                    errors.startDate
                      ? "border-red-500"
                      : ""
                  }`}
                />

                {errors.startDate && (
                  <p className="text-[10px] text-red-500 font-bold">
                    {errors.startDate}
                  </p>
                )}
              </div>

              {/* EST HANDOVER */}
              <div className="space-y-1">
                <Label
                  htmlFor="estHandover"
                  className="text-xs font-bold text-blue-fantastic/70"
                >
                  Est Handover Date
                </Label>

                <Input
                  id="estHandover"
                  placeholder="e.g. Nov 15, 2026"
                  value={estHandover}
                  onChange={(e) =>
                    setEstHandover(
                      e.target.value
                    )
                  }
                  className={`bg-white border-blue-fantastic/15 text-blue-fantastic h-9 focus-visible:ring-truffle-trouble ${
                    errors.estHandover
                      ? "border-red-500"
                      : ""
                  }`}
                />

                {errors.estHandover && (
                  <p className="text-[10px] text-red-500 font-bold">
                    {errors.estHandover}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* -------------------------------------------------- */}
          {/* BUTTONS                                            */}
          {/* -------------------------------------------------- */}

          <div
            className="
              flex
              justify-end
              gap-2
              border-t
              border-blue-fantastic/10
              pt-3.5
              mt-2
            "
          >
            <Button
              variant="outline"
              onClick={onClose}
              className="
                text-xs
                font-bold
                border-blue-fantastic/20
                text-blue-fantastic
                hover:bg-blue-fantastic/10
                h-9
                rounded-xl
                px-4
              "
            >
              Cancel
            </Button>

            <Button
              onClick={handleSave}
              className="
                bg-truffle-trouble
                text-palladian
                hover:bg-truffle-trouble/85
                text-xs
                font-bold
                h-9
                rounded-xl
                px-5
              "
            >
              {isEdit
                ? "Save Changes"
                : "Create Lot"}
            </Button>
          </div>
        </DialogContent>
      </div>
    </Dialog>
  );
}

/* ============================================================
   RANDOM PROJECT GRADIENT
   ============================================================ */

function getRandomGradient() {
  const gradients = [
    "from-blue-fantastic/40 to-abyssal-blue/80",
    "from-truffle-trouble/40 to-abyssal-blue/80",
    "from-burning-flame/30 to-abyssal-blue/80",
    "from-emerald-600/30 to-abyssal-blue/80",
  ];

  return gradients[
    Math.floor(Math.random() * gradients.length)
  ];
}

function getDefaultStages(): Stage[] {
  return STAGES.map((name) => ({
    name,
    status: "Pending" as const,
    progress: 0,
    checklist: [],
  }));
}
