import React from "react";
import { requireRole } from "@/lib/auth/auth";
import FAQClient from "@/components/company/faq/faq-client";

export default async function FAQPage() {
  // 1. Authenticate user and verify they have the 'company' role
  await requireRole(["company"]);

  return <FAQClient />;
}
