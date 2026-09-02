import { Container } from "@/components/container";
import { PageTransition } from "@/components/motion-system";

export const metadata = {
  title: "Terms of Service — VloPedia",
  description: "Read the Terms of Service for using VloPedia.",
  alternates: {
    canonical: "/terms",
  },
};

export default function TermsPage() {
  return (
    <PageTransition>
      <div className="min-h-screen bg-[#0B141A] text-foreground">
        {/* Header */}
        <div className="border-b border-[rgba(236,232,225,0.08)] bg-[#0B141A] pt-16 pb-10">
          <Container>
            <div className="flex items-center gap-3 mb-4">
              <span className="w-2 h-2 bg-primary animate-pulse" aria-hidden="true" />
              <span className="font-mono text-xs text-primary tracking-[0.25em] uppercase font-bold">
                LEGAL // RULES OF ENGAGEMENT
              </span>
            </div>
            <h1 className="font-display text-5xl uppercase tracking-tight text-white sm:text-6xl">
              TERMS OF SERVICE
            </h1>
            <p className="mt-2 font-mono text-xs text-muted">
              LAST UPDATE: AUGUST 2026 // VERSION 1.0
            </p>
          </Container>
        </div>

        {/* Content */}
        <Container className="py-16">
          <div className="mx-auto max-w-3xl space-y-10 font-sans text-sm leading-relaxed text-muted">
            <section className="space-y-4">
              <h2 className="font-display text-xl uppercase text-white tracking-wide border-l-2 border-primary pl-3">
                1. Acceptance of Terms
              </h2>
              <p>
                By accessing, browsing, or signing in to VloPedia (the &quot;Site&quot; or &quot;Service&quot;), you agree to be bound by these Terms of Service, all applicable laws and regulations, and agree that you are responsible for compliance with any local laws. If you do not agree with any of these terms, you are prohibited from using this Site.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="font-display text-xl uppercase text-white tracking-wide border-l-2 border-primary pl-3">
                2. Use License
              </h2>
              <p>
                Permission is granted to temporarily view the assets, skins, maps, and information on VloPedia for personal, non-commercial, informational viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
              </p>
              <ul className="list-disc pl-5 space-y-2">
                <li>Modify or copy the materials.</li>
                <li>Use the materials for any commercial purpose, or for any public display (commercial or non-commercial).</li>
                <li>Attempt to decompile or reverse engineer any software contained on the Site.</li>
                <li>Remove any copyright or other proprietary notations from the materials.</li>
                <li>Transfer the materials to another person or &quot;mirror&quot; the materials on any other server.</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="font-display text-xl uppercase text-white tracking-wide border-l-2 border-primary pl-3">
                3. Disclaimer &amp; Intellectual Property
              </h2>
              <p>
                The materials on VloPedia are provided &quot;as is&quot;. VloPedia makes no warranties, expressed or implied, and hereby disclaims all other warranties, including without limitation, implied warranties of merchantability, fitness for a particular purpose, or non-infringement of intellectual property.
              </p>
              <p>
                <strong className="text-white">Riot Games Disclaimer:</strong> VloPedia is a community-driven fan project. All game content, assets, images, weapon statistics, and agent media belong to Riot Games. We do not claim ownership over any official Valorant IP.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="font-display text-xl uppercase text-white tracking-wide border-l-2 border-primary pl-3">
                4. Account Responsibility
              </h2>
              <p>
                If you sign in using your Discord credentials, you are responsible for maintaining the security of your session and account details. You must notify us immediately of any unauthorized use or security breach. VloPedia is not responsible for any actions taken under your account session.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="font-display text-xl uppercase text-white tracking-wide border-l-2 border-primary pl-3">
                5. Limitations of Liability
              </h2>
              <p>
                In no event shall VloPedia or its contributors be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on the Site, even if VloPedia has been notified of the possibility of such damage.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="font-display text-xl uppercase text-white tracking-wide border-l-2 border-primary pl-3">
                6. Revisions &amp; Errata
              </h2>
              <p>
                The materials appearing on VloPedia could include technical, typographical, or photographic errors. While we pull official data from public APIs, we do not warrant that any of the materials on the Site are accurate, complete, or current. VloPedia may make changes to the materials contained on its web site at any time without notice.
              </p>
            </section>

            <div className="border-t border-[rgba(236,232,225,0.08)] pt-6 text-center text-xs font-mono text-muted">
              CONTACT: godrikt1408@gmail.com // CODENAME: PROTOCOL
            </div>
          </div>
        </Container>
      </div>
    </PageTransition>
  );
}
