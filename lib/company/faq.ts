import crypto from "crypto";
import fs from "fs/promises";
import path from "path";

export interface FAQArticle {
  id: string;
  category: string;
  question: string;
  answer: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface KnowledgeDoc {
  name: string;
  size: string;
  uploadedAt: string;
}

export interface CompanyFaqRecord {
  companyId: string;
  faqs: FAQArticle[];
  guardrails: string[];
  documents: KnowledgeDoc[];
  createdAt?: string;
  updatedAt?: string;
}

const faqFile = path.join(process.cwd(), "data", "company", "faq.json");

const DEFAULT_FAQS: FAQArticle[] = [
  {
    id: "faq-1",
    category: "Site Access",
    question: "Can I visit the construction site at any time?",
    answer: "For safety reasons, site visits must be scheduled in advance with your Site Supervisor. Unaccompanied access is strictly prohibited."
  },
  {
    id: "faq-2",
    category: "Payments",
    question: "When are progress payments due?",
    answer: "Progress payments are due at the completion of each major stage (Slab, Frame, Lockup, Fixing, Practical Completion). Invoices are sent via the Customer Portal and are payable within 7 business days."
  },
  {
    id: "faq-3",
    category: "Warranty",
    question: "What is covered under the post-handover warranty?",
    answer: "We provide a 3-month minor defects warranty period and a statutory 6-year structural guarantee. Warranty requests can be logged directly through the Warranty page in the Customer Portal."
  },
  {
    id: "faq-4",
    category: "Delays",
    question: "How will I be notified of weather delays?",
    answer: "Any weather or material delay is recorded in our Site Diary and will automatically show up on your timeline and dashboard. Your supervisor will log estimated delays as they occur."
  }
];

const DEFAULT_GUARDRAILS = [
  "Prioritize safety instructions in all site visit inquiries.",
  "Direct complex contract and payment variations to the company manager.",
  "Always suggest contacting supervisor Eric for lot-specific timeline details."
];

const DEFAULT_DOCUMENTS: KnowledgeDoc[] = [
  {
    name: "Stagen_Warranty_Agreement_2026.pdf",
    size: "1.2 MB",
    uploadedAt: "Jun 15, 2026"
  },
  {
    name: "Site_Safety_And_Access_Protocol.pdf",
    size: "840 KB",
    uploadedAt: "Jun 18, 2026"
  },
  {
    name: "Standard_Invoicing_Schedule.pdf",
    size: "450 KB",
    uploadedAt: "Jun 24, 2026"
  }
];

async function readFaqRecords(): Promise<CompanyFaqRecord[]> {
  try {
    const fileContents = await fs.readFile(faqFile, "utf8");
    return JSON.parse(fileContents) as CompanyFaqRecord[];
  } catch (error) {
    return [];
  }
}

async function writeFaqRecords(records: CompanyFaqRecord[]) {
  await fs.writeFile(faqFile, JSON.stringify(records, null, 2), "utf8");
}

function findOrCreateCompanyRecord(
  records: CompanyFaqRecord[],
  companyId: string
): CompanyFaqRecord {
  let record = records.find((item) => item.companyId === companyId);
  if (!record) {
    const now = new Date().toISOString();
    record = {
      companyId,
      faqs: [...DEFAULT_FAQS],
      guardrails: [...DEFAULT_GUARDRAILS],
      documents: [...DEFAULT_DOCUMENTS],
      createdAt: now,
      updatedAt: now,
    };
    records.push(record);
  }
  return record;
}

export async function getCompanyFaqData(companyId: string): Promise<CompanyFaqRecord> {
  const records = await readFaqRecords();
  const companyRecord = findOrCreateCompanyRecord(records, companyId);
  return companyRecord;
}

export async function getCompanyFaqs(companyId: string): Promise<FAQArticle[]> {
  const data = await getCompanyFaqData(companyId);
  return data.faqs ?? [];
}

export async function createCompanyFaq(
  companyId: string,
  input: { category: string; question: string; answer: string; id?: string }
): Promise<FAQArticle> {
  const records = await readFaqRecords();
  const company = findOrCreateCompanyRecord(records, companyId);
  const now = new Date().toISOString();

  const newFaq: FAQArticle = {
    id: input.id && input.id.trim() ? input.id : `faq-${crypto.randomUUID()}`,
    category: input.category.trim(),
    question: input.question.trim(),
    answer: input.answer.trim(),
    createdAt: now,
    updatedAt: now,
  };

  company.faqs.unshift(newFaq);
  company.updatedAt = now;

  await writeFaqRecords(records);
  return newFaq;
}

export async function updateCompanyFaq(
  companyId: string,
  input: FAQArticle
): Promise<FAQArticle | null> {
  const records = await readFaqRecords();
  const company = findOrCreateCompanyRecord(records, companyId);
  const index = company.faqs.findIndex((item) => item.id === input.id);

  if (index === -1) {
    return null;
  }

  const now = new Date().toISOString();
  const updatedFaq: FAQArticle = {
    ...company.faqs[index],
    category: input.category.trim(),
    question: input.question.trim(),
    answer: input.answer.trim(),
    updatedAt: now,
  };

  company.faqs[index] = updatedFaq;
  company.updatedAt = now;

  await writeFaqRecords(records);
  return updatedFaq;
}

export async function deleteCompanyFaq(
  companyId: string,
  faqId: string
): Promise<boolean> {
  const records = await readFaqRecords();
  const company = findOrCreateCompanyRecord(records, companyId);
  const initialLength = company.faqs.length;

  company.faqs = company.faqs.filter((item) => item.id !== faqId);

  if (company.faqs.length === initialLength) {
    return false;
  }

  company.updatedAt = new Date().toISOString();
  await writeFaqRecords(records);
  return true;
}

export async function saveCompanyGuardrails(
  companyId: string,
  guardrails: string[]
): Promise<string[]> {
  const records = await readFaqRecords();
  const company = findOrCreateCompanyRecord(records, companyId);
  company.guardrails = guardrails;
  company.updatedAt = new Date().toISOString();
  await writeFaqRecords(records);
  return company.guardrails;
}

export async function saveCompanyDocuments(
  companyId: string,
  documents: KnowledgeDoc[]
): Promise<KnowledgeDoc[]> {
  const records = await readFaqRecords();
  const company = findOrCreateCompanyRecord(records, companyId);
  company.documents = documents;
  company.updatedAt = new Date().toISOString();
  await writeFaqRecords(records);
  return company.documents;
}
