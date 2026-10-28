"use client";
import { useCompanyDashboard, DataState } from "@/components/supervisor/useSupervisorData";
export function BillingStats() {
  const { data, error } = useCompanyDashboard();
  if (!data) return <DataState loading={!error} error={error} />;
  return <section className="bg-white p-6 rounded-2xl border border-blue-fantastic/15 space-y-3"><h2 className="font-bold">Recorded Billing Summary</h2><p>Contract value: {data.kpis.totalContractValue.toLocaleString()}</p><p>Collected: {data.kpis.totalCollected.toLocaleString()}</p><p>Outstanding: {data.kpis.totalOutstanding.toLocaleString()}</p><p>Projects: {data.projects.length}</p></section>;
}
