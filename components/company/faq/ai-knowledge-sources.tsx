"use client";

import React, { useState } from "react";
import { Trash2, Plus, ShieldAlert, FileText, Upload, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export interface KnowledgeDoc {
  name: string;
  size: string;
  uploadedAt: string;
}

interface AIKnowledgeSourcesProps {
  guardrails: string[];
  onAddGuardrail: (text: string) => void;
  onDeleteGuardrail: (index: number) => void;
  documents: KnowledgeDoc[];
  onAddDocument: (doc: KnowledgeDoc) => void;
  onDeleteDocument: (name: string) => void;
}

export default function AIKnowledgeSources({
  guardrails,
  onAddGuardrail,
  onDeleteGuardrail,
  documents,
  onAddDocument,
  onDeleteDocument,
}: AIKnowledgeSourcesProps) {
  const [newGuardrail, setNewGuardrail] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [fileName, setFileName] = useState("");

  const handleAddGuard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGuardrail.trim()) return;
    onAddGuardrail(newGuardrail.trim());
    setNewGuardrail("");
  };

  const triggerSimulatedUpload = () => {
    const fileNames = [
      "Stagen_Standard_Specifications_2026.pdf",
      "Builder_Warranty_Terms_Schedule.pdf",
      "PCI_Practical_Completion_Inspection_Manual.pdf",
      "Site_Safety_Induction_Booklet.pdf"
    ];
    const available = fileNames.filter(n => !documents.some(d => d.name === n));
    const targetName = available[0] || `Custom_AI_Context_Doc_${documents.length + 1}.pdf`;

    setFileName(targetName);
    setIsUploading(true);
    setUploadProgress(0);

    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            onAddDocument({
              name: targetName,
              size: `${(Math.random() * 2 + 0.5).toFixed(1)} MB`,
              uploadedAt: new Date().toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              }),
            });
            setIsUploading(false);
            setFileName("");
          }, 400);
          return 100;
        }
        return prev + 25;
      });
    }, 200);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full font-sans">
      {/* AI Guardrails Panel */}
      <div className="bg-white p-6 rounded-2xl border border-blue-fantastic/10 flex flex-col justify-between h-full shadow-sm">
        <div>
          <div className="flex items-center gap-2 pb-3 border-b border-blue-fantastic/5 mb-4">
            <ShieldAlert className="h-5 w-5 text-truffle-trouble" />
            <h3 className="text-sm font-extrabold text-blue-fantastic uppercase tracking-wider">
              AI Guardrails & Policies
            </h3>
          </div>

          <p className="text-xs text-blue-fantastic/65 mb-4 font-semibold leading-relaxed">
            These strict system directives govern the behavior, tone, and scoping constraints of the customer-facing AI Assistant.
          </p>

          <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
            {guardrails.map((guard, idx) => (
              <div
                key={idx}
                className="flex items-start justify-between gap-3 p-3 bg-blue-fantastic/4 border border-blue-fantastic/5 rounded-xl text-xs font-semibold text-blue-fantastic/80 leading-normal"
              >
                <span>{guard}</span>
                <button
                  onClick={() => onDeleteGuardrail(idx)}
                  className="hover:text-burning-flame text-blue-fantastic/40 transition-colors p-0.5 rounded shrink-0 cursor-pointer"
                  title="Remove Directive"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Add Guardrail Form */}
        <form onSubmit={handleAddGuard} className="flex gap-2 pt-4 border-t border-blue-fantastic/5 mt-4">
          <Input
            placeholder="Add new prompt guardrail..."
            value={newGuardrail}
            onChange={(e) => setNewGuardrail(e.target.value)}
            className="bg-white border-blue-fantastic/15 text-blue-fantastic placeholder:text-blue-fantastic/35 h-9 text-xs font-sans w-full focus-visible:ring-truffle-trouble rounded-xl"
          />
          <Button
            type="submit"
            className="bg-blue-fantastic text-palladian hover:bg-blue-fantastic/90 shrink-0 h-9 px-3 rounded-xl cursor-pointer"
          >
            <Plus className="h-4 w-4 mr-1" />
            Add
          </Button>
        </form>
      </div>

      {/* Uploaded AI Documents Panel */}
      <div className="bg-white p-6 rounded-2xl border border-blue-fantastic/10 flex flex-col justify-between h-full shadow-sm">
        <div>
          <div className="flex items-center gap-2 pb-3 border-b border-blue-fantastic/5 mb-4">
            <FileText className="h-5 w-5 text-burning-flame" />
            <h3 className="text-sm font-extrabold text-blue-fantastic uppercase tracking-wider">
              AI Reference Documents
            </h3>
          </div>

          <p className="text-xs text-blue-fantastic/65 mb-4 font-semibold leading-relaxed">
            Upload policies, warranties, or builder guides that the AI model references to resolve complex questions.
          </p>

          <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
            {documents.map((doc) => (
              <div
                key={doc.name}
                className="flex items-center justify-between gap-3 p-3 bg-blue-fantastic/4 border border-blue-fantastic/5 rounded-xl text-xs font-semibold text-blue-fantastic/80"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <FileText className="h-4 w-4 text-blue-fantastic/40 shrink-0" />
                  <div className="min-w-0">
                    <p className="font-bold truncate">{doc.name}</p>
                    <p className="text-[10px] text-blue-fantastic/50 font-medium">
                      {doc.size} • Uploaded {doc.uploadedAt}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => onDeleteDocument(doc.name)}
                  className="hover:text-burning-flame text-blue-fantastic/40 transition-colors p-0.5 rounded shrink-0 cursor-pointer"
                  title="Delete Document"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Upload Button */}
        <div className="pt-4 border-t border-blue-fantastic/5 mt-4">
          {isUploading ? (
            <div className="flex flex-col gap-2 p-3 bg-blue-fantastic/5 border border-blue-fantastic/10 rounded-xl text-xs font-semibold text-blue-fantastic/80 items-center justify-center">
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 text-truffle-trouble animate-spin" />
                <span>Uploading {fileName}...</span>
              </div>
              <div className="h-1.5 w-full bg-blue-fantastic/15 rounded-full overflow-hidden p-[1px] border border-blue-fantastic/5 mt-1 max-w-[200px]">
                <div
                  className="h-full bg-truffle-trouble rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>
          ) : (
            <Button
              onClick={triggerSimulatedUpload}
              className="w-full bg-truffle-trouble text-palladian hover:bg-truffle-trouble/90 h-9 rounded-xl flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Upload className="h-4 w-4" />
              <span>Upload PDF Document</span>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
