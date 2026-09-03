import { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/container";
import { PageTransition } from "@/components/motion-system";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { 
  Database, ShieldCheck, Scale, BookOpen, 
  ExternalLink, CheckCircle2, Clock, Cpu 
} from "lucide-react";
import { SourceRegistry } from "@/lib/sources";

export const metadata: Metadata = {
  title: "Data Sources & Ingestion Architecture | VloPedia",
  description: "Explore the public data sources, telemetry APIs, VCT tournament datasets, and canon lore archives powering VloPedia.",
  alternates: {
    canonical: "/data-sources",
  },
};

export default function DataSourcesPage() {
  const sources = SourceRegistry.getAllSources();

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Data Sources & Ingestion" }
  ];

  return (
    <PageTransition>
      <div className="min-h-screen bg-[#0B141A] text-foreground py-16">
        <Container className="space-y-12 max-w-4xl">
          
          {/* Header */}
          <div className="space-y-3 border-b border-[rgba(236,232,225,0.08)] pb-8">
            <Breadcrumbs items={breadcrumbItems} />
            <div className="flex items-center gap-3">
              <span className="h-[2px] w-8 bg-primary" />
              <span className="font-mono text-xs uppercase tracking-[0.3em] text-primary font-bold">
                DATA PROVENANCE & INGESTION ARCHITECTURE
              </span>
            </div>
            <h1 className="font-display font-black text-4xl uppercase tracking-tight text-white sm:text-5xl">
              DATA SOURCES & REGISTRY
            </h1>
            <p className="font-sans text-sm sm:text-base text-secondary leading-relaxed">
              Every statistic, tier ranking, lore citation, and weapon ballistics curve on VloPedia is mapped to a verified, authoritative data source. Below is our complete live registry of telemetry endpoints, tournament datasets, and editorial baselines.
            </p>
          </div>

          {/* Sources Grid */}
          <div className="space-y-6">
            <h2 className="font-display font-black text-2xl uppercase text-white border-l-2 border-primary pl-3">
              01 // ACTIVE SOURCE REGISTRY
            </h2>

            <div className="grid gap-4 sm:grid-cols-2">
              {sources.map(source => (
                <div 
                  key={source.id} 
                  className="border border-[rgba(236,232,225,0.08)] bg-[#0D1A22] p-5 clip-diagonal space-y-3 hover:border-primary/40 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[9px] uppercase px-2 py-0.5 bg-primary/10 border border-primary/30 text-primary font-bold">
                      {source.type}
                    </span>
                    <span className="font-mono text-[9px] text-muted flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {source.updateFrequency}
                    </span>
                  </div>

                  <h3 className="font-display font-black text-lg uppercase text-white">
                    {source.name}
                  </h3>

                  <p className="font-sans text-xs text-secondary leading-relaxed">
                    {source.description}
                  </p>

                  <div className="flex items-center justify-between pt-2 border-t border-[rgba(236,232,225,0.04)] font-mono text-[10px]">
                    <span className="text-muted">Reliability: <strong className="text-[#0DF2F2]">{source.reliability}</strong></span>
                    <a
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline inline-flex items-center gap-1"
                    >
                      <span>Endpoint</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Mathematical Models */}
          <div className="border border-[rgba(236,232,225,0.08)] bg-[#0D1A22] p-6 sm:p-8 clip-diagonal space-y-6">
            <div className="flex items-center gap-3 border-b border-[rgba(236,232,225,0.08)] pb-4">
              <Cpu className="h-5 w-5 text-[#0DF2F2]" />
              <h2 className="font-display font-black text-2xl uppercase text-white">
                02 // MATHEMATICAL MODELS & ALGORITHMS
              </h2>
            </div>

            <div className="space-y-4 font-sans text-xs sm:text-sm text-secondary leading-relaxed">
              <div className="p-4 bg-[#08111A] border border-[rgba(236,232,225,0.04)] space-y-2">
                <span className="font-mono text-xs text-primary font-bold block">1. AIM KINEMATICS CONVERSION FORMULA</span>
                <p className="font-mono text-xs text-white">
                  eDPI = InGameSensitivity × MouseDPI
                </p>
                <p className="font-mono text-xs text-[#0DF2F2]">
                  cm/360° = 13,054.545 / eDPI (Constant: 0.07° yaw per count)
                </p>
              </div>

              <div className="p-4 bg-[#08111A] border border-[rgba(236,232,225,0.04)] space-y-2">
                <span className="font-mono text-xs text-primary font-bold block">2. TACTICAL RECOMMENDATION CONFIDENCE SCORE</span>
                <p className="font-mono text-xs text-white">
                  Confidence = (MapFit × 0.35) + (PlaystyleFit × 0.35) + (UtilitySynergy × 0.30)
                </p>
                <p className="text-xs text-muted">
                  Outputs an algorithmically weighted percentage (0-100%) indicating how strongly an agent matches your map and tactical tempo preferences.
                </p>
              </div>
            </div>
          </div>

        </Container>
      </div>
    </PageTransition>
  );
}
