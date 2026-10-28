"use client";

import React, { useState, useEffect } from "react";
import { Project } from "@/lib/types/project";
import { fetchCompanyProjectsAction, replyToCompanyQuestionAction } from "@/lib/company/actions";

import InsightsHeader from "./InsightsHeader";
import InsightsStats from "./InsightsStats";
import QuestionsFeed, { CustomerQuery } from "./QuestionsFed";
import TopicInsights from "./TopicInsights";
import ReplyModal from "./ReplyModel";

interface CustomerInsightsClientProps {
  initialProjects?: Project[];
}

export default function CustomerInsightsClient({ initialProjects }: CustomerInsightsClientProps) {
  const [projects, setProjects] = useState<Project[]>(initialProjects || []);
  const [selectedQuery, setSelectedQuery] = useState<CustomerQuery | null>(null);
  const [loading, setLoading] = useState(!initialProjects || initialProjects.length === 0);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await fetchCompanyProjectsAction();
        if (data && data.length > 0) {
          setProjects(data);
        }
      } catch (err) {
        console.error("Failed to load company projects for customer insights:", err);
      } finally {
        setLoading(false);
      }
    }

    if (!initialProjects || initialProjects.length === 0) {
      loadData();
    }
  }, [initialProjects]);

  // Extract queries
  const queries: CustomerQuery[] = projects.flatMap((p) =>
    (p.questions || []).map((q) => ({
      projectId: p.id,
      questionId: q.id,
      customerName: q.customerName,
      questionText: q.questionText,
      date: q.date,
      replied: q.replied,
      replyText: q.replyText,
      projectAddress: p.address,
    }))
  );

  const pendingCount = queries.filter((q) => !q.replied).length;

  const handleSendReply = async (questionId: string, replyText: string) => {
    // 1. Optimistic UI update
    const nextProjects = projects.map((p) => {
      const hasQuestion = (p.questions || []).some((q) => q.id === questionId);
      if (!hasQuestion) return p;

      return {
        ...p,
        questions: p.questions.map((q) =>
          q.id === questionId
            ? { ...q, replied: true, replyText }
            : q
        ),
      };
    });

    setProjects(nextProjects);
    setSelectedQuery(null);

    // 2. Persist to JSON file via server action
    try {
      const updated = await replyToCompanyQuestionAction(questionId, replyText);
      if (updated) {
        setProjects(updated);
      }
    } catch (err) {
      console.error("Failed to save reply to JSON file:", err);
    }
  };

  return (
    <div className="w-full p-4 sm:p-6 space-y-6 max-w-7xl mx-auto font-sans">
      {/* Header */}
      <InsightsHeader />

      {/* Overview Stats */}
      <InsightsStats totalQueries={queries.length} pendingCount={pendingCount} />

      {/* Grid: Feed and Topic insights */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-7 w-full">
          <QuestionsFeed queries={queries} onReplyClick={setSelectedQuery} />
        </div>
        <div className="lg:col-span-5 w-full">
          <TopicInsights />
        </div>
      </div>

      {/* Modal */}
      <ReplyModal
        query={selectedQuery}
        isOpen={selectedQuery !== null}
        onClose={() => setSelectedQuery(null)}
        onSend={handleSendReply}
      />
    </div>
  );
}
