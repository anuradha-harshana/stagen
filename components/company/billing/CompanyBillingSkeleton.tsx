"use client"

import React from "react"
import { Skeleton } from "@/components/ui/skeleton"

export function CompanyBillingSkeleton() {
  return (
    <div className="flex flex-col gap-6 w-full font-sans animate-pulse">
      {/* Header Skeleton */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-blue-fantastic/15">
        <div className="flex items-center gap-3">
          <Skeleton className="h-11 w-11 rounded-2xl bg-neutral-200" />
          <div className="space-y-2">
            <Skeleton className="h-7 w-48 bg-neutral-200 rounded-lg" />
            <Skeleton className="h-4 w-72 bg-neutral-200 rounded-md" />
          </div>
        </div>
        <Skeleton className="h-10 w-32 bg-neutral-200 rounded-xl" />
      </div>

      {/* Top Section Grid (Current Plan & Payment Method) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Skeleton className="h-56 w-full rounded-3xl bg-neutral-200" />
        </div>
        <div className="lg:col-span-1">
          <Skeleton className="h-56 w-full rounded-3xl bg-neutral-200" />
        </div>
      </div>

      {/* Bottom Section Grid (Invoice History & Site Licences) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Skeleton className="h-72 w-full rounded-3xl bg-neutral-200" />
        </div>
        <div className="lg:col-span-1">
          <Skeleton className="h-72 w-full rounded-3xl bg-neutral-200" />
        </div>
      </div>
    </div>
  )
}
