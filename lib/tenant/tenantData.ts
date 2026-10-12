import fs from "fs/promises";
import path from "path";
import {
  TenantSummary,
  Assignment,
  ActivityRecord,
  QuestionRecord,
  StageRecord,
  DelayRecord,
  SupervisorDashboardData,
} from "./tenantTypes"





const dataRoot = path.join(process.cwd(), "data", "tenants");

async function readJsonFile<T>(fileName: string): Promise<T> {
  const filePath = path.join(dataRoot, fileName);
  const fileContents = await fs.readFile(filePath, "utf8");
  return JSON.parse(fileContents) as T;
}

function ensureArray<T>(value: T | T[]): T[] {
  return Array.isArray(value) ? value : [value];
}



export async function getSupervisorDashboardData(
  supervisorId: string
): Promise<SupervisorDashboardData> {
  const [tenantsRaw, assignmentsRaw, activitiesRaw, questionsRaw, delaysRaw, stagesRaw] = await Promise.all([
    readJsonFile<TenantSummary | TenantSummary[]>("tenants.json"),
    readJsonFile<Assignment | Assignment[]>("tenant_assignments.json"),
    readJsonFile<ActivityRecord | ActivityRecord[]>("tenant_activities.json"),
    readJsonFile<QuestionRecord | QuestionRecord[]>("tenant_questions.json"),
    readJsonFile<DelayRecord | DelayRecord[]>("tenant_delays.json"),
    readJsonFile<StageRecord | StageRecord[]>("tenant_stages.json"),
  ]);

  const tenants = ensureArray(tenantsRaw);
  const assignments = ensureArray(assignmentsRaw);
  const activities = ensureArray(activitiesRaw);
  const questions = ensureArray(questionsRaw);
  const delays = ensureArray(delaysRaw);
  const stages = ensureArray(stagesRaw);

  const assignedTenantIds = assignments
    .filter((assignment) => assignment.user_id === supervisorId && assignment.role === "supervisor")
    .map((assignment) => assignment.tenant_id);

  const tenantMap = Object.fromEntries(
    tenants
      .filter((tenant) => assignedTenantIds.includes(tenant.tenant_id))
      .map((tenant) => [tenant.tenant_id, tenant])
  );

  const assignedTenants = Object.values(tenantMap);

  const unansweredQuestions = questions
    .filter((question) => assignedTenantIds.includes(question.tenant_id) && question.status !== "ANSWERED")
    .map((question) => ({
      id: question.id,
      tenantId: question.tenant_id,
      customerName: question.customer_name,
      date: question.date_asked,
      category: question.category,
      questionText: question.question_title,
      projectLot: tenantMap[question.tenant_id]?.display_name ?? question.tenant_id,
      projectName: tenantMap[question.tenant_id]?.client_name ?? "",
    }));

  const recentActivities = activities
    .filter((activity) => assignedTenantIds.includes(activity.tenant_id))
    .map((activity) => ({
      id: activity.id,
      project: tenantMap[activity.tenant_id]?.display_name ?? activity.tenant_id,
      time: activity.date,
      text: activity.title,
    }));

  const matchedStages = stages.filter((stage) => assignedTenantIds.includes(stage.tenant_id));
  const completedStagesCount = matchedStages.reduce(
    (count, stage) => count + stage.stages.filter((entry) => entry.status.toLowerCase() === "completed").length,
    0
  );

  const delayAlertRecord = delays.find((delay) => assignedTenantIds.includes(delay.tenant_id));

  return {
    projects: assignedTenants.map((tenant) => ({
      id: tenant.tenant_id,
      lot: tenant.display_name,
      clientName: tenant.client_name,
      address: tenant.address,
      status: tenant.status,
      progress: tenant.progress,
      currentStage: tenant.current_stage,
      estHandover: tenant.est_handover,
      outstanding: tenant.outstanding,
      nextDueLabel: tenant.next_due_label,
    })),
    unansweredQuestions,
    recentActivities,
    delayedProjectsCount: assignedTenants.filter((tenant) => tenant.status.toLowerCase() === "delayed").length,
    completedStagesCount,
    delayAlert: delayAlertRecord
      ? {
          tenantId: delayAlertRecord.tenant_id,
          tenantName: tenantMap[delayAlertRecord.tenant_id]?.display_name ?? delayAlertRecord.tenant_id,
          stageName: delayAlertRecord.stage_name,
          title: delayAlertRecord.title,
          reason: delayAlertRecord.reason,
          fromDate: delayAlertRecord.from_date,
          toDate: delayAlertRecord.to_date,
        }
      : null,
  };
}
