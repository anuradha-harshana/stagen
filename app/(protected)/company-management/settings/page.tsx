"use client";

import React, { useState } from "react";
import { 
  Settings, 
  ShieldAlert, 
  Building2, 
  CreditCard, 
  Clock, 
  Bell, 
  Lock, 
  CheckCircle2, 
  Save, 
  RefreshCw, 
  AlertTriangle,
  Sliders,
  ShieldCheck,
  FileCheck
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { MOCK_GOVERNANCE_SETTINGS } from "@/lib/db-mock/companyData";
import PageHeader from "@/components/shared/PageHeader";

export default function CompanyManagementSettingsPage() {
  const [settings, setSettings] = useState(MOCK_GOVERNANCE_SETTINGS);
  const [isSaving, setIsSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      showNotification("Executive governance & alert settings saved successfully!");
    }, 1000);
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto font-sans">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-blue-fantastic text-palladian px-4 py-3 rounded-xl shadow-lg border border-burning-flame/30 flex items-center gap-2 text-sm font-semibold animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="h-4 w-4 text-burning-flame" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <PageHeader
        icon={<Settings className="h-5 w-5 text-burning-flame" />}
        title="Executive Governance & Organization Settings"
        subtitle="Manage SaaS site licensing, SLA alert thresholds, enterprise security policies, and escalation triggers"
        rightContent={
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="bg-truffle-trouble text-palladian hover:bg-truffle-trouble/90 text-xs font-semibold h-9 rounded-xl shadow-sm"
          >
            {isSaving ? (
              <span className="flex items-center gap-2">
                <span className="h-3.5 w-3.5 border-2 border-palladian border-t-transparent rounded-full animate-spin" />
                Saving...
              </span>
            ) : (
              <>
                <Save className="mr-1.5 h-3.5 w-3.5" />
                Save Settings
              </>
            )}
          </Button>
        }
      />

      {/* 1. Subscription & Site Capacity Overview */}
      <Card className="bg-palladian border border-blue-fantastic/15 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-burning-flame via-truffle-trouble to-blue-fantastic" />
        <CardHeader className="pb-3 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge className="bg-burning-flame/20 text-truffle-trouble border border-burning-flame/30 text-[10px] font-bold">
                {settings.licenseTier}
              </Badge>
              <span className="text-xs text-blue-fantastic/60 font-medium">ABN: {settings.abn}</span>
            </div>
            <CardTitle className="text-lg font-bold text-blue-fantastic">
              {settings.organizationName}
            </CardTitle>
            <CardDescription className="text-xs text-blue-fantastic/60">
              {settings.billingPeriod}
            </CardDescription>
          </div>

          <Button
            variant="outline"
            onClick={() => showNotification("Contacted Stagen enterprise sales to expand site licenses.")}
            className="border-blue-fantastic/20 text-blue-fantastic hover:bg-blue-fantastic/10 text-xs font-semibold h-9 rounded-xl shrink-0"
          >
            <CreditCard className="mr-1.5 h-3.5 w-3.5" />
            Manage Subscription Capacity
          </Button>
        </CardHeader>

        <CardContent className="space-y-3 pt-0">
          <div className="bg-blue-fantastic/5 p-4 rounded-2xl border border-blue-fantastic/10 space-y-2">
            <div className="flex justify-between items-center text-xs font-bold text-blue-fantastic">
              <span>Active Site Licenses Allocation</span>
              <span className="text-truffle-trouble font-mono">{settings.activeSitesUsed} / 50 Sites (30% Capacity)</span>
            </div>
            <div className="h-2.5 rounded-full bg-blue-fantastic/10 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-truffle-trouble to-burning-flame transition-all"
                style={{ width: `${(settings.activeSitesUsed / 50) * 100}%` }}
              />
            </div>
            <p className="text-[10px] text-blue-fantastic/60 font-medium">
              You have 35 available site licenses for new residential home construction starts.
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 2. SLA & Threshold Alerts */}
        <Card className="bg-palladian border border-blue-fantastic/15 shadow-sm">
          <CardHeader className="pb-3 border-b border-blue-fantastic/10">
            <CardTitle className="text-base font-bold text-blue-fantastic flex items-center gap-2">
              <Bell className="h-4 w-4 text-burning-flame" />
              SLA Thresholds & Management Alerts
            </CardTitle>
            <CardDescription className="text-xs text-blue-fantastic/60">
              Configure automatic warnings when projects exceed delay or response limits
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4 pt-4">
            <div>
              <label className="text-xs font-bold text-blue-fantastic/80 block mb-1">
                Project Delay Alert Threshold (Days)
              </label>
              <Input
                type="number"
                value={settings.alertThresholds.projectDelayAlertDays}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    alertThresholds: {
                      ...settings.alertThresholds,
                      projectDelayAlertDays: Number(e.target.value)
                    }
                  })
                }
                className="bg-palladian border-blue-fantastic/20 text-xs font-bold"
              />
              <p className="text-[10px] text-blue-fantastic/50 mt-1">
                Flag projects as 'At Risk' on executive dashboard if unmitigated delay &gt; threshold.
              </p>
            </div>

            <div>
              <label className="text-xs font-bold text-blue-fantastic/80 block mb-1">
                Unanswered Customer Question SLA (Hours)
              </label>
              <Input
                type="number"
                value={settings.alertThresholds.unansweredQuestionSlaHours}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    alertThresholds: {
                      ...settings.alertThresholds,
                      unansweredQuestionSlaHours: Number(e.target.value)
                    }
                  })
                }
                className="bg-palladian border-blue-fantastic/20 text-xs font-bold"
              />
              <p className="text-[10px] text-blue-fantastic/50 mt-1">
                Trigger supervisor reminder if customer inquiry remains pending without reply.
              </p>
            </div>

            <div className="flex items-center justify-between p-3 bg-blue-fantastic/5 rounded-xl border border-blue-fantastic/10">
              <div>
                <p className="text-xs font-bold text-blue-fantastic">Daily Executive Email Digest</p>
                <p className="text-[10px] text-blue-fantastic/60">Receive 7:00 AM summary of delayed projects & AI queries</p>
              </div>
              <input
                type="checkbox"
                checked={settings.alertThresholds.dailyDigestEmailEnabled}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    alertThresholds: {
                      ...settings.alertThresholds,
                      dailyDigestEmailEnabled: e.target.checked
                    }
                  })
                }
                className="h-4 w-4 accent-truffle-trouble rounded cursor-pointer"
              />
            </div>
          </CardContent>
        </Card>

        {/* 3. Security & Governance Policies */}
        <Card className="bg-palladian border border-blue-fantastic/15 shadow-sm">
          <CardHeader className="pb-3 border-b border-blue-fantastic/10">
            <CardTitle className="text-base font-bold text-blue-fantastic flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-blue-fantastic" />
              Security Policies & Identity Controls
            </CardTitle>
            <CardDescription className="text-xs text-blue-fantastic/60">
              Enforce authentication standards and data retention periods
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4 pt-4">
            <div className="flex items-center justify-between p-3 bg-blue-fantastic/5 rounded-xl border border-blue-fantastic/10">
              <div>
                <p className="text-xs font-bold text-blue-fantastic">Enforce Two-Factor Authentication (2FA)</p>
                <p className="text-[10px] text-blue-fantastic/60">Mandatory 2FA for all site supervisors and admins</p>
              </div>
              <input
                type="checkbox"
                checked={settings.securityPolicies.enforce2FA}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    securityPolicies: {
                      ...settings.securityPolicies,
                      enforce2FA: e.target.checked
                    }
                  })
                }
                className="h-4 w-4 accent-truffle-trouble rounded cursor-pointer"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-blue-fantastic/80 block mb-1">
                Single Sign-On (SSO) Provider Integration
              </label>
              <Input
                readOnly
                value={settings.securityPolicies.ssoProvider}
                className="bg-palladian/60 border-blue-fantastic/15 text-xs font-bold text-blue-fantastic/80 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-blue-fantastic/80 block mb-1">
                Audit Log Storage Retention Period (Days)
              </label>
              <Input
                type="number"
                value={settings.securityPolicies.auditLogRetentionDays}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    securityPolicies: {
                      ...settings.securityPolicies,
                      auditLogRetentionDays: Number(e.target.value)
                    }
                  })
                }
                className="bg-palladian border-blue-fantastic/20 text-xs font-bold"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 4. Automatic Escalation Rules Card */}
      <Card className="bg-palladian border border-blue-fantastic/15 shadow-sm">
        <CardHeader className="pb-3 border-b border-blue-fantastic/10">
          <CardTitle className="text-base font-bold text-blue-fantastic flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-truffle-trouble" />
            Automated Escalation Workflows
          </CardTitle>
          <CardDescription className="text-xs text-blue-fantastic/60">
            Define system actions when milestones, site delays, or warranty issues break parameters
          </CardDescription>
        </CardHeader>

        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
          <div className="p-3 bg-blue-fantastic/5 rounded-xl border border-blue-fantastic/10 flex items-start gap-3">
            <input
              type="checkbox"
              checked={settings.escalationRules.autoEscalateDelayToManagement}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  escalationRules: {
                    ...settings.escalationRules,
                    autoEscalateDelayToManagement: e.target.checked
                  }
                })
              }
              className="h-4 w-4 accent-truffle-trouble rounded cursor-pointer mt-0.5"
            />
            <div>
              <p className="text-xs font-bold text-blue-fantastic">Escalate Delays &gt; 7 Days</p>
              <p className="text-[10px] text-blue-fantastic/60 mt-0.5">
                Automatically post notification to Executive Management dashboard when delay exceeds 7 days.
              </p>
            </div>
          </div>

          <div className="p-3 bg-blue-fantastic/5 rounded-xl border border-blue-fantastic/10 flex items-start gap-3">
            <input
              type="checkbox"
              checked={settings.escalationRules.escalateHighSeverityDefect}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  escalationRules: {
                    ...settings.escalationRules,
                    escalateHighSeverityDefect: e.target.checked
                  }
                })
              }
              className="h-4 w-4 accent-truffle-trouble rounded cursor-pointer mt-0.5"
            />
            <div>
              <p className="text-xs font-bold text-blue-fantastic">Escalate Critical Defects</p>
              <p className="text-[10px] text-blue-fantastic/60 mt-0.5">
                Flag structural post-handover warranty claims to Builder Operations manager immediately.
              </p>
            </div>
          </div>

          <div className="p-3 bg-blue-fantastic/5 rounded-xl border border-blue-fantastic/10 flex items-start gap-3">
            <input
              type="checkbox"
              checked={settings.escalationRules.notifySupervisorOnNewQuestion}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  escalationRules: {
                    ...settings.escalationRules,
                    notifySupervisorOnNewQuestion: e.target.checked
                  }
                })
              }
              className="h-4 w-4 accent-truffle-trouble rounded cursor-pointer mt-0.5"
            />
            <div>
              <p className="text-xs font-bold text-blue-fantastic">Notify Supervisor on Unhandled AI Query</p>
              <p className="text-[10px] text-blue-fantastic/60 mt-0.5">
                Alert supervisor on mobile app when customer AI assistant triggers human handover.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
