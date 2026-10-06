"use client";

import React, { useState } from "react";
import {
  Globe,
  Search,
  Languages,
  CheckCircle2,
  Clock,
  Download,
  Edit3,
  Plus,
  Sparkles,
  DollarSign,
  Calendar,
  Layers,
  Trash2,
  Filter,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import PageHeader from "@/components/shared/PageHeader";
import { PAGE_SHELL_CLASS } from "@/components/shared/pageShell";
import {
  TranslationKey,
  LocalisationSettings,
} from "@/lib/company/localisation";
import TranslationKeyModal from "./TranslationKeyModal";

interface CompanyLocalisationClientProps {
  initialKeys: TranslationKey[];
  initialSettings: LocalisationSettings;
  companyId: string;
}

export default function CompanyLocalisationClient({
  initialKeys,
  initialSettings,
  companyId,
}: CompanyLocalisationClientProps) {
  // 1. Client State initialized from Server JSON data
  const [translationKeys, setTranslationKeys] = useState<TranslationKey[]>(initialKeys);
  const [settings, setSettings] = useState<LocalisationSettings>(initialSettings);

  // Filters & Search
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("All");
  const [statusFilter, setStatusFilter] = useState<string>("All");

  // Modal & Selection State
  const [selectedKey, setSelectedKey] = useState<TranslationKey | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // --- CRUD Handlers Updating the JSON File via API ---

  // 1. ADD / EDIT Translation Key
  const handleSaveTranslationKey = async (payload: any) => {
    const isEdit = Boolean(selectedKey);
    const response = await fetch("/api/company/localisation", {
      method: isEdit ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      showNotification("Error saving translation key to JSON");
      throw new Error("Failed to save translation key");
    }

    const data: { key: TranslationKey } = await response.json();

    // Update React state with data from JSON file
    setTranslationKeys((current) => {
      const exists = current.some((item) => item.id === data.key.id);
      return exists
        ? current.map((item) => (item.id === data.key.id ? data.key : item))
        : [data.key, ...current];
    });

    showNotification(
      isEdit
        ? `Translation key '${data.key.key}' updated successfully!`
        : `New translation key '${data.key.key}' created successfully!`
    );
    setSelectedKey(null);
    setIsModalOpen(false);
  };

  // 2. DELETE Translation Key
  const handleDeleteTranslationKey = async (keyItem: TranslationKey) => {
    if (!window.confirm(`Are you sure you want to delete '${keyItem.key}'?`)) {
      return;
    }

    try {
      const response = await fetch(
        `/api/company/localisation?id=${encodeURIComponent(keyItem.id)}`,
        { method: "DELETE" }
      );

      if (!response.ok) {
        throw new Error("Failed to delete translation key");
      }

      // Remove from client state to reflect JSON deletion
      setTranslationKeys((current) =>
        current.filter((item) => item.id !== keyItem.id)
      );
      showNotification(`Translation key '${keyItem.key}' deleted from JSON.`);
    } catch (error) {
      console.error("Delete error:", error);
      showNotification("Error deleting translation key from JSON");
    }
  };

  // 3. EXPORT JSON Bundle
  const handleExportJSON = () => {
    const bundle: Record<string, Record<string, string>> = {
      "en-AU": {},
      "zh-CN": {},
      "vi-VN": {},
      "es-ES": {},
    };

    translationKeys.forEach((item) => {
      bundle["en-AU"][item.key] = item.enAU;
      if (item.zhCN) bundle["zh-CN"][item.key] = item.zhCN;
      if (item.viVN) bundle["vi-VN"][item.key] = item.viVN;
      if (item.esES) bundle["es-ES"][item.key] = item.esES;
    });

    const dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(bundle, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `translations-${companyId}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();

    showNotification("Exported translation dictionary bundle (.json)");
  };

  // Filter keys based on search and category
  const filteredKeys = translationKeys.filter((item) => {
    const query = searchTerm.toLowerCase();
    const matchesSearch =
      item.key.toLowerCase().includes(query) ||
      item.enAU.toLowerCase().includes(query) ||
      (item.zhCN && item.zhCN.toLowerCase().includes(query)) ||
      (item.viVN && item.viVN.toLowerCase().includes(query)) ||
      (item.esES && item.esES.toLowerCase().includes(query));

    const matchesCategory =
      categoryFilter === "All" || item.category === categoryFilter;
    const matchesStatus =
      statusFilter === "All" || item.status === statusFilter;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Calculate dynamic stats
  const totalKeys = translationKeys.length;
  const translatedCount = translationKeys.filter((k) => k.status === "Translated").length;
  const coveragePercentage = totalKeys > 0 ? ((translatedCount / totalKeys) * 100).toFixed(1) : "100";

  return (
    <div className={PAGE_SHELL_CLASS}>
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-blue-fantastic text-palladian px-4 py-3 rounded-xl shadow-lg border border-burning-flame/30 flex items-center gap-2 text-sm font-semibold animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="h-4 w-4 text-burning-flame" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header (Reusing PageHeader and Buttons pattern from /company/projects) */}
      <PageHeader
        icon={<Globe className="h-5 w-5 text-burning-flame" />}
        title="Localisation & Multilingual Settings"
        subtitle="Manage Australian locale standards, multi-language translation keys, and customer portal language defaults"
        rightContent={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={handleExportJSON}
              className="bg-white border-blue-fantastic/20 text-blue-fantastic hover:bg-blue-fantastic/10 text-xs font-semibold h-10 rounded-xl"
            >
              <Download className="mr-1.5 h-3.5 w-3.5" />
              Export .JSON
            </Button>
            <Button
              onClick={() => {
                setSelectedKey(null);
                setIsModalOpen(true);
              }}
              className="bg-truffle-trouble text-palladian hover:bg-truffle-trouble/95 text-xs font-semibold px-4 h-10 shadow-sm rounded-xl"
            >
              <Plus className="mr-1.5 h-4 w-4" />
              Add Translation Key
            </Button>
          </div>
        }
      />

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-white border border-blue-fantastic/15 shadow-sm">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-blue-fantastic/10 border border-blue-fantastic/15 flex items-center justify-center shrink-0">
              <Globe className="h-5 w-5 text-blue-fantastic" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-blue-fantastic/60 uppercase tracking-wider">
                Default Locale
              </p>
              <h3 className="text-base font-bold text-blue-fantastic mt-0.5">
                {settings.defaultLocaleLabel}
              </h3>
              <p className="text-[10px] text-blue-fantastic/50">
                {settings.regionStandard}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-blue-fantastic/15 shadow-sm">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-burning-flame/15 border border-burning-flame/20 flex items-center justify-center shrink-0">
              <Languages className="h-5 w-5 text-truffle-trouble" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-blue-fantastic/60 uppercase tracking-wider">
                Supported Languages
              </p>
              <h3 className="text-base font-bold text-blue-fantastic mt-0.5">
                {settings.supportedLanguages.length} Active Languages
              </h3>
              <p className="text-[10px] text-blue-fantastic/50">
                {settings.supportedLanguages.map((l) => l.code).join(", ")}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-blue-fantastic/15 shadow-sm">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-truffle-trouble/15 border border-truffle-trouble/20 flex items-center justify-center shrink-0">
              <Layers className="h-5 w-5 text-truffle-trouble" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-blue-fantastic/60 uppercase tracking-wider">
                Translation Coverage
              </p>
              <h3 className="text-base font-bold text-blue-fantastic mt-0.5">
                {coveragePercentage}% Complete
              </h3>
              <p className="text-[10px] text-blue-fantastic/50">
                {totalKeys} total JSON translation keys
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-blue-fantastic/15 shadow-sm">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-blue-fantastic/10 border border-blue-fantastic/15 flex items-center justify-center shrink-0">
              <Clock className="h-5 w-5 text-blue-fantastic" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-blue-fantastic/60 uppercase tracking-wider">
                Primary Timezone
              </p>
              <h3 className="text-base font-bold text-blue-fantastic mt-0.5">
                {settings.primaryTimezone}
              </h3>
              <p className="text-[10px] text-blue-fantastic/50">
                {settings.timezoneLabel}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Regional Formats Preview Card */}
      <Card className="bg-white border border-blue-fantastic/15 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-burning-flame via-truffle-trouble to-blue-fantastic" />
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-bold text-blue-fantastic flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-burning-flame" />
            Active Regional Format Standards (Australia)
          </CardTitle>
          <CardDescription className="text-xs text-blue-fantastic/60">
            Preview how dates, currency values, and milestone times are rendered to customers across portals
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-0">
          <div className="bg-blue-fantastic/5 p-3 rounded-xl border border-blue-fantastic/10 flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-blue-fantastic/15 flex items-center justify-center shrink-0">
              <DollarSign className="h-4 w-4 text-blue-fantastic" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-blue-fantastic/60 uppercase">Currency Standard</p>
              <p className="text-xs font-bold text-blue-fantastic">{settings.currencyStandard}</p>
              <p className="text-[10px] text-blue-fantastic/50">Formatted with AUD symbol & commas</p>
            </div>
          </div>

          <div className="bg-blue-fantastic/5 p-3 rounded-xl border border-blue-fantastic/10 flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-burning-flame/15 flex items-center justify-center shrink-0">
              <Calendar className="h-4 w-4 text-truffle-trouble" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-blue-fantastic/60 uppercase">Date Standard</p>
              <p className="text-xs font-bold text-blue-fantastic">{settings.dateStandard}</p>
              <p className="text-[10px] text-blue-fantastic/50">Australian Calendar Order</p>
            </div>
          </div>

          <div className="bg-blue-fantastic/5 p-3 rounded-xl border border-blue-fantastic/10 flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-truffle-trouble/15 flex items-center justify-center shrink-0">
              <Clock className="h-4 w-4 text-truffle-trouble" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-blue-fantastic/60 uppercase">Time & System Clock</p>
              <p className="text-xs font-bold text-blue-fantastic">{settings.timeStandard}</p>
              <p className="text-[10px] text-blue-fantastic/50">Automated AEST/AEDT Daylight Switch</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Translation Keys Management Section */}
      <Card className="bg-white border border-blue-fantastic/15 shadow-sm">
        <CardHeader className="pb-4 border-b border-blue-fantastic/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-base font-bold text-blue-fantastic">
              Translation Keys & Dictionary Management
            </CardTitle>
            <CardDescription className="text-xs text-blue-fantastic/60 mt-0.5">
              Edit system UI text strings stored in JSON across supported languages
            </CardDescription>
          </div>

          {/* Search & Category Filter (Reused from ProjectsFilters pattern) */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-blue-fantastic/40 pointer-events-none" />
              <Input
                placeholder="Search key or text..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 bg-white border-blue-fantastic/15 text-blue-fantastic placeholder:text-blue-fantastic/35 h-9 text-xs font-sans w-52 focus-visible:ring-truffle-trouble rounded-xl"
              />
            </div>

            {/* Quick Category Buttons */}
            <div className="hidden lg:flex gap-1 bg-blue-fantastic/5 p-0.5 rounded-xl border border-blue-fantastic/10">
              {["All", "Dashboard", "Progress", "Invoices", "Warranty", "AI Assistant"].map(
                (cat) => (
                  <button
                    key={cat}
                    onClick={() => setCategoryFilter(cat)}
                    className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold transition-all ${
                      categoryFilter === cat
                        ? "bg-blue-fantastic text-palladian shadow-sm"
                        : "text-blue-fantastic/70 hover:text-blue-fantastic hover:bg-blue-fantastic/5"
                    }`}
                  >
                    {cat}
                  </button>
                )
              )}
            </div>

            {/* Status Select */}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-36 bg-white border-blue-fantastic/15 text-blue-fantastic h-9 text-xs font-bold font-sans focus:ring-truffle-trouble rounded-xl">
                <div className="flex items-center gap-1.5">
                  <Filter className="h-3 w-3 text-blue-fantastic/50" />
                  <SelectValue placeholder="All Statuses" />
                </div>
              </SelectTrigger>
              <SelectContent className="bg-white text-blue-fantastic border-blue-fantastic/10">
                <SelectItem value="All" className="text-xs font-bold font-sans">
                  All Statuses
                </SelectItem>
                <SelectItem value="Translated" className="text-xs font-bold font-sans">
                  Translated
                </SelectItem>
                <SelectItem value="Pending Review" className="text-xs font-bold font-sans">
                  Pending Review
                </SelectItem>
                <SelectItem value="Missing" className="text-xs font-bold font-sans">
                  Missing
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-blue-fantastic/5 border-b border-blue-fantastic/10 text-blue-fantastic/70 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4">Translation Key</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">English (en-AU)</th>
                  <th className="py-3 px-4">Chinese (zh-CN)</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Last Updated</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-blue-fantastic/10">
                {filteredKeys.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <Globe className="h-8 w-8 text-blue-fantastic/30 mb-2" />
                        <p className="text-sm font-bold text-blue-fantastic">No Translation Keys Found</p>
                        <p className="text-xs text-blue-fantastic/50 mt-0.5">
                          Try changing your search term or category filter.
                        </p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredKeys.map((item) => (
                    <tr
                      key={item.id}
                      className="hover:bg-blue-fantastic/3 transition-colors group"
                    >
                      <td className="py-3 px-4 font-bold text-blue-fantastic font-mono text-[11px]">
                        {item.key}
                      </td>
                      <td className="py-3 px-4">
                        <Badge
                          variant="outline"
                          className="text-[10px] bg-blue-fantastic/5 border-blue-fantastic/15 text-blue-fantastic"
                        >
                          {item.category}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 font-medium text-blue-fantastic max-w-xs truncate">
                        {item.enAU}
                      </td>
                      <td className="py-3 px-4 text-blue-fantastic/80 max-w-xs truncate">
                        {item.zhCN || <span className="italic text-blue-fantastic/35">Unset</span>}
                      </td>
                      <td className="py-3 px-4">
                        <Badge
                          className={`text-[10px] px-2 py-0.5 border font-bold ${
                            item.status === "Translated"
                              ? "bg-truffle-trouble/10 text-truffle-trouble border-truffle-trouble/30"
                              : item.status === "Pending Review"
                              ? "bg-burning-flame/15 text-truffle-trouble border-burning-flame/30"
                              : "bg-red-100 text-red-700 border-red-200"
                          }`}
                        >
                          {item.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-blue-fantastic/60 font-medium">
                        {item.lastUpdated}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedKey(item);
                              setIsModalOpen(true);
                            }}
                            className="border-blue-fantastic/20 text-blue-fantastic hover:bg-blue-fantastic/10 text-xs font-semibold h-7 rounded-lg flex items-center gap-1"
                            title="Edit Translation"
                          >
                            <Edit3 className="h-3 w-3 mr-0.5 text-truffle-trouble" />
                            <span>Edit</span>
                          </Button>
                          <Button
                            size="icon"
                            variant="outline"
                            onClick={() => void handleDeleteTranslationKey(item)}
                            className="border-red-200 text-red-600 hover:bg-red-50 h-7 w-7 rounded-lg"
                            title="Delete Translation Key"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Add / Edit Key Modal */}
      <TranslationKeyModal
        keyItem={selectedKey}
        isOpen={isModalOpen}
        onClose={() => {
          setSelectedKey(null);
          setIsModalOpen(false);
        }}
        onSave={handleSaveTranslationKey}
      />
    </div>
  );
}
