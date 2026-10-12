"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TranslationKey } from "@/lib/company/localisation";
import { Edit3, Plus } from "lucide-react";

interface TranslationKeyModalProps {
  keyItem: TranslationKey | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => Promise<void>;
}

const CATEGORIES: TranslationKey["category"][] = [
  "General",
  "Dashboard",
  "Progress",
  "Invoices",
  "Warranty",
  "AI Assistant",
];

const STATUSES: TranslationKey["status"][] = [
  "Translated",
  "Pending Review",
  "Missing",
];

export default function TranslationKeyModal({
  keyItem,
  isOpen,
  onClose,
  onSave,
}: TranslationKeyModalProps) {
  const isEdit = Boolean(keyItem);

  const [key, setKey] = useState("");
  const [category, setCategory] = useState<TranslationKey["category"]>("General");
  const [enAU, setEnAU] = useState("");
  const [zhCN, setZhCN] = useState("");
  const [viVN, setViVN] = useState("");
  const [esES, setEsES] = useState("");
  const [status, setStatus] = useState<TranslationKey["status"]>("Translated");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (keyItem) {
      setKey(keyItem.key);
      setCategory(keyItem.category || "General");
      setEnAU(keyItem.enAU);
      setZhCN(keyItem.zhCN || "");
      setViVN(keyItem.viVN || "");
      setEsES(keyItem.esES || "");
      setStatus(keyItem.status || "Translated");
    } else {
      setKey("");
      setCategory("General");
      setEnAU("");
      setZhCN("");
      setViVN("");
      setEsES("");
      setStatus("Translated");
    }
    setErrors({});
  }, [keyItem, isOpen]);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!key.trim()) errs.key = "Translation key path is required (e.g. dashboard.title)";
    if (!enAU.trim()) errs.enAU = "English base translation is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setIsSubmitting(true);
      await onSave({
        ...(keyItem ? { id: keyItem.id } : {}),
        key: key.trim(),
        category,
        enAU: enAU.trim(),
        zhCN: zhCN.trim(),
        viVN: viVN.trim(),
        esES: esES.trim(),
        status,
      });
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-xl bg-white text-blue-fantastic font-sans border border-blue-fantastic/20 max-h-[90vh] overflow-y-auto rounded-2xl shadow-xl">
        <DialogHeader className="pb-3 border-b border-blue-fantastic/10">
          <DialogTitle className="text-xl font-bold text-blue-fantastic flex items-center gap-2">
            {isEdit ? (
              <>
                <Edit3 className="h-5 w-5 text-truffle-trouble" />
                Edit Translation Key
              </>
            ) : (
              <>
                <Plus className="h-5 w-5 text-truffle-trouble" />
                Add Translation Key
              </>
            )}
          </DialogTitle>
          <DialogDescription className="text-xs text-blue-fantastic/60">
            {isEdit
              ? `Update multilingual dictionary values for key: ${keyItem?.key}`
              : "Register a new UI localization key string with language translations"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-3">
          {/* Key path and category */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs font-bold text-blue-fantastic/70">
                Key Identifier *
              </Label>
              <Input
                placeholder="e.g. progress.inspections_note"
                value={key}
                disabled={isEdit}
                onChange={(e) => setKey(e.target.value)}
                className={`bg-white border-blue-fantastic/15 text-blue-fantastic h-9 text-xs font-mono focus-visible:ring-truffle-trouble rounded-xl ${
                  errors.key ? "border-red-500" : ""
                } ${isEdit ? "opacity-75 cursor-not-allowed bg-blue-fantastic/5" : ""}`}
              />
              {errors.key && <p className="text-[10px] text-red-500 font-bold">{errors.key}</p>}
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-bold text-blue-fantastic/70">
                Category
              </Label>
              <Select value={category} onValueChange={(val: any) => setCategory(val)}>
                <SelectTrigger className="bg-white border-blue-fantastic/15 text-blue-fantastic h-9 text-xs focus:ring-truffle-trouble rounded-xl">
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent className="bg-white text-blue-fantastic border-blue-fantastic/10">
                  {CATEGORIES.map((cat) => (
                    <SelectItem key={cat} value={cat} className="text-xs font-bold font-sans">
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* English (Base) */}
          <div className="space-y-1">
            <Label className="text-xs font-bold text-blue-fantastic/70">
              English (en-AU) - Base Default *
            </Label>
            <Input
              placeholder="English translation text..."
              value={enAU}
              onChange={(e) => setEnAU(e.target.value)}
              className={`bg-white border-blue-fantastic/15 text-blue-fantastic h-9 text-xs focus-visible:ring-truffle-trouble rounded-xl ${
                errors.enAU ? "border-red-500" : ""
              }`}
            />
            {errors.enAU && <p className="text-[10px] text-red-500 font-bold">{errors.enAU}</p>}
          </div>

          {/* Chinese */}
          <div className="space-y-1">
            <Label className="text-xs font-bold text-blue-fantastic/70">
              Chinese Simplified (zh-CN)
            </Label>
            <Input
              placeholder="简体中文翻译..."
              value={zhCN}
              onChange={(e) => setZhCN(e.target.value)}
              className="bg-white border-blue-fantastic/15 text-blue-fantastic h-9 text-xs focus-visible:ring-truffle-trouble rounded-xl"
            />
          </div>

          {/* Vietnamese */}
          <div className="space-y-1">
            <Label className="text-xs font-bold text-blue-fantastic/70">
              Vietnamese (vi-VN)
            </Label>
            <Input
              placeholder="Bản dịch tiếng Việt..."
              value={viVN}
              onChange={(e) => setViVN(e.target.value)}
              className="bg-white border-blue-fantastic/15 text-blue-fantastic h-9 text-xs focus-visible:ring-truffle-trouble rounded-xl"
            />
          </div>

          {/* Spanish */}
          <div className="space-y-1">
            <Label className="text-xs font-bold text-blue-fantastic/70">
              Spanish (es-ES)
            </Label>
            <Input
              placeholder="Traducción al español..."
              value={esES}
              onChange={(e) => setEsES(e.target.value)}
              className="bg-white border-blue-fantastic/15 text-blue-fantastic h-9 text-xs focus-visible:ring-truffle-trouble rounded-xl"
            />
          </div>

          {/* Status */}
          <div className="space-y-1">
            <Label className="text-xs font-bold text-blue-fantastic/70">
              Review Status
            </Label>
            <Select value={status} onValueChange={(val: any) => setStatus(val)}>
              <SelectTrigger className="bg-white border-blue-fantastic/15 text-blue-fantastic h-9 text-xs focus:ring-truffle-trouble rounded-xl">
                <SelectValue placeholder="Select Status" />
              </SelectTrigger>
              <SelectContent className="bg-white text-blue-fantastic border-blue-fantastic/10">
                {STATUSES.map((st) => (
                  <SelectItem key={st} value={st} className="text-xs font-bold font-sans">
                    {st}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Action buttons */}
          <div className="flex justify-end gap-2 border-t border-blue-fantastic/10 pt-3.5 mt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="text-xs font-semibold border-blue-fantastic/20 text-blue-fantastic hover:bg-blue-fantastic/10 h-9 rounded-xl px-4"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-truffle-trouble text-palladian hover:bg-truffle-trouble/90 text-xs font-semibold h-9 rounded-xl px-5 shadow-sm"
            >
              {isSubmitting
                ? "Saving..."
                : isEdit
                ? "Save Changes"
                : "Create Key"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
