"use client";
import Link from "next/link";
import { useCompanyDashboard, DataState } from "@/components/supervisor/useSupervisorData";
export function AiInsightsSection() {
  const { data, error } = useCompanyDashboard();
  if (!data) return <DataState loading={!error} error={error} />;
  const answered = data.questions.filter(q => q.answered).length;
  return <section className="bg-white p-6 rounded-2xl space-y-4 border border-blue-fantastic/15"><h2 className="text-xl font-bold">Customer Communication</h2><div className="grid sm:grid-cols-3 gap-6"><p>Total questions: {data.questions.length}</p><p>Answered: {answered}</p><p>Awaiting reply: {data.questions.length - answered}</p></div><Link className="text-truffle-trouble underline" href="/company-management/customer-insights">View customer questions</Link></section>;
}
