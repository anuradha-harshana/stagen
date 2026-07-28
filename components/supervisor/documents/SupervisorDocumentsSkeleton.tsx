import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function SupervisorDocumentsSkeleton() {
  return (
    <div className="flex flex-col gap-4 w-full font-cream">
      {/* Header skeleton */}
      <div className="flex items-center gap-3 pb-4 border-b border-blue-fantastic/10">
        <Skeleton className="h-11 w-11 rounded-2xl bg-blue-fantastic/15" />
        <div className="space-y-1.5">
          <Skeleton className="h-6 w-56 bg-blue-fantastic/15" />
          <Skeleton className="h-4 w-80 bg-blue-fantastic/10" />
        </div>
      </div>

      {/* Summary cards skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="sm:col-span-3 bg-palladian border border-blue-fantastic/15">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <Skeleton className="h-3 w-20 bg-blue-fantastic/15" />
                <Skeleton className="h-8 w-8 rounded-xl bg-blue-fantastic/15" />
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <Skeleton className="h-7 w-28 bg-blue-fantastic/20" />
              <Skeleton className="h-3 w-32 bg-blue-fantastic/10" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Form + Recent List skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 w-full">
        <Card className="lg:col-span-7 bg-palladian border border-blue-fantastic/15">
          <CardHeader>
            <Skeleton className="h-5 w-44 bg-blue-fantastic/15" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-10 w-full bg-blue-fantastic/10" />
            <div className="grid grid-cols-2 gap-4">
              <Skeleton className="h-10 w-full bg-blue-fantastic/10" />
              <Skeleton className="h-10 w-full bg-blue-fantastic/10" />
            </div>
            <Skeleton className="h-20 w-full bg-blue-fantastic/10" />
            <Skeleton className="h-32 w-full bg-blue-fantastic/10" />
          </CardContent>
        </Card>

        <Card className="lg:col-span-5 bg-palladian border border-blue-fantastic/15">
          <CardHeader>
            <Skeleton className="h-5 w-48 bg-blue-fantastic/15" />
          </CardHeader>
          <CardContent className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-24 w-full bg-blue-fantastic/10 rounded-2xl" />
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
