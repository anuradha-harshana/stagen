import fs from "fs/promises";
import path from "path";
import { INITIAL_PROJECTS, Project } from "../db-mock/projectsData";

export interface CompanyProjectsRecord {
  companyId: string;
  projects: Project[];
  updatedAt?: string;
}

const DEFAULT_COMPANY_ID = "7ab56015-4412-494e-8aff-dbb5095e0095";
const projectsFilePath = path.join(process.cwd(), "data", "company", "companyProjects.json");

async function readProjectsRecords(): Promise<CompanyProjectsRecord[]> {
  try {
    const data = await fs.readFile(projectsFilePath, "utf-8");
    const parsed = JSON.parse(data) as CompanyProjectsRecord[];
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
  } catch (err) {
    // File doesn't exist or failed to parse, seed below
  }

  // Seed default data
  const initialRecords: CompanyProjectsRecord[] = [
    {
      companyId: DEFAULT_COMPANY_ID,
      projects: INITIAL_PROJECTS,
      updatedAt: new Date().toISOString(),
    },
  ];

  try {
    await fs.writeFile(projectsFilePath, JSON.stringify(initialRecords, null, 2), "utf-8");
  } catch (writeErr) {
    console.error("Failed to seed initial company projects:", writeErr);
  }

  return initialRecords;
}

async function writeProjectsRecords(records: CompanyProjectsRecord[]): Promise<void> {
  await fs.writeFile(projectsFilePath, JSON.stringify(records, null, 2), "utf-8");
}

export async function getCompanyProjects(companyId: string): Promise<Project[]> {
  const records = await readProjectsRecords();
  let companyRecord = records.find((r) => r.companyId === companyId);

  if (!companyRecord) {
    // If company doesn't have a record yet, create one seeded with INITIAL_PROJECTS
    companyRecord = {
      companyId,
      projects: INITIAL_PROJECTS,
      updatedAt: new Date().toISOString(),
    };
    records.push(companyRecord);
    await writeProjectsRecords(records);
  }

  return companyRecord.projects;
}

export async function updateCompanyProjectSupervisor(
  companyId: string,
  projectId: string,
  supervisorName?: string
): Promise<Project[] | null> {
  const records = await readProjectsRecords();
  let companyRecord = records.find((r) => r.companyId === companyId);

  if (!companyRecord) {
    companyRecord = {
      companyId,
      projects: [...INITIAL_PROJECTS],
      updatedAt: new Date().toISOString(),
    };
    records.push(companyRecord);
  }

  const project = companyRecord.projects.find((p) => p.id === projectId);
  if (!project) return null;

  project.supervisorName = supervisorName === "Unassigned" ? undefined : supervisorName;
  companyRecord.updatedAt = new Date().toISOString();

  await writeProjectsRecords(records);
  return companyRecord.projects;
}

export async function replyToCompanyProjectQuestion(
  companyId: string,
  questionId: string,
  replyText: string
): Promise<Project[] | null> {
  const records = await readProjectsRecords();
  let companyRecord = records.find((r) => r.companyId === companyId);

  if (!companyRecord) {
    companyRecord = {
      companyId,
      projects: [...INITIAL_PROJECTS],
      updatedAt: new Date().toISOString(),
    };
    records.push(companyRecord);
  }

  let found = false;
  for (const project of companyRecord.projects) {
    if (!project.questions) continue;
    const question = project.questions.find((q) => q.id === questionId);
    if (question) {
      question.replied = true;
      question.replyText = replyText;
      found = true;
      break;
    }
  }

  if (!found) return null;

  companyRecord.updatedAt = new Date().toISOString();
  await writeProjectsRecords(records);
  return companyRecord.projects;
}
