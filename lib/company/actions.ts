"use server";

import { getCurrentUser } from "@/lib/auth/auth";
import {
  getCompanySettings,
  updateCompanySettings,
  CompanySettingsData,
} from "./companySettings";
import {
  getCompanyDocuments,
  addCompanyDocument,
  updateCompanyDocument,
  deleteCompanyDocument,
  CompanyDocumentRecord,
} from "./companyDocuments";
import { CompanyDocument } from "@/components/company/documents/CompanyUploadDocumentModal";
import {
  getCompanyProjects,
  updateCompanyProjectSupervisor,
  replyToCompanyProjectQuestion,
} from "./companyProjects";
import {
  getCompanyDefects,
  updateCompanyDefect,
  createCompanyDefect,
  deleteCompanyDefect,
  CompanyDefectRecord,
} from "./companyDefects";
import { Project } from "../db-mock/projectsData";

const DEFAULT_COMPANY_ID = "7ab56015-4412-494e-8aff-dbb5095e0095";

async function resolveCompanyId(providedId?: string): Promise<string> {
  if (providedId) return providedId;
  try {
    const user = await getCurrentUser();
    if (user?.role === "company") return user.id;
    if ((user as { companyId?: string })?.companyId) return (user as { companyId?: string }).companyId!;
  } catch {
    // If running in client context without request cookies, fallback
  }
  return DEFAULT_COMPANY_ID;
}

// ==========================================
//           SETTINGS ACTIONS
// ==========================================

export async function fetchCompanySettingsAction(companyId?: string): Promise<CompanySettingsData | null> {
  const targetId = await resolveCompanyId(companyId);
  return await getCompanySettings(targetId);
}

export async function saveCompanySettingsAction(
  settings: Omit<CompanySettingsData, "companyId" | "updatedAt">,
  companyId?: string
): Promise<CompanySettingsData> {
  const targetId = await resolveCompanyId(companyId);
  return await updateCompanySettings(targetId, settings);
}

// ==========================================
//          DOCUMENTS ACTIONS
// ==========================================

export async function fetchCompanyDocumentsAction(companyId?: string): Promise<CompanyDocumentRecord[]> {
  const targetId = await resolveCompanyId(companyId);
  return await getCompanyDocuments(targetId);
}

export async function createCompanyDocumentAction(
  doc: Omit<CompanyDocument, "id" | "uploadDate">,
  companyId?: string
): Promise<CompanyDocumentRecord> {
  const targetId = await resolveCompanyId(companyId);
  return await addCompanyDocument(targetId, doc);
}

export async function updateCompanyDocumentAction(
  docId: string,
  updates: Partial<Omit<CompanyDocument, "id">>,
  companyId?: string
): Promise<CompanyDocumentRecord | null> {
  const targetId = await resolveCompanyId(companyId);
  return await updateCompanyDocument(targetId, docId, updates);
}

export async function removeCompanyDocumentAction(
  docId: string,
  companyId?: string
): Promise<boolean> {
  const targetId = await resolveCompanyId(companyId);
  return await deleteCompanyDocument(targetId, docId);
}

// ==========================================
//     PROJECTS & WORKLOAD ACTIONS
// ==========================================

export async function fetchCompanyProjectsAction(companyId?: string): Promise<Project[]> {
  const targetId = await resolveCompanyId(companyId);
  return await getCompanyProjects(targetId);
}

export async function reassignSupervisorAction(
  projectId: string,
  supervisorName: string,
  companyId?: string
): Promise<Project[] | null> {
  const targetId = await resolveCompanyId(companyId);
  return await updateCompanyProjectSupervisor(targetId, projectId, supervisorName);
}

export async function replyToCompanyQuestionAction(
  questionId: string,
  replyText: string,
  companyId?: string
): Promise<Project[] | null> {
  const targetId = await resolveCompanyId(companyId);
  return await replyToCompanyProjectQuestion(targetId, questionId, replyText);
}

// ==========================================
//          DEFECTS & WARRANTY ACTIONS
// ==========================================

export async function fetchCompanyDefectsAction(companyId?: string): Promise<CompanyDefectRecord[]> {
  const targetId = await resolveCompanyId(companyId);
  return await getCompanyDefects(targetId);
}

export async function updateCompanyDefectAction(
  defectId: string,
  updates: Partial<Omit<CompanyDefectRecord, "id" | "companyId">>,
  companyId?: string
): Promise<CompanyDefectRecord | null> {
  const targetId = await resolveCompanyId(companyId);
  return await updateCompanyDefect(targetId, defectId, updates);
}

export async function createCompanyDefectAction(
  defect: Omit<CompanyDefectRecord, "id" | "companyId">,
  companyId?: string
): Promise<CompanyDefectRecord> {
  const targetId = await resolveCompanyId(companyId);
  return await createCompanyDefect(targetId, defect);
}

export async function removeCompanyDefectAction(
  defectId: string,
  companyId?: string
): Promise<boolean> {
  const targetId = await resolveCompanyId(companyId);
  return await deleteCompanyDefect(targetId, defectId);
}

