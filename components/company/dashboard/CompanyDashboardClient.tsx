"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Bell, LayoutDashboard, UserPlus, FolderPlus, CreditCard, Shield, Activity, Building2, ChevronRight, CheckCircle2, Clock3, AlertTriangle } from "lucide-react";
import { User } from "@/lib/types/types";
import type { getCompanyDashboard } from "@/lib/company/company";
import PageHeader from "@/components/shared/PageHeader";
import { PAGE_SHELL_CLASS } from "@/components/shared/pageShell";
import { LogoutButton } from "@/components/auth/LogoutButton";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

type Dashboard = Awaited<ReturnType<typeof getCompanyDashboard>>;
const statusStyles: Record<string, string> = {
  Completed: "border-emerald-200 bg-emerald-50 text-emerald-700",
  "On Track": "border-blue-fantastic/15 bg-blue-fantastic/5 text-blue-fantastic",
  Delayed: "border-amber-200 bg-amber-50 text-amber-800",
  "Action Required": "border-red-200 bg-red-50 text-red-700",
};
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
      <div className="grid gap-6 lg:grid-cols-2">
        <section className="overflow-hidden bg-white border border-blue-fantastic/15 rounded-2xl shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-blue-fantastic/10 px-6 py-5">
            <div><h2 className="font-bold">Recent Activity</h2><p className="mt-1 text-xs text-blue-fantastic/60">Latest updates from your build sites</p></div>
            <Link href="/company/audit-logs" className="inline-flex items-center gap-1 text-truffle-trouble text-xs font-semibold hover:underline">View audit logs <ChevronRight className="h-3.5 w-3.5" /></Link>
          </div>
          <ul className="divide-y divide-blue-fantastic/10">
            {data.recentActivities.slice(0, 5).map(a => <li key={a.id} className="flex gap-3 px-6 py-4 hover:bg-blue-fantastic/[0.025] transition-colors">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-truffle-trouble/15 bg-truffle-trouble/5 text-truffle-trouble"><Activity className="h-4 w-4" /></span>
              <div className="min-w-0"><p className="text-sm font-semibold leading-relaxed">{a.title}</p><div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-blue-fantastic/60"><span className="font-medium">{a.clientName}</span><span className="inline-flex items-center gap-1"><Clock3 className="h-3 w-3" />{a.date}</span></div></div>
            </li>)}
          </ul>
          {!data.recentActivities.length && <p className="px-6 py-8 text-center text-sm text-blue-fantastic/60">No activity recorded yet.</p>}
        </section>
      <section className="bg-white border border-blue-fantastic/15 rounded-2xl p-6"><h2 className="font-bold mb-4">Quick Actions</h2><div className="grid grid-cols-2 gap-4">{[{ label: "Add User", href: "/company/users", icon: UserPlus }, { label: "Create Project", href: "/company/projects?create=1", icon: FolderPlus }, { label: "View Billing", href: "/company/billing", icon: CreditCard }, { label: "Manage Roles", href: "/company/users", icon: Shield }].map(a => <Link key={a.label} href={a.href} className="flex flex-col items-center gap-3 border border-blue-fantastic/15 rounded-2xl p-6 hover:bg-oatmeal/30"><a.icon className="h-5 w-5" /><span>{a.label}</span></Link>)}</div></section></div>
      <section className="overflow-hidden bg-white rounded-2xl border border-blue-fantastic/15 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-5">
          <div><h2 className="font-bold">Projects Overview</h2><p className="mt-1 text-xs text-blue-fantastic/60">Stage progress and status across {data.projects.length} build sites</p></div>
          <Link href="/company/projects" className="inline-flex items-center gap-1 text-xs font-semibold text-truffle-trouble hover:underline">View all projects <ChevronRight className="h-4 w-4" /></Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[680px] text-sm text-left">
            <caption className="sr-only">Construction projects, current stages, completion percentages and status</caption>
            <thead className="border-y border-blue-fantastic/10 bg-blue-fantastic/5 text-[10px] uppercase tracking-wider text-blue-fantastic/65">
              <tr>{["Project", "Current Stage", "Progress", "Status"].map(label => <th key={label} scope="col" className="px-6 py-3 font-bold">{label}</th>)}</tr>
            </thead>
            <tbody className="divide-y divide-blue-fantastic/10">
              {data.projects.map(p => {
                const progress = Math.max(0, Math.min(100, p.progress));
                const StatusIcon = p.status === "Completed" ? CheckCircle2 : p.status === "On Track" ? Clock3 : AlertTriangle;
                return <tr key={p.id} className="even:bg-blue-fantastic/[0.015] hover:bg-blue-fantastic/[0.04] transition-colors">
                  <td className="px-6 py-4">
                    <Link href="/company/projects" className="group flex items-center gap-3 rounded-lg focus-visible:outline-2 focus-visible:outline-truffle-trouble">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-truffle-trouble/15 bg-truffle-trouble/5 text-truffle-trouble"><Building2 className="h-4 w-4" /></span>
                      <span><span className="block font-semibold group-hover:text-truffle-trouble">{p.clientName}</span><span className="mt-0.5 block text-[11px] uppercase tracking-wide text-blue-fantastic/55">{p.id}</span></span>
                    </Link>
                  </td>
                  <td className="px-6 py-4"><span className="inline-flex rounded-lg border border-blue-fantastic/10 bg-blue-fantastic/5 px-2.5 py-1 text-xs font-medium">{p.currentStage || "Not started"}</span></td>
                  <td className="px-6 py-4 min-w-[180px]">
                    <div className="mb-1.5 flex items-center justify-between gap-4 text-xs"><span className="text-blue-fantastic/55">Complete</span><span className="font-bold tabular-nums">{progress}%</span></div>
                    <div role="progressbar" aria-label={p.clientName + " completion"} aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100} className="h-1.5 overflow-hidden rounded-full bg-blue-fantastic/10"><div className={p.status === "Completed" ? "h-full rounded-full bg-emerald-500" : "h-full rounded-full bg-gradient-to-r from-truffle-trouble to-burning-flame"} style={{width: progress + "%"}} /></div>
                  </td>
                  <td className="px-6 py-4"><span className={"inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-1 text-[11px] font-semibold " + (statusStyles[p.status] ?? statusStyles["On Track"])}><StatusIcon className="h-3 w-3" />{p.status}</span></td>
                </tr>;
              })}
              {!data.projects.length && <tr><td colSpan={4} className="px-6 py-10 text-center text-blue-fantastic/60">No projects created yet.</td></tr>}
            </tbody>
          </table>
        </div>
      </section>
    </>}
  </div>;
}
