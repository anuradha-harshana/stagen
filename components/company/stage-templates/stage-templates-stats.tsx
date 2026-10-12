"use client";

import React from "react";
import { ListOrdered, CheckSquare, Percent, AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { StageTemplate } from "@/lib/types/types";

export type TemplateStage = StageTemplate;

interface StageTemplatesStatsProps {
  stages: TemplateStage[];
}

export default function StageTemplatesStats({ stages }: StageTemplatesStatsProps) {
  const totalStages = stages.length;
  const totalItems = stages.reduce((acc, stage) => acc + (stage.checklist?.length || 0), 0);
  const totalWeight = stages.reduce((acc, stage) => acc + (stage.weight || 0), 0);

  const isWeightValid = totalWeight === 100;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full font-sans">
      {/* Total Stages Card */}
      <Card className="bg-white border border-blue-fantastic/5 hover:border-truffle-trouble/10 shadow-[0_6px_20px_rgba(27,38,50,0.03)] hover:shadow-[0_12px_30px_rgba(27,38,50,0.06)] hover:scale-[1.01] transition-all duration-300 rounded-2xl overflow-hidden group">
        <CardContent className="p-6 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-fantastic/50 font-sans">
              Total Stages
            </span>
            <h2 className="text-3xl font-extrabold text-blue-fantastic font-sans tracking-tight group-hover:text-truffle-trouble transition-colors duration-300">
              {totalStages}
            </h2>
            <p className="text-xs text-blue-fantastic/45 font-medium">Standard build phases</p>
          </div>
          <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-blue-fantastic/10 text-blue-fantastic group-hover:rotate-6 transition-all duration-300">
            <ListOrdered className="h-6 w-6 text-blue-fantastic" />
          </div>
        </CardContent>
      </Card>

      {/* Total Checklist Items Card */}
      <Card className="bg-white border border-blue-fantastic/5 hover:border-truffle-trouble/10 shadow-[0_6px_20px_rgba(27,38,50,0.03)] hover:shadow-[0_12px_30px_rgba(27,38,50,0.06)] hover:scale-[1.01] transition-all duration-300 rounded-2xl overflow-hidden group">
        <CardContent className="p-6 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-fantastic/50 font-sans">
              Checklist Tasks
            </span>
            <h2 className="text-3xl font-extrabold text-blue-fantastic font-sans tracking-tight group-hover:text-truffle-trouble transition-colors duration-300">
              {totalItems}
            </h2>
            <p className="text-xs text-blue-fantastic/45 font-medium">Quality assurance checkpoints</p>
          </div>
          <div className="flex items-center justify-center w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 group-hover:rotate-6 transition-all duration-300">
            <CheckSquare className="h-6 w-6" />
          </div>
        </CardContent>
      </Card>

      {/* Est Weight Card */}
      <Card className="bg-white border border-blue-fantastic/5 hover:border-truffle-trouble/10 shadow-[0_6px_20px_rgba(27,38,50,0.03)] hover:shadow-[0_12px_30px_rgba(27,38,50,0.06)] hover:scale-[1.01] transition-all duration-300 rounded-2xl overflow-hidden group">
        <CardContent className="p-6 flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-blue-fantastic/50 font-sans flex items-center gap-1">
              Estimated Weight
              {!isWeightValid && (
                <AlertCircle className="h-3.5 w-3.5 text-burning-flame shrink-0" />
              )}
            </span>
            <h2 className={`text-3xl font-extrabold font-sans tracking-tight transition-colors duration-300 ${
              isWeightValid ? "text-blue-fantastic group-hover:text-truffle-trouble" : "text-burning-flame"
            }`}>
              {totalWeight}%
            </h2>
            <p className={`text-xs font-semibold ${isWeightValid ? "text-blue-fantastic/45" : "text-burning-flame/70"}`}>
              {isWeightValid ? "Weights sum up to 100%" : `Must sum to 100% (diff: ${100 - totalWeight}%)`}
            </p>
          </div>
          <div className={`flex items-center justify-center w-12 h-12 rounded-2xl group-hover:rotate-6 transition-all duration-300 ${
            isWeightValid ? "bg-truffle-trouble/15 text-truffle-trouble" : "bg-burning-flame/15 text-burning-flame"
          }`}>
            <Percent className="h-6 w-6" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
