import { notFound } from "next/navigation";
import Link from "next/link";
import { Container } from "@/components/container";
import { PageTransition, Reveal } from "@/components/motion-system";
import { guidesDb } from "@/lib/guides-db";
import { ArrowLeft, BookOpen, Clock, Calendar, ChevronRight } from "lucide-react";
import { Metadata } from "next";
import { BookmarkButton } from "@/components/bookmark-button";

interface GuideDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return guidesDb.map(g => ({
    slug: g.slug,
  }));
}

export async function generateMetadata({ params }: GuideDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const guide = guidesDb.find(g => g.slug === slug);
  if (!guide) return {};

  return {
    title: `${guide.title} — VloPedia Guide`,
    description: guide.summary,
    alternates: {
      canonical: `/guides/${slug}`,
    },
  };
}

export default async function GuideDetailPage({ params }: GuideDetailPageProps) {
  const { slug } = await params;
  const guide = guidesDb.find(g => g.slug === slug);
  if (!guide) notFound();

  // Get related guides (same category, or different slug)
  const related = guidesDb
    .filter(g => g.slug !== slug)
    .slice(0, 2);

  return (
    <PageTransition>
      <div className="min-h-screen bg-[#0B141A] text-foreground font-sans">
        {/* Tactical grid */}
        <div aria-hidden="true" className="pointer-events-none fixed inset-0 bg-tactical-grid bg-tactical-dots opacity-20 z-0" />

        <div className="relative z-10 py-12">
          <Container>
            
            {/* Breadcrumbs */}
            <nav className="flex items-center gap-1.5 font-mono text-[10px] uppercase text-muted mb-8" aria-label="Breadcrumb">
              <Link href="/" className="hover:text-primary transition-colors">HOME</Link>
              <ChevronRight className="h-3 w-3" />
              <Link href="/guides" className="hover:text-primary transition-colors">GUIDES</Link>
              <ChevronRight className="h-3 w-3" />
              <span className="text-white truncate max-w-[200px] sm:max-w-xs">{guide.title}</span>
            </nav>

            {/* Back button & Bookmark */}
            <div className="flex items-center gap-3 mb-8">
              <Link 
                href="/guides" 
                className="inline-flex items-center gap-2 border border-border bg-[rgba(15,28,36,0.6)] px-4 py-2 font-mono text-xs font-bold uppercase tracking-wider text-muted hover:border-primary hover:text-primary transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
              >
                <ArrowLeft className="h-4 w-4" /> Back to Guides
              </Link>
              <BookmarkButton
                id={`guide-${guide.slug}`}
                title={guide.title}
                category="Guide"
                url={`/guides/${slug}`}
              />
            </div>

            <div className="grid gap-8 lg:grid-cols-[1fr_300px] items-start">
              
              {/* Main article content */}
              <article className="border border-border bg-[#0D1A22]/90 backdrop-blur-md p-6 sm:p-10 cut-corner-br space-y-6">
                
                {/* Meta details */}
                <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-muted uppercase border-b border-[rgba(236,232,225,0.06)] pb-6">
                  <span className="border border-primary/20 bg-primary/5 px-2.5 py-0.5 text-[10px] text-primary tracking-wider font-bold">
                    {guide.category}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <BookOpen className="h-4 w-4 text-primary" /> {guide.author}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-4 w-4 text-primary" /> {guide.readTime}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4 text-primary" /> {guide.publishedAt}
                  </span>
                </div>

                {/* Article Header */}
                <header className="space-y-4">
                  <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl uppercase tracking-wide text-white leading-tight">
                    {guide.title}
                  </h1>
                  <p className="font-sans text-sm sm:text-base leading-relaxed text-secondary border-l-2 border-primary pl-4 italic">
                    {guide.summary}
                  </p>
                </header>

                {/* Body Content */}
                <div className="font-sans text-sm sm:text-base leading-relaxed text-muted space-y-6 pt-4">
                  {guide.content.split("\n\n").map((paragraph, index) => {
                    // Render headers
                    if (paragraph.startsWith("###")) {
                      return (
                        <h3 key={index} className="font-display text-lg sm:text-xl uppercase text-white tracking-wide pt-4 pb-1 border-b border-[rgba(236,232,225,0.06)]">
                          {paragraph.replace("###", "").trim()}
                        </h3>
                      );
                    }
                    if (paragraph.startsWith("##")) {
                      return (
                        <h2 key={index} className="font-display text-xl sm:text-2xl uppercase text-white tracking-wide pt-6 pb-2 border-b border-[rgba(236,232,225,0.1)]">
                          {paragraph.replace("##", "").trim()}
                        </h2>
                      );
                    }
                    if (paragraph.startsWith("####")) {
                      return (
                        <h4 key={index} className="font-display text-base uppercase text-primary tracking-wide pt-2">
                          {paragraph.replace("####", "").trim()}
                        </h4>
                      );
                    }

                    // Render bullet lists
                    if (paragraph.startsWith("*")) {
                      const items = paragraph.split("\n").map(li => li.replace("*", "").trim());
                      return (
                        <ul key={index} className="list-disc pl-6 space-y-2 text-sm sm:text-base">
                          {items.map((item, i) => {
                            // Support simple bolding **text** in lists
                            const parts = item.split("**");
                            if (parts.length > 2) {
                              return (
                                <li key={i}>
                                  <strong className="text-white">{parts[1]}</strong>
                                  {parts.slice(2).join("")}
                                </li>
                              );
                            }
                            return <li key={i}>{item}</li>;
                          })}
                        </ul>
                      );
                    }

                    // Render ordered lists
                    if (/^\d+\./.test(paragraph)) {
                      const items = paragraph.split("\n").map(li => li.replace(/^\d+\./, "").trim());
                      return (
                        <ol key={index} className="list-decimal pl-6 space-y-2 text-sm sm:text-base">
                          {items.map((item, i) => {
                            const parts = item.split("**");
                            if (parts.length > 2) {
                              return (
                                <li key={i}>
                                  <strong className="text-white">{parts[1]}</strong>
                                  {parts.slice(2).join("")}
                                </li>
                              );
                            }
                            return <li key={i}>{item}</li>;
                          })}
                        </ol>
                      );
                    }

                    // Standard paragraph, parsing simple code formatting `code` and bolding **bold**
                    let parsedText: React.ReactNode = paragraph;
                    const boldParts = paragraph.split("**");
                    if (boldParts.length > 2) {
                      parsedText = (
                        <>
                          {boldParts[0]}
                          <strong className="text-white">{boldParts[1]}</strong>
                          {boldParts.slice(2).join("")}
                        </>
                      );
                    }

                    return (
                      <p key={index} className="leading-relaxed">
                        {parsedText}
                      </p>
                    );
                  })}
                </div>
              </article>

              {/* Sidebar recommendations */}
              <aside className="space-y-6">
                
                {/* Related Intel widget */}
                <div className="border border-border bg-[#0D1A22] p-5 space-y-4 cut-corner-br">
                  <span className="text-[10px] text-primary font-bold block border-b border-border pb-2 tracking-widest font-mono uppercase">
                    {"// RELATED INTEL"}
                  </span>
                  
                  <div className="space-y-4">
                    {related.map(item => (
                      <Link 
                        key={item.slug} 
                        href={`/guides/${item.slug}`}
                        className="block group space-y-1.5"
                      >
                        <span className="font-mono text-[9px] text-primary tracking-wider uppercase">
                          {item.category}
                        </span>
                        <h4 className="font-display text-sm uppercase text-white group-hover:text-primary transition-colors leading-tight">
                          {item.title}
                        </h4>
                        <p className="font-sans text-[11px] text-muted line-clamp-2">
                          {item.summary}
                        </p>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Disclaimer widget */}
                <div className="border border-border bg-[rgba(15,28,36,0.4)] p-5">
                  <span className="text-[9px] text-muted font-bold block border-b border-[rgba(236,232,225,0.06)] pb-2 tracking-widest font-mono uppercase">
                    {"// DECK ARCHIVE DISCLAIMER"}
                  </span>
                  <p className="font-mono text-[9px] text-muted uppercase mt-3 leading-normal">
                    This content is maintained independently for companion purposes. Game updates may modify gameplay balance variables. Check official patch updates.
                  </p>
                </div>

              </aside>

            </div>

          </Container>
        </div>
      </div>
    </PageTransition>
  );
}
