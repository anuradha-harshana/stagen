"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FAQArticle } from "./faq-list";

interface FAQFormModalProps {
  article: FAQArticle | null;
  categories: string[];
  isOpen: boolean;
  onClose: () => void;
  onSave: (article: FAQArticle) => void;
}

export default function FAQFormModal({
  article,
  categories,
  isOpen,
  onClose,
  onSave,
}: FAQFormModalProps) {
  const isEdit = !!article;

  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [category, setCategory] = useState("");
  const [customCategory, setCustomCategory] = useState("");
  const [isCustomCat, setIsCustomCat] = useState(false);

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (article) {
      setQuestion(article.question);
      setAnswer(article.answer);
      setCategory(article.category);
      setIsCustomCat(false);
      setCustomCategory("");
    } else {
      setQuestion("");
      setAnswer("");
      setCategory(categories[0] || "General");
      setIsCustomCat(false);
      setCustomCategory("");
    }
    setErrors({});
  }, [article, isOpen, categories]);

  const handleCategorySelect = (val: string) => {
    if (val === "NEW_CATEGORY") {
      setIsCustomCat(true);
      setCategory("");
    } else {
      setIsCustomCat(false);
      setCategory(val);
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!question.trim()) newErrors.question = "Question is required";
    if (!answer.trim()) newErrors.answer = "Answer is required";
    
    const finalCategory = isCustomCat ? customCategory.trim() : category;
    if (!finalCategory) newErrors.category = "Category selection is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;

    const finalCategory = isCustomCat ? customCategory.trim() : category;

    onSave({
      id: article?.id || `faq-${Date.now()}`,
      category: finalCategory,
      question: question.trim(),
      answer: answer.trim(),
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md bg-palladian text-blue-fantastic font-sans border border-blue-fantastic/20 max-h-[90vh] overflow-y-auto rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold font-sans text-blue-fantastic border-b border-blue-fantastic/5 pb-2">
            {isEdit ? "Edit FAQ Article" : "Create New FAQ Article"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-3">
          {/* Category Selection */}
          <div className="space-y-1">
            <Label className="text-xs font-bold text-blue-fantastic/70">Category</Label>
            {!isCustomCat ? (
              <Select value={category} onValueChange={handleCategorySelect}>
                <SelectTrigger className="bg-palladian border-blue-fantastic/15 text-blue-fantastic h-9 text-sm focus:ring-truffle-trouble">
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent className="bg-palladian text-blue-fantastic border-blue-fantastic/10">
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat} className="text-xs font-bold font-sans">
                      {cat}
                    </SelectItem>
                  ))}
                  <SelectItem value="NEW_CATEGORY" className="text-xs font-bold font-sans text-truffle-trouble">
                    + Add New Category
                  </SelectItem>
                </SelectContent>
              </Select>
            ) : (
              <div className="flex gap-2">
                <Input
                  placeholder="Enter new category name..."
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value)}
                  className="bg-palladian border-blue-fantastic/15 text-blue-fantastic h-9 focus-visible:ring-truffle-trouble flex-1"
                />
                <Button
                  variant="outline"
                  onClick={() => setIsCustomCat(false)}
                  className="h-9 border-blue-fantastic/25 text-blue-fantastic hover:bg-blue-fantastic/10 text-xs font-semibold px-2.5"
                >
                  Cancel
                </Button>
              </div>
            )}
            {errors.category && <p className="text-[10px] text-red-500 font-bold">{errors.category}</p>}
          </div>

          {/* Question Text */}
          <div className="space-y-1">
            <Label htmlFor="question" className="text-xs font-bold text-blue-fantastic/70">
              Question
            </Label>
            <Input
              id="question"
              placeholder="e.g. Can we arrange a site walkthrough?"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className={`bg-palladian border-blue-fantastic/15 text-blue-fantastic h-9 focus-visible:ring-truffle-trouble ${
                errors.question ? "border-red-500" : ""
              }`}
            />
            {errors.question && <p className="text-[10px] text-red-500 font-bold">{errors.question}</p>}
          </div>

          {/* Answer Text */}
          <div className="space-y-1">
            <Label htmlFor="answer" className="text-xs font-bold text-blue-fantastic/70">
              Answer
            </Label>
            <Textarea
              id="answer"
              placeholder="Provide a detailed, helpful answer..."
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              className={`bg-palladian border-blue-fantastic/15 text-blue-fantastic min-h-[120px] focus-visible:ring-truffle-trouble rounded-xl ${
                errors.answer ? "border-red-500" : ""
              }`}
            />
            {errors.answer && <p className="text-[10px] text-red-500 font-bold">{errors.answer}</p>}
          </div>
        </div>

        <div className="flex justify-end gap-2 border-t border-blue-fantastic/10 pt-3.5 mt-2">
          <Button
            variant="outline"
            onClick={onClose}
            className="text-xs font-bold border-blue-fantastic/20 text-blue-fantastic hover:bg-blue-fantastic/10 h-9 rounded-xl px-4"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            className="bg-truffle-trouble text-palladian hover:bg-truffle-trouble/85 text-xs font-bold h-9 rounded-xl px-5"
          >
            {isEdit ? "Save Changes" : "Create Article"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
