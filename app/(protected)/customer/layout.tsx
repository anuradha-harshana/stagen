import { Navbar } from '@/components/Navbar/Navbar';
import { UserProvider } from '@/components/Providers/UserProvider';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { requireRole } from '@/lib/auth/auth';
import React from 'react';

export default async function customerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireRole(["customer"]);
  return (
    <SidebarProvider>
      <Navbar role={user.role} />
      <SidebarInset className="flex flex-col min-h-screen bg-oatmeal font-sans">
        <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center justify-between gap-3 border-b border-blue-fantastic/15 bg-palladian/90 px-4 md:px-6 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <SidebarTrigger className="text-blue-fantastic hover:bg-blue-fantastic/10 hover:text-blue-fantastic shrink-0 cursor-pointer" />
            <div className="h-4 w-px bg-blue-fantastic/20" />
            <span className="text-xs font-bold text-blue-fantastic/70 uppercase tracking-widest font-sans">
              Customer Portal
            </span>
          </div>
        </header>
        <main className="flex-1 w-full bg-oatmeal">
          <UserProvider user={user}>{children}</UserProvider>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}


