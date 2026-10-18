import { z } from "zod";
import { ApiError, read, Row, write } from "./store";
import type { User } from "../types/types";
export async function profile(user: User) {
  const p = (await read("profile")).find(p => p.user_id === user.id) ?? {};
  return { avatar: p.avatar_url ?? "/images/user.jpg", availability: p.availability ?? "Available", personalInfo: { fullName: p.full_name ?? user.username, employeeId: p.employee_id ?? user.id, contactNumber: p.phone ?? "", emailAddress: user.email, officeBranch: p.office_branch ?? "" }, professionalInfo: { yearsOfExperience: p.years_of_experience ?? 0, expertise: p.expertise ?? [] }, certifications: p.certifications ?? [] };
}
export async function updateProfile(user: User, body: unknown) {
  const cert = z.object({ id: z.string(), name: z.string().trim().min(1), licenseNo: z.string(), issuedDate: z.string(), expiryDate: z.string(), status: z.enum(["VERIFIED", "ACTIVE", "EXPIRED", "PENDING"]), fileName: z.string().optional(), fileContent: z.string().max(14 * 1024 * 1024).regex(/^[A-Za-z0-9+/]*={0,2}$/).optional() });
  const b = z.object({ availability: z.enum(["Available", "Onsite", "Leave"]).optional(), personalInfo: z.object({ fullName: z.string().trim().min(1), employeeId: z.string(), contactNumber: z.string(), emailAddress: z.email(), officeBranch: z.string() }).optional(), professionalInfo: z.object({ yearsOfExperience: z.number().min(0).max(100), expertise: z.array(z.string()) }).optional(), certifications: z.array(cert).optional() }).parse(body);
  const rows = await read("profile");
  let p = rows.find(p => p.user_id === user.id);
  if (!p) { p = { user_id: user.id, role: "supervisor" }; rows.push(p); }
  if (b.availability) p.availability = b.availability;
  if (b.personalInfo) {
    const info = b.personalInfo;
    const users = await read("users");
    if (users.some(u => u.id !== user.id && u.email.toLowerCase() === info.emailAddress.toLowerCase())) throw new ApiError(409, "Email is already in use");
    const u = users.find(u => u.id === user.id)!;
    u.username = info.fullName; u.email = info.emailAddress;
    Object.assign(p, { full_name: info.fullName, employee_id: info.employeeId, phone: info.contactNumber, office_branch: info.officeBranch });
    await write("users", users);
  }
  if (b.professionalInfo) Object.assign(p, { years_of_experience: b.professionalInfo.yearsOfExperience, expertise: b.professionalInfo.expertise });
  if (b.certifications) p.certifications = b.certifications;
  await write("profile", rows);
}
export const defaults = {
  general: { language: "English", timeZone: "(AEST) Australia/Sydney", dateFormat: "DD MMM YYYY", measurement: "Metric (m², km)", officeBranch: "" },
  notifications: { inApp: true, siteDelays: true, customerQuestions: true, docUploads: true, weeklySummary: false, pushNotifications: false, emailAlerts: true },
  site_preferences: { defaultChecklist: "Standard Frame Inspection", autoDelayThreshold: "5 Days", photoQuality: "Standard High-Res", weatherRadius: "10km Radius" },
};
export async function settings(userId: string) {
  const s = (await read("settings")).find(s => s.user_id === userId) ?? {};
  return { general: { ...defaults.general, ...s.general }, notifications: { ...defaults.notifications, ...s.notifications }, site_preferences: { ...defaults.site_preferences, ...s.site_preferences }, security: { two_factor_enabled: s.security?.two_factor_enabled ?? false } };
}
export async function updateSettings(userId: string, body: unknown) {
  const b = z.object({ section: z.enum(["general", "notifications", "site_preferences", "security"]), values: z.record(z.string(), z.unknown()) }).parse(body);
  const allowed = b.section === "security" ? { two_factor_enabled: false } : defaults[b.section];
  const shape = Object.fromEntries(Object.entries(allowed).map(([key, value]) => [key, typeof value === "boolean" ? z.boolean().optional() : z.string().max(250).optional()]));
  const values = z.object(shape).strict().parse(b.values);
  const rows = await read("settings");
  let s = rows.find(s => s.user_id === userId);
  if (!s) { s = { user_id: userId }; rows.push(s); }
  s[b.section] = { ...s[b.section], ...values }; await write("settings", rows);
}
export async function security(user: User, method: string, body: unknown) {
  if (method === "DELETE") {
    const sessions = await read("sessions");
    await write("sessions", sessions.filter(s => s.userId !== user.id)); return;
  }
  const b = z.object({ currentPassword: z.string(), newPassword: z.string().min(8).max(200) }).parse(body);
  const users = await read("users");
  const u: Row = users.find(u => u.id === user.id)!;
  if (u.password !== b.currentPassword) throw new ApiError(400, "Current password is incorrect");
  u.password = b.newPassword; await write("users", users);
}
