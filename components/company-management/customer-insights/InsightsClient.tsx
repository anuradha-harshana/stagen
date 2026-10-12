"use client";

import React, { useState, useEffect } from "react";
import { INITIAL_PROJECTS, Project } from "@/lib/db-mock/projectsData";

import InsightsHeader from "./InsightsHeader";
import InsightsStats from "./InsightsStats";
import QuestionsFeed, { CustomerQuery } from "./QuestionsFed";
import TopicInsights from "./TopicInsights";
import ReplyModal from "./ReplyModel";

export default function CustomerInsightsClient() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);
  const [selectedQuery, setSelectedQuery] = useState<CustomerQuery | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("stagen_company_projects");
    if (saved) {
      try {
        setProjects(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse projects from localStorage", e);
        setProjects(INITIAL_PROJECTS);
      }
    } else {
      setProjects(INITIAL_PROJECTS);
    }
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (isHydrated) {
      localStorage.setItem("stagen_company_projects", JSON.stringify(projects));
    }
  }, [projects, isHydrated]);

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

  const handleSendReply = (questionId: string, replyText: string) => {
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
  };

  return (
    <div className="flex flex-col gap-6 w-full p-4 sm:p-6 space-y-6 max-w-7xl mx-auto font-sans">
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
