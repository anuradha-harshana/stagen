"use client";
import { useCallback, useEffect, useState, useRef } from "react";
import { toast } from "sonner";

export async function supervisorRequest<T = unknown>(resource: string, method = "GET", body?: unknown): Promise<T> {
  const response = await fetch(`/api/supervisor/${resource}`, { method, cache: "no-store", headers: body instanceof FormData || body === undefined ? undefined : { "Content-Type": "application/json" }, body: body instanceof FormData ? body : body === undefined ? undefined : JSON.stringify(body) });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message ?? "Request failed");
  return data;
}
export function useSupervisorData<T>(resource: string, initial: T) {
  const [data, setData] = useState<T>(initial);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const pending = useRef(false);
  const [saving, setSaving] = useState(false);
  const reload = useCallback(async () => {
    try { const result = await supervisorRequest<T>(resource); setData(result); setError(""); return result; }
    catch (e) { setError(e instanceof Error ? e.message : "Unable to load data"); throw e; }
    finally { setLoading(false); }
  }, [resource]);
  useEffect(() => {
    let active = true;
    supervisorRequest<T>(resource).then(result => { if (active) { setData(result); setError(""); } }).catch(e => { if (active) setError(e instanceof Error ? e.message : "Unable to load data"); }).finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [resource]);
  const mutate = async (method: string, body: unknown, target = resource) => {
    if (pending.current) return false;
    pending.current = true;
    setSaving(true);
    try { await supervisorRequest(target, method, body); await reload(); toast.success("Changes saved"); return true; }
    catch (e) { toast.error(e instanceof Error ? e.message : "Unable to save changes"); return false; }
    finally { pending.current = false; setSaving(false); }
  };
  return { data, setData, loading, error, saving, reload, mutate };
}
export function DataState({ loading, error, empty = false }: { loading: boolean; error: string; empty?: boolean }) {
  return <div className="p-6 text-blue-fantastic" role={error ? "alert" : "status"}>{loading ? "Loading…" : error || (empty ? "No assigned project data available." : "")}{error && <button className="ml-3 underline" onClick={() => window.location.reload()}>Retry</button>}</div>;
}
