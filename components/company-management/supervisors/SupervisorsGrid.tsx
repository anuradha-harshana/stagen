"use client";

import React from "react";
import { UserRound, Building2, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Project } from "@/lib/db-mock/projectsData";

interface SupervisorsGridProps {
  supervisors: string[];
  projects: Project[];
  onReassignClick: (project: Project) => void;
}

export default function SupervisorsGrid({
  supervisors,
  projects,
  onReassignClick,
}: SupervisorsGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full font-sans">
      {supervisors.map((name) => {
        const assignedLots = projects.filter((p) => p.supervisorName === name);
        const avgProgress =
          assignedLots.length > 0
            ? Math.round(assignedLots.reduce((acc, curr) => acc + curr.progress, 0) / assignedLots.length)
            : 0;

        let capacityLabel = "Optimal";
        let capacityBadge = "bg-emerald-50 text-emerald-700 border-emerald-200";

        if (assignedLots.length === 0) {
          capacityLabel = "Under-allocated";
          capacityBadge = "bg-blue-50 text-blue-700 border-blue-200";
        } else if (assignedLots.length >= 3) {
          capacityLabel = "At Capacity";
          capacityBadge = "bg-burning-flame/15 text-truffle-trouble border-burning-flame/30";
        }

        return (
          <Card
            key={name}
            className="bg-white border border-blue-fantastic/10 shadow-sm flex flex-col justify-between h-full"
          >
            <div>
              {/* Card Header */}
              <CardHeader className="pb-3 border-b border-blue-fantastic/5">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-xl bg-blue-fantastic/10 flex items-center justify-center text-blue-fantastic">
                      <UserRound className="h-4.5 w-4.5 text-blue-fantastic" />
                    </div>
                    <CardTitle className="text-blue-fantastic text-sm font-bold font-sans">
                      {name}
                    </CardTitle>
                  </div>
                  <Badge variant="outline" className={`text-[10px] font-bold rounded-full ${capacityBadge}`}>
                    {capacityLabel} ({assignedLots.length} Lots)
                  </Badge>
                </div>
              </CardHeader>

              {/* Card Body */}
              <CardContent className="pt-4 space-y-4 font-sans">
                {/* Average progress bar */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-bold text-blue-fantastic/70">
                    <span>Average Project Progress</span>
                    <span>{avgProgress}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-blue-fantastic/10 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-truffle-trouble transition-all duration-500"
                      style={{ width: `${avgProgress}%` }}
                    />
                  </div>
                </div>

                {/* Assigned lots list */}
                <div className="space-y-2">
                  <span className="text-[10px] uppercase font-bold text-blue-fantastic/45 font-sans tracking-wide">
                    Assigned Builds
                  </span>

                  {assignedLots.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-6 border border-dashed border-blue-fantastic/10 rounded-xl bg-blue-fantastic/2">
                      <Building2 className="h-6 w-6 text-blue-fantastic/25 mb-1.5" />
                      <p className="text-[10px] font-bold text-blue-fantastic/60">No active build lots</p>
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-[220px] overflow-y-auto pr-1">
                      {assignedLots.map((lot) => (
                        <div
                          key={lot.id}
                          className="flex justify-between items-center p-3 bg-blue-fantastic/4 border border-blue-fantastic/5 rounded-xl text-xs font-bold text-blue-fantastic/80 hover:border-blue-fantastic/15 transition-all group"
                        >
                          <div className="space-y-1 min-w-0 flex-1 pr-2">
                            <div className="flex items-center gap-1.5">
                              <span className="text-blue-fantastic text-xs font-extrabold">Lot {lot.id}</span>
                              <span className="text-blue-fantastic/50 font-medium text-[10px] truncate">({lot.clientName})</span>
                            </div>
                            <div className="flex items-center gap-1 text-[10px] text-blue-fantastic/60 font-semibold">
                              <span>Stage: {lot.currentStage}</span>
                              <span>•</span>
                              <span>{lot.progress}% done</span>
                            </div>
                          </div>

                          <Button
                            onClick={() => onReassignClick(lot)}
                            className="opacity-0 group-hover:opacity-100 bg-truffle-trouble/10 hover:bg-truffle-trouble/20 text-truffle-trouble text-[10px] font-bold h-7 rounded-xl px-2 flex items-center gap-0.5 transition-all cursor-pointer"
                          >
                            <span>Reassign</span>
                            <ArrowRight className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </CardContent>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
