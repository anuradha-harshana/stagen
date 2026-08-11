"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import {
  Building2,
  AlertTriangle,
  MessageCircle,
  CheckCircle2,
  Send,
  CalendarDays,
  MapPin,
  Bell,
  Clock,
  UserCheck,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useUser } from "@/components/Providers/UserProvider";
import type {
  SupervisorDashboardData,
  SupervisorQuestion,
  SupervisorActivity,
} from "@/lib/tenant/tenantTypes";

export default function SupervisorDashboard() {
  const user = useUser();
  const [dashboardData, setDashboardData] = useState<SupervisorDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeQuestionId, setActiveQuestionId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");

  useEffect(() => {
    if (!user?.id) {
      return;
    }

    setLoading(true);
    fetch(`/api/supervisor/dashboard?supervisorId=${encodeURIComponent(user.id)}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to load dashboard data");
        }
        return res.json() as Promise<SupervisorDashboardData>;
      })
      .then((data) => setDashboardData(data))
      .catch((err) => {
        console.error(err);
        toast.error("Unable to load supervisor dashboard data");
      })
      .finally(() => setLoading(false));
  }, [user?.id]);

  const unansweredQuestions: SupervisorQuestion[] = dashboardData?.unansweredQuestions ?? [];
  const activities: SupervisorActivity[] = dashboardData?.recentActivities ?? [];
  const totalProjects = dashboardData?.projects.length ?? 0;
  const delayedProjects = dashboardData?.delayedProjectsCount ?? 0;
  const pendingQuestionsCount = unansweredQuestions.length;
  const completedStagesCount = dashboardData?.completedStagesCount ?? 0;
  const delayAlert = dashboardData?.delayAlert;

  const handleSendReply = (questionId: string, tenantId: string, customerName: string, projectLot: string) => {
    if (!replyText.trim()) {
      toast.error("Please enter a reply message");
      return;
    }

    setDashboardData((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        unansweredQuestions: prev.unansweredQuestions.filter((q) => q.id !== questionId),
        recentActivities: [
          {
            id: `act-${Date.now()}`,
            project: projectLot,
            time: "Just now",
            text: `Replied to ${customerName}'s question for ${projectLot}`,
          },
          ...prev.recentActivities,
        ],
      };
    });

    setActiveQuestionId(null);
    setReplyText("");
    toast.success(`Reply sent to ${customerName}!`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-120 text-blue-fantastic/70 font-semibold">
        Loading supervisor dashboard...
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5 w-full px-6 py-6 font-cream">
      {/* 1. Header greeting */}
      <div className="flex font-sans justify-between items-center">
        <div>
          <h1 className="text-blue-fantastic text-3xl font-bold font-cream tracking-tight">
            Welcome back, {user.username}
          </h1>
          <p className="text-sm text-blue-fantastic/60 font-semibold mt-0.5">
            Supervisor Dashboard · {totalProjects} active construction site{totalProjects === 1 ? "" : "s"} under management
          </p>
        </div>
        <div className="flex gap-3 h-fit items-center">
          <div className="relative cursor-pointer h-9 w-9 rounded-xl bg-blue-fantastic/10 flex items-center justify-center border border-blue-fantastic/15 hover:bg-blue-fantastic/20 transition-all">
            <Bell className="h-4.5 w-4.5 text-blue-fantastic" />
            <span className="absolute top-1 right-1 h-2.5 w-2.5 rounded-full bg-truffle-trouble border-2 border-oatmeal animate-pulse" />
          </div>
          <Image
            src="/images/user.jpg"
            width={40}
            height={40}
            alt="supervisor"
            className="rounded-xl border border-blue-fantastic/20 object-cover"
            onError={(e) => {
              e.currentTarget.src = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=100";
            }}
          />
        </div>
      </div>

      {/* 2. Interactive KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 font-cream">
        {[
          {
            label: "Total Projects",
            value: totalProjects,
            sub: "Assigned build sites",
            icon: Building2,
            iconBg: "bg-blue-fantastic/10 border-blue-fantastic/20",
            iconColor: "text-blue-fantastic",
            valueColor: "text-blue-fantastic",
          },
          {
            label: "Delayed Projects",
            value: delayedProjects,
            sub: "Weather or material impact",
            icon: AlertTriangle,
            iconBg: "bg-burning-flame/15 border-burning-flame/30",
            iconColor: "text-truffle-trouble",
            valueColor: "text-truffle-trouble",
          },
          {
            label: "Pending Questions",
            value: pendingQuestionsCount,
            sub: "Requires your response",
            icon: MessageCircle,
            iconBg: "bg-truffle-trouble/10 border-truffle-trouble/20",
            iconColor: "text-truffle-trouble",
            valueColor: "text-blue-fantastic",
          },
          {
            label: "Completed Stages",
            value: completedStagesCount,
            sub: "Passed milestone audits",
            icon: CheckCircle2,
            iconBg: "bg-blue-fantastic/10 border-blue-fantastic/25",
            iconColor: "text-blue-fantastic/80",
            valueColor: "text-blue-fantastic/80",
          },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <Card
              key={item.label}
              className="bg-palladian border border-blue-fantastic/15 shadow-sm hover:shadow-md transition-all duration-200"
            >
              <CardContent className="pt-4 pb-3.5 px-4 flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-blue-fantastic/60 uppercase tracking-wider">
                    {item.label}
                  </span>
                  <div className={`h-8 w-8 rounded-xl border flex items-center justify-center ${item.iconBg}`}>
                    <Icon className={`h-4 w-4 ${item.iconColor}`} />
                  </div>
                </div>
                <div>
                  <p className={`text-2xl font-bold font-cream tracking-tight ${item.valueColor}`}>
                    {item.value}
                  </p>
                  <p className="text-[11px] text-blue-fantastic/70 font-semibold mt-0.5">
                    {item.sub}
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* 3. Alerts Banner */}
      {delayAlert && (
        <div className="relative overflow-hidden bg-burning-flame/15 border border-burning-flame/30 rounded-2xl p-4 flex gap-3.5 items-start">
          <div className="absolute top-0 left-0 bottom-0 w-1.5 bg-truffle-trouble/70" />
          <div className="h-9 w-9 rounded-xl bg-truffle-trouble/10 flex items-center justify-center shrink-0 border border-truffle-trouble/20">
            <AlertTriangle className="h-4.5 w-4.5 text-truffle-trouble" />
          </div>
          <div>
            <h4 className="text-blue-fantastic font-bold text-sm font-cream">
              Active Build Site Delay Alert
            </h4>
            <p className="text-xs text-blue-fantastic/90 font-semibold mt-1 leading-relaxed">
              <strong className="text-truffle-trouble font-bold">{delayAlert.tenantName}</strong> has a delay active at <span className="font-bold underline">{delayAlert.stageName}</span> due to {delayAlert.reason}. The incident window is {delayAlert.fromDate} to {delayAlert.toDate}.
            </p>
          </div>
        </div>
      )}

      {/* 4. Two Column Workspace Layout */}
      <div className="grid gap-4 grid-cols-1 lg:grid-cols-5">
        {/* Left Column: Customer Inquiries (3 cols) */}
        <Card className="lg:col-span-3 bg-palladian border border-blue-fantastic/15 shadow-sm">
          <CardHeader className="border-b border-blue-fantastic/10 pb-3">
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-xl bg-truffle-trouble/10 flex items-center justify-center">
                <MessageCircle className="h-4 w-4 text-truffle-trouble" />
              </div>
              <CardTitle className="text-blue-fantastic text-sm font-bold font-cream">
                Customer Inquiries Center
              </CardTitle>
              <Badge
                variant="outline"
                className="ml-auto text-xs text-blue-fantastic/70 border-blue-fantastic/20 bg-blue-fantastic/5 font-semibold"
              >
                {pendingQuestionsCount} urgent
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-4 flex flex-col gap-3 min-h-75">
            {unansweredQuestions.length === 0 ? (
              <div className="flex-1 flex flex-col items-center justify-center py-10 text-center">
                <div className="h-12 w-12 rounded-full bg-blue-fantastic/5 flex items-center justify-center mb-3">
                  <UserCheck className="h-6 w-6 text-blue-fantastic/40" />
                </div>
                <p className="text-blue-fantastic font-bold text-sm">All Caught Up!</p>
                <p className="text-xs text-blue-fantastic/60 font-semibold mt-1 max-w-65">
                  There are no pending customer questions requiring your response at this time.
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {unansweredQuestions.map((q) => (
                  <div
                    key={q.id}
                    className="p-3.5 rounded-2xl border border-blue-fantastic/10 bg-blue-fantastic/4 flex flex-col gap-2.5 transition-all hover:border-blue-fantastic/20"
                  >
                    <div className="flex justify-between items-start flex-wrap gap-2">
                      <div className="flex items-center gap-2">
                        <div className="h-7 w-7 rounded-full bg-blue-fantastic text-palladian text-xs font-bold flex items-center justify-center">
                          {q.customerName.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-blue-fantastic text-xs font-bold">{q.customerName}</p>
                          <p className="text-[10px] text-blue-fantastic/60 font-semibold">{q.projectLot}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 text-blue-fantastic/50 text-[10px] font-semibold">
                        <Clock className="h-3 w-3" />
                        <span>{q.date}</span>
                      </div>
                    </div>

                    <p className="text-xs text-blue-fantastic/90 font-semibold italic bg-palladian/60 p-2.5 rounded-xl border border-blue-fantastic/5 leading-relaxed">
                      "{q.questionText}"
                    </p>

                    {activeQuestionId === q.id ? (
                      <div className="flex flex-col gap-2 mt-1">
                        <Textarea
                          placeholder="Type your reply to the customer here..."
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          className="bg-palladian border-blue-fantastic/20 text-xs text-blue-fantastic font-sans placeholder:text-blue-fantastic/35 focus-visible:ring-truffle-trouble"
                          rows={3}
                        />
                        <div className="flex gap-2 justify-end">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setActiveQuestionId(null);
                              setReplyText("");
                            }}
                            className="text-xs font-semibold text-blue-fantastic/70 hover:bg-blue-fantastic/5"
                          >
                            Cancel
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleSendReply(q.id, q.tenantId, q.customerName, q.projectLot)}
                            className="bg-truffle-trouble text-palladian hover:bg-truffle-trouble/85 text-xs font-semibold gap-1.5"
                          >
                            <Send className="h-3 w-3" />
                            Send Reply
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex justify-end mt-0.5">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setActiveQuestionId(q.id);
                            setReplyText("");
                          }}
                          className="text-xs border-blue-fantastic/25 text-blue-fantastic hover:bg-blue-fantastic/10 h-7"
                        >
                          Respond
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Right Column: Recent Activities (2 cols) */}
        <Card className="lg:col-span-2 bg-palladian border border-blue-fantastic/15 shadow-sm">
          <CardHeader className="border-b border-blue-fantastic/10 pb-3">
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-xl bg-blue-fantastic/10 flex items-center justify-center">
                <CalendarDays className="h-4 w-4 text-blue-fantastic" />
              </div>
              <CardTitle className="text-blue-fantastic text-sm font-bold font-cream">
                Recent Site Activity
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="relative border-l border-blue-fantastic/15 pl-4 ml-2.5 space-y-4">
              {activities.map((act) => (
                <div key={act.id} className="relative group">
                  <span className="absolute left-[-21.5px] top-1 h-2.5 w-2.5 rounded-full border border-palladian bg-truffle-trouble shadow-sm transition-transform duration-200 group-hover:scale-125" />
                  <div className="flex flex-col gap-0.5">
                    <span className="text-[10px] text-blue-fantastic/55 font-bold uppercase tracking-wider flex items-center gap-1.5">
                      <MapPin className="h-2.5 w-2.5 text-blue-fantastic/40" />
                      {act.project} · {act.time}
                    </span>
                    <p className="text-xs text-blue-fantastic font-semibold leading-relaxed">
                      {act.text}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
