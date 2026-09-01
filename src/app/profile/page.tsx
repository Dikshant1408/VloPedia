"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Container } from "@/components/container";
import { Reveal, PageTransition } from "@/components/motion-system";
import { useAuth } from "@/hooks/use-auth";
import { getFirebaseFirestore } from "@/services/firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { 
  User, Crosshair, Shield, Zap, Target, Bookmark, 
  Share2, Save, Sparkles, CheckCircle, RefreshCw, ArrowRight 
} from "lucide-react";
import { toast } from "sonner";

interface MyValoProfile {
  riotId: string;
  tagline: string;
  mainAgent: string;
  favMap: string;
  favWeapon: string;
  dpi: number;
  sensitivity: number;
  crosshairCode: string;
}

const DEFAULT_PROFILE: MyValoProfile = {
  riotId: "RadiantPlayer",
  tagline: "VALO",
  mainAgent: "Jett",
  favMap: "Ascent",
  favWeapon: "Vandal",
  dpi: 800,
  sensitivity: 0.32,
  crosshairCode: "0;s;1;P;c;5;h;0;m;1;0l;4;0v;4;0g;1;0o;2;0a;1;0f;0;1b;0",
};

const AGENTS_LIST = ["Jett", "Omen", "Sova", "Raze", "Cypher", "Killjoy", "Reyna", "Clove", "Viper", "Fade", "Gekko", "KAY/O", "Breach", "Neon", "Yoru", "Iso", "Vyse"];
const MAPS_LIST = ["Ascent", "Bind", "Haven", "Sunset", "Lotus", "Split", "Icebox", "Breeze", "Abyss", "Fracture"];
const WEAPONS_LIST = ["Vandal", "Phantom", "Operator", "Sheriff", "Spectre", "Ghost", "Outlaw", "Guardian", "Odin"];

// Dynamic "Before You Queue" tactical generator
function getBeforeYouQueueAdvice(agent: string, map: string) {
  const isAscent = map === "Ascent";
  const isBind = map === "Bind";
  const isHaven = map === "Haven";
  const isDuelist = ["Jett", "Raze", "Reyna", "Neon", "Yoru", "Iso"].includes(agent);
  const isController = ["Omen", "Clove", "Viper", "Brimstone", "Astra", "Harbor"].includes(agent);

  return {
    recommendedBuy: "Full Armor + Vandal / Phantom + Full Utility",
    primaryObjective: isDuelist 
      ? `Explosively contest ${isAscent ? "Mid Top & A Main" : isBind ? "A Short & B Long" : "A Long & C Garage"} to carve map space for your team.`
      : isController
      ? `Deploy vision-blocking smokes flush on ${isAscent ? "A Tree & Mid Bottom" : isBind ? "A Lamps & B Hookah" : "Main Chokepoints"} before team execute.`
      : `Gather early intel on ${map} default lanes and coordinate utility before executing.`,
    bestSynergyPartner: isDuelist ? "Omen / Sova" : isController ? "Jett / Fade" : "Jett / Killjoy",
    criticalMistakeToAvoid: isDuelist
      ? "Pushing past teammate smokes without checking close 50/50 corners."
      : "Using all defensive stall utility before enemy executes are committed.",
  };
}

export default function MyValorantProfilePage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<MyValoProfile>(DEFAULT_PROFILE);
  const [isSyncing, setIsSyncing] = useState(false);
  const [savedBookmarksCount, setSavedBookmarksCount] = useState(0);

  // Load from LocalStorage on mount
  useEffect(() => {
    try {
      const local = localStorage.getItem("my_valorant_profile");
      if (local) {
        setProfile(JSON.parse(local));
      }
      const bookmarks = JSON.parse(localStorage.getItem("vlopedia_saved_bookmarks") || "[]");
      setSavedBookmarksCount(bookmarks.length);
    } catch (e) {
      console.error(e);
    }
  }, []);

  // Load from Firebase if user is logged in
  useEffect(() => {
    if (!user) return;
    const fetchCloud = async () => {
      try {
        const db = getFirebaseFirestore();
        const docRef = doc(db, "users", user.uid);
        const snap = await getDoc(docRef);
        if (snap.exists()) {
          const data = snap.data();
          const merged: MyValoProfile = {
            riotId: data.riotId || DEFAULT_PROFILE.riotId,
            tagline: data.tagline || DEFAULT_PROFILE.tagline,
            mainAgent: data.favoriteAgent || DEFAULT_PROFILE.mainAgent,
            favMap: data.favoriteMap || DEFAULT_PROFILE.favMap,
            favWeapon: data.favoriteWeapon || DEFAULT_PROFILE.favWeapon,
            dpi: Number(data.dpi) || DEFAULT_PROFILE.dpi,
            sensitivity: Number(data.sensitivity) || DEFAULT_PROFILE.sensitivity,
            crosshairCode: data.crosshairCode || DEFAULT_PROFILE.crosshairCode,
          };
          setProfile(merged);
          localStorage.setItem("my_valorant_profile", JSON.stringify(merged));
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchCloud();
  }, [user]);

  const handleSaveLocal = (newProfile: MyValoProfile) => {
    setProfile(newProfile);
    localStorage.setItem("my_valorant_profile", JSON.stringify(newProfile));
    toast.success("My VALORANT settings saved locally!");
  };

  const handleCloudSync = async () => {
    if (!user) {
      toast.info("Sign in with Firebase to sync your profile to the cloud across devices.");
      return;
    }
    setIsSyncing(true);
    try {
      const db = getFirebaseFirestore();
      const docRef = doc(db, "users", user.uid);
      await setDoc(docRef, {
        riotId: profile.riotId,
        tagline: profile.tagline,
        favoriteAgent: profile.mainAgent,
        favoriteMap: profile.favMap,
        favoriteWeapon: profile.favWeapon,
        dpi: profile.dpi,
        sensitivity: profile.sensitivity,
        crosshairCode: profile.crosshairCode,
        lastUpdated: new Date().toISOString(),
      }, { merge: true });
      toast.success("Profile synchronized with cloud database!");
    } catch (e) {
      toast.error("Failed to sync profile to cloud.");
    } finally {
      setIsSyncing(false);
    }
  };

  const edpi = Math.round(profile.dpi * profile.sensitivity);
  const cm360 = (13054.545 / edpi).toFixed(1);
  const advice = getBeforeYouQueueAdvice(profile.mainAgent, profile.favMap);

  const shareableUrl = typeof window !== "undefined" 
    ? `${window.location.origin}/setup?agent=${encodeURIComponent(profile.mainAgent)}&sens=${profile.sensitivity}&dpi=${profile.dpi}&weapon=${encodeURIComponent(profile.favWeapon)}`
    : "";

  return (
    <PageTransition>
      <div className="min-h-screen bg-[#0B141A] text-foreground py-12">
        <Container className="space-y-10">
          
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[rgba(236,232,225,0.08)] pb-8">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="h-[2px] w-8 bg-primary" />
                <span className="font-mono text-xs uppercase tracking-[0.3em] text-primary font-bold">
                  PERSONAL TACTICAL COMMAND
                </span>
              </div>
              <h1 className="font-display font-black text-4xl uppercase tracking-tight text-white sm:text-5xl">
                MY VALORANT
              </h1>
              <p className="font-sans text-sm text-secondary">
                Your personal loadout, aiming kinematics, saved bookmarks, and custom pre-match briefing.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(shareableUrl);
                  toast.success("Shareable Player Setup link copied to clipboard!");
                }}
                className="font-mono text-xs uppercase px-4 py-2 border border-primary/40 bg-primary/10 text-primary font-bold hover:bg-primary/20 transition-colors flex items-center gap-2"
              >
                <Share2 className="h-4 w-4" />
                <span>Share My Setup</span>
              </button>

              {user ? (
                <button
                  onClick={handleCloudSync}
                  disabled={isSyncing}
                  className="font-mono text-xs uppercase px-4 py-2 border border-[#0DF2F2]/40 bg-[#0DF2F2]/10 text-[#0DF2F2] font-bold hover:bg-[#0DF2F2]/20 transition-colors flex items-center gap-2"
                >
                  <RefreshCw className={`h-4 w-4 ${isSyncing ? "animate-spin" : ""}`} />
                  <span>Cloud Sync</span>
                </button>
              ) : (
                <Link
                  href="/tools"
                  className="font-mono text-xs uppercase px-4 py-2 border border-[rgba(236,232,225,0.15)] bg-surface text-secondary hover:text-white transition-colors"
                >
                  Explore Tools
                </Link>
              )}
            </div>
          </div>

          {/* ── BEFORE YOU QUEUE Tactical Briefing Box ── */}
          <div className="border border-primary/40 bg-gradient-to-r from-primary/10 via-[#0D1A22] to-[#0D1A22] p-6 sm:p-8 clip-diagonal space-y-6 shadow-xl">
            <div className="flex items-center justify-between border-b border-[rgba(236,232,225,0.08)] pb-4">
              <div className="flex items-center gap-3">
                <Zap className="h-5 w-5 text-primary" />
                <div>
                  <span className="font-mono text-[10px] uppercase tracking-widest text-primary font-bold block">
                    TACTICAL PRE-MATCH BRIEFING
                  </span>
                  <h2 className="font-display font-black text-2xl uppercase text-white">
                    BEFORE YOU QUEUE // {profile.mainAgent.toUpperCase()} ON {profile.favMap.toUpperCase()}
                  </h2>
                </div>
              </div>
              <Link
                href={`/comp-builder?agents=${profile.mainAgent.toLowerCase()}&map=${profile.favMap.toLowerCase()}`}
                className="hidden sm:inline-flex items-center gap-1.5 font-mono text-xs uppercase text-primary hover:text-primary-hover font-bold"
              >
                <span>Full Map Comp Analysis</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="border border-[rgba(236,232,225,0.06)] bg-[#08111A] p-4 space-y-1">
                <span className="font-mono text-[9px] uppercase text-muted block">Recommended Gun Buy</span>
                <span className="font-sans text-xs font-bold text-white block">{advice.recommendedBuy}</span>
              </div>
              <div className="border border-[rgba(236,232,225,0.06)] bg-[#08111A] p-4 space-y-1">
                <span className="font-mono text-[9px] uppercase text-muted block">Primary Objective</span>
                <span className="font-sans text-xs text-secondary leading-snug block">{advice.primaryObjective}</span>
              </div>
              <div className="border border-[rgba(236,232,225,0.06)] bg-[#08111A] p-4 space-y-1">
                <span className="font-mono text-[9px] uppercase text-muted block">Ideal Partner Utility</span>
                <span className="font-sans text-xs font-bold text-[#0DF2F2] block">{advice.bestSynergyPartner}</span>
              </div>
              <div className="border border-error/20 bg-error/5 p-4 space-y-1">
                <span className="font-mono text-[9px] uppercase text-error font-bold block">Danger / Avoid</span>
                <span className="font-sans text-xs text-secondary leading-snug block">{advice.criticalMistakeToAvoid}</span>
              </div>
            </div>
          </div>

          {/* Main Profile Customizer Grid */}
          <div className="grid gap-8 lg:grid-cols-3">
            
            {/* Left: Loadout Configuration */}
            <div className="border border-[rgba(236,232,225,0.08)] bg-[#0D1A22] p-6 clip-diagonal space-y-6">
              <h3 className="font-display font-black text-xl uppercase text-white border-b border-[rgba(236,232,225,0.08)] pb-3 flex items-center gap-2">
                <Target className="h-4 w-4 text-primary" />
                <span>Tactical Loadout</span>
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block font-mono text-[10px] uppercase text-muted mb-1.5">Main Agent</label>
                  <select
                    value={profile.mainAgent}
                    onChange={(e) => handleSaveLocal({ ...profile, mainAgent: e.target.value })}
                    className="w-full bg-[#08111A] border border-[rgba(236,232,225,0.15)] px-3 py-2 font-sans text-xs text-white focus:border-primary focus:outline-none"
                  >
                    {AGENTS_LIST.map(a => <option key={a} value={a}>{a}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block font-mono text-[10px] uppercase text-muted mb-1.5">Current Active Map</label>
                  <select
                    value={profile.favMap}
                    onChange={(e) => handleSaveLocal({ ...profile, favMap: e.target.value })}
                    className="w-full bg-[#08111A] border border-[rgba(236,232,225,0.15)] px-3 py-2 font-sans text-xs text-white focus:border-primary focus:outline-none"
                  >
                    {MAPS_LIST.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block font-mono text-[10px] uppercase text-muted mb-1.5">Signature Weapon</label>
                  <select
                    value={profile.favWeapon}
                    onChange={(e) => handleSaveLocal({ ...profile, favWeapon: e.target.value })}
                    className="w-full bg-[#08111A] border border-[rgba(236,232,225,0.15)] px-3 py-2 font-sans text-xs text-white focus:border-primary focus:outline-none"
                  >
                    {WEAPONS_LIST.map(w => <option key={w} value={w}>{w}</option>)}
                  </select>
                </div>
              </div>
            </div>

            {/* Middle: Aim Kinematics & Sensitivity */}
            <div className="border border-[rgba(236,232,225,0.08)] bg-[#0D1A22] p-6 clip-diagonal space-y-6">
              <h3 className="font-display font-black text-xl uppercase text-white border-b border-[rgba(236,232,225,0.08)] pb-3 flex items-center gap-2">
                <Crosshair className="h-4 w-4 text-[#0DF2F2]" />
                <span>Aim Kinematics</span>
              </h3>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-mono text-[10px] uppercase text-muted mb-1.5">Mouse DPI</label>
                    <input
                      type="number"
                      value={profile.dpi}
                      onChange={(e) => handleSaveLocal({ ...profile, dpi: Number(e.target.value) || 800 })}
                      className="w-full bg-[#08111A] border border-[rgba(236,232,225,0.15)] px-3 py-2 font-mono text-xs text-white focus:border-primary focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-[10px] uppercase text-muted mb-1.5">In-Game Sens</label>
                    <input
                      type="number"
                      step="0.01"
                      value={profile.sensitivity}
                      onChange={(e) => handleSaveLocal({ ...profile, sensitivity: Number(e.target.value) || 0.3 })}
                      className="w-full bg-[#08111A] border border-[rgba(236,232,225,0.15)] px-3 py-2 font-mono text-xs text-white focus:border-primary focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 border border-[rgba(236,232,225,0.06)] bg-[#08111A] p-3 text-center">
                  <div>
                    <span className="font-mono text-[9px] uppercase text-muted block">Effective DPI</span>
                    <span className="font-mono text-lg font-black text-primary">{edpi} eDPI</span>
                  </div>
                  <div>
                    <span className="font-mono text-[9px] uppercase text-muted block">Turn Distance</span>
                    <span className="font-mono text-lg font-black text-[#0DF2F2]">{cm360} cm/360°</span>
                  </div>
                </div>

                <div>
                  <label className="block font-mono text-[10px] uppercase text-muted mb-1.5">Crosshair Profile Code</label>
                  <input
                    type="text"
                    value={profile.crosshairCode}
                    onChange={(e) => handleSaveLocal({ ...profile, crosshairCode: e.target.value })}
                    className="w-full bg-[#08111A] border border-[rgba(236,232,225,0.15)] px-3 py-2 font-mono text-[10px] text-white focus:border-primary focus:outline-none truncate"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(profile.crosshairCode);
                      toast.success("Crosshair code copied to clipboard!");
                    }}
                    className="mt-1.5 font-mono text-[9px] uppercase text-primary hover:underline"
                  >
                    Copy In-Game Import String →
                  </button>
                </div>
              </div>
            </div>

            {/* Right: Saved Activity & Quick Navigation */}
            <div className="border border-[rgba(236,232,225,0.08)] bg-[#0D1A22] p-6 clip-diagonal space-y-6">
              <h3 className="font-display font-black text-xl uppercase text-white border-b border-[rgba(236,232,225,0.08)] pb-3 flex items-center gap-2">
                <Bookmark className="h-4 w-4 text-primary" />
                <span>Saved Intel</span>
              </h3>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 border border-[rgba(236,232,225,0.06)] bg-[#08111A]">
                  <div>
                    <span className="font-sans text-xs font-bold text-white block">Saved Bookmarks</span>
                    <span className="font-mono text-[10px] text-muted">{savedBookmarksCount} articles & dossiers saved</span>
                  </div>
                  <button
                    onClick={() => window.dispatchEvent(new CustomEvent("open_bookmarks_drawer"))}
                    className="font-mono text-xs uppercase px-2.5 py-1 border border-primary/30 bg-primary/10 text-primary font-bold hover:bg-primary/20 transition-colors"
                  >
                    View All
                  </button>
                </div>

                <Link
                  href={`/agents/${profile.mainAgent.toLowerCase()}`}
                  className="flex items-center justify-between p-3 border border-[rgba(236,232,225,0.06)] bg-[#08111A] hover:border-primary/40 transition-colors block"
                >
                  <div>
                    <span className="font-sans text-xs font-bold text-white block">Main Agent Dossier</span>
                    <span className="font-mono text-[10px] text-muted">Review {profile.mainAgent} tips & counters</span>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted" />
                </Link>

                <Link
                  href={`/maps/${profile.favMap.toLowerCase()}`}
                  className="flex items-center justify-between p-3 border border-[rgba(236,232,225,0.06)] bg-[#08111A] hover:border-primary/40 transition-colors block"
                >
                  <div>
                    <span className="font-sans text-xs font-bold text-white block">Map Tactics & Layout</span>
                    <span className="font-mono text-[10px] text-muted">{profile.favMap} site callouts</span>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted" />
                </Link>
              </div>
            </div>

          </div>

        </Container>
      </div>
    </PageTransition>
  );
}
