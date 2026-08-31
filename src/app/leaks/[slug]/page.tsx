import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, AlertTriangle, ShieldAlert } from "lucide-react";
import { valorantDb } from "@/lib/valorant-db";
import { Container } from "@/components/container";
import { Reveal, PageTransition } from "@/components/motion-system";

export async function generateStaticParams() {
  return valorantDb.leaks.map(l => ({ slug: l.slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const leak = valorantDb.leaks.find(l => l.slug === slug);
  if (!leak) return { title: "Leak Not Found | ValoVault" };
  const pageTitle = `${leak.codename} VALORANT Leak: Credibility & Intel Report | ValoVault`;
  const pageDesc = `In-depth data-mined intel and credibility analysis for the upcoming ${leak.codename} leak in VALORANT. See the latest codename findings.`;

  return {
    title: pageTitle,
    description: pageDesc,
    alternates: {
      canonical: `/leaks/${slug}`,
    },
  };
}

const CRED_STYLE: Record<string, string> = {
  HIGH:        "border-error/40 bg-error/5 text-error",
  MEDIUM:      "border-warning/40 bg-warning/5 text-warning",
  SPECULATION: "border-muted/40 bg-surface text-muted",
};

const CATEGORY_STYLE: Record<string, string> = {
  AGENT:    "border-role-duelist/40 bg-role-duelist/10 text-role-duelist",
  SKIN:     "border-tier-premium/40 bg-tier-premium/10 text-tier-premium",
  MAP:      "border-role-initiator/40 bg-role-initiator/10 text-role-initiator",
  GAMEMODE: "border-role-controller/40 bg-role-controller/10 text-role-controller",
};

export default async function LeakDetailPage({ params }: Props) {
  const { slug } = await params;
  const leak = valorantDb.leaks.find(l => l.slug === slug);
  if (!leak) notFound();

  return (
    <PageTransition>
      <div className="min-h-screen bg-background text-foreground">
        {/* Header */}
        <div className="border-b border-border bg-background pt-16 pb-10">
          <Container>
            <Link href="/leaks"
              className="inline-flex items-center gap-2 font-mono-tactical text-[11px] font-bold uppercase tracking-wider text-muted hover:text-primary transition-colors mb-6 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary">
              <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" /> All Leaks
            </Link>

            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className={`border px-2 py-0.5 font-mono-tactical text-[9px] font-black uppercase tracking-wider ${CATEGORY_STYLE[leak.category] ?? "border-border text-muted"}`}>
                {leak.category}
              </span>
              <span className={`border px-2 py-0.5 font-mono-tactical text-[9px] font-black uppercase tracking-wider ${CRED_STYLE[leak.credibility] ?? ""}`}>
                {leak.credibility} credibility
              </span>
            </div>

            <h1 className="font-display text-5xl uppercase tracking-tight text-white sm:text-6xl">
              {leak.codename}
            </h1>
            <p className="mt-2 font-mono-tactical text-[11px] text-muted">Discovered: {leak.discoveredDate}</p>
          </Container>
        </div>

        <Container className="py-16 max-w-3xl">
          {/* Disclaimer */}
          <Reveal>
            <div className="mb-8 flex items-start gap-3 border border-warning/30 bg-warning/5 p-4">
              <AlertTriangle className="h-4 w-4 text-warning shrink-0 mt-0.5" aria-hidden="true" />
              <p className="font-sans text-xs leading-relaxed text-secondary">
                This content is unofficial and data-mined. Details may be inaccurate, subject to change, or cancelled before release. ValoVault does not confirm the accuracy of any leaked material.
              </p>
            </div>
          </Reveal>

          {/* Content */}
          <Reveal>
            <div className="border border-border bg-surface-card p-6 space-y-5">
              <div className="flex items-center gap-2 border-b border-border pb-4">
                <ShieldAlert className="h-4 w-4 text-primary" aria-hidden="true" />
                <span className="font-mono-tactical text-[10px] font-bold uppercase tracking-[0.3em] text-primary">
                  Intel Report
                </span>
              </div>
              <p className="font-sans text-sm leading-relaxed text-secondary">{leak.details}</p>
              <div className="border-t border-border pt-4 font-mono-tactical text-[9px] text-muted">
                Source: Data-mined PBE assets. Credibility: {leak.credibility}. Category: {leak.category}.
              </div>
            </div>
          </Reveal>
        </Container>
      </div>
    </PageTransition>
  );
}
