"use client";
import { useCompanyDashboard, DataState } from "@/components/supervisor/useSupervisorData";
import { PAGE_SHELL_CLASS } from "@/components/shared/pageShell";
export function BillingOverview() {
  const { data, error } = useCompanyDashboard();
  if (!data) return <DataState loading={!error} error={error} />;
  return <div className={PAGE_SHELL_CLASS}><h1 className="text-2xl font-bold">Project Billing</h1><div className="grid md:grid-cols-3 gap-6">{[["Contract value", data.kpis.totalContractValue], ["Collected", data.kpis.totalCollected], ["Outstanding", data.kpis.totalOutstanding]].map(([label, value]) => <div key={label} className="bg-white rounded-2xl p-6 border border-blue-fantastic/15"><p>{label}</p><p className="text-2xl font-bold">{Number(value).toLocaleString()}</p></div>)}</div><section className="bg-white p-6 rounded-2xl border border-blue-fantastic/15 overflow-x-auto"><table className="w-full text-left text-sm"><thead><tr><th>Invoice</th><th>Project</th><th>Due</th><th>Amount</th><th>Status</th></tr></thead><tbody>{data.invoices.map(i => <tr key={i.siteName + i.id} className="border-t border-blue-fantastic/10"><td className="py-3">{i.id}</td><td>{i.siteName}</td><td>{i.dueDate}</td><td>{i.amount.toLocaleString()}</td><td>{i.status}</td></tr>)}</tbody></table>{!data.invoices.length && <p>No invoices recorded.</p>}</section></div>;
}
