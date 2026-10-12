"use client";

import React from "react";
import { Hammer, CircleHelp, PartyPopper } from "lucide-react";
import { cn } from "@/lib/utils";

interface DemoControlsProps {
  currentState: "active" | "not-started" | "completed";
  onChange: (state: "active" | "not-started" | "completed") => void;
}

export default function DemoControls({ currentState, onChange }: DemoControlsProps) {
  return (
    <div className="flex bg-surface-inset border border-blue-fantastic/5 p-1 rounded-xl w-full sm:w-auto">
      <button
        onClick={() => onChange("not-started")}
        className={cn(
          "flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all duration-300 cursor-pointer",
          currentState === "not-started"
            ? "bg-white text-truffle-trouble shadow-sm border border-blue-fantastic/5"
            : "text-blue-fantastic/60 hover:text-blue-fantastic"
        )}
      >
        <CircleHelp className="h-4 w-4" />
        <span>Not Started</span>
      </button>

      <button
        onClick={() => onChange("active")}
        className={cn(
          "flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all duration-300 cursor-pointer",
          currentState === "active"
            ? "bg-white text-truffle-trouble shadow-sm border border-blue-fantastic/5"
            : "text-blue-fantastic/60 hover:text-blue-fantastic"
        )}
      >
        <Hammer className="h-4 w-4" />
        <span>Active Build</span>
      </button>

      <button
        onClick={() => onChange("completed")}
        className={cn(
          "flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition-all duration-300 cursor-pointer",
          currentState === "completed"
            ? "bg-white text-truffle-trouble shadow-sm border border-blue-fantastic/5"
            : "text-blue-fantastic/60 hover:text-blue-fantastic"
        )}
      >
        <PartyPopper className="h-4 w-4" />
        <span>Completed</span>
      </button>
    </div>
  );
}
