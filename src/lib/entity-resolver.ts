import { KnowledgeGraphService, CanonicalEntity, EntityType } from "./knowledge-graph-service";
import { slugify } from "./utils";

export interface ResolvedEntity {
  id: string;
  type: EntityType;
  displayName: string;
  slug: string;
  category: string;
  tier?: string;
  patchVersion?: string;
  source?: string;
  confidence?: string;
}

export interface CollisionAuditResult {
  totalChecked: number;
  totalPassed: number;
  collisionsDetected: Array<{
    alias: string;
    resolvedEntityA: string;
    resolvedEntityB: string;
    reason: string;
  }>;
  isHealthy: boolean;
  message: string;
}

export class EntityResolver {
  public static resolve(query: string, preferredType?: EntityType): ResolvedEntity | null {
    if (!query || typeof query !== "string") return null;

    const raw = query.trim();
    const cleanSlug = slugify(raw.replace(/^(agent|weapon|map|faction|lore|event):/, "").replace(/\s*(agent|rifle|map|knife|weapon)\s*$/i, ""));

    const allEntities = KnowledgeGraphService.getAllEntities();

    // 1. Exact ID match (e.g. "agent:kay-o")
    for (const e of allEntities) {
      if (e.id.toLowerCase() === raw.toLowerCase()) {
        return this.mapToResolved(e);
      }
    }

    // 2. Exact Slug & Type match
    for (const e of allEntities) {
      if (e.slug === cleanSlug && (!preferredType || e.type === preferredType)) {
        return this.mapToResolved(e);
      }
    }

    // 3. Match against Display Name (e.g. "KAY/O", "Dr. Sabine Callas")
    for (const e of allEntities) {
      const lowerDisplay = e.displayName.toLowerCase();
      if (lowerDisplay === raw.toLowerCase() || lowerDisplay.startsWith(raw.toLowerCase())) {
        if (!preferredType || e.type === preferredType) {
          return this.mapToResolved(e);
        }
      }
    }

    // 4. Fallback: normalize punctuation like "kay/o" -> "kay-o"
    const normalized = raw.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
    for (const e of allEntities) {
      if (e.slug === normalized) {
        return this.mapToResolved(e);
      }
    }

    return null;
  }

  public static getDisplayName(entityIdOrSlug: string, fallback?: string): string {
    const resolved = this.resolve(entityIdOrSlug);
    if (resolved) return resolved.displayName;
    return fallback || entityIdOrSlug;
  }

  /**
   * Collision Detector: audits entity resolution across standard test aliases to confirm 0 collisions
   */
  public static detectCollisions(): CollisionAuditResult {
    const testCases: Array<{ alias: string; expectedId: string; type?: EntityType }> = [
      { alias: "Jett", expectedId: "agent:jett", type: "AGENT" },
      { alias: "jett", expectedId: "agent:jett", type: "AGENT" },
      { alias: "Jett Agent", expectedId: "agent:jett", type: "AGENT" },
      { alias: "agent:jett", expectedId: "agent:jett", type: "AGENT" },
      { alias: "Omen", expectedId: "agent:omen", type: "AGENT" },
      { alias: "omen", expectedId: "agent:omen", type: "AGENT" },
      { alias: "agent:omen", expectedId: "agent:omen", type: "AGENT" },
      { alias: "KAY/O", expectedId: "agent:kay-o", type: "AGENT" },
      { alias: "kay-o", expectedId: "agent:kay-o", type: "AGENT" },
      { alias: "Vandal", expectedId: "weapon:vandal", type: "WEAPON" },
      { alias: "vandal", expectedId: "weapon:vandal", type: "WEAPON" },
      { alias: "Vandal Rifle", expectedId: "weapon:vandal", type: "WEAPON" },
      { alias: "weapon:vandal", expectedId: "weapon:vandal", type: "WEAPON" },
      { alias: "Phantom", expectedId: "weapon:phantom", type: "WEAPON" },
      { alias: "Ascent", expectedId: "map:ascent", type: "MAP" },
      { alias: "ascent", expectedId: "map:ascent", type: "MAP" },
      { alias: "map:ascent", expectedId: "map:ascent", type: "MAP" },
      { alias: "Kingdom", expectedId: "faction:kingdom", type: "FACTION" },
    ];

    const collisions: CollisionAuditResult["collisionsDetected"] = [];
    let passed = 0;

    for (const test of testCases) {
      const resolved = this.resolve(test.alias, test.type);
      if (!resolved || resolved.id !== test.expectedId) {
        collisions.push({
          alias: test.alias,
          resolvedEntityA: resolved ? resolved.id : "NULL",
          resolvedEntityB: test.expectedId,
          reason: `Alias '${test.alias}' resolved to '${resolved ? resolved.id : "NULL"}' but expected '${test.expectedId}'`,
        });
      } else {
        passed++;
      }
    }

    return {
      totalChecked: testCases.length,
      totalPassed: passed,
      collisionsDetected: collisions,
      isHealthy: collisions.length === 0,
      message: collisions.length === 0 
        ? `Entity Resolver Audit Healthy: ${passed}/${testCases.length} alias checks resolved with zero collisions.` 
        : `Entity Collision Warning: ${collisions.length} aliases failed expected canonical resolution.`,
    };
  }

  private static mapToResolved(entity: CanonicalEntity): ResolvedEntity {
    return {
      id: entity.id,
      type: entity.type,
      displayName: entity.displayName,
      slug: entity.slug,
      category: entity.category,
      tier: entity.tier,
      patchVersion: entity.patchVersion,
      source: entity.source,
      confidence: entity.confidence,
    };
  }
}
