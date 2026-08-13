"use client"

import React from "react"

export function CompanyNotificationsSkeleton() {
  return (
    <div className="flex flex-col gap-6 w-full animate-pulse font-sans">
      {/* Header Skeleton */}
      <div className="flex justify-between items-center pb-2">
        <div className="flex flex-col gap-2">
          <div className="h-8 w-64 bg-slate-200 rounded-xl" />
          <div className="h-4 w-80 bg-slate-200 rounded-lg" />
        </div>
        <div className="h-10 w-36 bg-slate-200 rounded-xl" />
      </div>

      {/* Tabs Skeleton */}
      <div className="flex gap-6 border-b border-blue-fantastic/15 pb-3">
        <div className="h-6 w-32 bg-slate-200 rounded-lg" />
        <div className="h-6 w-32 bg-slate-200 rounded-lg" />
      </div>

      {/* Grid Content Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-5 flex flex-col gap-4">
          <div className="h-28 bg-palladian border border-blue-fantastic/15 rounded-2xl p-5" />
          <div className="h-28 bg-palladian border border-blue-fantastic/15 rounded-2xl p-5" />
          <div className="h-28 bg-palladian border border-blue-fantastic/15 rounded-2xl p-5" />
        </div>
        <div className="lg:col-span-7 h-96 bg-palladian border border-blue-fantastic/15 rounded-3xl p-8" />
      </div>
    </div>
  )
}
