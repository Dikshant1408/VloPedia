import { KnowledgeGraphService } from "./knowledge-graph-service";
import guidesDb from "@/data/guides-database.json";

export interface PatchImpactResult {
  entityId: string;
  patchVersion: string;
  affectedRelationships: Array<{
    targetEntity: string;
    relationType: string;
    reason: string;
  }>;
  affectedGuides: Array<{
    slug: string;
    title: string;
    reason: string;
  }>;
  affectedComparisons: Array<{
    type: string;
    slug: string;
    title: string;
  }>;
  reviewStatus: "FRESH" | "NEEDS_REVIEW" | "CRITICAL_UPDATE_REQUIRED";
}

export class PatchImpactEngine {
  /**
   * Evaluates the ripple impact across the knowledge graph and content library when an entity is patched.
   */
  public static evaluateImpact(entityId: string, currentPatch: string = "9.04"): PatchImpactResult {
    const entity = KnowledgeGraphService.getEntityById(entityId);
    const slug = entity?.slug || entityId.split(":")[1] || entityId;

    // 1. Relationships affected
    const relationships = KnowledgeGraphService.getRelationshipsForEntity(entityId);
    const affectedRelationships = relationships.map(r => {
      const otherId = r.from === entityId ? r.to : r.from;
      return {
        targetEntity: otherId,
        relationType: r.relationType,
        reason: `Synergy or counterplay parameters may shift under Patch ${currentPatch}`
      };
    });

    // 2. Guides affected
    const affectedGuides: Array<{ slug: string; title: string; reason: string }> = [];
    for (const guide of guidesDb) {
      const mentionsAgent = guide.relatedAgents?.some(a => a.toLowerCase() === slug.toLowerCase());
      const mentionsWeapon = (guide as any).relatedWeapons?.some((w: string) => w.toLowerCase() === slug.toLowerCase());
      const mentionsInContent = guide.content.toLowerCase().includes(slug.toLowerCase());

      if (mentionsAgent || mentionsWeapon || mentionsInContent) {
        affectedGuides.push({
          slug: guide.slug,
          title: guide.title,
          reason: `Guide references ${slug} tactics or kinematics`
        });
      }
    }

    // 3. Comparisons affected
    const affectedComparisons: Array<{ type: string; slug: string; title: string }> = [];
    if (slug === "vandal" || slug === "phantom") {
      affectedComparisons.push({
        type: "weapons",
        slug: "vandal-vs-phantom",
        title: "Vandal vs. Phantom Ballistics Comparison"
      });
    }
    if (slug === "jett" || slug === "raze") {
      affectedComparisons.push({
        type: "agents",
        slug: "jett-vs-raze",
        title: "Jett vs. Raze Entry Duelist Comparison"
      });
    }
    if (slug === "omen" || slug === "clove") {
      affectedComparisons.push({
        type: "agents",
        slug: "omen-vs-clove",
        title: "Omen vs. Clove Controller Comparison"
      });
    }

    const reviewStatus: PatchImpactResult["reviewStatus"] = 
      affectedGuides.length > 2 || affectedRelationships.length > 2
        ? "CRITICAL_UPDATE_REQUIRED"
        : affectedGuides.length > 0
        ? "NEEDS_REVIEW"
        : "FRESH";

    return {
      entityId,
      patchVersion: currentPatch,
      affectedRelationships,
      affectedGuides,
      affectedComparisons,
      reviewStatus
    };
  }

  /**
   * Runs automated scan over all entities to discover decaying content
   */
  public static scanStaleContent(): Array<{ entityId: string; staleCount: number; status: string }> {
    const entities = KnowledgeGraphService.getAllEntities();
    return entities.map(e => {
      const impact = this.evaluateImpact(e.id, e.patchVersion);
      return {
        entityId: e.id,
        staleCount: impact.affectedGuides.length + impact.affectedComparisons.length,
        status: impact.reviewStatus
      };
    });
  }
}
