import { getCompanyProjects, saveCompanyProject } from "../tenant/projects";
import { read, write, exclusive } from "../supervisor/store";
export { getCompanyProjects } from "../tenant/projects";

export async function updateCompanyProjectSupervisor(companyId: string, projectId: string, supervisorName?: string) {
  return exclusive(async () => {
    const project = (await getCompanyProjects(companyId)).find(p => p.id === projectId);
    if (!project) return null;
    const tenantId = `tenant-${project.id}`;
    const [users, assignments] = await Promise.all([read("users"), read("assignments")]);
    const supervisor = users.find(u => u.username === supervisorName && u.role === "supervisor" && u.companyId === companyId);
    if (supervisorName && supervisorName !== "Unassigned" && !supervisor) throw new Error("Supervisor not found");
    const remaining = assignments.filter(a => !(a.tenant_id === tenantId && a.role === "supervisor"));
    if (supervisor) remaining.push({ id: crypto.randomUUID(), tenant_id: tenantId, user_id: supervisor.id, role: "supervisor" });
    await write("assignments", remaining);
    return getCompanyProjects(companyId);
  });
}
export async function replyToCompanyProjectQuestion(companyId: string, questionId: string, replyText: string) {
  return exclusive(async () => {
    const projects = await getCompanyProjects(companyId);
    const ids = new Set(projects.map(p => `tenant-${p.id}`));
    const questions = await read("questions");
    const question = questions.find(q => q.id === questionId && ids.has(q.tenant_id));
    if (!question) return null;
    question.answer_text = replyText;
    question.status = "ANSWERED";
    question.answered_at = new Date().toISOString();
    await write("questions", questions);
    return getCompanyProjects(companyId);
  });
}
