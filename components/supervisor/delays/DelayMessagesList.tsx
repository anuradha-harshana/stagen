"use client";

import React from "react";
import { DelayMessage } from "./DelayStore";
import { cn } from "@/lib/utils";
import { Mail, CheckCheck, Check, Clock, User, ArrowUpRight } from "lucide-react";

interface DelayMessagesListProps {
  messages: DelayMessage[];
}

export function DelayMessagesList({ messages }: DelayMessagesListProps) {
  if (!messages || messages.length === 0) {
    return (
      <div className="bg-palladian border border-blue-fantastic/10 rounded-2xl p-8 text-center space-y-2">
        <Mail className="h-8 w-8 text-blue-fantastic/30 mx-auto" />
        <h4 className="text-sm font-extrabold text-blue-fantastic font-sans">
          No Customer Delay Notices Sent
        </h4>
        <p className="text-xs text-blue-fantastic/60 font-sans max-w-sm mx-auto">
          No formal schedule adjustment notifications have been sent for this project yet. Use the "Send Notice" action on any delay log entry to inform the client.
        </p>
      </div>
    );
  }

  const getStatusBadge = (status: DelayMessage["status"]) => {
    switch (status) {
      case "read":
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-700 border border-emerald-500/20">
            <CheckCheck className="h-3 w-3" /> Read by Client
          </span>
        );
      case "delivered":
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-blue-fantastic/10 text-blue-fantastic border border-blue-fantastic/20">
            <Check className="h-3 w-3" /> Delivered
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-700 border border-amber-500/20">
            <Clock className="h-3 w-3" /> Sent
          </span>
        );
    }
  };

  return (
    <div className="space-y-3 font-sans">
      {messages.map((msg) => (
        <div
          key={msg.id}
          className="bg-palladian border border-blue-fantastic/10 rounded-2xl p-4 md:p-5 shadow-xs space-y-3 hover:border-blue-fantastic/20 transition-all"
        >
          {/* Header row */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-blue-fantastic/5 pb-3">
            <div className="flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-xl bg-blue-fantastic/10 text-blue-fantastic flex items-center justify-center font-bold text-xs shrink-0">
                <User className="h-4.5 w-4.5" />
              </div>
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-extrabold text-blue-fantastic">{msg.recipientName}</h4>
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-truffle-trouble/10 text-truffle-trouble border border-truffle-trouble/15">
                    {msg.stageName} Stage
                  </span>
                </div>
                <span className="text-[11px] text-blue-fantastic/60 font-sans block">{msg.recipientEmail}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs text-blue-fantastic/50 font-sans">{msg.sentAt}</span>
              {getStatusBadge(msg.status)}
            </div>
          </div>

          {/* Subject & Body */}
          <div className="space-y-1.5 pt-1">
            <h5 className="text-sm font-extrabold text-blue-fantastic flex items-center gap-1.5">
              <span>{msg.subject}</span>
            </h5>
            <p className="text-xs text-blue-fantastic/75 leading-relaxed font-sans whitespace-pre-line bg-blue-fantastic/[0.02] p-3 rounded-xl border border-blue-fantastic/5">
              {msg.body}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
