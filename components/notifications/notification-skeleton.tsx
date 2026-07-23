import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function NotificationSkeleton() {
  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Header skeleton */}
      <div className="flex items-center justify-between pb-4 border-b border-blue-fantastic/10">
        <div className="flex items-center gap-3">
          <Skeleton className="h-11 w-11 rounded-2xl" />
          <div className="space-y-1.5">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-3.5 w-64" />
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-32 rounded-2xl" />
          <Skeleton className="h-8 w-44 rounded-md" />
          <Skeleton className="h-8 w-36 rounded-md" />
        </div>
      </div>

      {/* Main content + Sub Sidebar skeleton */}
      <div className="flex flex-col lg:flex-row gap-4 w-full items-start">
        {/* Main Feed skeleton */}
        <div className="flex-1 min-w-0 w-full">
          <Card className="bg-abyssal-blue/20 border-blue-fantastic/10">
            <CardHeader className="border-b border-blue-fantastic/10 pb-3">
              <div className="flex items-center justify-between">
                <Skeleton className="h-5 w-36" />
                <Skeleton className="h-5 w-20 rounded-full" />
              </div>
            </CardHeader>
            <CardContent className="pt-3 space-y-2.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3.5 p-3 rounded-2xl bg-white/30">
                  <Skeleton className="h-10 w-10 rounded-2xl shrink-0" />
                  <div className="flex-1 space-y-1.5 min-w-0">
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-3 w-4/5" />
                  </div>
                  <Skeleton className="h-5 w-16 rounded-2xl hidden sm:block shrink-0" />
                  <Skeleton className="h-3 w-12 shrink-0" />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Sub Sidebar skeleton */}
        <div className="w-full lg:w-72 xl:w-80 shrink-0 space-y-4">
          <Card className="bg-abyssal-blue/20 border-blue-fantastic/10">
            <CardHeader className="pb-2">
              <Skeleton className="h-4 w-24" />
            </CardHeader>
            <CardContent className="space-y-2 pt-1">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-9 w-full rounded-xl" />
              ))}
            </CardContent>
          </Card>

          <Card className="bg-abyssal-blue/20 border-blue-fantastic/10">
            <CardHeader className="pb-2">
              <Skeleton className="h-4 w-36" />
            </CardHeader>
            <CardContent className="space-y-3 pt-1">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-5 w-9 rounded-full" />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
