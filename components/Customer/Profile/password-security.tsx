import { Lock } from "lucide-react"

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
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">
          Password & Security
        </CardTitle>

        <CardDescription>
          Keep your account secure
        </CardDescription>
      </CardHeader>

      <CardContent>
        <Button
          variant="outline"
          className="w-full justify-center"
        >
          <Lock className="mr-2 h-4 w-4" />
          Change Password
        </Button>
      </CardContent>
    </Card>
  )
}

export default PasswordSecurity