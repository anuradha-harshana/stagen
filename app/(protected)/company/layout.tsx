import { Navbar } from '@/components/Navbar/Navbar';
import { UserProvider } from '@/components/Providers/user-provider';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { requireRole } from '@/lib/auth/auth';
import React from 'react'

export default async function companyAdminLayout  ({
    children,
}: {
    children: React.ReactNode;
}) {
  const user = await requireRole(["company"])
  return (
    <>
      <SidebarProvider>
        <Navbar role={user.role} />
        <main className="flex-1 bg-oatmeal">
            <SidebarTrigger />
            <UserProvider user={user}>
              {children}
            </UserProvider>
        </main>
      </SidebarProvider>
    </>
  )
}


