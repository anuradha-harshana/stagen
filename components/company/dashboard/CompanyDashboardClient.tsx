"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Bell, LayoutDashboard, UserPlus, FolderPlus, CreditCard, Shield } from "lucide-react";
import { User } from "@/lib/types/types";
import type { getCompanyDashboard } from "@/lib/company/company";
import PageHeader from "@/components/shared/PageHeader";
import { PAGE_SHELL_CLASS } from "@/components/shared/pageShell";
import { LogoutButton } from "@/components/auth/LogoutButton";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

type Dashboard = Awaited<ReturnType<typeof getCompanyDashboard>>;
export default function CompanyDashboardClient({ user }: { user: User }) {
  const [data, setData] = useState<Dashboard | null>(null);
  const [error, setError] = useState("");
  useEffect(() => { fetch("/api/company/projects?view=dashboard", { cache: "no-store" }).then(async r => { if (!r.ok) throw new Error("Unable to load dashboard"); setData(await r.json()); }).catch(e => setError(e.message)); }, []);
  return <div className={PAGE_SHELL_CLASS}>
    <PageHeader icon={<LayoutDashboard className="h-5 w-5 text-burning-flame" />} title={`Welcome back, ${user.username}`} subtitle="Here's what's happening on your sites today." rightContent={<div className="flex items-center gap-3">
      <Link href="/company/notifications" aria-label="Notifications" className="p-3 rounded-xl bg-white"><Bell className="h-4 w-4" /></Link>
      <DropdownMenu><DropdownMenuTrigger className="p-3 rounded-xl bg-blue-fantastic text-white" aria-label="Account menu">{user.username.slice(0, 2).toUpperCase()}</DropdownMenuTrigger>
      <DropdownMenuContent align="end"><DropdownMenuItem asChild><Link href="/company/profile">Company Profile</Link></DropdownMenuItem><DropdownMenuItem asChild><Link href="/company/settings">Settings</Link></DropdownMenuItem><div className="flex items-center gap-2 p-2 bg-blue-fantastic text-white rounded-lg">Log out <LogoutButton /></div></DropdownMenuContent></DropdownMenu>
    </div>} />
    {error && <p role="alert">{error}</p>}
    {!data && !error && <p>Loading dashboard…</p>}
    {data && <>
      <div className="grid gap-6 md:grid-cols-3">{[["Active Projects", data.kpis.activeProjects], ["Total Users", data.totalUsers], ["Subscription", data.subscription]].map(([label, value]) => <div key={label} className="bg-white border border-blue-fantastic/15 rounded-2xl p-6"><p className="text-3xl font-bold">{value}</p><p className="mt-3 text-sm">{label}</p></div>)}</div>
      <div className="grid gap-6 lg:grid-cols-2"><section className="bg-white border border-blue-fantastic/15 rounded-2xl p-6"><div className="flex justify-between"><h2 className="font-bold">Recent Activity</h2><Link href="/company/audit-logs" className="text-truffle-trouble text-sm">View audit logs</Link></div><div className="mt-4 space-y-4">{data.recentActivities.slice(0, 5).map(a => <div key={a.id}><p>{a.title}</p><p className="text-xs opacity-60">{a.clientName} · {a.date}</p></div>)}{!data.recentActivities.length && <p>No activity recorded yet.</p>}</div></section>
      <section className="bg-white border border-blue-fantastic/15 rounded-2xl p-6"><h2 className="font-bold mb-4">Quick Actions</h2><div className="grid grid-cols-2 gap-4">{[{ label: "Add User", href: "/company/users", icon: UserPlus }, { label: "Create Project", href: "/company/projects?create=1", icon: FolderPlus }, { label: "View Billing", href: "/company/billing", icon: CreditCard }, { label: "Manage Roles", href: "/company/users", icon: Shield }].map(a => <Link key={a.label} href={a.href} className="flex flex-col items-center gap-3 border border-blue-fantastic/15 rounded-2xl p-6 hover:bg-oatmeal/30"><a.icon className="h-5 w-5" /><span>{a.label}</span></Link>)}</div></section></div>
      <section className="bg-white rounded-2xl p-6 border border-blue-fantastic/15"><h2 className="font-bold mb-4">Projects Overview</h2><div className="overflow-x-auto"><table className="w-full text-sm text-left"><thead><tr><th className="p-3">Project</th><th>Stage</th><th>Progress</th><th>Status</th></tr></thead><tbody>{data.projects.map(p => <tr key={p.id} className="border-t border-blue-fantastic/10"><td className="p-3"><Link href="/company/projects">{p.clientName} · {p.id}</Link></td><td>{p.currentStage}</td><td>{p.progress}%</td><td>{p.status}</td></tr>)}</tbody></table>{!data.projects.length && <p>No projects created yet.</p>}</div></section>
    </>}
  </div>;
}
