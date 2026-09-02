"use client";

import React, { useState } from "react";
import { Flag, X, CheckCircle, AlertTriangle, Send } from "lucide-react";
import { toast } from "sonner";

interface Props {
  entityName?: string;
}

export function ReportIssueModal({ entityName }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [category, setCategory] = useState("Wrong Statistic / Meta");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) {
      toast.error("Please provide details regarding the issue.");
      return;
    }

    setIsSubmitting(true);
    try {
      const reports = JSON.parse(localStorage.getItem("vlopedia_user_reports") || "[]");
      reports.push({
        entityName: entityName || "General Page",
        url: typeof window !== "undefined" ? window.location.href : "",
        category,
        description: description.trim(),
        timestamp: new Date().toISOString(),
      });
      localStorage.setItem("vlopedia_user_reports", JSON.stringify(reports));
      toast.success("Thank you! Your correction report has been submitted to VloPedia editorial desk.");
      setDescription("");
      setIsOpen(false);
    } catch (err) {
      toast.error("Failed to save report.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase text-muted hover:text-white transition-colors"
      >
        <Flag className="h-3 w-3 text-muted hover:text-primary" />
        <span>Report Issue / Suggest Correction</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-md border border-[rgba(236,232,225,0.15)] bg-[#0D1820] p-6 clip-diagonal shadow-2xl space-y-5 text-left">
            
            <div className="flex items-center justify-between border-b border-[rgba(236,232,225,0.08)] pb-3">
              <div className="flex items-center gap-2 text-primary font-mono text-xs uppercase font-bold">
                <AlertTriangle className="h-4 w-4" />
                <span>COMMUNITY EDITORIAL REPORT</span>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-muted hover:text-white transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <p className="font-sans text-xs text-secondary leading-relaxed">
              Found outdated patch data, an inaccurate weapon spec, or a lore discrepancy on <strong className="text-white">{entityName || "this page"}</strong>? Let our editorial team know.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block font-mono text-[10px] uppercase text-muted mb-1.5">Issue Type</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-[#08111A] border border-[rgba(236,232,225,0.15)] px-3 py-2 font-sans text-xs text-white focus:border-primary focus:outline-none"
                >
                  <option value="Wrong Statistic / Meta">Wrong Statistic / Meta Tier</option>
                  <option value="Outdated Patch Balance">Outdated Patch Balance</option>
                  <option value="Lore Discrepancy">Lore / Canon Discrepancy</option>
                  <option value="Broken Link or Asset">Broken Link or Missing Image</option>
                  <option value="Typo / Editorial Correction">Typo / Editorial Correction</option>
                </select>
              </div>

              <div>
                <label className="block font-mono text-[10px] uppercase text-muted mb-1.5">Description & Source Reference</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Explain the error (e.g. 'In Patch 9.04, this ability cost increased to 250 VP')..."
                  className="w-full bg-[#08111A] border border-[rgba(236,232,225,0.15)] p-3 font-sans text-xs text-white placeholder:text-muted focus:border-primary focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2 border-t border-[rgba(236,232,225,0.06)]">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="font-mono text-xs uppercase px-3 py-2 text-muted hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="font-mono text-xs uppercase font-bold px-4 py-2 bg-primary text-black hover:bg-primary-hover transition-colors flex items-center gap-1.5"
                >
                  <Send className="h-3.5 w-3.5" />
                  <span>Submit Report</span>
                </button>
              </div>
            </form>

          </div>
        </div>
      )}
    </>
  );
}
