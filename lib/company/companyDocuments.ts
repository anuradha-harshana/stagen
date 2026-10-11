import crypto from "crypto";
import fs from "fs/promises";
import path from "path";
import { CompanyDocument } from "@/components/company/documents/CompanyUploadDocumentModal";

export interface CompanyDocumentRecord extends CompanyDocument {
  companyId: string;
}

const docsFilePath = path.join(process.cwd(), "data", "company", "companyDocuments.json");

async function readDocRecords(): Promise<CompanyDocumentRecord[]> {
  try {
    const data = await fs.readFile(docsFilePath, "utf-8");
    return JSON.parse(data) as CompanyDocumentRecord[];
  } catch (err) {
    console.error("Failed to read company documents JSON:", err);
    return [];
  }
}

async function writeDocRecords(records: CompanyDocumentRecord[]) {
  await fs.writeFile(docsFilePath, JSON.stringify(records, null, 2), "utf-8");
}

export async function getCompanyDocuments(companyId: string): Promise<CompanyDocumentRecord[]> {
  const records = await readDocRecords();
  return records.filter((doc) => doc.companyId === companyId);
}

export async function addCompanyDocument(
  companyId: string,
  newDoc: Omit<CompanyDocument, "id" | "uploadDate">
): Promise<CompanyDocumentRecord> {
  const records = await readDocRecords();
  const doc: CompanyDocumentRecord = {
    ...newDoc,
    id: `doc-${crypto.randomUUID()}`,
    companyId,
    uploadDate: new Date().toISOString().split("T")[0],
  };

  records.unshift(doc);
  await writeDocRecords(records);
  return doc;
}

export async function updateCompanyDocument(
  companyId: string,
  docId: string,
  updates: Partial<Omit<CompanyDocument, "id">>
): Promise<CompanyDocumentRecord | null> {
  const records = await readDocRecords();
  const doc = records.find((d) => d.id === docId && d.companyId === companyId);
  if (!doc) return null;

  Object.assign(doc, updates);
  await writeDocRecords(records);
  return doc;
}

export async function deleteCompanyDocument(companyId: string, docId: string): Promise<boolean> {
  const records = await readDocRecords();
  const filtered = records.filter((d) => !(d.id === docId && d.companyId === companyId));

  if (filtered.length === records.length) return false;
  await writeDocRecords(filtered);
  return true;
}
