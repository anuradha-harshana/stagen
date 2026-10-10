import { Pencil, User, Mail, Phone, MapPin, Building, Calendar, Globe, Clock, Shield } from "lucide-react"

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

const PersonalInformation = () => {
  return (
    <Card className="bg-white border border-blue-fantastic/15 shadow-sm font-sans h-full">
      <CardHeader className="border-b border-blue-fantastic/10 pb-3 flex flex-row items-center justify-between space-y-0">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-xl bg-truffle-trouble/10 flex items-center justify-center">
            <User className="h-4 w-4 text-truffle-trouble" />
          </div>
          <CardTitle className="text-blue-fantastic text-base font-bold font-sans">
            Personal Information
          </CardTitle>
        </div>

        <Button
          variant="outline"
          size="sm"
          className="h-8 border-blue-fantastic/20 text-blue-fantastic hover:bg-blue-fantastic/10 bg-blue-fantastic/5 text-xs font-semibold"
        >
          <Pencil className="mr-1.5 h-3.5 w-3.5" />
          Edit
        </Button>
      </CardHeader>

      <CardContent className="pt-5 space-y-6">
        {/* User Card Header */}
        <div className="flex items-center gap-5 p-4 rounded-2xl bg-blue-fantastic/5 border border-blue-fantastic/10">
          <Avatar className="h-20 w-20 border-2 border-blue-fantastic/20 shadow-sm shrink-0">
            <AvatarImage src="/profile-avatar.png" alt="Joe Builder" />
            <AvatarFallback className="bg-blue-fantastic text-palladian font-bold text-xl">
              JB
            </AvatarFallback>
          </Avatar>

          <div className="space-y-1 min-w-0">
            <h2 className="text-xl font-bold text-blue-fantastic truncate">
              Joe Builder
            </h2>

            <div className="flex items-center gap-2 text-xs text-blue-fantastic/70 font-medium">
              <Mail className="h-3.5 w-3.5 text-truffle-trouble shrink-0" />
              <span className="truncate">joe.builder@example.com</span>
            </div>

            <div className="flex items-center gap-2 text-xs text-blue-fantastic/70 font-medium">
              <Phone className="h-3.5 w-3.5 text-truffle-trouble shrink-0" />
              <span>+61 412 345 678</span>
            </div>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InfoCard
            icon={<Shield className="h-4 w-4 text-truffle-trouble" />}
            label="Role"
            value="Customer"
          />

          {/* <InfoCard
            icon={<Building className="h-4 w-4 text-truffle-trouble" />}
            label="Company"
            value="Dream Homes Pty Ltd"
          /> */}

          <InfoCard
            icon={<MapPin className="h-4 w-4 text-truffle-trouble" />}
            label="Home Address"
            value="12 Willow Street, Melbourne, VIC 3000"
            // className="sm:col-span-2"
          />

          <InfoCard
            icon={<Calendar className="h-4 w-4 text-truffle-trouble" />}
            label="Account Created"
            value="12 Mar 2024"
          />

          <InfoCard
            icon={<Globe className="h-4 w-4 text-truffle-trouble" />}
            label="Preferred Language"
            value="English"
          />

          <InfoCard
            icon={<Clock className="h-4 w-4 text-truffle-trouble" />}
            label="Time Zone"
            value="(AEST) Australia/Sydney"
            className="sm:col-span-2"
          />
        </div>
      </CardContent>
    </Card>
  )
}

type InfoCardProps = {
  icon: React.ReactNode
  label: string
  value: React.ReactNode
  className?: string
}

const InfoCard = ({ icon, label, value, className = "" }: InfoCardProps) => {
  return (
    <div className={`p-3.5 rounded-xl bg-blue-fantastic/5 border border-blue-fantastic/10 flex items-start gap-3 ${className}`}>
      <div className="h-8 w-8 rounded-lg bg-blue-fantastic/10 flex items-center justify-center shrink-0 mt-0.5">
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[11px] font-semibold text-blue-fantastic/60 uppercase tracking-wider">
          {label}
        </p>
        <p className="text-sm font-bold text-blue-fantastic mt-0.5 leading-snug">
          {value}
        </p>
      </div>
    </div>
  )
}

export default PersonalInformation
