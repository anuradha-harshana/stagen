"use client";

import React, { useState, useEffect } from "react";
import WarrantyHeader from "./WarrantyHeader";
import WarrantyStats, { DefectItem } from "./WarrantyStats";
import DefectsList from "./DefectsList";
import WarrantyCoverageSummary from "./WarrantyCoverageSummary";
import DefectManagementModal from "./DefectManagementModal";

const INITIAL_DEFECTS: DefectItem[] = [
  {
    id: "DEF-001",
    projectId: "208",
    clientName: "Sarah Jenkins",
    title: "Garage door alignment issue",
    area: "Garage",
    priority: "High",
    reported: "2026-07-25",
    status: "resolved",
    assignedSupervisor: "Eric",
    description: "Garage door rollers are catching on the tracks during closure, preventing it from sealing properly at the base."
  },
  {
    id: "DEF-002",
    projectId: "104",
    clientName: "Anuradha Harshana",
    title: "Hairline crack – master bedroom wall",
    area: "Bedroom 1",
    priority: "Low",
    reported: "2026-07-28",
    status: "in-progress",
    assignedSupervisor: "Eric",
    description: "Small hairline crack has appeared along the plaster joint above the walk-in wardrobe door."
  },
  {
    id: "DEF-003",
    projectId: "104",
    clientName: "Anuradha Harshana",
    title: "Laundry tap dripping",
    area: "Laundry",
    priority: "Medium",
    reported: "2026-08-01",
    status: "open",
    assignedSupervisor: "Unassigned",
    description: "The cold water tap in the laundry basin is dripping continuously at a rate of 1 drip per 5 seconds, causing moisture build-up."
  },
  {
    id: "DEF-004",
    projectId: "312",
    clientName: "Marcus Vance",
    title: "Kitchen splashback silicone peeling",
    area: "Kitchen",
    priority: "Low",
    reported: "2026-08-03",
    status: "open",
    assignedSupervisor: "Unassigned",
    description: "The silicone seal between the stone benchtop and glass splashback is peeling behind the sink."
  }
];

export default function WarrantyClient() {
  const [defects, setDefects] = useState<DefectItem[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);
  const [selectedDefect, setSelectedDefect] = useState<DefectItem | null>(null);

  // Sync state with localStorage
  useEffect(() => {
    const saved = localStorage.getItem("stagen_warranty_defects");
    if (saved) {
      try {
        setDefects(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse defects from localStorage", e);
        setDefects(INITIAL_DEFECTS);
      }
    } else {
      setDefects(INITIAL_DEFECTS);
    }
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem("stagen_warranty_defects", JSON.stringify(defects));
    }
  }, [defects, isHydrated]);

  const handleSaveDefect = (id: string, updates: Partial<DefectItem>) => {
    const nextDefects = defects.map((d) =>
      d.id === id ? { ...d, ...updates } : d
    );
    setDefects(nextDefects);
    setSelectedDefect(null);
  };

  const supervisorsList = ["Eric"];

  return (
    <div className="flex flex-col gap-6 w-full px-5 py-6 md:px-8 md:py-8 font-cream">
      {/* Header */}
      <WarrantyHeader />

      {/* Stats Summary */}
      <WarrantyStats defects={defects} />

      {/* Grid Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left List */}
        <div className="lg:col-span-8 w-full">
          <DefectsList defects={defects} onManageClick={setSelectedDefect} />
        </div>

        {/* Right Summary */}
        <div className="lg:col-span-4 w-full">
          <WarrantyCoverageSummary />
        </div>
      </div>

      {/* Management Dialog */}
      <DefectManagementModal
        defect={selectedDefect}
        supervisors={supervisorsList}
        isOpen={selectedDefect !== null}
        onClose={() => setSelectedDefect(null)}
        onSave={handleSaveDefect}
      />
    </div>
  );
}
