"use client";
import Link from "next/link";
import { useCompanyDashboard, DataState } from "@/components/supervisor/useSupervisorData";
export function OperationsOverview() {
  const { data, error } = useCompanyDashboard();
  if (!data) return <DataState loading={!error} error={error} />;
  return <div className="grid md:grid-cols-2 gap-6"><section className="bg-white p-6 rounded-2xl space-y-4 border border-blue-fantastic/15"><h2 className="font-bold">Supervisor Workload</h2>{data.supervisorsWorkload.map(s => <p key={s.id}>{s.name}: {s.projectsCount} projects</p>)}<Link href="/company-management/supervisors" className="underline">Manage assignments</Link></section><section className="bg-white p-6 rounded-2xl space-y-4 border border-blue-fantastic/15"><h2 className="font-bold">Warranty Defects</h2>{["open", "in-progress", "resolved"].map(status => <p key={status}>{status}: {data.defects.filter(d => d.status === status).length}</p>)}<Link href="/company-management/warranty" className="underline">View warranty</Link></section></div>;
}
