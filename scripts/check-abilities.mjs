import { valorantDb } from "../src/lib/valorant-db.ts";

async function checkAbilities() {
  const r = await fetch("https://valorant-api.com/v1/agents?isPlayableCharacter=true");
  const j = await r.json();
  for (const a of j.data) {
    const dbA = valorantDb.agents.find(x => x.name.toLowerCase() === a.displayName.toLowerCase());
    if (!dbA) {
      console.log("AGENT MISSING IN DB:", a.displayName);
      continue;
    }
    const apiAbilNames = (a.abilities || []).map(x => x.displayName.toUpperCase());
    const dbAbilNames = (dbA.abilities || []).map(x => x.name.toUpperCase());
    const missing = apiAbilNames.filter(n => !dbAbilNames.some(dn => dn.includes(n) || n.includes(dn)));
    if (missing.length > 0) {
      console.log(a.displayName + " MISSING ABILITIES IN DB:", missing);
    }
  }
}

checkAbilities().catch(console.error);
