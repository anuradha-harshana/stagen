import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function WarrantySkeleton() {
  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Header skeleton */}
      <div className="flex items-center gap-3 pb-4 border-b border-blue-fantastic/10">
        <Skeleton className="h-9 w-9 rounded-2xl" />
        <div className="space-y-1.5">
          <Skeleton className="h-5 w-52" />
          <Skeleton className="h-3.5 w-64" />
        </div>
      </div>

      {/* Warranty cards grid skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="bg-abyssal-blue/20">
            <CardHeader>
              <div className="flex items-start gap-3">
                <Skeleton className="h-9 w-9 rounded-2xl shrink-0" />
                <div className="flex-1 space-y-1.5">
                  <div className="flex gap-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-14 rounded-2xl" />
                  </div>
                  <Skeleton className="h-3 w-28" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <Skeleton className="h-12 w-full" />
              <div className="flex gap-6 pt-1">
                <div className="space-y-1.5">
                  <Skeleton className="h-2.5 w-12" />
                  <Skeleton className="h-4 w-16" />
                </div>
                <div className="space-y-1.5">
                  <Skeleton className="h-2.5 w-12" />
                  <Skeleton className="h-4 w-16" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Bottom row: maintenance + defect log */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Maintenance timeline skeleton */}
        <Card className="bg-abyssal-blue/20">
          <CardHeader>
            <Skeleton className="h-4 w-36" />
          </CardHeader>
          <CardContent className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-start gap-3">
                <Skeleton className="h-4 w-4 rounded-full shrink-0 mt-0.5" />
                <div className="flex-1 space-y-1.5 pb-2">
                  <div className="flex gap-2">
                    <Skeleton className="h-4 w-40" />
                    <Skeleton className="h-4 w-16 rounded-2xl" />
                  </div>
                  <Skeleton className="h-3 w-32" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Defect log skeleton */}
        <Card className="bg-abyssal-blue/20">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="ml-auto h-6 w-20 rounded-2xl" />
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 px-3 py-2.5 rounded-2xl bg-white/30">
                <Skeleton className="h-4 w-4 rounded-full shrink-0" />
                <div className="flex-1 space-y-1.5">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-2/4" />
                </div>
                <Skeleton className="h-5 w-16 rounded-2xl" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
