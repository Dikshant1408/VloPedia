"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Container } from "@/components/container";
import { PageTransition, Reveal } from "@/components/motion-system";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { 
  Mail, 
  MessageSquare, 
  Send, 
  Loader2, 
  CheckCircle2, 
  AlertTriangle,
  ExternalLink,
  Info
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Please enter a valid email address").max(320),
  subject: z.string().min(3, "Subject must be at least 3 characters").max(150),
  message: z.string().min(10, "Message must be at least 10 characters").max(2000),
});

type ContactFormValues = z.infer<typeof contactSchema>;

export default function ContactPage() {
  const [submitting, setSubmitting] = useState(false);
  const [succeeded, setSucceeded] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    }
  });

  const onSubmit = async (values: ContactFormValues) => {
    setSubmitting(true);
    setSubmitError(null);

    try {
      const response = await fetch("https://formspree.io/f/xppaddry", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          ...values,
          category: "contact_inquiry",
          submittedAt: new Date().toISOString()
        })
      });

      if (response.ok) {
        setSucceeded(true);
        toast.success("Message transmitted successfully!", { className: "font-mono rounded-none" });
        reset();
      } else {
        const data = await response.json();
        const errorMsg = data.errors 
          ? data.errors.map((e: any) => e.message).join(", ") 
          : "Transmission failed.";
        throw new Error(errorMsg);
      }
    } catch (err: any) {
      console.error("Contact form submission error:", err);
      setSubmitError(err.message || "Uplink failure. Please check connection and try again.");
      toast.error("Transmission failed.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-[#0B141A] text-foreground font-sans">
        {/* Tactical grid */}
        <div aria-hidden="true" className="pointer-events-none fixed inset-0 bg-tactical-grid bg-tactical-dots opacity-20 z-0" />

        <div className="relative z-10 py-16">
          <Container className="max-w-5xl space-y-10">
            
            {/* Header banner */}
            <div className="border border-primary/20 bg-surface p-8 relative space-y-2 cut-corner-br">
              <div className="absolute left-0 top-0 h-[2px] w-16 bg-primary" />
              <span className="text-[10px] text-primary font-black tracking-widest block font-mono uppercase">
                {"// CONTACT CHANNELS //"}
              </span>
              <h1 className="text-3xl sm:text-4xl font-display font-black text-white uppercase tracking-wider">
                GET IN TOUCH
              </h1>
              <p className="text-xs text-muted uppercase tracking-wide font-mono">
                Direct inquiry portal for site help, feedback, and technical support.
              </p>
            </div>

            {/* Split layout */}
            <div className="grid gap-8 md:grid-cols-[300px_1fr]">
              
              {/* Info panel */}
              <div className="space-y-6">
                
                {/* Official Channels widget */}
                <div className="border border-border bg-[#0D1A22] p-6 space-y-4 cut-corner-br">
                  <span className="text-[10px] text-primary font-bold block border-b border-border pb-2 tracking-widest font-mono uppercase">
                    {"// COMMUNICATIONS"}
                  </span>
                  
                  <div className="space-y-4 font-mono text-xs">
                    <div className="space-y-1">
                      <span className="block text-muted text-[10px] uppercase">SUPPORT EMAIL:</span>
                      <a href="mailto:godrikt1408@gmail.com" className="text-[#0DF2F2] hover:underline font-bold break-all flex items-center gap-1">
                        <Mail className="h-3.5 w-3.5 shrink-0" /> godrikt1408@gmail.com
                      </a>
                    </div>

                    <div className="space-y-1">
                      <span className="block text-muted text-[10px] uppercase">RESPONSE WINDOW:</span>
                      <span className="text-white block font-bold">24-48 CHRONO-HOURS</span>
                    </div>

                    <div className="space-y-1">
                      <span className="block text-muted text-[10px] uppercase">LOCALE ORIGIN:</span>
                      <span className="text-white block font-bold">GLOBAL // FAN COMPASS</span>
                    </div>
                  </div>
                </div>

                {/* Bug logging redirect */}
                <div className="border border-border bg-[rgba(15,28,36,0.4)] p-6 space-y-3">
                  <span className="text-[9px] text-muted font-bold block border-b border-[rgba(236,232,225,0.06)] pb-2 tracking-widest font-mono uppercase">
                    {"// TACTICAL BUG LOGGING"}
                  </span>
                  <p className="font-sans text-[11px] text-muted leading-relaxed">
                    Have a detailed technical bug or game data error to report? Use our telemetry feedback deck.
                  </p>
                  <a 
                    href="/feedback" 
                    className="inline-flex items-center gap-1.5 font-mono text-[10px] font-black uppercase text-primary hover:text-white transition-colors"
                  >
                    FEEDBACK DECK <ExternalLink className="h-3 w-3" />
                  </a>
                </div>

              </div>

              {/* Form panel */}
              <div className="relative">
                <AnimatePresence mode="wait">
                  {!succeeded ? (
                    <motion.div
                      key="contact-form"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Card className="border border-border bg-surface p-6 space-y-6">
                        <div className="border-b border-border pb-3">
                          <span className="text-xs text-primary font-black tracking-widest block font-mono">
                            {"// UPLINK TRANSMISSION FORM"}
                          </span>
                        </div>

                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                          
                          {/* Name & Email */}
                          <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-1.5">
                              <label className="block text-[10px] font-bold text-muted uppercase tracking-widest font-mono">
                                Your Name
                              </label>
                              <input
                                type="text"
                                disabled={submitting}
                                {...register("name")}
                                className={`w-full bg-black/40 border ${errors.name ? "border-primary" : "border-border"} hover:border-border-light focus:border-[#0DF2F2] disabled:opacity-50 px-4 py-2.5 text-xs text-foreground focus:outline-none transition-colors font-mono`}
                                placeholder="Sage#123"
                              />
                              {errors.name && (
                                <span className="text-[10px] text-primary font-mono block">
                                  {errors.name.message}
                                </span>
                              )}
                            </div>

                            <div className="space-y-1.5">
                              <label className="block text-[10px] font-bold text-muted uppercase tracking-widest font-mono">
                                Contact Email
                              </label>
                              <input
                                type="email"
                                disabled={submitting}
                                {...register("email")}
                                className={`w-full bg-black/40 border ${errors.email ? "border-primary" : "border-border"} hover:border-border-light focus:border-[#0DF2F2] disabled:opacity-50 px-4 py-2.5 text-xs text-foreground focus:outline-none transition-colors font-mono`}
                                placeholder="agent@valovault.com"
                              />
                              {errors.email && (
                                <span className="text-[10px] text-primary font-mono block">
                                  {errors.email.message}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Subject */}
                          <div className="space-y-1.5">
                            <label className="block text-[10px] font-bold text-muted uppercase tracking-widest font-mono">
                              Subject
                            </label>
                            <input
                              type="text"
                              disabled={submitting}
                              {...register("subject")}
                              className={`w-full bg-black/40 border ${errors.subject ? "border-primary" : "border-border"} hover:border-border-light focus:border-[#0DF2F2] disabled:opacity-50 px-4 py-2.5 text-xs text-foreground focus:outline-none transition-colors font-mono`}
                              placeholder="Inquiry or partnership proposal"
                            />
                            {errors.subject && (
                              <span className="text-[10px] text-primary font-mono block">
                                {errors.subject.message}
                              </span>
                            )}
                          </div>

                          {/* Message */}
                          <div className="space-y-1.5">
                            <label className="block text-[10px] font-bold text-muted uppercase tracking-widest font-mono">
                              Message Details
                            </label>
                            <textarea
                              disabled={submitting}
                              rows={5}
                              {...register("message")}
                              className={`w-full bg-black/40 border ${errors.message ? "border-primary" : "border-border"} hover:border-border-light focus:border-[#0DF2F2] disabled:opacity-50 px-4 py-3 text-xs text-foreground focus:outline-none transition-colors font-mono resize-none`}
                              placeholder="Please write your detailed inquiry here..."
                            />
                            {errors.message && (
                              <span className="text-[10px] text-primary font-mono block">
                                {errors.message.message}
                              </span>
                            )}
                          </div>

                          {/* Error block */}
                          {submitError && (
                            <div className="border border-primary/30 bg-primary/5 p-4 flex gap-3 text-xs font-mono uppercase text-primary items-start">
                              <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5" />
                              <div>
                                <span className="font-bold block">Transmission Uplink Failure</span>
                                <span className="text-[10px] text-primary leading-tight">{submitError}</span>
                              </div>
                            </div>
                          )}

                          {/* Action row */}
                          <div className="border-t border-border pt-4 flex justify-end">
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
                                  Send Message <Send className="h-3.5 w-3.5" />
                                </>
                              )}
                            </Button>
                          </div>

                        </form>
                      </Card>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="contact-success"
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="border border-success/30 bg-[#0D1A22]/80 p-8 space-y-6 text-center relative overflow-hidden cut-corner-br">
                        <div className="absolute left-0 top-0 h-[2px] w-16 bg-success" />
                        
                        <div className="mx-auto h-12 w-12 border border-success/40 bg-success/5 flex items-center justify-center text-success animate-pulse">
                          <CheckCircle2 className="h-6 w-6" />
                        </div>

                        <div className="space-y-2">
                          <span className="text-[10px] text-success font-black tracking-widest block font-mono">
                            {"// UPLINK RECEIVED //"}
                          </span>
                          <h2 className="text-2xl font-display font-black text-white uppercase tracking-wider">
                            MESSAGE TRANSMITTED
                          </h2>
                          <p className="mx-auto max-w-md text-xs text-muted uppercase leading-relaxed font-mono">
                            Your message has been posted to our communications core. We will follow up shortly.
                          </p>
                        </div>

                        <div className="border-t border-border pt-6">
                          <Button 
                            variant="secondary" 
                            size="sm"
                            onClick={() => setSucceeded(false)}
                          >
                            Send Another Message
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

            </div>

          </Container>
        </div>
      </div>
    </PageTransition>
  );
}
