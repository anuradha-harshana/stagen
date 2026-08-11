"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";

export function ExecutiveKpis() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-cream">
      {/* Total Projects */}
      <Card className="bg-white border border-oatmeal/40 shadow-sm rounded-2xl p-5 hover:border-blue-fantastic/20 transition-all">
        <CardContent className="p-0 text-center">
          <span className="text-xs font-bold text-blue-fantastic/60 uppercase tracking-wider block">
            Total Projects
          </span>
          <div className="text-4xl font-extrabold text-blue-fantastic font-bebas-neue tracking-tight my-1">
            145
          </div>
          <span className="text-xs font-bold text-emerald-600 inline-flex items-center gap-1">
            ↑ 12% <span className="text-blue-fantastic/40 font-normal">vs last month</span>
          </span>
        </CardContent>
      </Card>

      {/* Active Projects */}
      <Card className="bg-white border border-oatmeal/40 shadow-sm rounded-2xl p-5 hover:border-blue-fantastic/20 transition-all">
        <CardContent className="p-0 text-center">
          <span className="text-xs font-bold text-blue-fantastic/60 uppercase tracking-wider block">
            Active Projects
          </span>
          <div className="text-4xl font-extrabold text-blue-fantastic font-bebas-neue tracking-tight my-1">
            92
          </div>
          <span className="text-xs font-bold text-emerald-600 inline-flex items-center gap-1">
            ↑ 8% <span className="text-blue-fantastic/40 font-normal">vs last month</span>
          </span>
        </CardContent>
      </Card>

      {/* Delayed Projects */}
      <Card className="bg-white border border-oatmeal/40 shadow-sm rounded-2xl p-5 hover:border-red-300 transition-all">
        <CardContent className="p-0 text-center">
          <span className="text-xs font-bold text-blue-fantastic/60 uppercase tracking-wider block">
            Delayed Projects
          </span>
          <div className="text-4xl font-extrabold text-red-600 font-bebas-neue tracking-tight my-1">
            14
          </div>
          <span className="text-xs font-bold text-red-500 inline-flex items-center gap-1">
            ↑ 3% <span className="text-blue-fantastic/40 font-normal">vs last month</span>
          </span>
        </CardContent>
      </Card>

      {/* Completed */}
      <Card className="bg-white border border-oatmeal/40 shadow-sm rounded-2xl p-5 hover:border-blue-fantastic/20 transition-all">
        <CardContent className="p-0 text-center">
          <span className="text-xs font-bold text-blue-fantastic/60 uppercase tracking-wider block">
            Completed
          </span>
          <div className="text-4xl font-extrabold text-blue-fantastic font-bebas-neue tracking-tight my-1">
            39
          </div>
          <span className="text-xs font-bold text-emerald-600 inline-flex items-center gap-1">
            ↑ 15% <span className="text-blue-fantastic/40 font-normal">vs last month</span>
          </span>
        </CardContent>
      </Card>
    </div>
  );
}
