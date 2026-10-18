import { z } from "zod";
import { randomUUID } from "node:crypto";
import { activity, ApiError, findRecord, read, requireProject, scopedRows, write } from "./store";
const visibility = z.enum(["Visible to Customer", "Internal Team Only", "Management Only"]);
const storedVisibility = { "Visible to Customer": "customer", "Internal Team Only": "internal", "Management Only": "management" };
export async function documents(userId: string) {
  return (await scopedRows("documents", userId)).map(d => ({ id: d.id, projectCode: d.tenant_id, title: d.title, documentType: d.document_type, dateOfUpdate: d.date_of_update, visibility: d.visibility === "customer" ? "Visible to Customer" : d.visibility === "management" ? "Management Only" : "Internal Team Only", description: d.description, fileName: d.file_name, fileSize: d.file_size, fileType: d.file_type, hasFile: !!d.file_content }));
}
export async function uploadDocument(userId: string, form: FormData) {
  const b = z.object({ projectCode: z.string().min(1), title: z.string().trim().min(1).max(250), documentType: z.string().min(1).max(100), description: z.string().max(10000), visibility, dateOfUpdate: z.string().refine(v => Number.isFinite(Date.parse(v)), "Invalid date") }).parse(Object.fromEntries(form));
  await requireProject(userId, b.projectCode);
  const file = form.get("file");
  if (!(file instanceof File) || !file.size || file.size > 25 * 1024 * 1024) throw new ApiError(400, "Attach a document between 1 byte and 25 MB");
  const ext = file.name.split(".").at(-1)?.toLowerCase() ?? "";
  if (!["pdf", "docx", "doc", "xlsx", "xls", "dwg", "txt", "pptx"].includes(ext)) throw new ApiError(400, "Unsupported document type");
  const rows = await read("documents");
  const id = randomUUID();
  rows.unshift({ id, tenant_id: b.projectCode, title: b.title, document_type: b.documentType, category: "Report", date_of_update: b.dateOfUpdate, visibility: storedVisibility[b.visibility], description: b.description, file_name: file.name, file_size: `${Math.round(file.size / 1024)} KB`, file_type: ext, file_content: Buffer.from(await file.arrayBuffer()).toString("base64"), uploaded_by: userId });
  await write("documents", rows); await activity(userId, b.projectCode, `Uploaded ${b.title}`);
}
export async function mutateDocument(userId: string, method: string, body: unknown) {
  const b = z.object({ id: z.string().min(1), visibility: visibility.optional() }).parse(body);
  const { rows, record } = await findRecord("documents", userId, b.id);
  if (method === "DELETE") await write("documents", rows.filter(r => r !== record));
  else { if (!b.visibility) throw new ApiError(400, "Visibility is required"); record.visibility = storedVisibility[b.visibility]; await write("documents", rows); }
}
export async function documentFile(userId: string, id: string) {
  const { record } = await findRecord("documents", userId, id);
  if (!record.file_content) throw new ApiError(404, "This existing document has metadata only; no file was supplied");
  return record;
}
export async function photos(userId: string) {
  return (await scopedRows("photos", userId)).map(p => ({ id: p.id, projectId: p.tenant_id, stageName: p.stage_name, url: p.url, fileName: p.file_name, fileSize: p.file_size, uploaderName: p.uploader_name, uploaderId: p.uploader_id, timestamp: p.timestamp, caption: p.caption ?? p.label }));
}
export async function mutatePhoto(userId: string, method: string, body: unknown) {
  const b = z.object({ id: z.string().min(1), caption: z.string().max(10000).optional() }).parse(body);
  const { rows, record } = await findRecord("photos", userId, b.id);
  if (method === "DELETE") await write("photos", rows.filter(r => r !== record));
  else { if (b.caption === undefined) throw new ApiError(400, "Caption is required"); record.caption = b.caption; await write("photos", rows); }
}
