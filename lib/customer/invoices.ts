import fs from "fs/promises";
import path from "path";

export type InvoiceStatus = "Paid" | "Pending" | "Overdue" | "Upcoming";
export type MilestoneStatus = "paid" | "pending" | "upcoming";

export interface Invoice {
  id: string;
  description: string;
  date: string;
  due: string;
  amount: number | string;
  status: InvoiceStatus;
}

export interface PaymentMilestone {
  id?: string;
  label: string;
  amount: number | string;
  date: string;
  status: MilestoneStatus;
  pct_of_contract: number;
}

export interface NextDue {
  amount: number;
  label: string;
  due_date: string;
}

export interface TenantInvoicesData {
  tenant_id: string;
  contract_value: number;
  amount_paid: number;
  outstanding: number;
  next_due: NextDue;
  invoices: Invoice[];
  payment_milestones: PaymentMilestone[];
}

const invoicesFilePath = path.join(process.cwd(), "data", "tenants", "tenant_invoices.json");
const tenantsFilePath = path.join(process.cwd(), "data", "tenants", "tenants.json");

// Helper: Parse numerical amount from number or "$97,000" string
function parseAmount(val: number | string | undefined): number {
  if (typeof val === "number") return val;
  if (!val) return 0;
  const cleaned = String(val).replace(/[^0-9.-]+/g, "");
  return parseFloat(cleaned) || 0;
}

// Helper: Read raw file content (handles single object or array of tenant invoice objects)
async function readInvoicesFile(): Promise<TenantInvoicesData | TenantInvoicesData[]> {
  try {
    const raw = await fs.readFile(invoicesFilePath, "utf8");
    return JSON.parse(raw);
  } catch (error) {
    // If not found or empty, return default empty structure
    return {
      tenant_id: "tenant-lot-104",
      contract_value: 485000,
      amount_paid: 218250,
      outstanding: 169750,
      next_due: { amount: 97000, label: "Stage 3 – Lock-up", due_date: "Aug 17, 2025" },
      invoices: [],
      payment_milestones: [],
    };
  }
}

// Helper: Write raw file content
async function writeInvoicesFile(data: TenantInvoicesData | TenantInvoicesData[]) {
  await fs.writeFile(invoicesFilePath, JSON.stringify(data, null, 2), "utf8");
}

// Helper: Find or get data for a specific tenant
function resolveTenantRecord(
  all: TenantInvoicesData | TenantInvoicesData[],
  tenantId: string
): TenantInvoicesData {
  if (Array.isArray(all)) {
    const found = all.find((item) => item.tenant_id === tenantId);
    return (
      found ||
      all[0] || {
        tenant_id: tenantId,
        contract_value: 485000,
        amount_paid: 0,
        outstanding: 485000,
        next_due: { amount: 0, label: "None", due_date: "" },
        invoices: [],
        payment_milestones: [],
      }
    );
  }
  return all;
}

// Helper: Update record within data structure
function updateInvoicesDataStructure(
  all: TenantInvoicesData | TenantInvoicesData[],
  tenantId: string,
  updated: TenantInvoicesData
): TenantInvoicesData | TenantInvoicesData[] {
  if (Array.isArray(all)) {
    const index = all.findIndex((item) => item.tenant_id === tenantId);
    if (index === -1) {
      all.push(updated);
    } else {
      all[index] = updated;
    }
    return all;
  }
  return updated;
}

// Helper: Recalculate summary metrics based on invoices and milestones
function recalculateMetrics(data: TenantInvoicesData): TenantInvoicesData {
  const totalPaid = data.invoices
    .filter((inv) => inv.status === "Paid")
    .reduce((sum, inv) => sum + parseAmount(inv.amount), 0);

  data.amount_paid = totalPaid;
  data.outstanding = Math.max(0, data.contract_value - totalPaid);

  // Find next pending or upcoming invoice
  const nextPendingInvoice = data.invoices.find(
    (inv) => inv.status === "Pending" || inv.status === "Upcoming"
  );

  if (nextPendingInvoice) {
    data.next_due = {
      amount: parseAmount(nextPendingInvoice.amount),
      label: nextPendingInvoice.description,
      due_date: nextPendingInvoice.due,
    };
  } else {
    data.next_due = {
      amount: 0,
      label: "All Invoices Paid",
      due_date: "-",
    };
  }

  return data;
}

// ── 1. READ (GET) ──
export async function getTenantInvoices(tenantId = "tenant-lot-104"): Promise<TenantInvoicesData> {
  const all = await readInvoicesFile();
  const record = resolveTenantRecord(all, tenantId);
  return recalculateMetrics(record);
}

// ── 2. CREATE (POST) ──
export async function createTenantInvoice(
  tenantId = "tenant-lot-104",
  invoiceData: Omit<Invoice, "id">
): Promise<Invoice> {
  const all = await readInvoicesFile();
  const record = resolveTenantRecord(all, tenantId);

  const newId = `INV-${(record.invoices.length + 1).toString().padStart(3, "0")}`;
  const newInvoice: Invoice = {
    ...invoiceData,
    id: newId,
  };

  record.invoices.push(newInvoice);
  recalculateMetrics(record);

  const updatedAll = updateInvoicesDataStructure(all, tenantId, record);
  await writeInvoicesFile(updatedAll);

  return newInvoice;
}

// ── 3. UPDATE (PUT) ──
export async function updateTenantInvoice(
  tenantId = "tenant-lot-104",
  invoiceId: string,
  updates: Partial<Invoice>
): Promise<Invoice | null> {
  const all = await readInvoicesFile();
  const record = resolveTenantRecord(all, tenantId);

  const index = record.invoices.findIndex((i) => i.id === invoiceId);
  if (index === -1) return null;

  record.invoices[index] = {
    ...record.invoices[index],
    ...updates,
  };

  // If status was changed to Paid, also sync milestone
  if (updates.status === "Paid") {
    const updatedDesc = (record.invoices[index].description || "").toLowerCase();
    const milestoneMatch = record.payment_milestones.find((m) =>
      updatedDesc.includes(m.label.toLowerCase()) || m.label.toLowerCase().includes(updatedDesc)
    );
    if (milestoneMatch) {
      milestoneMatch.status = "paid";
    }
  }

  recalculateMetrics(record);

  const updatedAll = updateInvoicesDataStructure(all, tenantId, record);
  await writeInvoicesFile(updatedAll);

  return record.invoices[index];
}

// ── 4. PAY INVOICE (PUT/POST) ──
export async function payTenantInvoice(
  tenantId = "tenant-lot-104",
  invoiceId: string
): Promise<TenantInvoicesData | null> {
  const all = await readInvoicesFile();
  const record = resolveTenantRecord(all, tenantId);

  const invoice = record.invoices.find((i) => i.id === invoiceId);
  if (!invoice) return null;

  invoice.status = "Paid";

  // Mark matching milestone as paid
  const desc = invoice.description.toLowerCase();
  const matchingMilestone = record.payment_milestones.find((m) => {
    const mLabel = m.label.toLowerCase();
    return desc.includes(mLabel) || mLabel.includes(desc);
  });
  if (matchingMilestone) {
    matchingMilestone.status = "paid";
  }

  // Next milestone if currently pending can become pending/next
  const nextPendingMilestone = record.payment_milestones.find(
    (m) => m.status === "pending" || m.status === "upcoming"
  );
  if (nextPendingMilestone && nextPendingMilestone.status === "upcoming") {
    // Keep it upcoming until activated, or keep schedule
  }

  recalculateMetrics(record);

  const updatedAll = updateInvoicesDataStructure(all, tenantId, record);
  await writeInvoicesFile(updatedAll);

  // Sync with tenants.json if it exists
  try {
    const tenantsRaw = await fs.readFile(tenantsFilePath, "utf8");
    const tenantsList = JSON.parse(tenantsRaw);
    if (Array.isArray(tenantsList)) {
      const tIndex = tenantsList.findIndex((t) => t.tenant_id === tenantId);
      if (tIndex !== -1) {
        tenantsList[tIndex].amount_paid = record.amount_paid;
        tenantsList[tIndex].outstanding = record.outstanding;
        tenantsList[tIndex].updated_at = new Date().toISOString();
        await fs.writeFile(tenantsFilePath, JSON.stringify(tenantsList, null, 2), "utf8");
      }
    }
  } catch (err) {
    console.error("Could not sync payment with tenants.json:", err);
  }

  return record;
}

// ── 5. DELETE (DELETE) ──
export async function deleteTenantInvoice(
  tenantId = "tenant-lot-104",
  invoiceId: string
): Promise<boolean> {
  const all = await readInvoicesFile();
  const record = resolveTenantRecord(all, tenantId);

  const initialCount = record.invoices.length;
  record.invoices = record.invoices.filter((i) => i.id !== invoiceId);

  if (record.invoices.length === initialCount) {
    return false;
  }

  recalculateMetrics(record);

  const updatedAll = updateInvoicesDataStructure(all, tenantId, record);
  await writeInvoicesFile(updatedAll);

  return true;
}

// ── 6. UPDATE MILESTONE ──
export async function updateTenantMilestone(
  tenantId = "tenant-lot-104",
  milestoneIdOrLabel: string,
  updates: Partial<PaymentMilestone>
): Promise<PaymentMilestone | null> {
  const all = await readInvoicesFile();
  const record = resolveTenantRecord(all, tenantId);

  const milestone = record.payment_milestones.find(
    (m) => m.id === milestoneIdOrLabel || m.label.toLowerCase() === milestoneIdOrLabel.toLowerCase()
  );

  if (!milestone) return null;

  Object.assign(milestone, updates);

  // If milestone marked as paid, find corresponding invoice and mark paid
  if (updates.status === "paid") {
    const matchingInvoice = record.invoices.find((i) =>
      i.description.toLowerCase().includes(milestone.label.toLowerCase())
    );
    if (matchingInvoice) {
      matchingInvoice.status = "Paid";
    }
  }

  recalculateMetrics(record);

  const updatedAll = updateInvoicesDataStructure(all, tenantId, record);
  await writeInvoicesFile(updatedAll);

  return milestone;
}
