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

const DEFAULT_FAQS: FAQArticle[] = [];

const DEFAULT_GUARDRAILS: string[] = [];

const DEFAULT_DOCUMENTS: KnowledgeDoc[] = [];

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
