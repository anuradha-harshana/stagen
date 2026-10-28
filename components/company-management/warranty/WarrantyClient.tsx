"use client";

import React, { useState, useEffect } from "react";
import WarrantyHeader from "./WarrantyHeader";
import WarrantyStats, { DefectItem } from "./WarrantyStats";
import DefectsList from "./DefectsList";
import WarrantyCoverageSummary from "./WarrantyCoverageSummary";
import DefectManagementModal from "./DefectManagementModal";

const INITIAL_DEFECTS: DefectItem[] = [];

import {
  fetchCompanyDefectsAction,
  updateCompanyDefectAction,
} from "@/lib/company/actions";

interface WarrantyClientProps {
  initialDefects?: DefectItem[];
  supervisors?: string[];
}

export default function WarrantyClient({ initialDefects, supervisors }: WarrantyClientProps) {
  const [defects, setDefects] = useState<DefectItem[]>(initialDefects || []);
  const [selectedDefect, setSelectedDefect] = useState<DefectItem | null>(null);

  // Sync state with server JSON file
  useEffect(() => {
    async function loadData() {
      try {
        const data = await fetchCompanyDefectsAction();
        if (data && data.length > 0) {
          setDefects(data);
        }
      } catch (err) {
        console.error("Failed to load company defects from JSON file:", err);
      }
    }

    if (!initialDefects || initialDefects.length === 0) {
      loadData();
    }
  }, [initialDefects]);

  const handleSaveDefect = async (id: string, updates: Partial<DefectItem>) => {
    // 1. Optimistic UI update
    const nextDefects = defects.map((d) =>
      d.id === id ? { ...d, ...updates } : d
    );
    setDefects(nextDefects);
    setSelectedDefect(null);

    // 2. Persist update to JSON file
    try {
      await updateCompanyDefectAction(id, updates);
    } catch (err) {
      console.error("Failed to update defect in JSON file:", err);
    }
  };

  const supervisorsList = supervisors ?? [];

  return (
    <div className="w-full p-4 sm:p-6 space-y-6 max-w-7xl mx-auto font-sans">
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
