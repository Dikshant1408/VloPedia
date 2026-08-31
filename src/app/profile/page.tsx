"use client";

import { useState, useEffect } from "react";
import { ProtectedRoute } from "@/components/protected-route";
import { Button } from "@/components/ui/button";
import { useFirestoreUserDocument } from "@/hooks/use-firestore-user-document";
import { useAuth } from "@/hooks/use-auth";
import { getFirebaseFirestore } from "@/services/firebase";
import { doc, setDoc } from "firebase/firestore";
import { Calculator, Shield, LogOut } from "lucide-react";
import { toast } from "sonner";
import { Container } from "@/components/container";
import { Reveal, PageTransition } from "@/components/motion-system";

export default function ProfilePage() {
  const { user } = useAuth();
  const { data: userDocument, loading, error } = useFirestoreUserDocument();

  const [riotId, setRiotId] = useState("");
  const [tagline, setTagline] = useState("");
  const [favAgent, setFavAgent] = useState("JETT");
  const [favWeapon, setFavWeapon] = useState("VANDAL");
  const [dpi, setDpi] = useState("800");
  const [sens, setSens] = useState("0.35");
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    if (userDocument) {
      const docData = userDocument as any;
      if (docData.riotId) setRiotId(docData.riotId);
      if (docData.tagline) setTagline(docData.tagline);
      if (docData.favoriteAgent) setFavAgent(docData.favoriteAgent);
      if (docData.favoriteWeapon) setFavWeapon(docData.favoriteWeapon);
      if (docData.dpi) setDpi(String(docData.dpi));
      if (docData.sensitivity) setSens(String(docData.sensitivity));
    }
  }, [userDocument]);

  const calculatedEdpi = Number(dpi) && Number(sens) ? (Number(dpi) * Number(sens)).toFixed(0) : "0";

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setUpdating(true);
    try {
      const db = getFirebaseFirestore();
      const userRef = doc(db, "users", user.uid);
      
      await setDoc(userRef, {
        riotId: riotId.trim(),
        tagline: tagline.trim(),
        favoriteAgent: favAgent,
        favoriteWeapon: favWeapon,
        dpi: Number(dpi) || 800,
        sensitivity: Number(sens) || 0.35,
        onboardingCompleted: true
      }, { merge: true });

      toast.success("Profile telemetry updated successfully!", {
        className: "font-mono rounded-none border-[#4AF626]"
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Could not sync profile data.";
      toast.error(message, {
        className: "font-mono rounded-none"
      });
    } finally {
      setUpdating(false);
    }
  };

  return (
    <ProtectedRoute
      title="Profile access is private"
      description="Your profile holds Riot identity, settings, and preferences."
    >
      <PageTransition>
        <div className="min-h-screen bg-[#0B141A] text-foreground">
          {/* Header */}
          <div className="border-b border-[rgba(236,232,225,0.08)] bg-[#0B141A] pt-16 pb-10">
            <Container>
              <div className="flex items-center gap-3 mb-4">
                <span className="w-2 h-2 bg-[#0DF2F2] animate-pulse" aria-hidden="true" />
                <span className="font-mono text-xs text-[#0DF2F2] tracking-[0.25em] uppercase font-bold">PLAYER PROFILE</span>
              </div>
              <div className="flex items-end justify-between gap-4">
                <h1 className="font-display text-5xl uppercase tracking-tight text-white sm:text-6xl">
                  {user?.displayName ?? "Profile"}
                </h1>
                <button
                  type="button"
                  onClick={async () => {
                    const { signOut } = await import("firebase/auth");
                    const { getFirebaseAuth } = await import("@/services/firebase");
                    await signOut(getFirebaseAuth());
                    window.location.href = "/";
                  }}
                  className="flex items-center gap-2 font-mono text-[11px] font-bold uppercase tracking-wider text-muted transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
                  aria-label="Sign out"
                >
                  <LogOut className="h-3.5 w-3.5" aria-hidden="true" />
                  Sign Out
                </button>
              </div>
              {user?.email && (
                <p className="mt-2 font-mono text-[11px] text-muted">{user.email}</p>
              )}
            </Container>
          </div>

          <Container className="py-12">
            <div className="grid gap-8 lg:grid-cols-[1.3fr_1fr] items-start">

              {/* Edit form */}
              <Reveal className="border border-border bg-[#0D1A22] p-6 space-y-5 cut-corner-br">
                <h2 className="font-mono text-[10px] font-bold uppercase tracking-[0.3em] text-primary border-b border-border pb-4">
                  Identity Settings
                </h2>
                <form onSubmit={handleUpdateProfile} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label htmlFor="riot-id" className="block font-mono text-[10px] font-bold uppercase tracking-wider text-muted">Riot ID</label>
                      <input id="riot-id" type="text" value={riotId} onChange={e=>setRiotId(e.target.value)} placeholder="e.g. Jett"
                        className="w-full border border-[rgba(236,232,225,0.08)] bg-[rgba(15,28,36,0.8)] px-3 py-2.5 font-sans text-sm text-foreground focus:border-primary focus:outline-none" />
                    </div>
                    <div className="space-y-1.5">
                      <label htmlFor="tagline" className="block font-mono text-[10px] font-bold uppercase tracking-wider text-muted">Tagline</label>
                      <input id="tagline" type="text" value={tagline} onChange={e=>setTagline(e.target.value)} placeholder="e.g. KR1"
                        className="w-full border border-[rgba(236,232,225,0.08)] bg-[rgba(15,28,36,0.8)] px-3 py-2.5 font-sans text-sm text-foreground focus:border-primary focus:outline-none" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label htmlFor="fav-agent" className="block font-mono text-[10px] font-bold uppercase tracking-wider text-muted">Favorite Agent</label>
                      <select id="fav-agent" value={favAgent} onChange={e=>setFavAgent(e.target.value)}
                        className="w-full border border-[rgba(236,232,225,0.08)] bg-[rgba(15,28,36,0.8)] px-3 py-2.5 font-mono text-sm text-foreground focus:border-primary focus:outline-none">
                        {["JETT","OMEN","SOVA","REYNA","KILLJOY","SAGE"].map(a=><option key={a} value={a}>{a}</option>)}
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label htmlFor="fav-weapon" className="block font-mono text-[10px] font-bold uppercase tracking-wider text-muted">Favorite Weapon</label>
                      <select id="fav-weapon" value={favWeapon} onChange={e=>setFavWeapon(e.target.value)}
                        className="w-full border border-[rgba(236,232,225,0.08)] bg-[rgba(15,28,36,0.8)] px-3 py-2.5 font-mono text-sm text-foreground focus:border-primary focus:outline-none">
                        {["VANDAL","PHANTOM","OPERATOR","SHERIFF"].map(w=><option key={w} value={w}>{w}</option>)}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label htmlFor="dpi-field" className="block font-mono text-[10px] font-bold uppercase tracking-wider text-muted">Mouse DPI</label>
                      <input id="dpi-field" type="number" value={dpi} onChange={e=>setDpi(e.target.value)}
                        className="w-full border border-[rgba(236,232,225,0.08)] bg-[rgba(15,28,36,0.8)] px-3 py-2.5 font-mono text-sm text-foreground focus:border-primary focus:outline-none" />
                    </div>
                    <div className="space-y-1.5">
                      <label htmlFor="sens-field" className="block font-mono text-[10px] font-bold uppercase tracking-wider text-muted">Sensitivity</label>
                      <input id="sens-field" type="number" step="0.001" value={sens} onChange={e=>setSens(e.target.value)}
                        className="w-full border border-[rgba(236,232,225,0.08)] bg-[rgba(15,28,36,0.8)] px-3 py-2.5 font-mono text-sm text-foreground focus:border-primary focus:outline-none" />
                    </div>
                  </div>

                  <Button type="submit" variant="primary" disabled={updating} className="w-full cut-corner-br">
                    {updating ? "Saving…" : "Save Profile"}
                  </Button>
                </form>
              </Reveal>

              {/* Stats panel */}
              <div className="space-y-5">
                <Reveal className="border border-primary/30 bg-primary-softer p-6 cut-corner-br">
                  <div className="flex items-center gap-2 mb-3">
                    <Calculator className="h-4 w-4 text-primary" aria-hidden="true" />
                    <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-primary">eDPI</span>
                  </div>
                  <p className="font-mono text-5xl font-black text-white">{calculatedEdpi}</p>
                  <p className="font-mono text-[11px] text-muted mt-1">{dpi} DPI × {sens} sens</p>
                </Reveal>

                <Reveal className="border border-border bg-[#0D1A22] p-6 cut-corner-br space-y-3">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-primary" aria-hidden="true" />
                    <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-primary">Account</span>
                  </div>
                  <div className="space-y-2 font-mono text-[11px]">
                    <div className="flex justify-between">
                      <span className="text-muted">Auth</span>
                      <span className="text-white font-bold">Google</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted">UID</span>
                      <span className="text-white font-bold truncate max-w-[140px]">{user?.uid?.slice(0,16)}…</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted">Email</span>
                      <span className="text-white font-bold truncate max-w-[140px]">{user?.email}</span>
                    </div>
                  </div>
                </Reveal>
              </div>
            </div>
          </Container>
        </div>
      </PageTransition>
    </ProtectedRoute>
  );
}
