"use client";

import React, { useState, useEffect } from "react";
import { BookOpen, FileText } from "lucide-react";
import FAQHeader from "./faq-header";
import FAQStats from "./faq-stats";
import FAQList, { FAQArticle } from "./faq-list";
import FAQFormModal from "./faq-form-modal";
import AIKnowledgeSources, { KnowledgeDoc } from "./ai-knowledge-sources";

const INITIAL_FAQ_ARTICLES: FAQArticle[] = [
  {
    id: "faq-1",
    category: "Site Access",
    question: "Can I visit the construction site at any time?",
    answer: "For safety reasons, site visits must be scheduled in advance with your Site Supervisor. Unaccompanied access is strictly prohibited."
  },
  {
    id: "faq-2",
    category: "Payments",
    question: "When are progress payments due?",
    answer: "Progress payments are due at the completion of each major stage (Slab, Frame, Lockup, Fixing, Practical Completion). Invoices are sent via the Customer Portal and are payable within 7 business days."
  },
  {
    id: "faq-3",
    category: "Warranty",
    question: "What is covered under the post-handover warranty?",
    answer: "We provide a 3-month minor defects warranty period and a statutory 6-year structural guarantee. Warranty requests can be logged directly through the Warranty page in the Customer Portal."
  },
  {
    id: "faq-4",
    category: "Delays",
    question: "How will I be notified of weather delays?",
    answer: "Any weather or material delay is recorded in our Site Diary and will automatically show up on your timeline and dashboard. Your supervisor will log estimated delays as they occur."
  }
];

const INITIAL_GUARDRAILS = [
  "Prioritize safety instructions in all site visit inquiries.",
  "Direct complex contract and payment variations to the company manager.",
  "Always suggest contacting supervisor Eric for lot-specific timeline details."
];

const INITIAL_DOCUMENTS: KnowledgeDoc[] = [
  {
    name: "Stagen_Warranty_Agreement_2026.pdf",
    size: "1.2 MB",
    uploadedAt: "Jun 15, 2026"
  },
  {
    name: "Site_Safety_And_Access_Protocol.pdf",
    size: "840 KB",
    uploadedAt: "Jun 18, 2026"
  },
  {
    name: "Standard_Invoicing_Schedule.pdf",
    size: "450 KB",
    uploadedAt: "Jun 24, 2026"
  }
];

export default function FAQClient() {
  const [articles, setArticles] = useState<FAQArticle[]>(INITIAL_FAQ_ARTICLES);
  const [guardrails, setGuardrails] = useState<string[]>(INITIAL_GUARDRAILS);
  const [documents, setDocuments] = useState<KnowledgeDoc[]>(INITIAL_DOCUMENTS);
  const [isHydrated, setIsHydrated] = useState(false);

  // Layout Tab State
  const [activeTab, setActiveTab] = useState<"faq" | "ai">("faq");

  // Form States
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingArticle, setEditingArticle] = useState<FAQArticle | null>(null);

  // Sync state with localStorage
  useEffect(() => {
    const savedArticles = localStorage.getItem("stagen_faq_articles");
    const savedGuardrails = localStorage.getItem("stagen_ai_guardrails");
    const savedDocs = localStorage.getItem("stagen_ai_documents");

    if (savedArticles) setArticles(JSON.parse(savedArticles));
    if (savedGuardrails) setGuardrails(JSON.parse(savedGuardrails));
    if (savedDocs) setDocuments(JSON.parse(savedDocs));

    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem("stagen_faq_articles", JSON.stringify(articles));
      localStorage.setItem("stagen_ai_guardrails", JSON.stringify(guardrails));
      localStorage.setItem("stagen_ai_documents", JSON.stringify(documents));
    }
  }, [articles, guardrails, documents, isHydrated]);

  // QA Operations
  const handleSaveFAQ = (savedArt: FAQArticle) => {
    const exists = articles.some((art) => art.id === savedArt.id);
    if (exists) {
      setArticles(articles.map((art) => (art.id === savedArt.id ? savedArt : art)));
    } else {
      setArticles([savedArt, ...articles]);
    }
    setIsFormOpen(false);
    setEditingArticle(null);
  };

  const handleDeleteFAQ = (id: string) => {
    setArticles(articles.filter((art) => art.id !== id));
  };

  // Guardrail Operations
  const handleAddGuardrail = (text: string) => {
    setGuardrails([...guardrails, text]);
  };

  const handleDeleteGuardrail = (index: number) => {
    setGuardrails(guardrails.filter((_, idx) => idx !== index));
  };

  // Documents Operations
  const handleAddDoc = (doc: KnowledgeDoc) => {
    setDocuments([...documents, doc]);
  };

  const handleDeleteDoc = (name: string) => {
    setDocuments(documents.filter((doc) => doc.name !== name));
  };

  const categories = Array.from(new Set(articles.map((art) => art.category)));

  return (
    <div className="flex flex-col gap-6 w-full p-4 sm:p-6 space-y-6 max-w-7xl mx-auto font-sans">
      {/* Page Header */}
      <FAQHeader onAddClick={() => {
        setEditingArticle(null);
        setIsFormOpen(true);
      }} />

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
          onDelete={handleDeleteFAQ}
        />
      ) : (
        <AIKnowledgeSources
          guardrails={guardrails}
          onAddGuardrail={handleAddGuardrail}
          onDeleteGuardrail={handleDeleteGuardrail}
          documents={documents}
          onAddDocument={handleAddDoc}
          onDeleteDocument={handleDeleteDoc}
        />
      )}

      {/* Form Modal */}
      <FAQFormModal
        article={editingArticle}
        categories={categories}
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingArticle(null);
        }}
        onSave={handleSaveFAQ}
      />
    </div>
  );
}
