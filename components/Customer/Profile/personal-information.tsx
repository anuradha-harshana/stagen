import { Pencil } from "lucide-react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

const PersonalInformation = () => {
  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">
          Personal Information
        </CardTitle>

        <Button variant="outline" size="sm">
          <Pencil className="mr-2 h-4 w-4" />
          Edit
        </Button>
      </CardHeader>

      <CardContent>
        {/* User */}
        <div className="flex items-center gap-5">
          <Avatar className="h-28 w-28">
            <AvatarImage src="/profile-avatar.png" alt="Joe Builder" />
            <AvatarFallback>JB</AvatarFallback>
          </Avatar>

          <div>
            <h2 className="text-2xl font-semibold">
              Joe Builder
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              joe.builder@example.com
            </p>

            <p className="mt-2 text-sm text-muted-foreground">
              +61 412 345 678
            </p>
          </div>
        </div>

        <Separator className="my-6" />

        {/* Details */}
        <div className="space-y-6 text-sm">
          <InfoRow label="Role" value="Customer" />

          <InfoRow
            label="Company"
            value="Dream Homes Pty Ltd"
          />

          <InfoRow
            label="Home Address"
            value={
              <>
                12 Willow Street,
                <br />
                Melbourne, VIC 3000
              </>
            }
          />

          <InfoRow
            label="Account Created"
            value="12 Mar 2024"
          />

          <InfoRow
            label="Preferred Language"
            value="English"
          />

          <InfoRow
            label="Time Zone"
            value="(AEST) Australia/Sydney"
          />
        </div>
      </CardContent>
    </Card>
  )
}

type InfoRowProps = {
  label: string
  value: React.ReactNode
}

const InfoRow = ({ label, value }: InfoRowProps) => {
  return (
    <div className="grid grid-cols-[140px_1fr] gap-4">
      <span className="text-muted-foreground">
        {label}
      </span>

      <span className="font-medium">
        {value}
      </span>
    </div>
  )
}

export default PersonalInformation