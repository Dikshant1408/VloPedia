import fs from "fs";

async function run() {
  console.log("=== CHECKING ALL LATEST VALORANT DATA ===");

  // 1. Version
  const versionRes = await fetch("https://valorant-api.com/v1/version").then(r => r.json());
  console.log("Live Version:", versionRes.data.version);
  console.log("Live Branch:", versionRes.data.branch);
  console.log("Build Date:", versionRes.data.buildDate);

  // 2. Agents
  const agentsRes = await fetch("https://valorant-api.com/v1/agents?isPlayableCharacter=true").then(r => r.json());
  console.log("\nLive Playable Agents:", agentsRes.data.length);

  // 3. Weapons
  const weaponsRes = await fetch("https://valorant-api.com/v1/weapons").then(r => r.json());
  console.log("Live Weapons:", weaponsRes.data.length);

  // 4. Maps
  const mapsRes = await fetch("https://valorant-api.com/v1/maps").then(r => r.json());
  const playableMaps = mapsRes.data.filter(m => m.splash && m.displayIcon);
  console.log("Live Playable Maps:", playableMaps.length);

  // 5. Competitive Tiers
  const tiersRes = await fetch("https://valorant-api.com/v1/competitivetiers").then(r => r.json());
  const latestTierGroup = tiersRes.data[tiersRes.data.length - 1];
  console.log("Latest Tier Set:", latestTierGroup.assetObjectName, "tiers:", latestTierGroup.tiers.length);

  // 6. Bundles
  const bundlesRes = await fetch("https://valorant-api.com/v1/bundles").then(r => r.json());
  console.log("Live Bundles Count:", bundlesRes.data.length);

  // 7. Sprays, Buddies, Player Cards
  const [spraysRes, buddiesRes, cardsRes] = await Promise.all([
    fetch("https://valorant-api.com/v1/sprays").then(r => r.json()),
    fetch("https://valorant-api.com/v1/buddies").then(r => r.json()),
    fetch("https://valorant-api.com/v1/playercards").then(r => r.json()),
  ]);
  console.log("Live Sprays:", spraysRes.data.length);
  console.log("Live Buddies:", buddiesRes.data.length);
  console.log("Live Player Cards:", cardsRes.data.length);

  // Read valorant-db.ts as text
  const dbContent = fs.readFileSync("./src/lib/valorant-db.ts", "utf8");

  // Check each agent in DB
  const missingAgents = [];
  for (const agent of agentsRes.data) {
    if (!dbContent.includes(`"${agent.displayName.toUpperCase()}"`)) {
      missingAgents.push(agent.displayName);
    }
  }
  console.log("\nAgents missing from DB:", missingAgents);

  // Check each weapon in DB
  const missingWeapons = [];
  for (const weapon of weaponsRes.data) {
    if (!dbContent.includes(`"${weapon.displayName.toUpperCase()}"`)) {
      missingWeapons.push(weapon.displayName);
    }
  }
  console.log("Weapons missing from DB:", missingWeapons);

  // Check each map in DB
  const missingMaps = [];
  for (const map of playableMaps) {
    if (!dbContent.includes(`"${map.displayName.toUpperCase()}"`)) {
      missingMaps.push(map.displayName);
    }
  }
  console.log("Maps missing from DB:", missingMaps);

  // Check abilities
  console.log("\n--- AGENT ABILITIES VERIFICATION ---");
  for (const agent of agentsRes.data) {
    for (const ability of agent.abilities) {
      if (ability.displayName && !dbContent.includes(ability.displayName)) {
        console.log(`[Ability missing in DB] ${agent.displayName} -> ${ability.displayName} (${ability.slot})`);
      }
    }
  }

  // Check competitive tiers fallback file
  const compFallback = JSON.parse(fs.readFileSync("./src/data/competitive-tiers-fallback.json", "utf8"));
  console.log("\nFallback competitive tiers count:", compFallback.length);
  console.log("Live tiers count:", latestTierGroup.tiers.length);

  // Check agent meta tiers
  const agentMeta = JSON.parse(fs.readFileSync("./src/data/agent-meta.json", "utf8"));
  console.log("\nAgent meta patch version:", agentMeta.metadata.patchVersion);
  console.log("Agent meta total agents:", Object.keys(agentMeta.tiers).length);

  // Check latest patches in valorant-db.ts
  const patchMatches = [...dbContent.matchAll(/"version":\s*"([^"]+)"/g)].map(m => m[1]);
  console.log("\nPatches currently in DB:", patchMatches.slice(0, 8));
}

run().catch(console.error);
