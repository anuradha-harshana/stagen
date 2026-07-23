import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

const StatCards = () => {
  return (
    <>
      <Card className="col-span-3 bg-abyssal-blue/20 w-full flex flex-col">
        <CardHeader>
          <Skeleton className="h-4 w-3/4" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-16 w-full" />
        </CardContent>
      </Card>
    </>
  )
}



export default StatCards
