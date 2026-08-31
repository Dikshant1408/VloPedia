"use client";

import React, { useState, useEffect, useCallback } from "react";
import { getFirebaseFirestore } from "@/services/firebase";
import { collection, getDocs, doc, writeBatch, serverTimestamp, query } from "firebase/firestore";
import { ValorantImporter } from "@/lib/valorant-importer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Database, RefreshCw, Cpu, CheckCircle2, AlertTriangle, Play, Flame, ShieldAlert } from "lucide-react";
import { toast } from "sonner";

export default function AdminPage() {
  const [dbCounts, setDbCounts] = useState({
    agents: 0,
    weapons: 0,
    skins: 0,
    bundles: 0,
    maps: 0,
    logs: 0
  });
  
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [latestRuns, setLatestRuns] = useState<any[]>([]);
  const db = getFirebaseFirestore();

  const fetchTelemetry = useCallback(async () => {
    try {
      const getCount = async (collName: string) => {
        const snap = await getDocs(collection(db, collName));
        return snap.size;
      };
      
      const counts = {
        agents: await getCount("agents"),
        weapons: await getCount("weapons"),
        skins: await getCount("skins"),
        bundles: await getCount("bundles"),
        maps: await getCount("maps"),
        logs: await getCount("import_logs")
      };
      setDbCounts(counts);

      // Fetch latest logs
      const logsSnap = await getDocs(collection(db, "import_logs"));
      const logsList = logsSnap.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })).sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      setLatestRuns(logsList.slice(0, 5));

    } catch (err) {
      console.error("Telemetry query failed:", err);
    }
  }, [db]);

  useEffect(() => {
    fetchTelemetry();
  }, [fetchTelemetry]);

  const handleRunPipeline = async () => {
    setLoading(true);
    setLogs([]);
    toast.info("Ingestion pipeline sequence initiated...", { className: "font-mono rounded-none" });

    try {
      const importer = new ValorantImporter();
      const res = await importer.ingestAll((msg) => {
        setLogs((prev) => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);
      });

      if (res.success) {
        toast.success("VALORANT Ingestion completed successfully!", { className: "font-mono rounded-none" });
      } else {
        toast.error("Pipeline encountered errors. Check terminal output.", { className: "font-mono rounded-none" });
      }
      
      await fetchTelemetry();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Pipeline crashed during initialization.";
      setLogs((prev) => [...prev, `[FATAL EXCEPTION] ${message}`]);
      toast.error("Pipeline crashed during initialization.");
    } finally {
      setLoading(false);
    }
  };

  const handleClearCollections = async () => {
    if (!confirm("WARNING: This will purge agents, weapons, skins, bundles, and maps collections. Continue?")) return;
    setLoading(true);
    toast.warning("Purging target collections...", { className: "font-mono rounded-none" });

    try {
      const collectionsToPurge = ["agents", "weapons", "skins", "bundles", "maps", "search_index"];
      for (const colName of collectionsToPurge) {
        const snap = await getDocs(collection(db, colName));
        const batch = writeBatch(db);
        snap.docs.forEach((d) => batch.delete(d.ref));
        await batch.commit();
      }
      toast.success("Collections successfully purged.");
      await fetchTelemetry();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Purge failed";
      toast.error(`Purge failed: ${message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B141A] py-16 px-6 font-mono text-foreground">
      <div className="mx-auto max-w-6xl space-y-10">
        
        {/* Banner header */}
        <div className="border border-primary/20 bg-surface p-8 relative space-y-2">
          <div className="absolute left-0 top-0 h-[2px] w-16 bg-primary" />
          <span className="text-[10px] text-primary font-black tracking-widest block">{"// DECLASSIFIED COMMAND OVERRIDE //"}</span>
          <h1 className="text-4xl font-sans font-black text-white uppercase tracking-wider">VALOVAULT INGESTION DECK</h1>
          <p className="text-xs text-muted font-sans">
            Directly orchestrate data harvesting operations from remote CDN networks into Cloud Firestore buckets.
          </p>
        </div>

        {/* Telemetry Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-6">
          {[
            { label: "AGENTS", val: dbCounts.agents, desc: "Playable matrix profiles" },
            { label: "WEAPONS", val: dbCounts.weapons, desc: "Armory base models" },
            { label: "SKINS", val: dbCounts.skins, desc: "Hues & chromas index" },
            { label: "BUNDLES", val: dbCounts.bundles, desc: "Promotional skin groups" },
            { label: "MAPS", val: dbCounts.maps, desc: "Vector geometry files" },
            { label: "IMPORT LOGS", val: dbCounts.logs, desc: "Pipeline run telemetry" }
          ].map((item) => (
            <Card key={item.label} className="border border-[rgba(236,232,225,0.08)] bg-[rgba(15,28,36,0.8)] p-5 relative overflow-hidden flex flex-col justify-between h-32">
              <span className="text-[9px] text-muted font-black block">{"//"} {item.label}</span>
              <span className="text-3xl font-sans font-black text-white my-1">{item.val}</span>
              <span className="text-[8px] text-muted block leading-tight">{item.desc}</span>
            </Card>
          ))}
        </div>

        {/* Main interactive controls */}
        <div className="grid gap-8 lg:grid-cols-[1fr_1.5fr]">
          
          {/* Controls Column */}
          <div className="space-y-6">
            <div className="border border-[rgba(236,232,225,0.08)] bg-[rgba(15,28,36,0.8)] p-6 space-y-6">
              <span className="text-[10px] text-primary font-black block border-b border-border pb-2">
                {"// CORES CONTROLS"}
              </span>

              <div className="space-y-3">
                <Button 
                  onClick={handleRunPipeline} 
                  disabled={loading}
                  className="w-full justify-start cut-corner-br bg-primary hover:bg-[#E8404E] text-black font-black text-xs h-11"
                >
                  <Play className="h-4 w-4 mr-2" />
                  HARVEST DYNAMIC API (RE-SYNC)
                </Button>

                <Button 
                  onClick={handleClearCollections} 
                  disabled={loading}
                  variant="secondary"
                  className="w-full justify-start border-primary/40 text-primary hover:bg-primary-soft font-bold text-xs h-11"
                >
                  <Flame className="h-4 w-4 mr-2" />
                  PURGE INDEX DATABASE
                </Button>
              </div>
            </div>

            {/* Run logs summary list */}
            <div className="border border-[rgba(236,232,225,0.08)] bg-[rgba(15,28,36,0.8)] p-6 space-y-4">
              <span className="text-[10px] text-foreground font-black block border-b border-border pb-2">
                {"// LATEST PIPELINE RUNS"}
              </span>
              
              <div className="space-y-2">
                {latestRuns.length === 0 ? (
                  <span className="text-[10px] text-muted">NO REGISTERED IMPORT RUNS FOUND</span>
                ) : (
                  latestRuns.map((r, i) => (
                    <div key={r.id || i} className="border border-border/60 bg-black/40 p-3 text-[10px] flex justify-between items-center">
                      <div>
                        <span className="font-bold text-white block">RUN_{r.id?.slice(0, 6)}</span>
                        <span className="text-muted">{new Date(r.timestamp).toLocaleString()}</span>
                      </div>
                      {r.success ? (
                        <span className="text-success font-bold flex items-center gap-1">
                          <CheckCircle2 className="h-3 w-3" /> OK
                        </span>
                      ) : (
                        <span className="text-primary font-bold flex items-center gap-1">
                          <ShieldAlert className="h-3 w-3" /> FAILED
                        </span>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>

          {/* Glowing console display Column */}
          <div className="border border-[rgba(236,232,225,0.08)] bg-[rgba(15,28,36,0.8)] p-6 flex flex-col justify-between h-[450px]">
            <div className="flex justify-between items-center border-b border-border pb-2 mb-4">
              <span className="text-[10px] text-primary font-black tracking-widest flex items-center gap-1.5">
                <Cpu className="h-4 w-4 animate-pulse" /> {"// OPERATIONS TELEMETRY MONITOR"}
              </span>
              <span className="text-[9px] text-muted">STATUS: {loading ? "ACTIVE" : "IDLE"}</span>
            </div>

            <div className="bg-black/60 border border-border p-4 font-mono text-[10px] text-success flex-1 overflow-y-auto leading-relaxed space-y-1 scrollbar-thin select-text">
              {logs.length === 0 ? (
                <div className="text-muted h-full flex items-center justify-center">
                  {"// DECRYPT SYSTEM STANDING BY. AWAITING INGEST DIRECTIVES..."}
                </div>
              ) : (
                logs.map((log, i) => (
                  <div key={i} className="whitespace-pre-wrap">
                    {log}
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
