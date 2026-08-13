"use client";

import React, { useState } from "react";
import { 
  TrendingUp, 
  Bot, 
  MessageSquareText, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles, 
  DollarSign, 
  Search, 
  Edit3, 
  HelpCircle, 
  ThumbsUp, 
  ArrowUpRight,
  Zap,
  BookOpen
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { MOCK_AI_FAQ_TRENDS, AIFaqTrend } from "@/lib/db-mock/companyData";
import PageHeader from "@/components/Customer/PageHeader";

export default function CompanyManagementAiTrendsPage() {
  const [trends, setTrends] = useState<AIFaqTrend[]>(MOCK_AI_FAQ_TRENDS);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("All");
  const [selectedFaq, setSelectedFaq] = useState<AIFaqTrend | null>(null);

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const filteredTrends = trends.filter((item) => {
    const matchesSearch = 
      item.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sampleAnswer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === "All" || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

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
        icon={<TrendingUp className="h-5 w-5 text-burning-flame" />}
        title="AI Assistant & FAQ Usage Analytics"
        subtitle="Executive insights into customer inquiry volumes, AI resolution accuracy, and support ticket deflection"
        rightContent={
          <Button
            onClick={() => showNotification("AI Knowledge base retrained with latest FAQ dataset!")}
            className="bg-truffle-trouble text-palladian hover:bg-truffle-trouble/90 text-xs font-semibold h-9 rounded-xl shadow-sm"
          >
            <Sparkles className="mr-1.5 h-3.5 w-3.5" />
            Retrain AI Knowledge Base
          </Button>
        }
      />

      {/* Executive Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-palladian border border-blue-fantastic/15 shadow-sm">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-blue-fantastic/10 border border-blue-fantastic/15 flex items-center justify-center shrink-0">
              <Bot className="h-5 w-5 text-blue-fantastic" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-blue-fantastic/60 uppercase tracking-wider">Monthly AI Inquiries</p>
              <h3 className="text-xl font-bold text-blue-fantastic mt-0.5">1,208 Queries</h3>
              <p className="text-[10px] text-truffle-trouble font-bold flex items-center gap-0.5 mt-0.5">
                <ArrowUpRight className="h-3 w-3" />
                +14.2% from last month
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-palladian border border-blue-fantastic/15 shadow-sm">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-truffle-trouble/15 border border-truffle-trouble/20 flex items-center justify-center shrink-0">
              <CheckCircle2 className="h-5 w-5 text-truffle-trouble" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-blue-fantastic/60 uppercase tracking-wider">AI Resolution Rate</p>
              <h3 className="text-xl font-bold text-blue-fantastic mt-0.5">92.4% Automated</h3>
              <p className="text-[10px] text-blue-fantastic/50">Handled without supervisor calls</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-palladian border border-blue-fantastic/15 shadow-sm">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-burning-flame/15 border border-burning-flame/20 flex items-center justify-center shrink-0">
              <DollarSign className="h-5 w-5 text-truffle-trouble" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-blue-fantastic/60 uppercase tracking-wider">Support Cost Savings</p>
              <h3 className="text-xl font-bold text-blue-fantastic mt-0.5">$18,400 Saved</h3>
              <p className="text-[10px] text-blue-fantastic/50">~160 supervisor hours freed</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-palladian border border-blue-fantastic/15 shadow-sm">
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-blue-fantastic/10 border border-blue-fantastic/15 flex items-center justify-center shrink-0">
              <ThumbsUp className="h-5 w-5 text-blue-fantastic" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-blue-fantastic/60 uppercase tracking-wider">Customer Satisfaction</p>
              <h3 className="text-xl font-bold text-blue-fantastic mt-0.5">4.85 / 5.0 Rating</h3>
              <p className="text-[10px] text-blue-fantastic/50">Based on post-chat feedback</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Query Intent Breakdown Visual Bar */}
      <Card className="bg-palladian border border-blue-fantastic/15 shadow-sm relative overflow-hidden">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-bold text-blue-fantastic flex items-center gap-2">
            <Zap className="h-4 w-4 text-burning-flame" />
            Customer Query Category Breakdown
          </CardTitle>
          <CardDescription className="text-xs text-blue-fantastic/60">
            Most frequent topics asked by home buyers across active construction projects
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 pt-0">
          <div className="h-4 w-full rounded-full bg-blue-fantastic/10 flex overflow-hidden">
            <div className="h-full bg-truffle-trouble text-[10px] text-palladian flex items-center justify-center font-bold" style={{ width: "42%" }}>
              Stages 42%
            </div>
            <div className="h-full bg-burning-flame text-[10px] text-blue-fantastic flex items-center justify-center font-bold" style={{ width: "28%" }}>
              Invoices 28%
            </div>
            <div className="h-full bg-blue-fantastic text-[10px] text-palladian flex items-center justify-center font-bold" style={{ width: "15%" }}>
              Access 15%
            </div>
            <div className="h-full bg-truffle-trouble/70 text-[10px] text-palladian flex items-center justify-center font-bold" style={{ width: "15%" }}>
              Warranty 15%
            </div>
          </div>
          <div className="flex justify-between items-center text-xs text-blue-fantastic/70 font-semibold pt-1">
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-truffle-trouble" />
              Construction Stage Timelines (42%)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-burning-flame" />
              Drawdown & Invoices (28%)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-blue-fantastic" />
              Site Inspections & PCI (15%)
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-truffle-trouble/70" />
              Defects & Warranty (15%)
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Top Customer Questions & FAQ Performance Table */}
      <Card className="bg-palladian border border-blue-fantastic/15 shadow-sm">
        <CardHeader className="pb-4 border-b border-blue-fantastic/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-base font-bold text-blue-fantastic flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-blue-fantastic" />
              Top Customer Questions & FAQ Knowledge Performance
            </CardTitle>
            <CardDescription className="text-xs text-blue-fantastic/60 mt-0.5">
              Evaluate query frequency, resolution rates, and identify topics needing answer refinement
            </CardDescription>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-blue-fantastic/40 pointer-events-none" />
              <Input
                placeholder="Search FAQ question..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 bg-palladian border-blue-fantastic/15 text-blue-fantastic placeholder:text-blue-fantastic/35 h-8 text-xs font-sans w-52 focus-visible:ring-truffle-trouble"
              />
            </div>

            <div className="flex gap-1 bg-blue-fantastic/8 p-0.5 rounded-xl border border-blue-fantastic/10">
              {["All", "Stage Timelines", "Invoices & Payments", "Site Access & Inspections", "Warranty Claims", "Variations & Specs"].map((cat) => (
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
                  <th className="py-3 px-4">Question Topic</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Query Count</th>
                  <th className="py-3 px-4">AI Resolution Rate</th>
                  <th className="py-3 px-4">Supervisor Escalations</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-blue-fantastic/10">
                {filteredTrends.map((item) => (
                  <tr key={item.id} className="hover:bg-blue-fantastic/3 transition-colors">
                    <td className="py-3 px-4 font-bold text-blue-fantastic max-w-sm">
                      {item.question}
                    </td>
                    <td className="py-3 px-4">
                      <Badge variant="outline" className="text-[10px] bg-blue-fantastic/5 border-blue-fantastic/15 text-blue-fantastic font-semibold">
                        {item.category}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-blue-fantastic">
                      {item.queryCount} queries
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-blue-fantastic/10 h-1.5 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              item.aiResolutionRate >= 90
                                ? "bg-truffle-trouble"
                                : item.aiResolutionRate >= 80
                                ? "bg-burning-flame"
                                : "bg-red-500"
                            }`}
                            style={{ width: `${item.aiResolutionRate}%` }}
                          />
                        </div>
                        <span className="font-bold text-blue-fantastic font-mono text-[11px]">
                          {item.aiResolutionRate}%
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-truffle-trouble">
                      {item.escalationCount} calls
                    </td>
                    <td className="py-3 px-4">
                      <Badge
                        className={`text-[10px] px-2 py-0.5 border font-bold ${
                          item.status === "Optimized"
                            ? "bg-truffle-trouble/10 text-truffle-trouble border-truffle-trouble/30"
                            : item.status === "Needs Review"
                            ? "bg-burning-flame/15 text-truffle-trouble border-burning-flame/30"
                            : "bg-red-100 text-red-700 border-red-300"
                        }`}
                      >
                        {item.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setSelectedFaq(item)}
                        className="h-7 text-xs text-truffle-trouble hover:bg-truffle-trouble/10 font-semibold"
                      >
                        <Edit3 className="h-3.5 w-3.5 mr-1" />
                        Inspect & Edit
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Detail Dialog */}
      <Dialog open={selectedFaq !== null} onOpenChange={(open) => !open && setSelectedFaq(null)}>
        {selectedFaq && (
          <DialogContent className="max-w-xl bg-palladian text-blue-fantastic font-cream border border-blue-fantastic/20">
            <DialogHeader className="pb-3 border-b border-blue-fantastic/10">
              <div className="flex items-center gap-2 mb-1">
                <Badge className="text-[10px] bg-blue-fantastic/10 border-blue-fantastic/20 text-blue-fantastic font-bold">
                  {selectedFaq.category}
                </Badge>
                <span className="text-xs text-blue-fantastic/60 font-mono">{selectedFaq.id}</span>
              </div>
              <DialogTitle className="text-lg font-bold text-blue-fantastic">
                {selectedFaq.question}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-4 py-3">
              <div className="grid grid-cols-3 gap-2 text-xs bg-blue-fantastic/5 p-3 rounded-xl border border-blue-fantastic/10">
                <div>
                  <span className="text-blue-fantastic/60 block text-[10px] font-bold uppercase">Volume</span>
                  <span className="font-bold text-blue-fantastic">{selectedFaq.queryCount} queries</span>
                </div>
                <div>
                  <span className="text-blue-fantastic/60 block text-[10px] font-bold uppercase">AI Resolution</span>
                  <span className="font-bold text-truffle-trouble">{selectedFaq.aiResolutionRate}%</span>
                </div>
                <div>
                  <span className="text-blue-fantastic/60 block text-[10px] font-bold uppercase">Escalations</span>
                  <span className="font-bold text-truffle-trouble">{selectedFaq.escalationCount} cases</span>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-blue-fantastic/80 block mb-1">
                  Current Approved AI Knowledge Response
                </label>
                <textarea
                  value={selectedFaq.sampleAnswer}
                  onChange={(e) =>
                    setSelectedFaq({ ...selectedFaq, sampleAnswer: e.target.value })
                  }
                  className="w-full bg-palladian border border-blue-fantastic/20 rounded-xl p-3 text-xs text-blue-fantastic focus:outline-none h-24"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 border-t border-blue-fantastic/10 pt-3">
              <Button
                variant="outline"
                onClick={() => setSelectedFaq(null)}
                className="text-xs font-semibold border-blue-fantastic/20 text-blue-fantastic"
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  setTrends((prev) =>
                    prev.map((t) => (t.id === selectedFaq.id ? selectedFaq : t))
                  );
                  setSelectedFaq(null);
                  showNotification(`Updated AI answer for '${selectedFaq.id}'`);
                }}
                className="bg-truffle-trouble text-palladian hover:bg-truffle-trouble/90 text-xs font-semibold"
              >
                Save Knowledge Base Answer
              </Button>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}
