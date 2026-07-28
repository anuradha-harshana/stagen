"use client";

import React, { useState, useEffect } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { DelayLogEntry } from "@/lib/timeline/data";
import { DelayMessage, getDelayCategoryMeta } from "./delays-store";
import { Send, Sparkles, User, AlertCircle, ArrowRight } from "lucide-react";
import { toast } from "sonner";

interface SendDelayMessageModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  customerName: string;
  customerEmail: string;
  delayEntry?: DelayLogEntry | null;
  onSendMessage: (newMessage: DelayMessage) => void;
}

export function SendDelayMessageModal({
  isOpen,
  onClose,
  projectId,
  customerName,
  customerEmail,
  delayEntry,
  onSendMessage,
}: SendDelayMessageModalProps) {
  const [subject, setSubject] = useState<string>("");
  const [body, setBody] = useState<string>("");

  useEffect(() => {
    if (delayEntry) {
      setSubject(`Build Schedule Notice: ${delayEntry.title} (${delayEntry.stageName} Stage)`);
      setBody(
        `Hi ${customerName.split(" ")[0] || "Customer"},\n\nWe wanted to share an update regarding your build schedule for ${projectId.toUpperCase()}. We have experienced a delay during the ${delayEntry.stageName} stage due to ${delayEntry.reason}.\n\nOur revised completion estimate for this stage is now ${delayEntry.toDate}. We are monitoring site progress closely and will keep you informed of further updates.`
      );
    } else {
      setSubject(`Build Schedule Update: ${projectId.toUpperCase()}`);
      setBody(
        `Hi ${customerName.split(" ")[0] || "Customer"},\n\nPlease find an update regarding your project timeline...`
      );
    }
  }, [delayEntry, customerName, projectId, isOpen]);

  const handleGenerateTemplate = () => {
    if (!delayEntry) return;

    const catMeta = getDelayCategoryMeta(delayEntry.type);
    const templateText = `Dear ${customerName},\n\nThis is an official schedule adjustment update for ${projectId.toUpperCase()}.\n\nStage Impacted: ${delayEntry.stageName} Stage\nCategory: ${catMeta.label}\nOriginal Estimate: ${delayEntry.fromDate}\nRevised Projected Completion: ${delayEntry.toDate}\n\nExplanation:\n${delayEntry.reason}\n\nThank you for your patience as we maintain safety and craftsmanship quality standards on site. Please contact us directly if you have any questions.`;

    setBody(templateText);
    toast.info("Template message text generated");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!subject.trim() || !body.trim()) {
      toast.error("Please provide both a subject line and message content");
      return;
    }

    const todayStr = new Date().toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
    const timeStr = new Date().toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });

    const newMessage: DelayMessage = {
      id: `msg-${Date.now()}`,
      projectId,
      delayId: delayEntry ? String(delayEntry.id) : undefined,
      recipientName: customerName,
      recipientEmail: customerEmail,
      stageName: delayEntry?.stageName || "General",
      subject: subject.trim(),
      body: body.trim(),
      sentAt: `${todayStr} at ${timeStr}`,
      status: "delivered",
    };

    onSendMessage(newMessage);
    toast.success(`Delay notice dispatched to ${customerName}`);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg bg-palladian border-blue-fantastic/20 text-blue-fantastic font-sans rounded-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="space-y-1">
          <div className="flex items-center gap-2 text-blue-fantastic font-bold font-cream">
            <Send className="h-5 w-5 text-truffle-trouble" />
            <DialogTitle className="text-lg font-black font-cream text-blue-fantastic">
              Send Delay Notice to Customer
            </DialogTitle>
          </div>
          <DialogDescription className="text-xs text-blue-fantastic/70">
            Compose and dispatch an official notification email/message regarding schedule adjustments directly to the client.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          {/* Recipient Details */}
          <div className="p-3 bg-blue-fantastic/5 border border-blue-fantastic/10 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 rounded-full bg-burning-flame text-blue-fantastic flex items-center justify-center font-bold text-xs">
                <User className="h-4 w-4" />
              </div>
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-blue-fantastic block">{customerName}</span>
                <span className="text-[11px] text-blue-fantastic/60 block">{customerEmail}</span>
              </div>
            </div>
            <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-truffle-trouble/10 text-truffle-trouble border border-truffle-trouble/20">
              {projectId.toUpperCase()}
            </span>
          </div>

          {/* Linked Delay Context Header (if triggered from delay card) */}
          {delayEntry && (
            <div className="p-3 bg-palladian border border-blue-fantastic/15 rounded-xl space-y-1">
              <div className="flex items-center justify-between text-[11px] font-extrabold uppercase text-truffle-trouble">
                <span>{delayEntry.stageName} STAGE DELAY</span>
                <div className="flex items-center gap-1 text-[11px] text-blue-fantastic">
                  <span className="line-through opacity-60">{delayEntry.fromDate}</span>
                  <ArrowRight className="h-3 w-3 text-truffle-trouble" />
                  <span className="text-truffle-trouble font-black">{delayEntry.toDate}</span>
                </div>
              </div>
              <h5 className="text-xs font-extrabold text-blue-fantastic">{delayEntry.title}</h5>
            </div>
          )}

          {/* Subject Line */}
          <div className="space-y-1.5">
            <Label className="text-xs font-bold text-blue-fantastic">Notification Subject</Label>
            <Input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="bg-palladian border-blue-fantastic/20 text-xs font-semibold text-blue-fantastic h-9 rounded-xl"
            />
          </div>

          {/* Message Body + Template Button */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-bold text-blue-fantastic">Message Body</Label>
              {delayEntry && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleGenerateTemplate}
                  className="h-6 text-[10px] font-bold text-truffle-trouble hover:bg-truffle-trouble/10 gap-1 px-2 rounded-lg"
                >
                  <Sparkles className="h-3 w-3" />
                  <span>Insert Formal Template</span>
                </Button>
              )}
            </div>

            <Textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={6}
              className="bg-palladian border-blue-fantastic/20 text-xs text-blue-fantastic rounded-xl resize-none leading-relaxed"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="bg-palladian border-blue-fantastic/20 text-blue-fantastic font-bold text-xs rounded-xl h-9"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-blue-fantastic hover:bg-blue-fantastic/90 text-palladian font-bold font-cream text-xs rounded-xl h-9 px-4 shadow-sm gap-1.5"
            >
              <Send className="h-3.5 w-3.5" />
              <span>Dispatch Notice</span>
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
