import { ChevronRight } from "lucide-react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { Badge } from "@/components/ui/badge"

const LinkedAccounts = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">
          Linked Accounts
        </CardTitle>

        <CardDescription>
          Manage connected services
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="flex items-center justify-between rounded-lg border p-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-md border font-bold">
              G
            </div>

            <span className="font-medium">
              Google
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Badge
              variant="secondary"
              className="text-green-700"
            >
              Connected
            </Badge>

            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default LinkedAccounts