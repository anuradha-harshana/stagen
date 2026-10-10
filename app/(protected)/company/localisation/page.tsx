"use client";

import React, { useState } from "react";
import { 
  Globe, 
  Search, 
  Languages, 
  CheckCircle2, 
  Clock, 
  FileSpreadsheet, 
  Download, 
  Upload, 
  Edit3, 
  Plus, 
  Sparkles,
  DollarSign,
  Calendar,
  Layers,
  ArrowRight
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { MOCK_TRANSLATION_KEYS, TranslationKey } from "@/lib/db-mock/companyData";
import PageHeader from "@/components/shared/PageHeader";
import { PAGE_SHELL_CLASS } from "@/components/shared/pageShell";

export default function CompanyLocalisationPage() {
  const [translationKeys, setTranslationKeys] = useState<TranslationKey[]>(MOCK_TRANSLATION_KEYS);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("All");
  const [selectedKey, setSelectedKey] = useState<TranslationKey | null>(null);
  const [editForm, setEditForm] = useState({
    enAU: "",
    zhCN: "",
    viVN: "",
    esES: "",
    status: "Translated" as "Translated" | "Pending Review" | "Missing"
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Filter keys
  const filteredKeys = translationKeys.filter((item) => {
    const matchesSearch = 
      item.key.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.enAU.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.zhCN.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "All" || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleOpenEdit = (keyItem: TranslationKey) => {
    setSelectedKey(keyItem);
    setEditForm({
      enAU: keyItem.enAU,
      zhCN: keyItem.zhCN,
      viVN: keyItem.viVN,
      esES: keyItem.esES,
      status: keyItem.status
    });
  };

  const handleSaveTranslation = () => {
    if (!selectedKey) return;
    setTranslationKeys((prev) =>
      prev.map((k) =>
        k.id === selectedKey.id
          ? {
              ...k,
              enAU: editForm.enAU,
              zhCN: editForm.zhCN,
              viVN: editForm.viVN,
              esES: editForm.esES,
              status: editForm.status,
              lastUpdated: new Date().toISOString().split("T")[0]
            }
          : k
      )
    );
    setSelectedKey(null);
    showNotification(`Translation key '${selectedKey.key}' updated successfully!`);
  };

  return (
    <div className={PAGE_SHELL_CLASS}>
      {/* Notification Toast */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-blue-fantastic text-palladian px-4 py-3 rounded-xl shadow-lg border border-burning-flame/30 flex items-center gap-2 text-sm font-semibold animate-in fade-in slide-in-from-top-2">
          <CheckCircle2 className="h-4 w-4 text-burning-flame" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <PageHeader
        icon={<Globe className="h-5 w-5 text-burning-flame" />}
        title="Localisation & Multilingual Settings"
        subtitle="Manage Australian locale standards, multi-language translation keys, and customer portal language defaults"
        rightContent={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => showNotification("Exported translation bundle (.json)")}
              className="bg-white border-blue-fantastic/20 text-blue-fantastic hover:bg-blue-fantastic/10 text-xs font-semibold h-9 rounded-xl"
            >
              <Download className="mr-1.5 h-3.5 w-3.5" />
              Export .JSON
            </Button>
            <Button
              onClick={() => showNotification("Imported translation bundle successfully")}
              className="bg-truffle-trouble text-palladian hover:bg-truffle-trouble/90 text-xs font-semibold h-9 rounded-xl shadow-sm"
            >
              <Upload className="mr-1.5 h-3.5 w-3.5" />
              Import Bundle
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
              <p className="text-[11px] font-bold text-blue-fantastic/60 uppercase tracking-wider">Default Locale</p>
              <h3 className="text-base font-bold text-blue-fantastic mt-0.5">English (en-AU)</h3>
              <p className="text-[10px] text-blue-fantastic/50">Australian Regional Standard</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-blue-fantastic/15 shadow-sm">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-burning-flame/15 border border-burning-flame/20 flex items-center justify-center shrink-0">
              <Languages className="h-5 w-5 text-truffle-trouble" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-blue-fantastic/60 uppercase tracking-wider">Supported Languages</p>
              <h3 className="text-base font-bold text-blue-fantastic mt-0.5">4 Active Languages</h3>
              <p className="text-[10px] text-blue-fantastic/50">EN-AU, ZH-CN, VI-VN, ES-ES</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-blue-fantastic/15 shadow-sm">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-truffle-trouble/15 border border-truffle-trouble/20 flex items-center justify-center shrink-0">
              <Layers className="h-5 w-5 text-truffle-trouble" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-blue-fantastic/60 uppercase tracking-wider">Translation Coverage</p>
              <h3 className="text-base font-bold text-blue-fantastic mt-0.5">94.8% Complete</h3>
              <p className="text-[10px] text-blue-fantastic/50">6 active translation keys</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white border border-blue-fantastic/15 shadow-sm">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-blue-fantastic/10 border border-blue-fantastic/15 flex items-center justify-center shrink-0">
              <Clock className="h-5 w-5 text-blue-fantastic" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-blue-fantastic/60 uppercase tracking-wider">Primary Timezone</p>
              <h3 className="text-base font-bold text-blue-fantastic mt-0.5">Australia/Sydney</h3>
              <p className="text-[10px] text-blue-fantastic/50">AEST / AEDT Format</p>
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
              <p className="text-xs font-bold text-blue-fantastic">$12,500.00 AUD</p>
              <p className="text-[10px] text-blue-fantastic/50">Formatted with AUD symbol & commas</p>
            </div>
          </div>

          <div className="bg-blue-fantastic/5 p-3 rounded-xl border border-blue-fantastic/10 flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-burning-flame/15 flex items-center justify-center shrink-0">
              <Calendar className="h-4 w-4 text-truffle-trouble" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-blue-fantastic/60 uppercase">Date Standard</p>
              <p className="text-xs font-bold text-blue-fantastic">06/08/2026 (DD/MM/YYYY)</p>
              <p className="text-[10px] text-blue-fantastic/50">Australian Calendar Order</p>
            </div>
          </div>

          <div className="bg-blue-fantastic/5 p-3 rounded-xl border border-blue-fantastic/10 flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-truffle-trouble/15 flex items-center justify-center shrink-0">
              <Clock className="h-4 w-4 text-truffle-trouble" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-blue-fantastic/60 uppercase">Time & System Clock</p>
              <p className="text-xs font-bold text-blue-fantastic">12-Hour AM/PM (Sydney Time)</p>
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
              Edit system UI text strings across supported languages
            </CardDescription>
          </div>

          {/* Search & Category Filter */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-blue-fantastic/40 pointer-events-none" />
              <Input
                placeholder="Search key or text..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 bg-white border-blue-fantastic/15 text-blue-fantastic placeholder:text-blue-fantastic/35 h-8 text-xs font-sans w-56 focus-visible:ring-truffle-trouble"
              />
            </div>

            <div className="flex gap-1 bg-blue-fantastic/8 p-0.5 rounded-xl border border-blue-fantastic/10">
              {["All", "Dashboard", "Progress", "Invoices", "Warranty", "AI Assistant"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                    categoryFilter === cat
                      ? "bg-blue-fantastic text-palladian shadow-sm"
                      : "text-blue-fantastic/70 hover:text-blue-fantastic hover:bg-blue-fantastic/5"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
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
                    <td colSpan={7} className="py-10 text-center text-blue-fantastic/50">
                      No translation keys matched your search criteria.
                    </td>
                  </tr>
                ) : (
                  filteredKeys.map((item) => (
                    <tr key={item.id} className="hover:bg-blue-fantastic/3 transition-colors">
                      <td className="py-3 px-4 font-bold text-blue-fantastic font-mono text-[11px]">
                        {item.key}
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant="outline" className="text-[10px] bg-blue-fantastic/5 border-blue-fantastic/15 text-blue-fantastic">
                          {item.category}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 font-medium text-blue-fantastic max-w-xs truncate">
                        {item.enAU}
                      </td>
                      <td className="py-3 px-4 text-blue-fantastic/80 max-w-xs truncate">
                        {item.zhCN}
                      </td>
                      <td className="py-3 px-4">
                        <Badge
                          className={`text-[10px] px-2 py-0.5 border font-bold ${
                            item.status === "Translated"
                              ? "bg-truffle-trouble/10 text-truffle-trouble border-truffle-trouble/30"
                              : "bg-burning-flame/15 text-truffle-trouble border-burning-flame/30"
                          }`}
                        >
                          {item.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-blue-fantastic/60 font-medium">
                        {item.lastUpdated}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleOpenEdit(item)}
                          className="h-7 text-xs text-truffle-trouble hover:bg-truffle-trouble/10 font-semibold"
                        >
                          <Edit3 className="h-3.5 w-3.5 mr-1" />
                          Edit
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Edit Translation Dialog */}
      <Dialog open={selectedKey !== null} onOpenChange={(open) => !open && setSelectedKey(null)}>
        {selectedKey && (
          <DialogContent className="max-w-xl bg-white text-blue-fantastic font-sans border border-blue-fantastic/20">
            <DialogHeader className="pb-3 border-b border-blue-fantastic/10">
              <DialogTitle className="text-xl font-bold text-blue-fantastic flex items-center gap-2">
                <Edit3 className="h-5 w-5 text-truffle-trouble" />
                Edit Translation Key
              </DialogTitle>
              <DialogDescription className="text-xs text-blue-fantastic/60 font-mono">
                {selectedKey.key} ({selectedKey.category})
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-3">
              <div>
                <label className="text-xs font-bold text-blue-fantastic/80 block mb-1">
                  English (en-AU) - Default Base Text
                </label>
                <Input
                  value={editForm.enAU}
                  onChange={(e) => setEditForm({ ...editForm, enAU: e.target.value })}
                  className="bg-white border-blue-fantastic/20 text-xs font-medium"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-blue-fantastic/80 block mb-1">
                  Chinese Simplified (zh-CN)
                </label>
                <Input
                  value={editForm.zhCN}
                  onChange={(e) => setEditForm({ ...editForm, zhCN: e.target.value })}
                  className="bg-white border-blue-fantastic/20 text-xs font-medium"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-blue-fantastic/80 block mb-1">
                  Vietnamese (vi-VN)
                </label>
                <Input
                  value={editForm.viVN}
                  onChange={(e) => setEditForm({ ...editForm, viVN: e.target.value })}
                  className="bg-white border-blue-fantastic/20 text-xs font-medium"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-blue-fantastic/80 block mb-1">
                  Spanish (es-ES)
                </label>
                <Input
                  value={editForm.esES}
                  onChange={(e) => setEditForm({ ...editForm, esES: e.target.value })}
                  className="bg-white border-blue-fantastic/20 text-xs font-medium"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-blue-fantastic/80 block mb-1">
                  Translation Status
                </label>
                <select
                  value={editForm.status}
                  onChange={(e: any) => setEditForm({ ...editForm, status: e.target.value })}
                  className="w-full bg-white border border-blue-fantastic/20 text-xs font-bold rounded-md h-9 px-3 text-blue-fantastic focus:outline-none"
                >
                  <option value="Translated">Translated</option>
                  <option value="Pending Review">Pending Review</option>
                  <option value="Missing">Missing</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 border-t border-blue-fantastic/10 pt-3">
              <Button
                variant="outline"
                onClick={() => setSelectedKey(null)}
                className="text-xs font-semibold border-blue-fantastic/20 text-blue-fantastic"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSaveTranslation}
                className="bg-truffle-trouble text-palladian hover:bg-truffle-trouble/90 text-xs font-semibold"
              >
                Save Translation
              </Button>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}
