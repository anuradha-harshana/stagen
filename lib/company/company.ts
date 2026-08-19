import crypto from "crypto";
import fs from "fs/promises";
import path from "path";
import { StageTemplate } from "../types/types";

const templateFile = path.join(process.cwd(), "data", "company", "stageTemplates.json");

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