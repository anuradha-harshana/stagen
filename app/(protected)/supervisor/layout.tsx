import { Navbar } from '@/components/Navbar/Navbar';
import { UserProvider } from '@/components/Providers/user-provider';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { requireRole } from '@/lib/auth/auth';
import React from 'react'

<<<<<<< HEAD
export default async function supervisorLayout ({
=======
export default async function companyAdminLayout  ({
>>>>>>> 83af4cf76b3bec3bf88bdb0da2b4623d94163bc4
    children,
}: {
    children: React.ReactNode;
}) {
  const user = await requireRole(["supervisor"])
  return (
    <>
      <SidebarProvider>
        <Navbar role={user.role} />
<<<<<<< HEAD
        <main className="pb-10 flex-1 bg-oatmeal h-screen overflow-hidden">
            <SidebarTrigger />
            <div className="h-full overflow-y-scroll scrollbar-none">
              <UserProvider user={user}>
                {children}
              </UserProvider>
            </div>
=======
        <main className="flex-1 bg-oatmeal">
            <SidebarTrigger />
            <UserProvider user={user}>
              {children}
            </UserProvider>
>>>>>>> 83af4cf76b3bec3bf88bdb0da2b4623d94163bc4
        </main>
      </SidebarProvider>
    </>
  )
}
<<<<<<< HEAD
=======


>>>>>>> 83af4cf76b3bec3bf88bdb0da2b4623d94163bc4
