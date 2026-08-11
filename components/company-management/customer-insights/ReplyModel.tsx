"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { CustomerQuery } from "./QuestionsFed";

interface ReplyModalProps {
  query: CustomerQuery | null;
  isOpen: boolean;
  onClose: () => void;
  onSend: (questionId: string, replyText: string) => void;
}

export default function ReplyModal({
  query,
  isOpen,
  onClose,
  onSend,
}: ReplyModalProps) {
  const [replyText, setReplyText] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    setReplyText("");
    setError("");
  }, [query, isOpen]);

  const handleSend = () => {
    if (!replyText.trim()) {
      setError("Reply text cannot be empty");
      return;
    }
    if (query) {
      onSend(query.questionId, replyText.trim());
    }
  };

  if (!query) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md bg-palladian text-blue-fantastic font-cream border border-blue-fantastic/20 max-h-[90vh] overflow-y-auto rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold font-cream text-blue-fantastic border-b border-blue-fantastic/5 pb-2">
            Respond to {query.customerName}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-3">
          {/* Original Question */}
          <div className="space-y-1 bg-blue-fantastic/4 p-3.5 rounded-xl border border-blue-fantastic/5">
            <p className="text-[10px] font-bold text-blue-fantastic/50 uppercase tracking-wider">
              Original Inquiry
            </p>
            <p className="text-xs font-bold text-blue-fantastic/80 leading-relaxed mt-1">
              "{query.questionText}"
            </p>
          </div>

          {/* Reply Input */}
          <div className="space-y-1.5">
            <Label htmlFor="reply" className="text-xs font-bold text-blue-fantastic/70">
              Your Response
            </Label>
            <Textarea
              id="reply"
              placeholder="Type your response here..."
              value={replyText}
              onChange={(e) => {
                setReplyText(e.target.value);
                setError("");
              }}
              className={`bg-palladian border-blue-fantastic/15 min-h-[120px] focus-visible:ring-truffle-trouble rounded-xl ${
                error ? "border-red-500" : ""
              }`}
            />
            {error && <p className="text-[10px] text-red-500 font-bold">{error}</p>}
          </div>
        </div>

        <div className="flex justify-end gap-2 border-t border-blue-fantastic/10 pt-3.5 mt-2">
          <Button
            variant="outline"
            onClick={onClose}
            className="text-xs font-bold border-blue-fantastic/20 text-blue-fantastic hover:bg-blue-fantastic/10 h-9 rounded-xl px-4 cursor-pointer"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSend}
            className="bg-truffle-trouble text-palladian hover:bg-truffle-trouble/85 text-xs font-bold h-9 rounded-xl px-5 cursor-pointer"
          >
            Send Response
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
