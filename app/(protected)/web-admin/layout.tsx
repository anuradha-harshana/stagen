import { Navbar } from '@/components/Navbar/Navbar';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import React from 'react';

const sysAdminLayout = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <SidebarProvider>
      <Navbar role="admin" />
      <SidebarInset className="flex flex-col min-h-screen bg-oatmeal font-sans">
        <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center justify-between gap-3 border-b border-blue-fantastic/15 bg-palladian/90 px-4 md:px-6 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <SidebarTrigger className="text-blue-fantastic hover:bg-blue-fantastic/10 hover:text-blue-fantastic shrink-0 cursor-pointer" />
            <div className="h-4 w-px bg-blue-fantastic/20" />
            <span className="text-xs font-bold text-blue-fantastic/70 uppercase tracking-widest font-sans">
              System Admin Portal
            </span>
          </div>
        </header>
        <main className="flex-1 w-full bg-oatmeal">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default sysAdminLayout;
