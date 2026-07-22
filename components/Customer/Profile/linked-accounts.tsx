import { ChevronRight, Link2 } from "lucide-react"

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
    <Card className="bg-palladian border border-blue-fantastic/15 shadow-sm font-cream">
      <CardHeader className="border-b border-blue-fantastic/10 pb-3">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-xl bg-truffle-trouble/10 flex items-center justify-center">
            <Link2 className="h-4 w-4 text-truffle-trouble" />
          </div>
          <div>
            <CardTitle className="text-blue-fantastic text-base font-bold font-cream">
              Linked Accounts
            </CardTitle>
            <CardDescription className="text-blue-fantastic/60 text-xs font-medium font-cream mt-0.5">
              Manage connected third-party services
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-4">
        <div className="flex items-center justify-between rounded-xl border border-blue-fantastic/15 bg-blue-fantastic/5 p-3.5 hover:bg-blue-fantastic/10 transition-colors">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-fantastic text-palladian font-bold text-xs shadow-xs">
              G
            </div>

            <span className="font-bold text-sm text-blue-fantastic">
              Google
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className="bg-emerald-500/10 text-emerald-700 border-emerald-500/30 text-xs font-semibold"
            >
              Connected
            </Badge>

            <ChevronRight className="h-4 w-4 text-blue-fantastic/40" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default LinkedAccounts