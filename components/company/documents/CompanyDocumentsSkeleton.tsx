import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function CompanyDocumentsSkeleton() {
  return (
    <div className="flex flex-col gap-5 w-full font-cream">
      {/* Header skeleton */}
      <div className="flex items-center justify-between pb-4 border-b border-blue-fantastic/15">
        <div className="flex items-center gap-3">
          <Skeleton className="h-11 w-11 rounded-2xl bg-blue-fantastic/15" />
          <div className="space-y-1.5">
            <Skeleton className="h-6 w-56 bg-blue-fantastic/20" />
            <Skeleton className="h-4 w-72 bg-blue-fantastic/10" />
          </div>
        </div>
        <Skeleton className="h-10 w-44 rounded-xl bg-burning-flame/30" />
      </div>

      {/* Main Table Card Skeleton */}
      <Card className="bg-palladian border border-blue-fantastic/15 rounded-3xl shadow-sm overflow-hidden">
        <CardHeader className="bg-white/50 border-b border-blue-fantastic/10 p-4">
          <div className="flex items-center justify-between gap-3">
            <Skeleton className="h-10 flex-1 max-w-xs bg-blue-fantastic/10 rounded-xl" />
            <Skeleton className="h-10 w-32 shrink-0 bg-blue-fantastic/10 rounded-xl" />
          </div>
        </CardHeader>
        <CardContent className="p-4 space-y-3">
          <Skeleton className="h-10 w-full bg-blue-fantastic/15 rounded-xl" />
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-14 w-full bg-blue-fantastic/10 rounded-xl" />
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
