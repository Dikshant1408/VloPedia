import { valorantDb } from "../src/lib/valorant-db.ts";

async function audit() {
  console.log("=== STEP 1: AUDIT CURRENT DATA ===");
  
  // 1. Fetch live API data
  const [agentsRes, weaponsRes, mapsRes, bundlesRes] = await Promise.all([
    fetch("https://valorant-api.com/v1/agents?isPlayableCharacter=true"),
    fetch("https://valorant-api.com/v1/weapons"),
    fetch("https://valorant-api.com/v1/maps"),
    fetch("https://valorant-api.com/v1/bundles"),
  ]);

  const [agentsJson, weaponsJson, mapsJson, bundlesJson] = await Promise.all([
    agentsRes.json(),
    weaponsRes.json(),
    mapsRes.json(),
    bundlesRes.json(),
  ]);

  console.log("\n--- AGENTS AUDIT ---");
  const apiAgents = agentsJson.data;
  console.log(`API Playable Agents count: ${apiAgents.length}`);
  console.log(`DB Agents count: ${valorantDb.agents.length}`);
  
  const dbAgentNames = valorantDb.agents.map(a => a.name.toUpperCase());
  const apiAgentNames = apiAgents.map(a => a.displayName.toUpperCase());
  
  for (const apiA of apiAgents) {
    const inDb = dbAgentNames.includes(apiA.displayName.toUpperCase());
    if (!inDb) {
      console.log(`[AGENT ADDED IN API]: ${apiA.displayName} (${apiA.role?.displayName})`);
    }
  }
  for (const dbA of valorantDb.agents) {
    const inApi = apiAgentNames.includes(dbA.name.toUpperCase());
    if (!inApi) {
      console.log(`[AGENT IN DB BUT NOT IN API]: ${dbA.name}`);
    }
  }

  // Check agent abilities
  for (const dbA of valorantDb.agents) {
    const apiA = apiAgents.find(a => a.displayName.toUpperCase() === dbA.name.toUpperCase());
    if (apiA) {
      const apiAbilityCount = (apiA.abilities || []).length;
      const dbAbilityCount = (dbA.abilities || []).length;
      if (apiAbilityCount !== dbAbilityCount) {
        console.log(`[AGENT ABILITIES COUNT MISMATCH]: ${dbA.name} - DB: ${dbAbilityCount}, API: ${apiAbilityCount}`);
      }
    }
  }

  console.log("\n--- WEAPONS AUDIT ---");
  const apiWeapons = weaponsJson.data;
  console.log(`API Weapons count: ${apiWeapons.length}`);
  console.log(`DB Weapons count: ${valorantDb.weapons.length}`);
  
  for (const apiW of apiWeapons) {
    const dbW = valorantDb.weapons.find(w => w.name.toUpperCase() === apiW.displayName.toUpperCase());
    if (!dbW) {
      console.log(`[WEAPON IN API BUT NOT IN DB]: ${apiW.displayName} (${apiW.category}, Cost: ${apiW.shopData?.cost})`);
    } else {
      const apiCost = apiW.shopData?.cost ?? 0;
      const apiMag = apiW.weaponStats?.magazineSize ?? 0;
      const apiRate = apiW.weaponStats?.fireRate ?? 0;
      const apiDmg = apiW.weaponStats?.damageRanges?.[0] || {};
      const diffs = [];
      if (dbW.cost !== apiCost) diffs.push(`cost: DB ${dbW.cost} vs API ${apiCost}`);
      if (dbW.magazineSize !== apiMag) diffs.push(`mag: DB ${dbW.magazineSize} vs API ${apiMag}`);
      if (Math.abs(dbW.fireRate - apiRate) > 0.05) diffs.push(`rate: DB ${dbW.fireRate} vs API ${apiRate}`);
      if (dbW.dmgHead !== apiDmg.headDamage) diffs.push(`head: DB ${dbW.dmgHead} vs API ${apiDmg.headDamage}`);
      if (dbW.dmgBody !== apiDmg.bodyDamage) diffs.push(`body: DB ${dbW.dmgBody} vs API ${apiDmg.bodyDamage}`);
      if (dbW.dmgLeg !== Math.round(apiDmg.legDamage)) diffs.push(`leg: DB ${dbW.dmgLeg} vs API ${apiDmg.legDamage}`);
      if (diffs.length > 0) {
        console.log(`[WEAPON STAT DIFF] ${dbW.name}: ${diffs.join(", ")}`);
      }
    }
  }

  console.log("\n--- MAPS AUDIT ---");
  const apiMaps = mapsJson.data.filter(m => m.splash && m.displayIcon);
  console.log(`API Playable Maps count: ${apiMaps.length}`);
  console.log(`DB Maps count: ${valorantDb.maps.length}`);

  for (const apiM of apiMaps) {
    const dbM = valorantDb.maps.find(m => m.name.toUpperCase() === apiM.displayName.toUpperCase());
    if (!dbM) {
      console.log(`[MAP IN API BUT NOT IN DB]: ${apiM.displayName} (coords: ${apiM.coordinates})`);
    }
  }

  for (const dbM of valorantDb.maps) {
    const apiM = apiMaps.find(m => m.displayName.toUpperCase() === dbM.name.toUpperCase());
    if (!apiM) {
      console.log(`[MAP IN DB BUT NOT IN PLAYABLE API]: ${dbM.name}`);
    }
  }

  console.log("\n--- BUNDLES AUDIT ---");
  const apiBundles = bundlesJson.data;
  console.log(`API Bundles count: ${apiBundles.length}`);
  console.log(`DB Bundles count: ${valorantDb.bundles.length}`);

  console.log("\n--- SKINS AUDIT ---");
  console.log(`DB Skins count: ${valorantDb.skins.length}`);

  console.log("\n--- PATCHES AUDIT ---");
  console.log(`DB Patches count: ${valorantDb.patches.length}`);
  console.log(`Latest DB Patch: ${valorantDb.patches[0]?.version} (${valorantDb.patches[0]?.date})`);

  console.log("\n=== AUDIT COMPLETE ===");
}

audit().catch(console.error);
