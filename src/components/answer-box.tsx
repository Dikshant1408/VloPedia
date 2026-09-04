"use client";

import React, { useState } from "react";
import { HelpCircle, Sparkles, CheckCircle, ArrowRight, ThumbsUp, ThumbsDown } from "lucide-react";
import Link from "next/link";
import { logSearchFeedback } from "@/lib/search-analytics";
import { toast } from "sonner";

interface AnswerBoxProps {
  question: string;
  verdict: string;
  explanation: string;
  keyTakeaways?: string[];
  ctaLabel?: string;
  ctaHref?: string;
}

export function AnswerBox({
  question,
  verdict,
  explanation,
  keyTakeaways,
  ctaLabel,
  ctaHref,
}: AnswerBoxProps) {
  const [feedbackGiven, setFeedbackGiven] = useState<boolean | null>(null);

  const handleFeedback = (helpful: boolean) => {
    setFeedbackGiven(helpful);
    logSearchFeedback(question, helpful);
    toast.success(helpful ? "Thanks for your feedback! (Marked helpful)" : "Feedback recorded! We'll refine this answer.");
  };

  return (
    <div className="border border-primary/30 bg-gradient-to-r from-primary/10 via-[#0D1A22] to-[#0D1A22] p-6 clip-diagonal space-y-4 shadow-lg">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2 text-primary">
          <HelpCircle className="h-4 w-4" />
          <span className="font-mono text-[10px] font-bold uppercase tracking-widest">
            VALORANT QUICK ANSWER
          </span>
        </div>
        <span className="font-mono text-[9px] uppercase px-2 py-0.5 border border-primary/30 bg-primary/20 text-primary font-bold">
          {verdict}
        </span>
      </div>

      <div className="space-y-2">
        <h3 className="font-display font-black text-lg sm:text-xl uppercase text-white tracking-wide">
          {question}
        </h3>
        <p className="font-sans text-xs sm:text-sm text-secondary leading-relaxed">
          {explanation}
        </p>
      </div>

      {keyTakeaways && keyTakeaways.length > 0 && (
        <div className="grid gap-2 sm:grid-cols-2 pt-2 border-t border-[rgba(236,232,225,0.06)]">
          {keyTakeaways.map((takeaway, idx) => (
            <div key={idx} className="flex items-start gap-2 text-xs font-mono text-muted">
              <CheckCircle className="h-3.5 w-3.5 text-[#0DF2F2] shrink-0 mt-0.5" />
              <span>{takeaway}</span>
            </div>
          ))}
        </div>
      )}

      {/* Footer: Feedback Satisfaction & CTA Link */}
      <div className="pt-3 border-t border-[rgba(236,232,225,0.06)] flex items-center justify-between flex-wrap gap-3 font-mono text-xs">
        {/* Feedback Section */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] text-muted uppercase">Did this answer help?</span>
          {feedbackGiven !== null ? (
            <span className="text-[10px] text-[#0DF2F2] font-bold">✓ Feedback recorded</span>
          ) : (
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => handleFeedback(true)}
                className="p-1 px-2 border border-[rgba(236,232,225,0.1)] hover:border-primary/50 hover:bg-primary/10 text-muted hover:text-white transition-colors flex items-center gap-1 text-[10px]"
                title="Helpful"
              >
                <ThumbsUp className="h-3 w-3" />
                <span>Yes</span>
              </button>
              <button
                type="button"
                onClick={() => handleFeedback(false)}
                className="p-1 px-2 border border-[rgba(236,232,225,0.1)] hover:border-error/50 hover:bg-error/10 text-muted hover:text-white transition-colors flex items-center gap-1 text-[10px]"
                title="Not helpful"
              >
                <ThumbsDown className="h-3 w-3" />
                <span>No</span>
              </button>
            </div>
          )}
        </div>

        {ctaLabel && ctaHref && (
          <Link
            href={ctaHref}
            className="inline-flex items-center gap-1.5 font-mono text-[10px] font-bold uppercase text-primary hover:text-primary-hover transition-colors"
          >
            <span>{ctaLabel}</span>
            <ArrowRight className="h-3 w-3" />
          </Link>
        )}
      </div>
    </div>
  );
}
