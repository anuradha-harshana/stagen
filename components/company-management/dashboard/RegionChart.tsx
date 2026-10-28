"use client";
import { useCompanyDashboard, DataState } from "@/components/supervisor/useSupervisorData";
export function RegionChart() {
  const { data, error } = useCompanyDashboard();
  if (!data) return <DataState loading={!error} error={error} />;
  const counts: Record<string, number> = {};
  for (const project of data.projects) { const region = project.address.match(/\b(VIC|NSW|QLD|WA|SA|TAS|NT|ACT)\b/)?.[0] ?? "Unspecified"; counts[region] = (counts[region] ?? 0) + 1; }
  return <section className="bg-white p-6 rounded-2xl border border-blue-fantastic/15 space-y-3"><h2 className="font-bold">Projects by Region</h2>{Object.entries(counts).map(([region, count]) => <p key={region}>{region}: {count}</p>)}{!data.projects.length && <p>No projects recorded.</p>}</section>;
}
