import fs from "fs/promises";
import path from "path";

const settingsFile = path.join(process.cwd(), "data", "company", "governanceSettings.json");

export interface GovernanceSettings {
  organizationName: string;
  abn: string;
  licenseTier: string;
  activeSitesUsed: number;
  billingPeriod: string;
  alertThresholds: {
    projectDelayAlertDays: number;
    unansweredQuestionSlaHours: number;
    unassignedWarrantyDefectDays: number;
    dailyDigestEmailEnabled: boolean;
  };
  securityPolicies: {
    enforce2FA: boolean;
    sessionTimeoutMinutes: number;
    auditLogRetentionDays: number;
    ssoProvider: string;
  };
  escalationRules: {
    autoEscalateDelayToManagement: boolean;
    escalateHighSeverityDefect: boolean;
    notifySupervisorOnNewQuestion: boolean;
  };
}

// ── 1. READ SETTINGS ──
export async function getGovernanceSettings(): Promise<GovernanceSettings> {
  try {
    const data = await fs.readFile(settingsFile, "utf8");
    return JSON.parse(data) as GovernanceSettings;
  } catch (error) {
    throw new Error("Unable to read governance settings file");
  }
}

// ── 2. SAVE / UPDATE SETTINGS ──
export async function saveGovernanceSettings(
  updatedSettings: Partial<GovernanceSettings>
): Promise<GovernanceSettings> {
  const current = await getGovernanceSettings();
  const merged: GovernanceSettings = {
    ...current,
    ...updatedSettings,
    alertThresholds: {
      ...current.alertThresholds,
      ...(updatedSettings.alertThresholds ?? {}),
    },
    securityPolicies: {
      ...current.securityPolicies,
      ...(updatedSettings.securityPolicies ?? {}),
    },
    escalationRules: {
      ...current.escalationRules,
      ...(updatedSettings.escalationRules ?? {}),
    },
  };

  await fs.writeFile(settingsFile, JSON.stringify(merged, null, 2), "utf8");
  return merged;
}
