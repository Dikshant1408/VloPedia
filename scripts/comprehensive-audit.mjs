import { valorantDb } from "../src/lib/valorant-db.ts";
import agentMeta from "../src/data/agent-meta.json" with { type: "json" };
import canonicalGraph from "../src/data/canonical-graph.json" with { type: "json" };
import agentCounters from "../src/data/relationships/agent-counters.json" with { type: "json" };
import agentMapFit from "../src/data/relationships/agent-map-fit.json" with { type: "json" };
import agentSynergies from "../src/data/relationships/agent-synergies.json" with { type: "json" };
import agentWeapons from "../src/data/relationships/agent-weapons.json" with { type: "json" };

async function comprehensiveAudit() {
  console.log("=== COMPREHENSIVE DATA AUDIT ===");

  const [agentsRes, weaponsRes, mapsRes, bundlesRes, gamemodesRes] = await Promise.all([
    fetch("https://valorant-api.com/v1/agents?isPlayableCharacter=true"),
    fetch("https://valorant-api.com/v1/weapons"),
    fetch("https://valorant-api.com/v1/maps"),
    fetch("https://valorant-api.com/v1/bundles"),
    fetch("https://valorant-api.com/v1/gamemodes"),
  ]);

  const [agentsJson, weaponsJson, mapsJson, bundlesJson, gamemodesJson] = await Promise.all([
    agentsRes.json(),
    weaponsRes.json(),
    mapsRes.json(),
    bundlesRes.json(),
    gamemodesRes.json(),
  ]);

  const apiAgents = agentsJson.data;
  const apiWeapons = weaponsJson.data;
  const apiMaps = mapsJson.data;
  const apiBundles = bundlesJson.data;
  const apiGamemodes = gamemodesJson.data;

  console.log("\n--- AGENT META JSON AUDIT ---");
  console.log(`agent-meta.json patchVersion: ${agentMeta.metadata.patchVersion}`);
  console.log(`agent-meta.json season: ${agentMeta.metadata.season}`);
  console.log(`agent-meta.json lastVerified: ${agentMeta.metadata.lastVerified}`);
  const metaTierKeys = Object.keys(agentMeta.tiers);
  console.log(`Agents in agent-meta.json: ${metaTierKeys.length}`);
  const missingInMeta = apiAgents.filter(a => !metaTierKeys.some(k => k.toLowerCase() === a.displayName.toLowerCase()));
  console.log("Missing from agent-meta.json tiers:", missingInMeta.map(a => a.displayName));

  console.log("\n--- AGENT RELATIONSHIPS AUDIT ---");
  const counterAgents = new Set(agentCounters.map(c => c.fromEntity));
  console.log(`Agents in agent-counters.json: ${counterAgents.size}`);
  const mapFitAgents = new Set(agentMapFit.map(c => c.fromEntity));
  console.log(`Agents in agent-map-fit.json: ${mapFitAgents.size}`);

  console.log("\n--- CANONICAL GRAPH AUDIT ---");
  console.log(`canonical-graph.json entities count: ${canonicalGraph.entities.length}`);
  console.log(`canonical-graph.json version: ${canonicalGraph.version}`);

  console.log("\n--- WEAPONS AUDIT ---");
  console.log(`API weapons (${apiWeapons.length}):`, apiWeapons.map(w => w.displayName));
  console.log(`DB weapons (${valorantDb.weapons.length}):`, valorantDb.weapons.map(w => w.name));

  console.log("\n--- MAPS AUDIT ---");
  console.log("Playable standard & TDM maps in API:");
  apiMaps.filter(m => m.splash && m.displayIcon).forEach(m => {
    console.log(`  ${m.displayName}: coords="${m.coordinates || 'N/A'}", sites="${m.tacticalDescription || 'N/A'}"`);
  });

  console.log("\n--- GAME MODES AUDIT ---");
  console.log(`API Game modes (${apiGamemodes.length}):`, apiGamemodes.map(g => g.displayName));

  console.log("\n--- BUNDLES SUMMARY ---");
  console.log(`Recent API Bundles (first 10):`, apiBundles.slice(0, 10).map(b => b.displayName));

  console.log("\n--- PATCHES IN DB ---");
  console.log(valorantDb.patches.slice(0, 5).map(p => `${p.version} (${p.date}): ${p.title}`));
}

comprehensiveAudit().catch(console.error);
