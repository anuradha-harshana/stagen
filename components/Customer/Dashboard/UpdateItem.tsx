"use client";

import React from "react";
import { CheckCircle2, Clock, Package, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { RecentUpdate } from "@/lib/dashboard/data";

interface UpdateItemProps {
  update: RecentUpdate;
}

export default function UpdateItem({ update }: UpdateItemProps) {
  const getIcon = () => {
    switch (update.type) {
      case "success":
        return {
          icon: <CheckCircle2 className="h-5 w-5 text-emerald-600" />,
          bgClass: "bg-emerald-50 border border-emerald-100",
        };
      case "in-progress":
        return {
          icon: <Clock className="h-5 w-5 text-burning-flame" />,
          bgClass: "bg-burning-flame/10 border border-burning-flame/15",
        };
      case "info":
      default:
        return {
          icon: <Package className="h-5 w-5 text-blue-fantastic" />,
          bgClass: "bg-blue-fantastic/10 border border-blue-fantastic/15",
        };
    }
  };

  const { icon, bgClass } = getIcon();

  return (
    <div className="group flex items-center justify-between p-3.5 rounded-2xl bg-white border border-blue-fantastic/[0.03] hover:border-truffle-trouble/10 hover:shadow-[0_4px_15px_rgba(27,38,50,0.02)] transition-all duration-300">
      <div className="flex items-center gap-3.5">
        {/* Status Icon Wrapper */}
        <div className={cn("flex items-center justify-center w-10 h-10 rounded-xl shrink-0 transition-transform duration-300 group-hover:scale-105", bgClass)}>
          {icon}
        </div>

        {/* Text descriptions */}
        <div>
          <h4 className="text-sm font-bold text-blue-fantastic group-hover:text-truffle-trouble transition-colors duration-300">
            {update.title}
          </h4>
          <p className="text-xs text-blue-fantastic/50 font-medium mt-0.5">
            {update.date}
          </p>
        </div>
      </div>

      {/* Decorative arrow showing interactivity */}
      <ChevronRight className="h-4 w-4 text-blue-fantastic/20 group-hover:text-truffle-trouble/60 group-hover:translate-x-1 transition-all duration-300" />
    </div>
  );
}
