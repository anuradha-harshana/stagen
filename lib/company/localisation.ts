import crypto from "crypto";
import fs from "fs/promises";
import path from "path";

export interface TranslationKey {
  id: string;
  key: string;
  category: "General" | "Dashboard" | "Progress" | "Invoices" | "Warranty" | "AI Assistant";
  enAU: string;
  zhCN: string;
  viVN: string;
  esES: string;
  lastUpdated: string;
  status: "Translated" | "Pending Review" | "Missing";
}

export interface LocalisationSettings {
  defaultLocale: string;
  defaultLocaleLabel: string;
  regionStandard: string;
  supportedLanguages: { code: string; name: string }[];
  primaryTimezone: string;
  timezoneLabel: string;
  currencyStandard: string;
  dateStandard: string;
  timeStandard: string;
}

export interface CompanyLocalisationRecord {
  companyId: string;
  settings: LocalisationSettings;
  translationKeys: TranslationKey[];
  updatedAt?: string;
}

const localisationFile = path.join(process.cwd(), "data", "company", "localisation.json");

const DEFAULT_SETTINGS: LocalisationSettings = {
  defaultLocale: "en-AU",
  defaultLocaleLabel: "English (en-AU)",
  regionStandard: "Australian Regional Standard",
  supportedLanguages: [
    { code: "en-AU", name: "English (Australia)" },
    { code: "zh-CN", name: "Chinese (Simplified)" },
    { code: "vi-VN", name: "Vietnamese" },
    { code: "es-ES", name: "Spanish" },
  ],
  primaryTimezone: "Australia/Sydney",
  timezoneLabel: "AEST / AEDT Format",
  currencyStandard: "$12,500.00 AUD",
  dateStandard: "06/08/2026 (DD/MM/YYYY)",
  timeStandard: "12-Hour AM/PM (Sydney Time)",
};

const DEFAULT_KEYS: TranslationKey[] = [
  {
    id: "TR-001",
    key: "dashboard.welcome_banner",
    category: "Dashboard",
    enAU: "Welcome back to your Build Progress OS",
    zhCN: "欢迎回到您的施工进度系统",
    viVN: "Chào mừng trở lại với Hệ thống Tiến độ Xây dựng",
    esES: "Bienvenido de nuevo a su Sistema de Progreso de Construcción",
    lastUpdated: "2026-08-01",
    status: "Translated",
  },
  {
    id: "TR-002",
    key: "progress.stage_slab_complete",
    category: "Progress",
    enAU: "Slab poured and inspected successfully",
    zhCN: "混凝土地基已浇筑并通过检验",
    viVN: "Móng bê tông đã đỗ và kiểm định thành công",
    esES: "Losa vertida e inspeccionada con éxito",
    lastUpdated: "2026-07-28",
    status: "Translated",
  },
  {
    id: "TR-003",
    key: "invoices.payment_due_reminder",
    category: "Invoices",
    enAU: "Progress payment for Frame Stage is due in 5 days",
    zhCN: "框架阶段进度款需在5天内支付",
    viVN: "Thanh toán tiến độ Giai đoạn Khung đỗ hạn trong 5 ngày",
    esES: "El pago de progreso para la Etapa de Estructura vence en 5 días",
    lastUpdated: "2026-08-02",
    status: "Translated",
  },
  {
    id: "TR-004",
    key: "warranty.report_defect_prompt",
    category: "Warranty",
    enAU: "Submit maintenance items with photos within your 90-day defect liability period",
    zhCN: "请在90天保修期内提交带有照片的维修项目",
    viVN: "Gửi các mục bảo trì kèm ảnh trong thời hạn bảo hành 90 ngày",
    esES: "Envíe los elementos de mantenimiento con fotos dentro de su período de garantía de 90 días",
    lastUpdated: "2026-07-15",
    status: "Translated",
  },
  {
    id: "TR-005",
    key: "ai.ask_assistant_placeholder",
    category: "AI Assistant",
    enAU: "Ask questions about your build, PCI inspections, or variations...",
    zhCN: "询问关于您的房屋建造、PCI验收或变更的问题...",
    viVN: "Đặt câu hỏi về công trình, kiểm tra PCI, hoặc thay đổi...",
    esES: "Haga preguntas sobre su construcción, inspecciones PCI o variaciones...",
    lastUpdated: "2026-08-04",
    status: "Translated",
  },
  {
    id: "TR-006",
    key: "stage.lockup_delayed_weather",
    category: "Progress",
    enAU: "Lockup stage extended due to severe weather delays in Melbourne Metro",
    zhCN: "因墨尔本大都会区恶劣天气延误，封顶阶段已延长",
    viVN: "Giai đoạn đóng cửa kéo dài do thời tiết xấu ở Melbourne Metro",
    esES: "Etapa de cerramiento extendida debido a demasías por mal tiempo en Melbourne Metro",
    lastUpdated: "2026-08-05",
    status: "Pending Review",
  },
];

async function readLocalisationRecords(): Promise<CompanyLocalisationRecord[]> {
  try {
    const fileContents = await fs.readFile(localisationFile, "utf8");
    return JSON.parse(fileContents) as CompanyLocalisationRecord[];
  } catch (error) {
    return [];
  }
}

async function writeLocalisationRecords(records: CompanyLocalisationRecord[]) {
  await fs.writeFile(localisationFile, JSON.stringify(records, null, 2), "utf8");
}

function findOrCreateCompanyRecord(
  records: CompanyLocalisationRecord[],
  companyId: string
): CompanyLocalisationRecord {
  let record = records.find((item) => item.companyId === companyId);
  if (!record) {
    record = {
      companyId,
      settings: { ...DEFAULT_SETTINGS },
      translationKeys: [...DEFAULT_KEYS],
      updatedAt: new Date().toISOString(),
    };
    records.push(record);
  }
  return record;
}

export async function getCompanyLocalisationData(
  companyId: string
): Promise<CompanyLocalisationRecord> {
  const records = await readLocalisationRecords();
  return findOrCreateCompanyRecord(records, companyId);
}

export async function createTranslationKey(
  companyId: string,
  input: {
    key: string;
    category: TranslationKey["category"];
    enAU: string;
    zhCN?: string;
    viVN?: string;
    esES?: string;
    status?: TranslationKey["status"];
  }
): Promise<TranslationKey> {
  const records = await readLocalisationRecords();
  const company = findOrCreateCompanyRecord(records, companyId);
  const now = new Date().toISOString().split("T")[0];

  const newKey: TranslationKey = {
    id: `TR-${crypto.randomUUID().slice(0, 6).toUpperCase()}`,
    key: input.key.trim(),
    category: input.category || "General",
    enAU: input.enAU.trim(),
    zhCN: input.zhCN ? input.zhCN.trim() : "",
    viVN: input.viVN ? input.viVN.trim() : "",
    esES: input.esES ? input.esES.trim() : "",
    lastUpdated: now,
    status: input.status || "Translated",
  };

  company.translationKeys.unshift(newKey);
  company.updatedAt = new Date().toISOString();

  await writeLocalisationRecords(records);
  return newKey;
}

export async function updateTranslationKey(
  companyId: string,
  input: TranslationKey
): Promise<TranslationKey | null> {
  const records = await readLocalisationRecords();
  const company = findOrCreateCompanyRecord(records, companyId);
  const index = company.translationKeys.findIndex((item) => item.id === input.id);

  if (index === -1) {
    return null;
  }

  const now = new Date().toISOString().split("T")[0];
  const updatedKey: TranslationKey = {
    ...company.translationKeys[index],
    key: input.key.trim(),
    category: input.category || company.translationKeys[index].category,
    enAU: input.enAU.trim(),
    zhCN: input.zhCN ? input.zhCN.trim() : "",
    viVN: input.viVN ? input.viVN.trim() : "",
    esES: input.esES ? input.esES.trim() : "",
    status: input.status || company.translationKeys[index].status,
    lastUpdated: now,
  };

  company.translationKeys[index] = updatedKey;
  company.updatedAt = new Date().toISOString();

  await writeLocalisationRecords(records);
  return updatedKey;
}

export async function deleteTranslationKey(
  companyId: string,
  keyId: string
): Promise<boolean> {
  const records = await readLocalisationRecords();
  const company = findOrCreateCompanyRecord(records, companyId);
  const initialLength = company.translationKeys.length;

  company.translationKeys = company.translationKeys.filter((item) => item.id !== keyId);

  if (company.translationKeys.length === initialLength) {
    return false;
  }

  company.updatedAt = new Date().toISOString();
  await writeLocalisationRecords(records);
  return true;
}

export async function updateLocalisationSettings(
  companyId: string,
  settings: Partial<LocalisationSettings>
): Promise<LocalisationSettings> {
  const records = await readLocalisationRecords();
  const company = findOrCreateCompanyRecord(records, companyId);

  company.settings = {
    ...company.settings,
    ...settings,
  };
  company.updatedAt = new Date().toISOString();

  await writeLocalisationRecords(records);
  return company.settings;
}
