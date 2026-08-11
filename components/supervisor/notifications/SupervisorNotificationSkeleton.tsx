"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"

export function SupervisorNotificationSkeleton() {
  return (
    <div className="flex flex-col gap-4 w-full font-sans animate-pulse">
      {/* Header Skeleton */}
      <div className="flex items-start justify-between flex-wrap gap-4 py-1">
        <div className="flex items-center gap-3">
          <div className="h-11 w-11 rounded-2xl bg-blue-fantastic/10 shrink-0" />
          <div className="space-y-1.5">
            <div className="h-6 w-48 bg-blue-fantastic/10 rounded-md" />
            <div className="h-4 w-80 bg-blue-fantastic/5 rounded-md" />
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <div className="h-8 w-28 bg-blue-fantastic/10 rounded-2xl" />
          <div className="h-8 w-48 bg-blue-fantastic/10 rounded-md" />
          <div className="h-8 w-32 bg-blue-fantastic/10 rounded-md" />
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-4 w-full items-start">
        {/* Main Feed Skeleton */}
        <div className="flex-1 w-full">
          <Card className="bg-palladian border border-blue-fantastic/15 shadow-sm rounded-2xl">
            <CardHeader className="border-b border-blue-fantastic/10 pb-3 flex items-center justify-between flex-row">
              <div className="flex items-center gap-2">
                <div className="h-7 w-7 rounded-xl bg-blue-fantastic/10" />
                <div className="h-4 w-24 bg-blue-fantastic/10 rounded-md" />
                <div className="h-4.5 w-16 bg-blue-fantastic/5 rounded-xl" />
              </div>
              <div className="h-6 w-24 bg-blue-fantastic/10 rounded-xl" />
            </CardHeader>
            <CardContent className="pt-3 pb-4 space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex flex-col gap-2.5 p-4 rounded-2xl border border-blue-fantastic/10 bg-palladian/25">
                  <div className="flex items-start gap-3.5">
                    <div className="h-10 w-10 rounded-2xl bg-blue-fantastic/10 shrink-0" />
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-36 bg-blue-fantastic/15 rounded-md" />
                        <div className="h-4.5 w-14 bg-truffle-trouble/10 rounded-xl" />
                        <div className="h-4 w-20 bg-blue-fantastic/10 rounded-md" />
                      </div>
                      <div className="h-3 w-full bg-blue-fantastic/5 rounded-md" />
                      <div className="h-3 w-2/3 bg-blue-fantastic/5 rounded-md" />
                    </div>
                    <div className="h-3 w-12 bg-blue-fantastic/10 rounded-md self-start shrink-0" />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Skeleton */}
        <div className="w-full lg:w-72 xl:w-80 shrink-0 space-y-4">
          <Card className="bg-palladian border border-blue-fantastic/15 shadow-sm rounded-2xl p-0 overflow-hidden">
            <div className="border-b border-blue-fantastic/10 px-4 py-3 flex items-center gap-2">
              <div className="h-6 w-6 rounded-lg bg-blue-fantastic/10" />
              <div className="h-4 w-24 bg-blue-fantastic/10 rounded-md" />
            </div>
            <div className="p-2 space-y-1.5">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-8 w-full bg-blue-fantastic/5 rounded-xl" />
              ))}
            </div>
          </Card>

          <Card className="bg-palladian border border-blue-fantastic/15 shadow-sm rounded-2xl p-0 overflow-hidden">
            <div className="border-b border-blue-fantastic/10 px-4 py-3 flex items-center gap-2">
              <div className="h-6 w-6 rounded-lg bg-blue-fantastic/10" />
              <div className="h-4 w-32 bg-blue-fantastic/10 rounded-md" />
            </div>
            <div className="p-3 space-y-2.5">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex justify-between items-center">
                  <div className="space-y-1">
                    <div className="h-3 w-20 bg-blue-fantastic/10 rounded-md" />
                    <div className="h-2 w-28 bg-blue-fantastic/5 rounded-md" />
                  </div>
                  <div className="h-4 w-8 bg-blue-fantastic/10 rounded-full" />
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default SupervisorNotificationSkeleton
