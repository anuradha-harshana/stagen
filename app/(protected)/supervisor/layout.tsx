import { Navbar } from '@/components/Navbar/Navbar';
import { UserProvider } from '@/components/Providers/user-provider';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { requireRole } from '@/lib/auth/auth';
import React from 'react';

export default async function supervisorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireRole(["supervisor"]);

  return (
    <>
      <SidebarProvider>
        <Navbar role={user.role} />
        <main className="pb-10 flex-1 bg-oatmeal h-screen overflow-hidden">
          <SidebarTrigger />
          <div className="h-full overflow-y-scroll scrollbar-none">
            <UserProvider user={user}>{children}</UserProvider>
          </div>
        </main>
      </SidebarProvider>
    </>
  );
}
