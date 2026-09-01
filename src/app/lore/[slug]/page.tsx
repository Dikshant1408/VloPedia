import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Container } from "@/components/container";
import { PageTransition, Reveal } from "@/components/motion-system";
import { CanonEvidenceCard, type CanonStatus } from "@/components/canon-evidence-card";
import { siteConfig } from "@/lib/site";
import loreData from "@/data/lore-database.json";
import { ArrowLeft, Clock, Share2, BookOpen, ChevronRight } from "lucide-react";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { BookmarkButton } from "@/components/bookmark-button";

export const dynamic = "force-static";

export async function generateStaticParams() {
  return loreData.articles.map(a => ({
    slug: a.slug,
  }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = loreData.articles.find(a => a.slug === slug);
  if (!article) return { title: "Lore Not Found | VloPedia", robots: { index: false } };

  const pageTitle = `${article.title} | VALORANT Lore Archives | VloPedia`;
  const pageDesc = article.summary;

  return {
    title: pageTitle,
    description: pageDesc,
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    openGraph: {
      type: "article",
      title: pageTitle,
      description: pageDesc,
      url: `${siteConfig.url}/lore/${slug}`,
    },
    alternates: {
      canonical: `${siteConfig.url}/lore/${slug}`,
    },
  };
}

export default async function LoreDetailPage({ params }: Props) {
  const { slug } = await params;
  const article = loreData.articles.find(a => a.slug === slug);
  if (!article) notFound();

  const otherArticles = loreData.articles.filter(a => a.slug !== slug).slice(0, 3);

  const breadcrumbItems = [
    { label: "Lore", href: "/lore" },
    { label: article.category.replace("_", " "), href: `/lore#${article.category.toLowerCase()}` },
    { label: article.title }
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": siteConfig.url },
          { "@type": "ListItem", "position": 2, "name": "Lore", "item": `${siteConfig.url}/lore` },
          { "@type": "ListItem", "position": 3, "name": article.title, "item": `${siteConfig.url}/lore/${slug}` }
        ]
      },
      {
        "@type": "Article",
        "headline": article.title,
        "description": article.summary,
        "author": {
          "@type": "Organization",
          "name": "VloPedia Lore Archives"
        },
        "publisher": {
          "@type": "Organization",
          "name": "VloPedia",
          "url": siteConfig.url
        },
        "mainEntityOfPage": `${siteConfig.url}/lore/${slug}`
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PageTransition>
        <div className="min-h-screen bg-[#0B141A] text-foreground">
          
          {/* Header */}
          <div className="border-b border-[rgba(236,232,225,0.08)] bg-[#0B141A] pt-10 pb-10">
            <Container>
              <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                <Breadcrumbs items={breadcrumbItems} />
                <div className="flex items-center gap-2">
                  <BookmarkButton
                    id={`lore-${article.slug}`}
                    title={article.title}
                    category="Lore"
                    url={`/lore/${slug}`}
                  />
                  <span className="font-mono text-[10px] uppercase tracking-wider text-muted border border-[rgba(236,232,225,0.1)] px-2.5 py-1">
                    Canon: {article.canonStatus}
                  </span>
                </div>
              </div>

              <div className="space-y-4 max-w-4xl">
                <div className="flex items-center gap-3">
                  <span className="h-[2px] w-8 bg-[#0DF2F2]" />
                  <span className="font-mono text-xs uppercase tracking-[0.3em] text-[#0DF2F2] font-bold">
                    {article.category.replace("_", " ")} DOSSIER
                  </span>
                  <span className="text-muted/40">•</span>
                  <span className="font-mono text-xs text-muted flex items-center gap-1.5">
                    <Clock className="h-3 w-3" /> {article.readTime}
                  </span>
                </div>

                <h1 className="font-display font-black text-4xl uppercase tracking-tight text-white sm:text-5xl lg:text-6xl">
                  {article.title}
                </h1>

                <p className="font-sans text-base leading-relaxed text-secondary border-l-2 border-primary/60 pl-4 py-1">
                  {article.summary}
                </p>
              </div>
            </Container>
          </div>

          <Container className="py-16">
            <div className="grid gap-12 lg:grid-cols-[1fr_320px] lg:items-start">
              
              {/* Main Content Body */}
              <div className="space-y-10">
                {/* Evidence Card */}
                <CanonEvidenceCard
                  status={article.canonStatus as CanonStatus}
                  source={article.evidenceSource}
                  whyDoWeKnowThis={article.whyDoWeKnowThis}
                />

                {/* Article Sections */}
                <div className="space-y-8">
                  {article.sections.map((sec, idx) => (
                    <div
                      key={idx}
                      className="border border-[rgba(236,232,225,0.06)] bg-[#0D1A22] p-8 clip-diagonal-sm space-y-4"
                    >
                      <h2 className="font-display font-black text-2xl uppercase tracking-wide text-white border-b border-[rgba(236,232,225,0.08)] pb-3">
                        {sec.heading}
                      </h2>
                      <p className="font-sans text-sm sm:text-base leading-relaxed text-secondary whitespace-pre-line">
                        {sec.content}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Back to Hub CTA */}
                <div className="border border-[rgba(236,232,225,0.08)] bg-surface p-6 flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h3 className="font-display font-black text-lg uppercase text-white">
                      Explore More VALORANT Lore
                    </h3>
                    <p className="font-sans text-xs text-muted">
                      Discover verified faction dossiers, agent origins, and the First Light timeline.
                    </p>
                  </div>
                  <Link
                    href="/lore"
                    className="font-mono text-xs uppercase px-4 py-2 bg-primary text-black font-bold hover:bg-primary-hover transition-colors"
                  >
                    View All Archives →
                  </Link>
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                <div className="border border-[rgba(236,232,225,0.08)] bg-[#0D1A22] p-6 space-y-4">
                  <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-[#0DF2F2] block border-b border-[rgba(236,232,225,0.08)] pb-2">
                    RELATED LORE FILES
                  </span>
                  <div className="space-y-3">
                    {otherArticles.map(rel => (
                      <Link
                        key={rel.slug}
                        href={`/lore/${rel.slug}`}
                        className="group block border border-[rgba(236,232,225,0.04)] bg-surface/50 p-3 hover:border-primary/40 transition-colors"
                      >
                        <span className="block font-mono text-[9px] uppercase text-muted mb-1">
                          {rel.category.replace("_", " ")}
                        </span>
                        <p className="font-display text-sm uppercase text-white group-hover:text-primary transition-colors leading-snug">
                          {rel.title}
                        </p>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Tactical Database Cross-Link */}
                <div className="border border-[rgba(236,232,225,0.08)] bg-[#0D1A22] p-6 space-y-3">
                  <span className="font-mono text-[10px] font-bold uppercase tracking-widest text-primary block">
                    TACTICAL DATABASE
                  </span>
                  <p className="font-sans text-xs text-muted">
                    Looking for weapon stats or agent abilities? Explore our full database.
                  </p>
                  <div className="flex flex-col gap-2 pt-2 text-xs font-mono">
                    <Link href="/agents" className="text-secondary hover:text-primary flex items-center justify-between border-b border-[rgba(236,232,225,0.04)] pb-1.5">
                      <span>Operatives Database</span> <ChevronRight className="h-3 w-3" />
                    </Link>
                    <Link href="/weapons" className="text-secondary hover:text-primary flex items-center justify-between border-b border-[rgba(236,232,225,0.04)] pb-1.5">
                      <span>Weapons & Stats</span> <ChevronRight className="h-3 w-3" />
                    </Link>
                    <Link href="/maps" className="text-secondary hover:text-primary flex items-center justify-between border-b border-[rgba(236,232,225,0.04)] pb-1.5">
                      <span>Tactical Maps</span> <ChevronRight className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              </div>

            </div>
          </Container>
        </div>
      </PageTransition>
    </>
  );
}
