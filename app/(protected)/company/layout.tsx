import { Navbar } from '@/components/Navbar/Navbar';
import { UserProvider } from '@/components/Providers/UserProvider';
import { CompanyThemeProvider } from '@/components/Providers/CompanyThemeProvider';
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { requireRole } from '@/lib/auth/auth';
import { getCompanySettings } from '@/lib/company/companySettings';
import { getCompanyProfile } from '@/lib/company/companyProfile';
import React from 'react';

export default async function companyAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireRole(["company"]);
  const companyId = user.companyId || user.id;
  const settings = await getCompanySettings(companyId);
  const profile = await getCompanyProfile(companyId);

  return (
    <CompanyThemeProvider initialSettings={settings}>
      <SidebarProvider>
        <Navbar
          role={user.role}
          logoUrl={settings?.logo || profile?.logoUrl}
          brandName={profile?.companyName}
        />
        <SidebarInset className="flex flex-col min-h-screen bg-oatmeal font-sans">
          <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center justify-between gap-3 border-b border-blue-fantastic/15 bg-white/90 px-4 md:px-6 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <SidebarTrigger className="text-blue-fantastic hover:bg-blue-fantastic/10 hover:text-blue-fantastic shrink-0 cursor-pointer" />
              <div className="h-4 w-px bg-blue-fantastic/20" />
              <span className="text-xs font-bold text-blue-fantastic/70 uppercase tracking-widest font-sans">
                {profile?.companyName ? `${profile.companyName} Admin Portal` : "Company Admin Portal"}
              </span>
            </div>
          </header>
          <main className="flex-1 w-full bg-oatmeal flex flex-col">
            <UserProvider user={user}>{children}</UserProvider>
          </main>
        </SidebarInset>
      </SidebarProvider>
    </CompanyThemeProvider>
  );
}
