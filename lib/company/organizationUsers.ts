import fs from "fs/promises";
import path from "path";
import { randomUUID } from "crypto";
import { getDefaultCustomerSettings } from "../customer/customerSettings";
import { z } from "zod";
import { exclusive, ApiError } from "../supervisor/store";
import { syncOrgUserToProfile, deleteOrgUserProfile, mapOrgRoleToProfileRole } from "../users/userProfiles";
export type OrganizationUserRole =
  | "Company Admin"
  | "Executive Management"
  | "Site Supervisor"
  | "Trade Contractor"
  | "Customer";

export interface OrganizationUser {
  id: string;
  companyId?: string;
  name: string;
  email: string;
  role: OrganizationUserRole;
  phone: string;
  status: "Active" | "Pending" | "Suspended";
  assignedProjectsCount: number;
  assignedProjects: string[];
  lastActive: string;
  avatarBg: string;
}


const file = (name: string) => path.join(process.cwd(), "data", name);
const read = async (name: string): Promise<Record<string, any>[]> => JSON.parse(await fs.readFile(file(name), "utf8"));
const write = (name: string, rows: unknown[]) => fs.writeFile(file(name), JSON.stringify(rows, null, 2), "utf8");
const orgFile = "company/organizationUsers.json", accountFile = "users/users.json", projectFile = "tenants/tenants.json", assignmentFile = "tenants/tenant_assignments.json";
const schema = z.object({
  name: z.string().trim().min(1), email: z.string().trim().email(),
  role: z.enum(["Company Admin", "Executive Management", "Site Supervisor", "Trade Contractor", "Customer"]),
  phone: z.string().default(""), status: z.enum(["Active", "Pending", "Suspended"]).default("Active"),
  assignedProjects: z.array(z.string()).default([]), avatarBg: z.string().default("bg-blue-fantastic"),
  password: z.string().min(8).optional(),
});
const roleLabels: Record<string, OrganizationUserRole> = { company: "Company Admin", "company-management": "Executive Management", supervisor: "Site Supervisor", customer: "Customer", trade: "Trade Contractor" };
export async function getCompanyUsers(companyId: string): Promise<OrganizationUser[]> {
  const [org, accounts, projects, assignments] = await Promise.all([read(orgFile), read(accountFile), read(projectFile), read(assignmentFile)]);
  const owned = accounts.filter(a => (a.companyId || (a.role === "company" ? a.id : "")) === companyId);
  const rows = org.filter(o => o.companyId === companyId || (!o.companyId && owned.some(a => a.id === o.id || a.email.toLowerCase() === o.email.toLowerCase())));
  for (const a of owned) if (!rows.some(o => o.id === a.id || o.email.toLowerCase() === a.email.toLowerCase())) rows.push({id:a.id,name:a.username,email:a.email,role:roleLabels[a.role],phone:"",status:a.status || "Active",avatarBg:"bg-blue-fantastic",lastActive:"Not recorded"});
  return rows.map(o => {
    const a = owned.find(a => a.id === o.id || a.email.toLowerCase() === o.email.toLowerCase());
    const id = a?.id ?? o.id;
    const assigned = projects.filter(p => p.company_id === companyId && (p.client_user_id === id || assignments.some(v => v.user_id === id && v.tenant_id === p.tenant_id))).map(p => p.tenant_id);
    return {id, companyId, name:a?.username ?? o.name,email:a?.email ?? o.email,role:roleLabels[a?.role] ?? o.role,phone:o.phone || "",status:a?.status ?? o.status ?? "Active",avatarBg:o.avatarBg || "bg-blue-fantastic",lastActive:o.lastActive || "Not recorded",assignedProjects:assigned,assignedProjectsCount:assigned.length};
  });
}
async function save(companyId: string, data: unknown, id?: string) {
  const existing = id ? (await getCompanyUsers(companyId)).find(o => o.id === id) : undefined;
  if (id && !existing) throw new ApiError(404, "User not found");
  const parsed = schema.safeParse({...existing, ...(data as object)});
  if (!parsed.success) throw new ApiError(400, parsed.error.issues[0].message);
  const b = parsed.data;
  const [org, accounts, projects, assignments] = await Promise.all([read(orgFile),read(accountFile),read(projectFile),read(assignmentFile)]);
  const account = accounts.find(a => a.id === id);
  if (accounts.some(a => a.id !== id && a.email.toLowerCase() === b.email.toLowerCase()) || org.some(o => o.id !== id && o.email.toLowerCase() === b.email.toLowerCase() && (!account || o.email.toLowerCase() !== account.email.toLowerCase()))) throw new ApiError(400, "Email already exists. Edit the existing user instead.");
  if (!account && !b.password) throw new ApiError(400, "An initial password of at least 8 characters is required for a new account.");
  if (id === companyId && (b.role !== "Company Admin" || b.status !== "Active")) throw new ApiError(400, "The company owner must remain an active admin.");
  const selected = [...new Set(b.assignedProjects.flatMap(v => v.split(",")).map(v=>v.trim()).filter(v=>v && v.toLowerCase() !== "unassigned"))].map(value => {
    const p = projects.find(p => p.company_id === companyId && [p.tenant_id, p.tenant_id.replace(/^tenant-/, ""), p.display_name].some(v => v?.toLowerCase() === value.toLowerCase()));
    if (!p) throw new ApiError(400, "Unknown project: " + value + ". Use a project ID from this company.");
    return p;
  });
  const userId = id || randomUUID(), role = mapOrgRoleToProfileRole(b.role);
  const nextAccount = {...account, id:userId,username:b.name,email:b.email.toLowerCase(),role,companyId,status:b.status,...(b.password ? {password:b.password} : {})};
  const newOrg: OrganizationUser = {id:userId,companyId,name:b.name,email:nextAccount.email,role:b.role,phone:b.phone,status:b.status,avatarBg:b.avatarBg,lastActive:existing?.lastActive || "Account created",assignedProjects:selected.map(p=>p.tenant_id),assignedProjectsCount:selected.length};
  let nextAssignments = assignments.filter(a => a.user_id !== userId);
  for (const p of projects) if (p.company_id === companyId && p.client_user_id === userId) p.client_user_id = null;
  if (["supervisor","customer"].includes(role)) for (const p of selected) {
    nextAssignments = nextAssignments.filter(a=>!(a.tenant_id === p.tenant_id && a.role === role));
    nextAssignments.push({id:randomUUID(),tenant_id:p.tenant_id,user_id:userId,role});
    if (role === "customer") p.client_user_id = userId;
  }
  const writes: [string, unknown[]][] = [
    [accountFile, [...accounts.filter(a=>a.id!==userId),nextAccount]],
    [orgFile, [...org.filter(o=>o.id!==userId && !(account && o.email.toLowerCase()===account.email.toLowerCase())),newOrg]],
    [assignmentFile, nextAssignments], [projectFile, projects],
  ];
  if (role === "customer") {
    const profileFile = "customer/customerProfiles.json";
    const settingsFile = "customer/customerSettings.json";
    const [profiles, settings] = await Promise.all([read(profileFile), read(settingsFile)]);
    const previous = profiles.find(p => p.userId === userId);
    const now = new Date().toISOString();
    const profile = {
      avatarUrl: "", homeAddress: "", city: "", state: "", postalCode: "", country: "Australia",
      preferredLanguage: "English", timeZone: "(AEST) Australia/Sydney",
      accountCreatedAt: now, passwordUpdatedAt: now, linkedAccounts: [],
      ...previous, userId, fullName: b.name, email: nextAccount.email, phone: b.phone, updatedAt: now,
    };
    const previousSettings = settings.find(p => p.userId === userId);
    const customerSettings = previousSettings ?? getDefaultCustomerSettings(userId, nextAccount.email, profile.preferredLanguage, profile.timeZone);
    writes.push([profileFile, [...profiles.filter(p=>p.userId!==userId), profile]]);
    writes.push([settingsFile, [...settings.filter(p=>p.userId!==userId), customerSettings]]);
  }
  // Snapshot existing files before the first write so failed provisioning is retryable.
  const snapshots = new Map<string, string>();
  for (const name of [...writes.map(([name]) => name), "users/user_profiles.json"]) snapshots.set(name, await fs.readFile(file(name), "utf8"));
  const touched: string[] = [];
  try {
    for (const [name, rows] of writes) { touched.push(name); await write(name, rows); }
    touched.push("users/user_profiles.json");
    await syncOrgUserToProfile(newOrg);
  } catch (error) {
    const restored = await Promise.allSettled(touched.map(name => fs.writeFile(file(name), snapshots.get(name)!, "utf8")));
    if (restored.some(result => result.status === "rejected")) throw new ApiError(500, "User save failed and could not be fully restored. Check JSON storage permissions before retrying.");
    throw new ApiError(500, "User was not saved. Please retry. " + (error instanceof Error ? error.message : ""));
  }
  return newOrg;
}
export const createCompanyUser = (companyId: string, data: unknown) => exclusive(()=>save(companyId,data));
export const updateCompanyUser = (companyId: string, id: string, updates: unknown) => exclusive(()=>save(companyId,updates,id));
export const deleteCompanyUser = (companyId: string, id: string) => exclusive(async () => {
  if (id === companyId) throw new ApiError(400,"Cannot delete the company owner");
  if (!(await getCompanyUsers(companyId)).some(u=>u.id===id)) return false;
  const [org,accounts,assignments,projects,sessions]=await Promise.all([read(orgFile),read(accountFile),read(assignmentFile),read(projectFile),read("sessions/sessions.json")]);
  await write(orgFile,org.filter(o=>o.id!==id));
  await write(accountFile,accounts.filter(a=>a.id!==id));
  await write(assignmentFile,assignments.filter(a=>a.user_id!==id));
  await write(projectFile,projects.map(p=>p.client_user_id===id?{...p,client_user_id:null}:p));
  await write("sessions/sessions.json",sessions.filter(s=>s.userId!==id));
  await deleteOrgUserProfile(id);
  return true;
});
