"use client";

import React from "react";
import { ShieldAlert } from "lucide-react";

export default function WarrantyHeader() {
  return (
    <div className="flex flex-col gap-3 pb-4 border-b border-blue-fantastic/15 font-sans w-full">
      <div className="flex items-center gap-3">
        <div className="h-11 w-11 rounded-2xl bg-blue-fantastic flex items-center justify-center shadow-sm shrink-0">
          <ShieldAlert className="h-5 w-5 text-burning-flame" />
        </div>
        <div>
          <h1 className="text-blue-fantastic text-2xl font-bold leading-tight font-sans">
            Warranty & Defects
          </h1>
          <p className="text-blue-fantastic/60 text-sm mt-0.5 font-medium font-sans">
            Assign supervisors, track resolution progress, and manage structural and maintenance warranties.
          </p>
        </div>
      </div>
    </div>
  );
}
