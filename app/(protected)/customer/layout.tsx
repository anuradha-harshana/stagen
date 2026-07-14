import { Navbar } from '@/components/Navbar/Navbar';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import React from 'react'

const customerLayout = ({
    children,
}: {
    children: React.ReactNode;
}) => {
  return (
    <>
      <SidebarProvider>
        <Navbar role="customer" />
        <main className="pb-10 flex-1 bg-oatmeal h-screen overflow-hidden">
            <SidebarTrigger />
            <div className="h-full overflow-y-scroll scrollbar-none">
              {children}
            </div>
        </main>
      </SidebarProvider>
    </>
  )
}

export default customerLayout
