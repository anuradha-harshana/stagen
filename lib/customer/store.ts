import fs from "node:fs/promises";
import path from "node:path";
import { randomUUID } from "node:crypto";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Row = Record<string, any>;

export const files = {
  notifications: "notifications/notiffications.json",
  settings: "users/user_settings.json",
  users: "users/users.json",
  tenants: "tenants/tenants.json",
  assignments: "tenants/tenant_assignments.json",
  activities: "tenants/tenant_activities.json",
  invoices: "tenants/tenant_invoices.json",
  warranty: "tenants/tenant_warranty.json",
} as const;

export type Table = keyof typeof files;

const filename = (table: Table) => path.join(process.cwd(), "data", files[table]);

export async function read(table: Table): Promise<Row[]> {
  try {
    const raw = await fs.readFile(filename(table), "utf8");
    const value = JSON.parse(raw);
    return Array.isArray(value) ? value : [value];
  } catch (err) {
    console.error(`Error reading data table ${table}:`, err);
    return [];
  }
}

export async function write(table: Table, rows: Row[]) {
  const target = filename(table);
  let previous: unknown = [];
  try {
    previous = JSON.parse(await fs.readFile(target, "utf8"));
  } catch {
    previous = [];
  }

  const temp = `${target}.${randomUUID()}.tmp`;
  try {
    const content = !Array.isArray(previous) && rows.length === 1 ? rows[0] : rows;
    await fs.writeFile(temp, JSON.stringify(content, null, 2) + "\n", "utf8");
    await fs.rename(temp, target);
  } finally {
    await fs.rm(temp, { force: true });
  }
}

// Global mutex to serialize concurrent write operations
const state = globalThis as typeof globalThis & { customerWrites?: Promise<unknown> };

export function exclusive<T>(operation: () => Promise<T>): Promise<T> {
  const next = (state.customerWrites ?? Promise.resolve()).then(operation);
  state.customerWrites = next.catch(() => undefined);
  return next;
}

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = "ApiError";
  }
}
