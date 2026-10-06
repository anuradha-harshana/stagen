"use client";

import React, { useState } from "react";
import { BookOpen, FileText } from "lucide-react";
import FAQHeader from "./faq-header";
import FAQStats from "./faq-stats";
import FAQList, { FAQArticle } from "./faq-list";
import FAQFormModal from "./faq-form-modal";
import AIKnowledgeSources, { KnowledgeDoc } from "./ai-knowledge-sources";

interface FAQClientProps {
  initialFaqs: FAQArticle[];
  initialGuardrails?: string[];
  initialDocuments?: KnowledgeDoc[];
  companyId: string;
}

export default function FAQClient({
  initialFaqs,
  initialGuardrails = [],
  initialDocuments = [],
  companyId,
}: FAQClientProps) {
  // 1. Initialize state with data loaded from server JSON file
  const [articles, setArticles] = useState<FAQArticle[]>(initialFaqs);
  const [guardrails, setGuardrails] = useState<string[]>(initialGuardrails);
  const [documents, setDocuments] = useState<KnowledgeDoc[]>(initialDocuments);

  // Layout Tab State
  const [activeTab, setActiveTab] = useState<"faq" | "ai">("faq");

  // Form & Edit States
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<FAQArticle | null>(null);

  // --- CRUD Operations connected to /api/company/faq ---

  // 1. ADD / EDIT FAQ
  const handleSaveFAQ = async (payload: FAQArticle) => {
    try {
      const isEdit = Boolean(editingArticle);
      const response = await fetch("/api/company/faq", {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to save FAQ article to JSON");
      }

      const data: { faq: FAQArticle } = await response.json();

      // Update UI state with the saved FAQ returned from the server
      setArticles((current) => {
        const exists = current.some((art) => art.id === data.faq.id);
        return exists
          ? current.map((art) => (art.id === data.faq.id ? data.faq : art))
          : [data.faq, ...current];
      });

      setIsFormOpen(false);
      setEditingArticle(null);
    } catch (error) {
      console.error("Error saving FAQ article:", error);
    }
  };

  // 2. DELETE FAQ
  const handleDeleteFAQ = async (id: string) => {
    try {
      const response = await fetch(`/api/company/faq?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete FAQ article from JSON");
      }

      // Remove from client state to immediately update UI
      setArticles((current) => current.filter((art) => art.id !== id));
    } catch (error) {
      console.error("Error deleting FAQ article:", error);
    }
  };

  // AI Guardrail Operations (Syncing to JSON)
  const handleAddGuardrail = async (text: string) => {
    const updated = [...guardrails, text];
    setGuardrails(updated);
    await fetch("/api/company/faq", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ guardrails: updated }),
    }).catch(console.error);
  };

  const handleDeleteGuardrail = async (index: number) => {
    const updated = guardrails.filter((_, idx) => idx !== index);
    setGuardrails(updated);
    await fetch("/api/company/faq", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ guardrails: updated }),
    }).catch(console.error);
  };

  // AI Knowledge Document Operations (Syncing to JSON)
  const handleAddDoc = async (doc: KnowledgeDoc) => {
    const updated = [...documents, doc];
    setDocuments(updated);
    await fetch("/api/company/faq", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ documents: updated }),
    }).catch(console.error);
  };

  const handleDeleteDoc = async (name: string) => {
    const updated = documents.filter((doc) => doc.name !== name);
    setDocuments(updated);
    await fetch("/api/company/faq", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ documents: updated }),
    }).catch(console.error);
  };

  const categories = Array.from(new Set(articles.map((art) => art.category)));

  return (
    <div className="flex flex-col gap-6 w-full p-4 sm:p-6 space-y-6 max-w-7xl mx-auto font-sans">
      {/* Page Header */}
      <FAQHeader
        onAddClick={() => {
          setEditingArticle(null);
          setIsFormOpen(true);
        }}
      />

      {/* Overview Stats */}
      <FAQStats
        faqCount={articles.length}
        docCount={documents.length}
        guardrailCount={guardrails.length}
      />

      {/* Tab Switcher */}
      <div className="flex gap-2 border-b border-blue-fantastic/10 pb-1 flex-wrap">
        <button
          onClick={() => setActiveTab("faq")}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-bold font-sans border-b-2 transition-all cursor-pointer ${
            activeTab === "faq"
              ? "border-truffle-trouble text-truffle-trouble"
              : "border-transparent text-blue-fantastic/50 hover:text-blue-fantastic"
          }`}
        >
          <BookOpen className="h-4 w-4" />
          FAQ Database
        </button>
        <button
          onClick={() => setActiveTab("ai")}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-bold font-sans border-b-2 transition-all cursor-pointer ${
            activeTab === "ai"
              ? "border-truffle-trouble text-truffle-trouble"
              : "border-transparent text-blue-fantastic/50 hover:text-blue-fantastic"
          }`}
        >
          <FileText className="h-4 w-4" />
          AI & Reference Manuals
        </button>
      </div>

      {/* Active Tab Panels */}
      {activeTab === "faq" ? (
        <FAQList
          articles={articles}
          onEdit={(art) => {
            setEditingArticle(art);
            setIsFormOpen(true);
          }}
          onDelete={(id) => void handleDeleteFAQ(id)}
        />
      ) : (
        <AIKnowledgeSources
          guardrails={guardrails}
          onAddGuardrail={(text) => void handleAddGuardrail(text)}
          onDeleteGuardrail={(idx) => void handleDeleteGuardrail(idx)}
          documents={documents}
          onAddDocument={(doc) => void handleAddDoc(doc)}
          onDeleteDocument={(name) => void handleDeleteDoc(name)}
        />
      )}

      {/* Create / Edit Form Modal */}
      <FAQFormModal
        article={editingArticle}
        categories={categories}
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingArticle(null);
        }}
        onSave={(payload) => void handleSaveFAQ(payload)}
      />
    </div>
  );
}
