import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { PAGE_SHELL_CLASS } from "./pageShell";

interface PageSkeletonProps {
  statCards?: number;
  contentRows?: number;
}

export function PageSkeleton({ statCards = 3, contentRows = 5 }: PageSkeletonProps) {
  return (
    <div className={PAGE_SHELL_CLASS}>
      <div className="flex items-center justify-between gap-4 pb-4 border-b border-blue-fantastic/15">
        <div className="flex items-center gap-3">
          <Skeleton className="h-12 w-12 rounded-2xl bg-blue-fantastic/10" />
          <div className="space-y-2">
            <Skeleton className="h-7 w-48 bg-blue-fantastic/10" />
            <Skeleton className="h-4 w-72 max-w-full bg-blue-fantastic/10" />
          </div>
        </div>
        <Skeleton className="h-10 w-32 rounded-xl bg-blue-fantastic/10" />
      </div>

      {statCards > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Array.from({ length: statCards }).map((_, index) => (
            <Card
              key={index}
              className="bg-white border border-blue-fantastic/15 shadow-sm"
            >
              <CardContent className="p-4 space-y-3">
                <Skeleton className="h-4 w-1/3 bg-blue-fantastic/10" />
                <Skeleton className="h-8 w-2/3 bg-blue-fantastic/10" />
                <Skeleton className="h-2 w-full bg-blue-fantastic/10" />
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Card className="bg-white border border-blue-fantastic/15 shadow-sm">
        <CardHeader>
          <Skeleton className="h-5 w-1/4 bg-blue-fantastic/10" />
        </CardHeader>
        <CardContent className="space-y-3">
          {Array.from({ length: contentRows }).map((_, index) => (
            <div key={index} className="flex gap-3">
              <Skeleton className="h-10 w-10 rounded-full bg-blue-fantastic/10" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-2/3 bg-blue-fantastic/10" />
                <Skeleton className="h-3 w-full bg-blue-fantastic/10" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
