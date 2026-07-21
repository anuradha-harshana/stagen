import {
  ChevronRight,
  LogOut,
  Monitor,
} from "lucide-react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

const SessionCard = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">
          Session
        </CardTitle>

        <CardDescription>
          You are currently signed in
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Current device */}
        <div className="flex items-center justify-between rounded-lg border p-4">
          <div className="flex items-center gap-3">
            <Monitor className="h-5 w-5" />

            <div>
              <p className="font-medium">
                This device
              </p>

              <p className="text-sm text-muted-foreground">
                Chrome on Windows
              </p>
            </div>
          </div>

          <Badge
            variant="secondary"
            className="text-green-700"
          >
            Active
          </Badge>
        </div>

        {/* Sign out */}
        <Button
          variant="outline"
          className="h-auto w-full justify-between p-4 text-destructive hover:text-destructive"
        >
          <div className="flex items-center gap-3">
            <LogOut className="h-5 w-5" />

            <span>
              Sign out from all devices
            </span>
          </div>

          <ChevronRight className="h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  )
}

export default SessionCard