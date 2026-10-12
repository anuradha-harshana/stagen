import { ZodError } from "zod";
import { getCurrentUser } from "../auth/auth";
import { getSupervisorDashboardData } from "../tenant/tenantData";
import { ApiError, exclusive } from "./store";
import { getDelays, mutateDelay, postNote, projects, timelines, updateStage, updateTimeline } from "./projects";
import { messages, mutateNotification, mutateQuestion, notifications, postMessage, questions } from "./communication";
import { documentFile, documents, mutateDocument, mutatePhoto, photos, uploadDocument } from "./documents";
import { profile, security, settings, updateProfile, updateSettings } from "./account";

const methods: Record<string, string[]> = {
  dashboard: ["GET"], projects: ["GET"], timeline: ["GET", "PUT", "PATCH"], "stage-updates": ["GET", "PUT", "PATCH", "POST"],
  delays: ["GET", "POST", "PUT", "PATCH", "DELETE"], messages: ["GET", "POST"], questions: ["GET", "PUT", "PATCH", "DELETE"],
  documents: ["GET", "POST", "PUT", "PATCH", "DELETE"], photos: ["GET", "PUT", "PATCH", "DELETE"],
  notifications: ["GET", "PUT", "PATCH", "DELETE"], profile: ["GET", "PUT", "PATCH"], settings: ["GET", "PUT", "PATCH"], security: ["PUT", "DELETE"],
};
export async function supervisorApi(request: Request, resource: string): Promise<Response> {
  try {
    const user = await getCurrentUser();
    if (!user) throw new ApiError(401, "Please sign in");
    if (user.role !== "supervisor") throw new ApiError(403, "Supervisor access required");
    if (!methods[resource]) throw new ApiError(404, "Resource not found");
    if (!methods[resource].includes(request.method)) return Response.json({ message: "Method not allowed" }, { status: 405, headers: { Allow: methods[resource].join(", ") } });
    if (request.method !== "GET") {
      const origin = request.headers.get("origin");
      if (origin && origin !== new URL(request.url).origin) throw new ApiError(403, "Invalid request origin");
      if (resource === "documents" && request.method === "POST") {
        let form: FormData;
        try { form = await request.formData(); } catch { throw new ApiError(400, "Expected a multipart document upload"); }
        await exclusive(() => uploadDocument(user.id, form));
      } else {
        let body: unknown = {};
        if (request.method !== "DELETE" || resource !== "security") {
          try { body = await request.json(); } catch { throw new ApiError(400, "Invalid JSON request"); }
        }
        await exclusive(async () => {
          switch (resource) {
            case "timeline": return updateTimeline(user.id, body);
            case "stage-updates": return request.method === "POST" ? postNote(user.id, body) : updateStage(user.id, body);
            case "delays": return mutateDelay(user.id, request.method, body);
            case "messages": return postMessage(user.id, body);
            case "questions": return mutateQuestion(user.id, user.username, request.method, body);
            case "notifications": return mutateNotification(user.id, user.username, request.method, body);
            case "documents": return mutateDocument(user.id, request.method, body);
            case "photos": return mutatePhoto(user.id, request.method, body);
            case "profile": return updateProfile(user, body);
            case "settings": return updateSettings(user.id, body);
            case "security": return security(user, request.method, body);
          }
        });
      }
      return Response.json({ success: true }, { status: request.method === "POST" ? 201 : 200 });
    }
    if (resource === "documents" && new URL(request.url).searchParams.has("file")) {
      const d = await documentFile(user.id, new URL(request.url).searchParams.get("file")!);
      return new Response(Buffer.from(d.file_content, "base64"), { headers: { "Content-Type": d.file_type === "pdf" ? "application/pdf" : "application/octet-stream", "Content-Disposition": `${new URL(request.url).searchParams.has("preview") && d.file_type === "pdf" ? "inline" : "attachment"}; filename*=UTF-8''${encodeURIComponent(d.file_name)}`, "Cache-Control": "private, no-store", "X-Content-Type-Options": "nosniff" } });
    }
    const readers: Record<string, () => Promise<unknown>> = {
      dashboard: () => getSupervisorDashboardData(user.id), projects: () => projects(user.id), "stage-updates": () => projects(user.id), timeline: () => timelines(user.id), delays: () => getDelays(user.id), messages: () => messages(user.id), questions: () => questions(user.id), notifications: () => notifications(user.id), documents: () => documents(user.id), photos: () => photos(user.id), profile: () => profile(user), settings: () => settings(user.id),
    };
    return Response.json(await readers[resource](), { headers: { "Cache-Control": "private, no-store" } });
  } catch (error) {
    if (error instanceof ZodError) return Response.json({ message: error.issues.map(i => `${i.path.join(".")}: ${i.message}`).join("; ") }, { status: 400 });
    if (error instanceof ApiError) return Response.json({ message: error.message }, { status: error.status });
    console.error("Supervisor API failed", error);
    return Response.json({ message: "Unable to complete the request. Please try again." }, { status: 500 });
  }
}
