"use client";
import { useCompanyDashboard, DataState } from "@/components/supervisor/useSupervisorData";
export default function TopicInsights() {
  const { data, error } = useCompanyDashboard();
  if (!data) return <DataState loading={!error} error={error} />;
  const categories = Array.from(new Set(data.questions.map(q => q.category)));
  return <section className="bg-white p-6 rounded-2xl space-y-4 border border-blue-fantastic/15"><h2 className="font-bold">Question Topics</h2>{categories.map(category => <p key={category}>{category}: {data.questions.filter(q => q.category === category).length}</p>)}{!categories.length && <p>No questions recorded.</p>}</section>;
}
