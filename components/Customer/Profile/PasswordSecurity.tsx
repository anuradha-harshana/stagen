import { Lock, ShieldCheck } from "lucide-react"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { Button } from "@/components/ui/button"

const PasswordSecurity = () => {
  return (
    <Card className="bg-palladian border border-blue-fantastic/15 shadow-sm font-sans">
      <CardHeader className="border-b border-blue-fantastic/10 pb-3">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-xl bg-truffle-trouble/10 flex items-center justify-center">
            <Lock className="h-4 w-4 text-truffle-trouble" />
          </div>
          <div>
            <CardTitle className="text-blue-fantastic text-base font-bold font-sans">
              Password & Security
            </CardTitle>
            <CardDescription className="text-blue-fantastic/60 text-xs font-medium font-sans mt-0.5">
              Keep your account credentials safe
            </CardDescription>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-4 space-y-3">
        <div className="flex items-center justify-between p-3 rounded-xl bg-blue-fantastic/5 border border-blue-fantastic/10">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-truffle-trouble" />
            <span className="text-xs font-semibold text-blue-fantastic">Password status</span>
          </div>
          <span className="text-xs text-blue-fantastic/70 font-medium">Updated 30 days ago</span>
        </div>

        <Button
          className="w-full bg-truffle-trouble text-palladian hover:bg-truffle-trouble/85 font-semibold text-xs h-9 justify-center gap-2 shadow-sm"
        >
          <Lock className="h-3.5 w-3.5" />
          Change Password
        </Button>
      </CardContent>
    </Card>
  )
}

export default PasswordSecurity