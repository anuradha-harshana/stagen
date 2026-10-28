import crypto from "crypto";
import fs from "fs/promises";
import path from "path";
import { StageTemplate } from "../types/types";

const templateFile = path.join(process.cwd(), "data", "company", "stageTemplates.json");

export async function getCompanyDashboard(companyId: string) {
    const { getCompanyManagementDashboardData } = await import("../company-management/dashboardData");
    const { getCompanyUsers } = await import("../users/users");
    const { getCompanySettings } = await import("./companySettings");
    const [data, users, settings] = await Promise.all([getCompanyManagementDashboardData(companyId), getCompanyUsers(companyId), getCompanySettings(companyId)]);
    const read = async (name: string): Promise<Record<string, any>[]> => { const value = JSON.parse(await fs.readFile(path.join(process.cwd(), "data", name), "utf8")); return Array.isArray(value) ? value : [value]; };
    const ids = new Set(data.projects.map(p => "tenant-" + p.id));
    const [questionRows, defectRows, warrantyRows, invoiceRows] = await Promise.all([read("tenants/tenant_questions.json"), read("company/companyDefects.json"), read("tenants/tenant_warranty.json"), read("tenants/tenant_invoices.json")]);
    const questions = questionRows.filter(q => ids.has(q.tenant_id)).map(q => ({ id: String(q.id), category: String(q.category ?? "General"), answered: q.status === "ANSWERED" }));
    const defects = defectRows.filter(d => d.companyId === companyId).map(d => ({ id: String(d.id), status: String(d.status), title: String(d.title) }));
    const warranties = warrantyRows.filter(w => ids.has(w.tenant_id)).flatMap(w => (w.warranties ?? []).map((v: Record<string, any>) => ({ id: String(v.id), projectId: String(w.tenant_id), title: String(v.title), period: String(v.period), expiry: String(v.expiry), status: String(v.status) })));
    const invoices = invoiceRows.filter(r => ids.has(r.tenant_id)).flatMap(r => (r.invoices ?? []).map((i: Record<string, any>) => ({ id: String(i.id), siteName: data.projects.find(p => "tenant-" + p.id === r.tenant_id)?.clientName ?? "", region: "", plan: "", issueDate: String(i.date ?? ""), dueDate: String(i.due ?? ""), amount: Number(String(i.amount ?? 0).replace(/[^0-9.-]/g, "")), status: i.status as "Paid" | "Pending" | "Overdue" })));
    const financials = invoiceRows.filter(r => ids.has(r.tenant_id));
    const amount = (v: unknown) => Number(String(v ?? 0).replace(/[^0-9.-]/g, "")) || 0;
    data.kpis.totalContractValue = financials.reduce((n, r) => n + amount(r.contract_value), 0);
    data.kpis.totalCollected = financials.reduce((n, r) => n + amount(r.amount_paid), 0);
    data.kpis.totalOutstanding = financials.reduce((n, r) => n + amount(r.outstanding), 0);
    return { ...data, questions, defects, warranties, invoices, totalUsers: users.length, subscription: settings?.portal?.billing?.plan?.name ?? "Not configured" };
}

interface CompanyTemplateRecord {
    companyId: string;
    stages: StageTemplate[];
    createdAt?: string;
    updatedAt?: string;
}

async function readTemplateRecords(): Promise<CompanyTemplateRecord[]> {
    const fileContents = await fs.readFile(templateFile, "utf8");
    return JSON.parse(fileContents) as CompanyTemplateRecord[];
}

async function writeTemplateRecords(records: CompanyTemplateRecord[]) {
    await fs.writeFile(templateFile, JSON.stringify(records, null, 2));
}

function getCompanyRecord(records: CompanyTemplateRecord[], companyId: string) {
    return records.find((record) => record.companyId === companyId);
}

export async function getStageTemplates(companyId: string): Promise<StageTemplate[]> {
    const records = await readTemplateRecords();
    return getCompanyRecord(records, companyId)?.stages ?? [];
}

export async function createStageTemplate(
    companyId: string,
    stage: Omit<StageTemplate, "id">
): Promise<StageTemplate> {
    const records = await readTemplateRecords();
    const now = new Date().toISOString();
    const newStage: StageTemplate = { ...stage, id: `stage-${crypto.randomUUID()}` };
    const company = getCompanyRecord(records, companyId);

    if (company) {
        company.stages.push(newStage);
        company.updatedAt = now;
    } else {
        records.push({ companyId, stages: [newStage], createdAt: now, updatedAt: now });
    }

    await writeTemplateRecords(records);
    return newStage;
}

export async function updateStageTemplate(
    companyId: string,
    stageId: string,
    updates: Partial<Omit<StageTemplate, "id">>
): Promise<StageTemplate | null> {
    const records = await readTemplateRecords();
    const company = getCompanyRecord(records, companyId);
    const stage = company?.stages.find((item) => item.id === stageId);

    if (!company || !stage) return null;

    Object.assign(stage, updates);
    company.updatedAt = new Date().toISOString();
    await writeTemplateRecords(records);
    return stage;
}

export async function reorderStageTemplates(
    companyId: string,
    stageIds: string[]
): Promise<StageTemplate[] | null> {
    const records = await readTemplateRecords();
    const company = getCompanyRecord(records, companyId);
    if (!company || stageIds.length !== company.stages.length) return null;

    const stagesById = new Map(company.stages.map((stage) => [stage.id, stage]));
    const reorderedStages = stageIds.map((stageId) => stagesById.get(stageId));
    if (reorderedStages.some((stage) => !stage)) return null;

    company.stages = reorderedStages as StageTemplate[];
    company.updatedAt = new Date().toISOString();
    await writeTemplateRecords(records);
    return company.stages;
}

export async function deleteStageTemplate(
    companyId: string,
    stageId: string,
    checklistId?: string
): Promise<boolean> {
    const records = await readTemplateRecords();
    const company = getCompanyRecord(records, companyId);
    if (!company) return false;

    if (checklistId) {
        const stage = company.stages.find((item) => item.id === stageId);
        if (!stage) return false;
        const initialLength = stage.checklist.length;
        stage.checklist = stage.checklist.filter((item) => item.id !== checklistId);
        if (stage.checklist.length === initialLength) return false;
    } else {
        const initialLength = company.stages.length;
        company.stages = company.stages.filter((item) => item.id !== stageId);
        if (company.stages.length === initialLength) return false;
    }

    company.updatedAt = new Date().toISOString();
    await writeTemplateRecords(records);
    return true;
}
