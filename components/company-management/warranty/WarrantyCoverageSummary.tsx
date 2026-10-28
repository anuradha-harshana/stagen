"use client";
import { useCompanyDashboard, DataState } from "@/components/supervisor/useSupervisorData";
export default function WarrantyCoverageSummary() {
  const { data, error } = useCompanyDashboard();
  if (!data) return <DataState loading={!error} error={error} />;
  return <section className="bg-white p-6 rounded-2xl space-y-4 border border-blue-fantastic/15"><h2 className="font-bold">Recorded Warranty Coverage</h2>{data.warranties.map(w => <div key={w.projectId + w.id}><p>{w.title} · {w.status}</p><p className="text-sm opacity-70">{w.projectId} · {w.period} · Expires {w.expiry}</p></div>)}{!data.warranties.length && <p>No coverage recorded.</p>}</section>;
}
