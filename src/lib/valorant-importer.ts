import { getFirebaseFirestore } from "@/services/firebase";
import { collection, doc, writeBatch, setDoc, addDoc, serverTimestamp, getDocs, deleteDoc } from "firebase/firestore";

function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-");
}

export type ImportProgressCallback = (msg: string) => void;

export class ValorantImporter {
  private db = getFirebaseFirestore();

  constructor() {}

  // Fetch helper with simple retries
  private async fetchWithRetry(url: string, retries = 3): Promise<any> {
    for (let i = 0; i < retries; i++) {
      try {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        return json.data;
      } catch (err) {
        if (i === retries - 1) throw err;
        await new Promise((r) => setTimeout(r, 1000 * (i + 1)));
      }
    }
  }

  // Orchestrate the whole ingestion pipeline
  public async ingestAll(onProgress?: ImportProgressCallback): Promise<{ success: boolean; stats: any; logId: string }> {
    const stats = {
      agents: 0,
      weapons: 0,
      skins: 0,
      bundles: 0,
      maps: 0,
      searchIndex: 0
    };
    
    const errors: string[] = [];
    onProgress?.("Initiating VALORANT Data Ingestion Pipeline...");

    try {
      // 1. Agents Ingestion
      onProgress?.("Ingesting playable Agents...");
      const rawAgents = await this.fetchWithRetry("https://valorant-api.com/v1/agents?isPlayableCharacter=true");
      const agentBatch = writeBatch(this.db);
      
      const agentsList = rawAgents.map((raw: any) => {
        const slug = slugify(raw.displayName);
        const agentDoc = {
          uuid: raw.uuid,
          slug,
          name: raw.displayName.toUpperCase(),
          role: (raw.role?.displayName || "DUELIST").toUpperCase(),
          origin: "Classified",
          bio: raw.description,
          portrait: raw.fullPortrait || raw.displayIconSmall || "",
          bestMaps: ["ascent", "haven", "bind"],
          counters: ["Cypher", "Killjoy"],
          voiceLines: [
            { context: "Match Start", text: `Protocol activated. Jett here.` }
          ],
          abilities: (raw.abilities || []).map((ab: any) => ({
            key: ab.slot === "Passive" ? "Passive" : ab.slot.replace("Ability", ""),
            name: ab.displayName || "Ability",
            type: ab.displayName || "Tactical Core",
            description: ab.description || "Diagnostics file unavailable."
          }))
        };
        
        const ref = doc(this.db, "agents", slug);
        agentBatch.set(ref, agentDoc, { merge: true });
        stats.agents++;
        return agentDoc;
      });
      await agentBatch.commit();
      onProgress?.(`Committed ${stats.agents} Agents to Firestore.`);

      // 2. Weapons & Skins Ingestion
      onProgress?.("Ingesting Weapons and Visual Skins catalog...");
      const rawWeapons = await this.fetchWithRetry("https://valorant-api.com/v1/weapons");
      const weaponBatch = writeBatch(this.db);
      const skinBatch = writeBatch(this.db);

      const weaponsList: any[] = [];
      const skinsList: any[] = [];

      rawWeapons.forEach((raw: any) => {
        const wSlug = slugify(raw.displayName);
        const statsObj = raw.weaponStats || {};
        
        const weaponDoc = {
          uuid: raw.uuid,
          slug: wSlug,
          name: raw.displayName.toUpperCase(),
          category: (raw.category?.split("::")[1] || "RIFLES").toUpperCase(),
          cost: raw.shopData?.cost || 1000,
          fireRate: statsObj.fireRate || 10,
          reloadSpeed: statsObj.reloadTimeSeconds || 2,
          magazineSize: statsObj.magazineSize || 30,
          dmgHead: statsObj.damageRanges?.[0]?.headDamage || 100,
          dmgBody: statsObj.damageRanges?.[0]?.bodyDamage || 30,
          dmgLeg: statsObj.damageRanges?.[0]?.legDamage || 25,
          description: `VALORANT weapon catalog entry for ${raw.displayName}. Class: ${raw.category?.split("::")[1] || "Armory"}.`,
          recoil: "Standard calibration parameters apply."
        };

        const wRef = doc(this.db, "weapons", wSlug);
        weaponBatch.set(wRef, weaponDoc, { merge: true });
        stats.weapons++;
        weaponsList.push(weaponDoc);

        // Skins under this weapon
        const skins = raw.skins || [];
        skins.forEach((sk: any) => {
          if (sk.displayName.includes("Standard") || sk.displayName.includes("Melee")) return;
          const sSlug = slugify(sk.displayName);
          
          const skinDoc = {
            uuid: sk.uuid,
            slug: sSlug,
            name: sk.displayName.toUpperCase(),
            weaponSlug: wSlug,
            weaponUuid: raw.uuid,
            price: 1775,
            rarity: "PREMIUM",
            variants: (sk.chromas || []).map((ch: any) => ({
              id: ch.uuid,
              name: ch.displayName,
              hex: ch.swatch || "#FF4655",
              hueRotate: ch.displayIcon ? "hue-rotate-0" : "hue-rotate-[180deg]"
            })),
            inspectVideoUrl: sk.levels?.[0]?.streamedVideo || null,
            reloadVideoUrl: sk.levels?.[0]?.streamedVideo || null,
            communityRating: 4.8,
            popularity: 90
          };

          const sRef = doc(this.db, "skins", sSlug);
          skinBatch.set(sRef, skinDoc, { merge: true });
          stats.skins++;
          skinsList.push(skinDoc);
        });
      });

      await weaponBatch.commit();
      await skinBatch.commit();
      onProgress?.(`Committed ${stats.weapons} Weapons & ${stats.skins} Custom Skins to Firestore.`);

      // 3. Bundles Ingestion
      onProgress?.("Ingesting Featured Bundles...");
      const rawBundles = await this.fetchWithRetry("https://valorant-api.com/v1/bundles");
      const bundleBatch = writeBatch(this.db);
      const bundlesList: any[] = [];

      rawBundles.forEach((raw: any) => {
        const bSlug = slugify(raw.displayName);
        const bundleDoc = {
          uuid: raw.uuid,
          slug: bSlug,
          name: raw.displayName.toUpperCase(),
          price: 7100,
          active: false,
          endsInSeconds: 0,
          skins: [],
          description: raw.description || `Tactical skin collections index for ${raw.displayName}.`,
          trailerUrl: "https://www.youtube.com/embed/e_E9W2GD7Zw"
        };
        const bRef = doc(this.db, "bundles", bSlug);
        bundleBatch.set(bRef, bundleDoc, { merge: true });
        stats.bundles++;
        bundlesList.push(bundleDoc);
      });
      await bundleBatch.commit();
      onProgress?.(`Committed ${stats.bundles} Bundles to Firestore.`);

      // 4. Maps Ingestion
      onProgress?.("Ingesting Maps coordinates...");
      const rawMaps = await this.fetchWithRetry("https://valorant-api.com/v1/maps");
      const mapBatch = writeBatch(this.db);
      const mapsList: any[] = [];

      rawMaps.forEach((raw: any) => {
        const mSlug = slugify(raw.displayName);
        const mapDoc = {
          uuid: raw.uuid,
          slug: mSlug,
          name: raw.displayName.toUpperCase(),
          location: raw.coordinates || "Classified Sector",
          lore: raw.narrativeDescription || `Tactical skirmishes vector map located at ${raw.coordinates || "Classified"}.`,
          callouts: (raw.callouts || []).map((c: any) => c.regionName || "Sector"),
          strategies: ["Control critical lines of sight", "Hold narrow choke points"],
          minimapUrl: raw.displayIcon || "/images/map-ascent.webp"
        };
        const mRef = doc(this.db, "maps", mSlug);
        mapBatch.set(mRef, mapDoc, { merge: true });
        stats.maps++;
        mapsList.push(mapDoc);
      });
      await mapBatch.commit();
      onProgress?.(`Committed ${stats.maps} Maps to Firestore.`);

      // 5. Generate Universal Search Index
      onProgress?.("Compiling universal Search Index...");
      const searchBatch = writeBatch(this.db);
      
      // Agents to search index
      agentsList.forEach((agent: any) => {
        const docId = `agent_${agent.slug}`;
        const searchDoc = {
          id: docId,
          type: "AGENT",
          title: agent.name,
          desc: agent.bio,
          href: `/agents/${agent.slug}`,
          tokens: [agent.name.toLowerCase(), "agent", agent.role.toLowerCase()]
        };
        const ref = doc(this.db, "search_index", docId);
        searchBatch.set(ref, searchDoc, { merge: true });
        stats.searchIndex++;
      });

      // Weapons to search index
      weaponsList.forEach((w: any) => {
        const docId = `weapon_${w.slug}`;
        const searchDoc = {
          id: docId,
          type: "WEAPON",
          title: w.name,
          desc: w.description,
          href: `/weapons/${w.slug}`,
          tokens: [w.name.toLowerCase(), "weapon", w.category.toLowerCase()]
        };
        const ref = doc(this.db, "search_index", docId);
        searchBatch.set(ref, searchDoc, { merge: true });
        stats.searchIndex++;
      });

      // Skins to search index (subset first 100 for batch limits)
      skinsList.slice(0, 150).forEach((s: any) => {
        const docId = `skin_${s.slug}`;
        const searchDoc = {
          id: docId,
          type: "SKIN",
          title: s.name,
          desc: `Valorant Weapon Skin for ${s.name}`,
          href: `/skins/${s.slug}`,
          tokens: [s.name.toLowerCase(), "skin", s.weaponSlug]
        };
        const ref = doc(this.db, "search_index", docId);
        searchBatch.set(ref, searchDoc, { merge: true });
        stats.searchIndex++;
      });

      // Bundles to search index
      bundlesList.forEach((b: any) => {
        const docId = `bundle_${b.slug}`;
        const searchDoc = {
          id: docId,
          type: "BUNDLE",
          title: b.name,
          desc: b.description,
          href: `/bundles/${b.slug}`,
          tokens: [b.name.toLowerCase(), "bundle"]
        };
        const ref = doc(this.db, "search_index", docId);
        searchBatch.set(ref, searchDoc, { merge: true });
        stats.searchIndex++;
      });

      // Maps to search index
      mapsList.forEach((m: any) => {
        const docId = `map_${m.slug}`;
        const searchDoc = {
          id: docId,
          type: "MAP",
          title: m.name,
          desc: m.lore,
          href: `/maps/${m.slug}`,
          tokens: [m.name.toLowerCase(), "map", m.location.toLowerCase()]
        };
        const ref = doc(this.db, "search_index", docId);
        searchBatch.set(ref, searchDoc, { merge: true });
        stats.searchIndex++;
      });

      await searchBatch.commit();
      onProgress?.(`Universal Search Index compiled: ${stats.searchIndex} items index tokens.`);

      // Log import run details
      const logRef = collection(this.db, "import_logs");
      const logDoc = await addDoc(logRef, {
        timestamp: new Date().toISOString(),
        success: true,
        stats,
        errors: []
      });

      onProgress?.("Ingestion Pipeline process COMPLETED.");
      return { success: true, stats, logId: logDoc.id };

    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown execution error";
      errors.push(message);
      onProgress?.(`ERROR: ${message}`);
      
      try {
        const logRef = collection(this.db, "import_logs");
        const logDoc = await addDoc(logRef, {
          timestamp: new Date().toISOString(),
          success: false,
          stats,
          errors
        });
        return { success: false, stats, logId: logDoc.id };
      } catch (logErr) {
        return { success: false, stats, logId: "FAILED_TO_LOG" };
      }
    }
  }
}
