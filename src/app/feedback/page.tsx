"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuth } from "@/components/auth-provider";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { 
  Bug, 
  Sparkles, 
  AlertTriangle, 
  FileText, 
  CheckCircle2, 
  Loader2, 
  ArrowRight, 
  User, 
  Mail, 
  ShieldAlert, 
  Radio, 
  Terminal,
  ChevronRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const feedbackSchema = z.object({
  title: z.string()
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title must not exceed 100 characters"),
  type: z.enum(["bug", "visual", "data", "feature", "other"]),
  category: z.enum(["general", "agents", "weapons", "maps", "tracker", "admin", "other"]),
  severity: z.enum(["low", "medium", "high"]),
  message: z.string()
    .min(10, "Details must be at least 10 characters")
    .max(2000, "Details must not exceed 2000 characters"),
  displayName: z.string()
    .min(1, "Name is required")
    .max(100, "Name must not exceed 100 characters"),
  email: z.string()
    .email("Please enter a valid email address")
    .max(320, "Email must not exceed 320 characters"),
});

type FeedbackFormValues = z.infer<typeof feedbackSchema>;

export default function FeedbackPage() {
  const { user, loading: authLoading } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [succeeded, setSucceeded] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  
  // Terminal logs state for aesthetic uplink panel
  const [terminalLogs, setTerminalLogs] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors }
  } = useForm<FeedbackFormValues>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: {
      title: "",
      type: "bug",
      category: "general",
      severity: "medium",
      message: "",
      displayName: "",
      email: "",
    }
  });

  // Pre-fill user contact info if authenticated
  useEffect(() => {
    if (user) {
      setValue("displayName", user.displayName || "");
      setValue("email", user.email || "");
    }
  }, [user, setValue]);

  // Handle telemetry log flow on component mount
  useEffect(() => {
    const logs = [
      `[SYS] SECURE UPLINK CORE INITIALIZED`,
      `[CONN] DISPATCH TARGET: https://formspree.io/f/xppaddry`,
      user 
        ? `[AUTH] USER PROFILE IDENTIFIED: ${user.uid.slice(0, 8)}...` 
        : `[AUTH] ANONYMOUS VISITOR PROTOCOL ENGAGED`,
      `[SYS] STANDING BY FOR USER TELEMETRY LOGS...`
    ];

    let currentLogIndex = 0;
    const interval = setInterval(() => {
      if (currentLogIndex < logs.length) {
        setTerminalLogs(prev => [...prev, logs[currentLogIndex]]);
        currentLogIndex++;
      } else {
        clearInterval(interval);
      }
    }, 400);

    return () => clearInterval(interval);
  }, [user]);

  const onSubmit = async (values: FeedbackFormValues) => {
    setSubmitting(false);
    setSubmitting(true);
    setSubmitError(null);
    
    // Add pending log entries
    setTerminalLogs(prev => [
      ...prev, 
      `[UPLOAD] PACKING SUBMISSION DATA...`,
      `[CONN] INITIATING SECURE POST TRANSMISSION...`
    ]);

    try {
      const response = await fetch("https://formspree.io/f/xppaddry", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          ...values,
          userId: user?.uid || "anonymous",
          submittedAt: new Date().toISOString()
        })
      });

      if (response.ok) {
        setSucceeded(true);
        setTerminalLogs(prev => [
          ...prev,
          `[SUCCESS] TRANSMISSION COMPLETE (200 OK)`,
          `[SYS] SECURE UPLINK ESTABLISHED AND RESOLVED`
        ]);
        toast.success("Feedback transmission successful!", { className: "font-mono rounded-none" });
        reset();
        // If logged in, restore name/email fields
        if (user) {
          setValue("displayName", user.displayName || "");
          setValue("email", user.email || "");
        }
      } else {
        const data = await response.json();
        const errorMsg = data.errors 
          ? data.errors.map((e: any) => e.message).join(", ") 
          : "Submission failed.";
        throw new Error(errorMsg);
      }
    } catch (err: any) {
      console.error("Feedback submission error:", err);
      const msg = err.message || "Uplink failure. Please verify connection and try again.";
      setSubmitError(msg);
      setTerminalLogs(prev => [
        ...prev,
        `[FATAL] UPLINK ERROR: ${msg.toUpperCase()}`
      ]);
      toast.error("Transmission failed. Please check inputs.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B141A] py-16 px-4 sm:px-6 lg:px-8 font-sans text-foreground">
      <div className="mx-auto max-w-6xl space-y-10">
        
        {/* Banner header */}
        <div className="border border-primary/20 bg-surface p-8 relative space-y-2">
          <div className="absolute left-0 top-0 h-[2px] w-16 bg-primary" />
          <span className="text-[10px] text-primary font-black tracking-widest block font-mono">
            {"// SECURE FEEDBACK TERMINAL //"}
          </span>
          <h1 className="text-3xl sm:text-4xl font-display font-black text-white uppercase tracking-wider">
            REPORT ISSUES & BUG LOGGING
          </h1>
          <p className="text-xs text-muted uppercase tracking-wide font-mono">
            Direct secure transmission of visual errors, client bugs, or system feedback.
          </p>
        </div>

        {/* Form / Uplink Layout */}
        <div className="grid gap-8 lg:grid-cols-[1.2fr_1.8fr]">
          
          {/* Telemetry Information Column */}
          <div className="space-y-6">
            
            {/* Session status card */}
            <div className="border border-border bg-surface p-6 space-y-6">
              <span className="text-[10px] text-[#0DF2F2] font-bold block border-b border-border pb-2 tracking-widest font-mono">
                {"// CLIENT TELEMETRY STATUS"}
              </span>

              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted font-mono uppercase">TRANSMISSION LINK:</span>
                  <span className="font-mono text-[#0DF2F2] font-black uppercase flex items-center gap-1.5">
                    <Radio className="h-3 w-3 animate-pulse text-[#0DF2F2]" /> SECURE
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted font-mono uppercase">AUTHORIZATION:</span>
                  <span className="font-mono font-bold text-white uppercase">
                    {authLoading ? "FETCHING..." : user ? "USER VERIFIED" : "ANONYMOUS"}
                  </span>
                </div>

                {user && (
                  <div className="border border-border/40 bg-black/40 p-3 space-y-1.5">
                    <span className="text-[9px] text-muted font-mono block">{"// USER PAYLOAD IDENT"}</span>
                    <div className="text-[11px] font-mono text-white truncate">
                      UID: <span className="text-primary font-bold">{user.uid}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Aesthetic console display */}
            <div className="border border-border bg-surface p-6 flex flex-col justify-between h-64 relative">
              <div className="absolute top-2 right-4 flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-primary animate-ping" />
                <span className="text-[8px] text-muted font-mono uppercase">UPLINK ACTIVE</span>
              </div>
              
              <div className="flex items-center gap-1.5 border-b border-border pb-2 mb-3">
                <Terminal className="h-4 w-4 text-primary" />
                <span className="text-[10px] text-primary font-black tracking-widest font-mono">
                  {"// SECURE UPLINK TELEMETRY MONITOR"}
                </span>
              </div>

              <div className="bg-black/60 border border-border/80 p-4 font-mono text-[10px] text-success flex-1 overflow-y-auto leading-relaxed space-y-1 scrollbar-thin select-text">
                {terminalLogs.map((log, i) => (
                  <div key={i} className="whitespace-pre-wrap flex items-start gap-1">
                    <span className="text-[#0DF2F2]/60 select-none">&gt;</span>
                    <span>{log}</span>
                  </div>
                ))}
                {submitting && (
                  <div className="text-[#0DF2F2] flex items-center gap-1.5 font-bold animate-pulse mt-2">
                    <Loader2 className="h-3 w-3 animate-spin" /> UPLOADING PACKETS...
                  </div>
                )}
              </div>
            </div>

            {/* Bug report instructions */}
            <div className="border border-border bg-surface p-6 space-y-3">
              <span className="text-[10px] text-foreground font-black block border-b border-border pb-2 tracking-widest font-mono">
                {"// LOGGING SPECIFICATION GUIDE"}
              </span>
              <ul className="space-y-2 text-xs font-mono text-muted uppercase">
                <li className="flex items-start gap-2">
                  <ChevronRight className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                  <span>Specify the module or component where the issue occurred (e.g. Agent list, collection page)</span>
                </li>
                <li className="flex items-start gap-2">
                  <ChevronRight className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                  <span>Provide clear reproduction steps and error logs where possible</span>
                </li>
                <li className="flex items-start gap-2">
                  <ChevronRight className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
                  <span>Assign a realistic severity tier to help resolve critical breaks faster</span>
                </li>
              </ul>
            </div>

          </div>

          {/* Form / Success Screen Column */}
          <div className="relative">
            <AnimatePresence mode="wait">
              {!succeeded ? (
                <motion.div
                  key="form-container"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                >
                  <Card className="border border-border bg-surface p-6 space-y-6">
                    <div className="border-b border-border pb-3">
                      <span className="text-xs text-primary font-black tracking-widest block font-mono">
                        {"// INITIALIZE PACKET DATA"}
                      </span>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                      
                      {/* Identity Row (Pre-filled if logged in) */}
                      <div className="grid gap-4 sm:grid-cols-2">
                        {/* Name Field */}
                        <div className="space-y-1.5">
                          <label className="block text-[10px] font-bold text-muted uppercase tracking-widest font-mono">
                            Name / Display ID
                          </label>
                          <div className="relative flex items-center">
                            <span className="absolute left-3 text-muted">
                              <User className="h-4 w-4" />
                            </span>
                            <input
                              type="text"
                              disabled={submitting}
                              {...register("displayName")}
                              className={`w-full bg-black/40 border ${errors.displayName ? "border-primary" : "border-border"} hover:border-border-light focus:border-[#0DF2F2] disabled:opacity-50 pl-10 pr-4 py-2.5 text-xs text-foreground focus:outline-none transition-colors font-mono`}
                              placeholder="e.g. Phoenix#NA1"
                            />
                          </div>
                          {errors.displayName && (
                            <span className="text-[10px] text-primary font-mono block">
                              {errors.displayName.message}
                            </span>
                          )}
                        </div>

                        {/* Email Field */}
                        <div className="space-y-1.5">
                          <label className="block text-[10px] font-bold text-muted uppercase tracking-widest font-mono">
                            Secure Contact Email
                          </label>
                          <div className="relative flex items-center">
                            <span className="absolute left-3 text-muted">
                              <Mail className="h-4 w-4" />
                            </span>
                            <input
                              type="email"
                              disabled={submitting}
                              {...register("email")}
                              className={`w-full bg-black/40 border ${errors.email ? "border-primary" : "border-border"} hover:border-border-light focus:border-[#0DF2F2] disabled:opacity-50 pl-10 pr-4 py-2.5 text-xs text-foreground focus:outline-none transition-colors font-mono`}
                              placeholder="agent@valovault.com"
                            />
                          </div>
                          {errors.email && (
                            <span className="text-[10px] text-primary font-mono block">
                              {errors.email.message}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Dropdowns Row (Type, Severity, Category) */}
                      <div className="grid gap-4 sm:grid-cols-3">
                        {/* Type Dropdown */}
                        <div className="space-y-1.5">
                          <label className="block text-[10px] font-bold text-muted uppercase tracking-widest font-mono">
                            Issue Type
                          </label>
                          <select
                            disabled={submitting}
                            {...register("type")}
                            className="w-full bg-black/40 border border-border hover:border-border-light focus:border-[#0DF2F2] text-xs text-foreground focus:outline-none px-3 py-2.5 font-mono uppercase tracking-wider transition-colors"
                          >
                            <option value="bug">Bug / Error</option>
                            <option value="visual">Visual Glitch</option>
                            <option value="data">Data Issue</option>
                            <option value="feature">Feature Idea</option>
                            <option value="other">Other</option>
                          </select>
                          {errors.type && (
                            <span className="text-[10px] text-primary font-mono block">
                              {errors.type.message}
                            </span>
                          )}
                        </div>

                        {/* Severity Dropdown */}
                        <div className="space-y-1.5">
                          <label className="block text-[10px] font-bold text-muted uppercase tracking-widest font-mono">
                            Severity Level
                          </label>
                          <select
                            disabled={submitting}
                            {...register("severity")}
                            className="w-full bg-black/40 border border-border hover:border-border-light focus:border-[#0DF2F2] text-xs text-foreground focus:outline-none px-3 py-2.5 font-mono uppercase tracking-wider transition-colors"
                          >
                            <option value="low">Low (Minor Glitch)</option>
                            <option value="medium">Medium (Impaired)</option>
                            <option value="high">High (Blocked / Crash)</option>
                          </select>
                          {errors.severity && (
                            <span className="text-[10px] text-primary font-mono block">
                              {errors.severity.message}
                            </span>
                          )}
                        </div>

                        {/* Category Dropdown */}
                        <div className="space-y-1.5">
                          <label className="block text-[10px] font-bold text-muted uppercase tracking-widest font-mono">
                            Category Scope
                          </label>
                          <select
                            disabled={submitting}
                            {...register("category")}
                            className="w-full bg-black/40 border border-border hover:border-border-light focus:border-[#0DF2F2] text-xs text-foreground focus:outline-none px-3 py-2.5 font-mono uppercase tracking-wider transition-colors"
                          >
                            <option value="general">General</option>
                            <option value="agents">Agents</option>
                            <option value="weapons">Weapons</option>
                            <option value="maps">Maps</option>
                            <option value="tracker">Tracker</option>
                            <option value="admin">Admin Ingestion</option>
                            <option value="other">Other</option>
                          </select>
                          {errors.category && (
                            <span className="text-[10px] text-primary font-mono block">
                              {errors.category.message}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Title Field */}
                      <div className="space-y-1.5">
                        <label className="block text-[10px] font-bold text-muted uppercase tracking-widest font-mono">
                          Brief Summary Title
                        </label>
                        <input
                          type="text"
                          disabled={submitting}
                          {...register("title")}
                          className={`w-full bg-black/40 border ${errors.title ? "border-primary" : "border-border"} hover:border-border-light focus:border-[#0DF2F2] disabled:opacity-50 px-4 py-2.5 text-xs text-foreground focus:outline-none transition-colors font-mono`}
                          placeholder="e.g. Agent details page crashes on mobile device"
                        />
                        {errors.title && (
                          <span className="text-[10px] text-primary font-mono block">
                            {errors.title.message}
                          </span>
                        )}
                      </div>

                      {/* Detailed Description Field */}
                      <div className="space-y-1.5">
                        <label className="block text-[10px] font-bold text-muted uppercase tracking-widest font-mono">
                          Detailed Description / Message
                        </label>
                        <textarea
                          disabled={submitting}
                          rows={6}
                          {...register("message")}
                          className={`w-full bg-black/40 border ${errors.message ? "border-primary" : "border-border"} hover:border-border-light focus:border-[#0DF2F2] disabled:opacity-50 px-4 py-3 text-xs text-foreground focus:outline-none transition-colors font-mono resize-none`}
                          placeholder="Please provide steps to reproduce, device configuration, or error screenshots/messages..."
                        />
                        {errors.message && (
                          <span className="text-[10px] text-primary font-mono block">
                            {errors.message.message}
                          </span>
                        )}
                      </div>

                      {/* Submit Error banner */}
                      {submitError && (
                        <div className="border border-primary/30 bg-primary/5 p-4 flex gap-3 text-xs font-mono uppercase text-primary items-start">
                          <ShieldAlert className="h-5 w-5 shrink-0 mt-0.5" />
                          <div>
                            <span className="font-bold block">Transmission Uplink Failure</span>
                            <span className="text-[10px] text-primary leading-tight">{submitError}</span>
                          </div>
                        </div>
                      )}

                      {/* Action buttons */}
                      <div className="border-t border-border pt-4 flex items-center justify-end gap-3">
                        <Button
                          variant="secondary"
                          type="button"
                          onClick={() => reset()}
                          disabled={submitting}
                        >
                          Clear Form
                        </Button>
                        
                        <Button
                          variant="primary"
                          type="submit"
                          disabled={submitting}
                          className="h-10 px-6 flex items-center gap-2 cut-corner-br"
                        >
                          {submitting ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin" />
                              Transmitting...
                            </>
                          ) : (
                            <>
                              Transmit Packet
                              <ArrowRight className="h-4 w-4" />
                            </>
                          )}
                        </Button>
                      </div>

                    </form>
                  </Card>
                </motion.div>
              ) : (
                <motion.div
                  key="success-container"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.25 }}
                >
                  <div className="border border-success/30 bg-[#0F1C24]/80 p-8 space-y-6 text-center relative overflow-hidden">
                    <div className="absolute left-0 top-0 h-[2px] w-16 bg-success" />
                    
                    <div className="mx-auto h-12 w-12 border border-success/40 bg-success/5 flex items-center justify-center text-success animate-pulse">
                      <CheckCircle2 className="h-6 w-6" />
                    </div>

                    <div className="space-y-2">
                      <span className="text-[10px] text-success font-black tracking-widest block font-mono">
                        {"// TRANSMISSION RECEIVED //"}
                      </span>
                      <h2 className="text-2xl font-display font-black text-white uppercase tracking-wider">
                        SECURE UPLINK ESTABLISHED
                      </h2>
                      <p className="mx-auto max-w-md text-xs text-muted uppercase leading-relaxed font-mono">
                        Your telemetry payload was transmitted successfully. Diagnostic queue is tracking this issue.
                      </p>
                    </div>

                    <div className="border-t border-border pt-6 flex flex-wrap justify-center gap-3">
                      <Button 
                        variant="secondary" 
                        size="sm"
                        onClick={() => setSucceeded(false)}
                      >
                        Submit Another Packet
                      </Button>
                      
                      <Button 
                        variant="primary" 
                        size="sm"
                        className="cut-corner-br"
                        onClick={() => window.location.href = "/"}
                      >
                        Return to Deck
                      </Button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>

      </div>
    </div>
  );
}
