"use client";

import React, { useEffect, useState } from "react";
import { WarrantyHeader } from "@/components/Customer/Warranty/WarrantyHeader";
import { WarrantyCards } from "@/components/Customer/Warranty/WarrantyCards";
import { MaintenanceTimeline } from "@/components/Customer/Warranty/MaintenanceTimeline";
import { DefectLog } from "@/components/Customer/Warranty/DefectLog";
import { PAGE_SHELL_CLASS } from "@/components/shared/pageShell";
import type { TenantWarrantyData, DefectStatus } from "@/lib/customer/warranty";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function WarrantyPage() {
  const [warrantyData, setWarrantyData] = useState<TenantWarrantyData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isReporting, setIsReporting] = useState(false);

  const loadWarrantyData = async () => {
    try {
      const res = await fetch("/api/customer/warranty");
      if (!res.ok) {
        throw new Error("Failed to load warranty and defect data");
      }
      const data = await res.json();
      setWarrantyData(data.warrantyData);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load warranty information");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadWarrantyData();
  }, []);

  const handleReportDefect = async (defect: { title: string; area: string }) => {
    setIsReporting(true);
    try {
      const res = await fetch("/api/customer/warranty", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "defect",
          data: defect,
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to submit defect");
      }

      const data = await res.json();
      setWarrantyData(data.warrantyData);
      toast.success("Defect reported to site supervisor successfully!");
    } catch (err: any) {
      toast.error(err.message || "Failed to submit defect report");
    } finally {
      setIsReporting(false);
    }
  };

  const handleUpdateDefectStatus = async (id: string, status: DefectStatus) => {
    try {
      const res = await fetch("/api/customer/warranty", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "defect",
          id,
          updates: { status },
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to update defect status");
      }

      const data = await res.json();
      setWarrantyData(data.warrantyData);
      toast.success(`Defect updated to "${status}"`);
    } catch (err: any) {
      toast.error(err.message || "Failed to update defect");
    }
  };

  const handleDeleteDefect = async (id: string) => {
    try {
      const res = await fetch(`/api/customer/warranty?type=defect&id=${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Failed to delete defect");
      }

      // Refresh list locally
      if (warrantyData) {
        setWarrantyData({
          ...warrantyData,
          defects: warrantyData.defects.filter((d) => d.id !== id),
        });
      }
      toast.success("Defect removed successfully");
    } catch (err: any) {
      toast.error(err.message || "Failed to remove defect");
    }
  };

  const activeWarrantiesCount =
    warrantyData?.warranties.filter((w) => w.status === "Active").length ?? 4;
  const scheduledServicesCount =
    warrantyData?.maintenance.filter((m) => m.status === "scheduled").length ?? 1;

  return (
    <div className={PAGE_SHELL_CLASS}>
      <WarrantyHeader
        activeCount={activeWarrantiesCount}
        scheduledCount={scheduledServicesCount}
      />

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-3 text-blue-fantastic/70">
          <Loader2 className="h-8 w-8 animate-spin text-truffle-trouble" />
          <p className="text-sm font-semibold">Loading warranty and maintenance records...</p>
        </div>
      ) : (
        <>
          <WarrantyCards warranties={warrantyData?.warranties} />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <MaintenanceTimeline services={warrantyData?.maintenance} />
            <DefectLog
              defects={warrantyData?.defects}
              onReportDefect={handleReportDefect}
              onUpdateDefectStatus={handleUpdateDefectStatus}
              onDeleteDefect={handleDeleteDefect}
              isReporting={isReporting}
            />
          </div>
        </>
      )}
    </div>
  );
}
