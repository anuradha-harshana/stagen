"use client"

import StatCards from "@/components/Customer/StatCards"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import UserDetails from "@/components/user/userDetails"



const page = () => {
  return (
    <div className="flex flex-col gap-4 w-full px-5">
        <UserDetails />
        <div className="grid grid-cols-1 sm:grid-cols-9 gap-2">
           <StatCards />
           <StatCards />
           <StatCards />
        </div>
        <div className="w-full">
          <Card className="bg-abyssal-blue/20">
            <CardHeader>
              <Skeleton className="h-5 w-2/7" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-20 w-full" />
            </CardContent>
          </Card>
        </div>
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
          <div className="flex gap-4 flex-col w-full">
            <Card className="bg-abyssal-blue/20">
              <CardHeader>
                <Skeleton className="h-5 w-1/4"/>
              </CardHeader>
              <CardContent className="space-y-2">
                <Skeleton className="h-10 w-full"/>
                <Skeleton className="h-10 w-full"/>
                <Skeleton className="h-10 w-full"/>
                <Skeleton className="h-10 w-full"/>
              </CardContent>
            </Card>
            <Card className="bg-abyssal-blue/20">
              <CardHeader>
                <Skeleton className="h-5 w-1/4"/>
              </CardHeader>
              <CardContent className="space-y-2">
                <Skeleton className="h-7 w-full"/>
                <Skeleton className="h-7 w-full"/>
                <Skeleton className="h-7 w-full"/>
                <Skeleton className="h-7 w-full"/>
              </CardContent>
            </Card>
          </div>
          <Card className="bg-abyssal-blue/20">
              <CardHeader>
                <Skeleton className="h-5 w-1/4"/>
              </CardHeader>
              <CardContent className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <Skeleton className="h-30 w-full"/>
                <Skeleton className="h-30 w-full"/>
                <Skeleton className="h-30 w-full"/>
              </CardContent>
            </Card>
        </div>
      </div>
  )
}

export default page
