import React from "react";
import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { valorantDb } from "@/lib/valorant-db";
import { Container } from "@/components/container";
import { Reveal, PageTransition } from "@/components/motion-system";

export async function generateStaticParams() {
  return valorantDb.lore.map((l) => ({
    slug: l.slug
  }));
}

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const chapter = valorantDb.lore.find((l) => l.slug === slug);
  if (!chapter) return { title: "Lore Not Found | ValoVault" };
  return {
    title: `${chapter.title} | ValoVault`,
    description: chapter.summary,
    openGraph: { type: "website", title: `${chapter.title} | ValoVault`, description: chapter.summary },
    alternates: {
      canonical: `/lore/${slug}`,
    },
  };
}

export default async function LoreDetailPage({ params }: Props) {
  const { slug } = await params;
  const chapter = valorantDb.lore.find((l) => l.slug === slug);
  if (!chapter) notFound();

  return (
    <PageTransition>
      <div className="min-h-screen bg-background text-foreground">
        <div className="border-b border-border bg-background pt-16 pb-10">
          <Container>
            <Link href="/lore" className="inline-flex items-center gap-2 font-mono-tactical text-[11px] font-bold uppercase tracking-wider text-muted hover:text-primary transition-colors mb-6">
              <ArrowLeft className="h-3.5 w-3.5" /> Back to Lore
            </Link>
            <div className="flex items-center gap-3 mb-3">
              <span className="h-[2px] w-8 bg-primary" />
              <span className="font-mono-tactical text-[10px] font-bold uppercase tracking-[0.4em] text-primary">Chapter {chapter.chapter}</span>
            </div>
            <h1 className="font-display text-5xl uppercase tracking-tight text-white sm:text-6xl">{chapter.title}</h1>
          </Container>
        </div>

        <Container className="py-16">
          <Reveal className="max-w-3xl mx-auto space-y-8">
            <p className="border-l-2 border-primary pl-5 font-sans text-sm italic leading-relaxed text-secondary">
              {chapter.summary}
            </p>
            <div className="prose-sm font-sans text-sm leading-relaxed text-secondary space-y-4">
              {chapter.content.split("\n\n").map((para, i) => (
                <p key={i}>{para}</p>
              ))}
            </div>
          </Reveal>
        </Container>
      </div>
    </PageTransition>
  );
}
