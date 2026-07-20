import React from "react"
import { Navbar } from "@/components/Navbar/Navbar"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"

export default function SiteSupervisorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <Navbar role="site-supervisor" />
      <main className="flex-1 bg-oatmeal min-h-svh">
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider>
  )
}