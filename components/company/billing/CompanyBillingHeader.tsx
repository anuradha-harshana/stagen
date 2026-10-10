"use client";

import React from "react";
import { CreditCard } from "lucide-react";
import PageHeader from "@/components/shared/PageHeader";

export function CompanyBillingHeader() {
  return (
    <PageHeader
      icon={<CreditCard className="h-5 w-5 text-burning-flame" />}
      title="Billing & Licences"
      subtitle="Manage your subscription, payment methods, and invoices."
    />
  );
}
