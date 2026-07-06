import { Navbar } from '@/components/Navbar/Navbar';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import React from 'react'

const companyAdminLayout = ({
    children,
}: {
    children: React.ReactNode;
}) => {
  return (
    <>
      <SidebarProvider>
        <Navbar role="company-admin" />
        <main className="flex-1 bg-oatmeal">
            <SidebarTrigger />
            {children}
        </main>
      </SidebarProvider>
    </>
  )
}

export default companyAdminLayout
