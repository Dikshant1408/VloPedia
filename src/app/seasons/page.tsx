import { Container } from "@/components/container";
import { Reveal, PageTransition } from "@/components/motion-system";

// Hardcoded because valorant-api.com doesn't expose seasons data
const EPISODES = [
  {
    episode: "Episode 1",
    period: "June 2020 – March 2021",
    acts: ["Act I: The Beginning", "Act II: Formation", "Act III: Ignition"],
    highlight: "Launch of VALORANT. First 12 agents, 4 maps.",
  },
  {
    episode: "Episode 2",
    period: "March 2021 – January 2022",
    acts: ["Act I: Kick-Off", "Act II: Judgement", "Act III: Resolution"],
    highlight: "Astra, KAY/O, Chamber added. Fracture released.",
  },
  {
    episode: "Episode 3",
    period: "January 2022 – June 2022",
    acts: ["Act I: Reflection", "Act II: Judgment", "Act III: Finale"],
    highlight: "Neon, Fade added. Pearl introduced.",
  },
  {
    episode: "Episode 4",
    period: "June 2022 – January 2023",
    acts: ["Act I", "Act II", "Act III"],
    highlight: "Harbor added. Competitive revamp.",
  },
  {
    episode: "Episode 5",
    period: "January 2023 – June 2023",
    acts: ["Act I", "Act II", "Act III"],
    highlight: "Gekko, Deadlock added. Lotus map launched.",
  },
  {
    episode: "Episode 6",
    period: "June 2023 – January 2024",
    acts: ["Act I", "Act II", "Act III"],
    highlight: "Iso added. Sunset map released.",
  },
  {
    episode: "Episode 7",
    period: "January 2024 – June 2024",
    acts: ["Act I", "Act II", "Act III"],
    highlight: "Clove added. Console (PS5/XSX) launch.",
  },
  {
    episode: "Episode 8",
    period: "June 2024 – January 2025",
    acts: ["Act I", "Act II", "Act III"],
    highlight: "Vyse added. Abyss map added.",
  },
  {
    episode: "Episode 9",
    period: "January 2025 – Present",
    acts: ["Act I", "Act II", "Act III"],
    highlight: "Tejo, Waylay added. Ongoing competitive season.",
    current: true,
  },
];

export default function SeasonsPage() {
  return (
    <PageTransition>
      <div className="min-h-screen bg-[#0B141A] text-foreground">
        <div className="border-b border-[rgba(236,232,225,0.08)] bg-[#0B141A] pt-16 pb-10">
          <Container>
            <div className="flex items-center gap-3 mb-4">
              <span className="w-2 h-2 bg-[#0DF2F2] animate-pulse" aria-hidden="true" />
              <span className="font-mono text-xs text-[#0DF2F2] tracking-[0.25em] uppercase font-bold">TIMELINE</span>
            </div>
            <h1 className="font-display text-6xl uppercase tracking-tight text-white sm:text-7xl">SEASONS</h1>
            <p className="mt-3 max-w-xl font-sans text-sm leading-relaxed text-secondary">
              Every episode and act in VALORANT history — agents added, maps launched, and competitive milestones.
            </p>
          </Container>
        </div>

        <Container className="py-16">
          <div className="relative">
            {/* Spine */}
            <div aria-hidden="true" className="absolute left-4 top-0 h-full w-px bg-gradient-to-b from-primary via-border to-transparent sm:left-8" />

            <div className="space-y-8">
              {[...EPISODES].reverse().map((ep, i) => (
                <Reveal key={ep.episode} delay={i * 0.04}>
                  <div className="relative pl-12 sm:pl-20">
                    {/* Timeline dot */}
                    <div
                      aria-hidden="true"
                      className={`absolute left-2 sm:left-6 top-4 h-4 w-4 rounded-full border-2 ${ep.current ? "border-primary bg-primary" : "border-border bg-background"}`}
                    />

                    <div className={`border p-5 transition-all ${ep.current ? "border-primary/50 bg-primary/5" : "border-border bg-[#0D1A22]"}`}>
                      <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <h2 className="font-display text-2xl uppercase text-white">{ep.episode}</h2>
                            {ep.current && (
                              <span className="bg-primary px-2 py-0.5 font-mono text-[9px] font-black uppercase tracking-wider text-black">
                                CURRENT
                              </span>
                            )}
                          </div>
                          <p className="font-mono text-[11px] text-muted mt-0.5">{ep.period}</p>
                        </div>
                      </div>

                      <p className="font-sans text-sm text-secondary mb-4">{ep.highlight}</p>

                      <div className="flex flex-wrap gap-2">
                        {ep.acts.map(act => (
                          <span key={act}
                            className="border border-[rgba(236,232,225,0.08)] bg-[rgba(15,28,36,0.8)] px-3 py-1.5 font-mono text-[10px] font-bold text-muted">
                            {act}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </Container>
      </div>
    </PageTransition>
  );
}
