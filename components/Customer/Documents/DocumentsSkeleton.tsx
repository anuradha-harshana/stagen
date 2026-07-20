import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function DocumentsSkeleton() {
  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Header skeleton */}
      <div className="flex items-center justify-between pb-4 border-b border-blue-fantastic/10">
        <div className="flex items-center gap-3">
          <Skeleton className="h-9 w-9 rounded-2xl" />
          <div className="space-y-1.5">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-3.5 w-52" />
          </div>
        </div>
        <Skeleton className="h-8 w-24 rounded-2xl" />
      </div>

      {/* Filter skeleton */}
      <div className="flex gap-2">
        {[80, 70, 90, 80].map((w, i) => (
          <Skeleton key={i} className="h-6 rounded-2xl" style={{ width: w }} />
        ))}
      </div>

      {/* Photo grid skeleton */}
      <Card className="bg-abyssal-blue/20">
        <CardHeader>
          <Skeleton className="h-4 w-28" />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="aspect-video w-full rounded-2xl" />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Document list skeleton */}
      <Card className="bg-abyssal-blue/20">
        <CardHeader>
          <Skeleton className="h-4 w-36" />
        </CardHeader>
        <CardContent className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 px-3 py-2.5 rounded-2xl bg-white/30">
              <Skeleton className="h-9 w-9 rounded-xl shrink-0" />
              <div className="flex-1 space-y-1.5">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/3" />
              </div>
              <Skeleton className="h-5 w-16 rounded-2xl hidden sm:block" />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
