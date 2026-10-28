"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { AlertTriangle, CheckCircle2, Clock, PlusCircle, ShieldCheck, Trash2, Loader2, ArrowRight } from "lucide-react"
import type { DefectItem, DefectStatus } from "@/lib/customer/warranty"

const DEFAULT_DEFECTS: DefectItem[] = []

const statusConfig: Record<DefectStatus, { label: string; badge: string; dot: string }> = {
  resolved:    { label: "Resolved",    badge: "bg-truffle-trouble/10 text-truffle-trouble border-truffle-trouble/30 font-bold", dot: "bg-truffle-trouble" },
  "in-progress":{ label: "In Progress",badge: "bg-burning-flame/15 text-truffle-trouble border-burning-flame/30 font-bold",   dot: "bg-burning-flame" },
  open:        { label: "Open",        badge: "bg-red-500/10 text-red-700 border-red-500/30 font-bold",                       dot: "bg-red-500" },
}

function DefectIcon({ status }: { status: DefectStatus }) {
  if (status === "resolved")    return <CheckCircle2 className="h-4.5 w-4.5 text-truffle-trouble shrink-0" />
  if (status === "in-progress") return <Clock className="h-4.5 w-4.5 text-truffle-trouble animate-pulse shrink-0" />
  return <AlertTriangle className="h-4.5 w-4.5 text-red-600 shrink-0" />
}

interface DefectLogProps {
  defects?: DefectItem[];
  onReportDefect?: (defect: { title: string; area: string }) => Promise<void> | void;
  onUpdateDefectStatus?: (id: string, status: DefectStatus) => Promise<void> | void;
  onDeleteDefect?: (id: string) => Promise<void> | void;
  isReporting?: boolean;
}

export function DefectLog({
  defects = DEFAULT_DEFECTS,
  onReportDefect,
  onUpdateDefectStatus,
  onDeleteDefect,
  isReporting = false,
}: DefectLogProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedDefect, setSelectedDefect] = useState<DefectItem | null>(null);
  const [title, setTitle] = useState("");
  const [area, setArea] = useState("");
  const [formError, setFormError] = useState("");

  const list = defects.length > 0 ? defects : DEFAULT_DEFECTS;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !area.trim()) {
      setFormError("Please enter both defect title and location/area.");
      return;
    }
    setFormError("");
    if (onReportDefect) {
      await onReportDefect({ title: title.trim(), area: area.trim() });
    }
    setTitle("");
    setArea("");
    setIsDialogOpen(false);
  };

  const cycleStatus = async (defect: DefectItem) => {
    const nextStatus: Record<DefectStatus, DefectStatus> = {
      open: "in-progress",
      "in-progress": "resolved",
      resolved: "open",
    };
    if (onUpdateDefectStatus) {
      await onUpdateDefectStatus(defect.id, nextStatus[defect.status]);
      if (selectedDefect?.id === defect.id) {
        setSelectedDefect({ ...defect, status: nextStatus[defect.status] });
      }
    }
  };

  return (
    <>
      <Card className="bg-white border border-blue-fantastic/15 shadow-sm font-sans">
        <CardHeader className="border-b border-blue-fantastic/10 pb-3">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-xl bg-red-500/10 flex items-center justify-center">
              <AlertTriangle className="h-4 w-4 text-red-600" />
            </div>
            <CardTitle className="text-blue-fantastic text-sm font-bold font-sans">Defect Log</CardTitle>
            <Button
              size="xs"
              onClick={() => setIsDialogOpen(true)}
              className="ml-auto bg-truffle-trouble text-palladian hover:bg-truffle-trouble/90 gap-1.5 shadow-sm font-bold h-7 px-2.5 cursor-pointer"
            >
              <PlusCircle className="h-3.5 w-3.5" />
              Report Defect
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-3 font-sans">
          {list.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center gap-2">
              <div className="h-12 w-12 rounded-2xl bg-truffle-trouble/10 flex items-center justify-center">
                <ShieldCheck className="h-6 w-6 text-truffle-trouble" />
              </div>
              <p className="text-sm font-bold text-blue-fantastic/80">No defects reported</p>
              <p className="text-xs text-blue-fantastic/60 font-semibold">Your home is in great shape!</p>
            </div>
          ) : (
            <div className="space-y-1.5">
              {list.map((defect) => {
                const cfg = statusConfig[defect.status] || statusConfig.open
                return (
                  <div
                    key={defect.id}
                    onClick={() => setSelectedDefect(defect)}
                    className="group flex items-center gap-3 px-3 py-2.5 rounded-2xl border border-transparent hover:bg-blue-fantastic/5 hover:border-blue-fantastic/15 transition-all duration-200 cursor-pointer"
                  >
                    <DefectIcon status={defect.status} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-blue-fantastic font-bold truncate">{defect.title}</p>
                      <p className="text-xs text-blue-fantastic/60 mt-0.5 font-semibold">
                        <span className="font-bold text-blue-fantastic/80">{defect.area}</span> · {defect.reported}
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className="text-[10px] text-blue-fantastic/60 font-mono font-semibold hidden sm:inline">{defect.id}</span>
                      <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
                      <Badge variant="outline" className={`text-xs border ${cfg.badge}`}>
                        {cfg.label}
                      </Badge>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Report Defect Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[440px] bg-white border border-blue-fantastic/15">
          <DialogHeader>
            <DialogTitle className="text-blue-fantastic font-bold text-lg flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-burning-flame" />
              Report a Defect or Maintenance Issue
            </DialogTitle>
            <DialogDescription className="text-xs text-blue-fantastic/70">
              Submit an item for your site supervisor to inspect and rectify.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4 pt-2">
            {formError && (
              <div className="text-xs text-red-600 bg-red-50 p-2.5 rounded-xl border border-red-200 font-medium">
                {formError}
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-blue-fantastic">Defect Title / Summary</label>
              <Input
                placeholder="e.g. Hairline crack on bathroom wall, dripping tap"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="text-xs h-9"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-blue-fantastic">Location / Area in Home</label>
              <Input
                placeholder="e.g. Master Ensuite, Kitchen, Garage, Bedroom 1"
                value={area}
                onChange={(e) => setArea(e.target.value)}
                className="text-xs h-9"
                required
              />
            </div>

            <DialogFooter className="gap-2 sm:gap-0 pt-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsDialogOpen(false)}
                className="text-xs cursor-pointer"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={isReporting}
                className="bg-truffle-trouble text-palladian hover:bg-truffle-trouble/90 font-bold text-xs cursor-pointer"
              >
                {isReporting ? (
                  <span className="flex items-center gap-1.5">
                    <Loader2 className="h-3 w-3 animate-spin" />
                    Submitting...
                  </span>
                ) : (
                  "Submit Report"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* View / Manage Defect Details Modal */}
      {selectedDefect && (
        <Dialog open={Boolean(selectedDefect)} onOpenChange={(open) => !open && setSelectedDefect(null)}>
          <DialogContent className="sm:max-w-[420px] bg-white border border-blue-fantastic/15">
            <DialogHeader>
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-blue-fantastic/60">{selectedDefect.id}</span>
                <Badge variant="outline" className={`text-xs border ${statusConfig[selectedDefect.status]?.badge}`}>
                  {statusConfig[selectedDefect.status]?.label}
                </Badge>
              </div>
              <DialogTitle className="text-blue-fantastic font-bold text-base mt-1">
                {selectedDefect.title}
              </DialogTitle>
              <DialogDescription className="text-xs text-blue-fantastic/70">
                Location: <strong className="text-blue-fantastic">{selectedDefect.area}</strong> · Reported on {selectedDefect.reported}
              </DialogDescription>
            </DialogHeader>

            <div className="pt-3 pb-1 flex flex-col gap-2">
              <p className="text-xs text-blue-fantastic/70 font-medium">Quick Status Action:</p>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => cycleStatus(selectedDefect)}
                  className="flex-1 text-xs border-blue-fantastic/20 hover:bg-blue-fantastic/5 text-blue-fantastic font-semibold cursor-pointer"
                >
                  Change Status
                  <ArrowRight className="h-3.5 w-3.5 ml-1 text-truffle-trouble" />
                </Button>
                {onDeleteDefect && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={async () => {
                      await onDeleteDefect(selectedDefect.id);
                      setSelectedDefect(null);
                    }}
                    className="text-xs border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 cursor-pointer"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                )}
              </div>
            </div>

            <DialogFooter className="pt-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectedDefect(null)}
                className="text-xs w-full cursor-pointer"
              >
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  )
}
