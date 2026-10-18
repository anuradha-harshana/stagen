import React from "react";
import { requireRole } from "@/lib/auth/auth";
import { getCompanyFaqData } from "@/lib/company/faq";
import FAQClient from "@/components/company/faq/faq-client";

export default async function FAQPage() {
  // 1. Authenticate user and verify they have the 'company' role
  const user = await requireRole(["company"]);

  // 2. Fetch initial FAQ data directly from JSON storage
  const faqData = await getCompanyFaqData(user.id);

  return (
    <FAQClient
      initialFaqs={faqData.faqs}
      initialGuardrails={faqData.guardrails}
      initialDocuments={faqData.documents}
      companyId={user.id}
    />
  );
}
