import { randomUUID } from "node:crypto";
import { z } from "zod";
import { activity, ApiError, assignedProjects, findRecord, notify, read, requireProject, Row, scopedRows, write } from "./store";
import { syncDelays } from "./projects";
const text = z.string().trim().min(1).max(10000);
export async function questions(userId: string) {
  const ps = await assignedProjects(userId);
  return (await scopedRows("questions", userId)).map(q => ({ id: q.id, projectCode: q.tenant_id, projectName: ps.find(p => p.tenant_id === q.tenant_id)?.display_name ?? "", customerName: q.customer_name, dateAsked: q.date_asked, category: q.category, questionTitle: q.question_title, questionDetails: q.question_details, status: q.status, answerText: q.answer_text ?? undefined, answeredDate: q.answered_date ?? undefined, likesCount: q.liked_by?.length ?? 0, isLiked: q.liked_by?.includes(userId) ?? false, comments: (q.comments ?? []).map((c: Row) => ({ ...c, likes: c.liked_by?.length ?? 0, isLiked: c.liked_by?.includes(userId) ?? false })) }));
}
export async function mutateQuestion(userId: string, username: string, method: string, body: unknown) {
  const b = z.object({ id: text, answerText: text.optional(), notifyCustomer: z.boolean().optional(), commentText: text.optional(), isOfficialAnswer: z.boolean().optional(), like: z.boolean().optional(), commentId: text.optional() }).parse(body);
  const { rows, record: q } = await findRecord("questions", userId, b.id);
  if (method === "DELETE") { await write("questions", rows.filter(r => r !== q)); return; }
  const answer = b.answerText ?? (b.isOfficialAnswer ? b.commentText : undefined);
  if (answer) {
    q.answer_text = answer; q.answered_by = userId; q.answered_date = new Date().toISOString(); q.status = "ANSWERED"; q.notify_customer = b.notifyCustomer ?? false;
    q.comments = (q.comments ?? []).filter((c: Row) => !c.isOfficialAnswer);
  }
  if (answer || b.commentText) {
    q.comments ??= [];
    q.comments.push({ id: randomUUID(), authorName: username, authorRole: "SUPERVISOR", author_id: userId, content: answer ?? b.commentText, timestamp: new Date().toISOString(), isOfficialAnswer: !!answer, liked_by: [] });
  }
  if (b.like !== undefined) {
    const target = b.commentId ? q.comments?.find((c: Row) => c.id === b.commentId) : q;
    if (!target) throw new ApiError(404, "Comment not found");
    target.liked_by = (target.liked_by ?? []).filter((id: string) => id !== userId);
    if (b.like) target.liked_by.push(userId);
  }
  await write("questions", rows);
  if (answer) {
    await activity(userId, q.tenant_id, `Answered ${q.customer_name}'s question`, answer);
    if (q.notify_customer) await notify(q.customer_user_id, q.tenant_id, "Your question was answered", answer, "Customer Questions", "question", q.id);
  }
}
export async function messages(userId: string) {
  return (await scopedRows("messages", userId)).map(m => ({ id: m.id, projectId: m.tenant_id, delayId: m.delay_id, recipientName: m.recipient_name, recipientEmail: m.recipient_email, stageName: m.stage_name, subject: m.subject, body: m.body, sentAt: m.sent_at, status: m.status }));
}
export async function postMessage(userId: string, body: unknown) {
  const b = z.object({ projectId: text, delayId: z.string().optional(), recipientName: text, recipientEmail: z.email(), stageName: text, subject: text, body: text }).parse(body);
  await requireProject(userId, b.projectId);
  if (b.delayId) { const { record } = await findRecord("delays", userId, b.delayId); if (record.tenant_id !== b.projectId) throw new ApiError(400, "Delay belongs to another project"); }
  const recipient = (await read("users")).find(u => u.email.toLowerCase() === b.recipientEmail.toLowerCase());
  const rows = await read("messages");
  const m = { id: randomUUID(), tenant_id: b.projectId, delay_id: b.delayId, recipient_user_id: recipient?.id ?? null, recipient_name: b.recipientName, recipient_email: b.recipientEmail, stage_name: b.stageName, subject: b.subject, body: b.body, sent_at: new Date().toISOString(), status: "sent" };
  rows.unshift(m); await write("messages", rows);
  if (recipient) await notify(recipient.id, b.projectId, b.subject, b.body, "Delays & Alerts", "delay", b.delayId ?? m.id);
}
export async function notifications(userId: string) {
  const ps = await assignedProjects(userId);
  return (await read("notifications")).filter(n => n.user_id === userId).map(n => ({ id: n.id, title: n.title, description: n.description, time: n.created_at ?? n.time, category: n.category, read: n.read, lot: ps.find(p => p.tenant_id === n.tenant_id)?.display_name, clientName: ps.find(p => p.tenant_id === n.tenant_id)?.client_name, priority: n.priority ?? undefined, resolved: n.resolved ?? false, replyText: n.reply_text ?? undefined }));
}
export async function mutateNotification(userId: string, username: string, method: string, body: unknown) {
  const b = z.object({ id: text.optional(), all: z.boolean().optional(), read: z.boolean().optional(), resolved: z.boolean().optional(), replyText: text.optional() }).parse(body);
  const rows = await read("notifications");
  if (b.all && method !== "DELETE") { rows.filter(n => n.user_id === userId).forEach(n => { n.read = true; }); await write("notifications", rows); return; }
  const n = rows.find(n => n.id === b.id && n.user_id === userId);
  if (!n) throw new ApiError(404, "Notification not found");
  if (method === "DELETE") { await write("notifications", rows.filter(r => r !== n)); return; }
  if (b.replyText) {
    if (n.source_entity_type !== "question") throw new ApiError(400, "No linked question to reply to");
    await mutateQuestion(userId, username, "PUT", { id: n.source_entity_id, answerText: b.replyText, notifyCustomer: true });
    n.reply_text = b.replyText;
  }
  if (b.resolved && n.source_entity_type === "delay") {
    const { rows: ds, record: d } = await findRecord("delays", userId, n.source_entity_id);
    d.resolved = true; d.duration_days = 0; await write("delays", ds); await syncDelays(d.tenant_id);
  }
  if (b.read !== undefined) n.read = b.read;
  if (b.resolved !== undefined) n.resolved = b.resolved;
  // A question reply can append customer notifications; retain those additions.
  const latest = await read("notifications");
  await write("notifications", latest.map(r => r.id === n.id ? n : r));
}
