import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function InvoicesSkeleton() {
  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Header skeleton */}
      <div className="flex items-center gap-3 pb-4 border-b border-blue-fantastic/10">
        <Skeleton className="h-9 w-9 rounded-2xl" />
        <div className="space-y-1.5">
          <Skeleton className="h-5 w-44" />
          <Skeleton className="h-3.5 w-60" />
        </div>
      </div>

      {/* Summary cards skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-9 gap-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="col-span-3 bg-abyssal-blue/20">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Skeleton className="h-7 w-7 rounded-xl" />
                <Skeleton className="h-3 w-20" />
              </div>
            </CardHeader>
            <CardContent className="space-y-1.5">
              <Skeleton className="h-7 w-28" />
              <Skeleton className="h-3 w-20" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Table + timeline grid skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Table skeleton */}
        <Card className="bg-abyssal-blue/20">
          <CardHeader>
            <Skeleton className="h-4 w-32" />
          </CardHeader>
          <CardContent className="space-y-2">
            <Skeleton className="h-8 w-full" />
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </CardContent>
        </Card>

        {/* Timeline skeleton */}
        <Card className="bg-abyssal-blue/20">
          <CardHeader>
            <Skeleton className="h-4 w-36" />
          </CardHeader>
          <CardContent className="space-y-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <Skeleton className="h-4 w-4 rounded-full shrink-0" />
                <div className="flex-1 space-y-1.5">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-20" />
                </div>
                <Skeleton className="h-4 w-16" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
