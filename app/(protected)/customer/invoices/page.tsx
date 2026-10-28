"use client";

import React, { useEffect, useState } from "react";
import { InvoicesHeader } from "@/components/Customer/Invoices/InvoicesHeader";
import { InvoicesSummaryCards } from "@/components/Customer/Invoices/InvoicesSummaryCards";
import { InvoicesTable } from "@/components/Customer/Invoices/InvoicesTable";
import { PaymentTimeline } from "@/components/Customer/Invoices/PaymentTimeline";
import { PAGE_SHELL_CLASS } from "@/components/shared/pageShell";
import type { TenantInvoicesData, PaymentMilestone } from "@/lib/customer/invoices";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

export default function InvoicesPage() {
  const [invoicesData, setInvoicesData] = useState<TenantInvoicesData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPaying, setIsPaying] = useState<string | null>(null);

  const loadInvoices = async () => {
    try {
      const res = await fetch("/api/customer/invoices");
      if (!res.ok) {
        throw new Error("Failed to load invoice records");
      }
      const data = await res.json();
      setInvoicesData(data.invoicesData);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load invoice records from server");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadInvoices();
  }, []);

  const handlePayInvoice = async (invoiceId: string) => {
    setIsPaying(invoiceId);
    try {
      const res = await fetch("/api/customer/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "pay", invoiceId }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Payment failed");
      }

      const data = await res.json();
      setInvoicesData(data.invoicesData);
      toast.success("Payment processed successfully!");
    } catch (err: any) {
      toast.error(err.message || "Payment could not be completed");
    } finally {
      setIsPaying(null);
    }
  };

  const handlePayMilestone = async (milestone: PaymentMilestone) => {
    if (!invoicesData) return;

    // Match with pending invoice
    const matchingInvoice = invoicesData.invoices.find(
      (inv) =>
        inv.status === "Pending" &&
        (inv.description.toLowerCase().includes(milestone.label.toLowerCase()) ||
          milestone.label.toLowerCase().includes(inv.description.toLowerCase()))
    );

    if (matchingInvoice) {
      await handlePayInvoice(matchingInvoice.id);
    } else {
      setIsPaying(milestone.label);
      try {
        const res = await fetch("/api/customer/invoices", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            milestoneId: milestone.id || milestone.label,
            updates: { status: "paid" },
          }),
        });

        if (!res.ok) throw new Error("Payment failed");
        const data = await res.json();
        if (data.invoicesData) setInvoicesData(data.invoicesData);
        toast.success("Payment milestone settled successfully!");
      } catch (err: any) {
        toast.error(err.message || "Failed to settle milestone payment");
      } finally {
        setIsPaying(null);
      }
    }
  };

  const paidPct =
    invoicesData && invoicesData.contract_value > 0
      ? Math.round((invoicesData.amount_paid / invoicesData.contract_value) * 100)
      : 45;

  return (
    <div className={PAGE_SHELL_CLASS}>
      <InvoicesHeader percentage={paidPct} />

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-3 text-blue-fantastic/70">
          <Loader2 className="h-8 w-8 animate-spin text-truffle-trouble" />
          <p className="text-sm font-semibold">Loading payment details...</p>
        </div>
      ) : (
        <>
          <InvoicesSummaryCards data={invoicesData} />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InvoicesTable
              invoices={invoicesData?.invoices}
              onPayInvoice={handlePayInvoice}
              isPaying={isPaying}
            />
            <PaymentTimeline
              milestones={invoicesData?.payment_milestones}
              onPayMilestone={handlePayMilestone}
              isPaying={isPaying}
            />
          </div>
        </>
      )}
    </div>
  );
}
