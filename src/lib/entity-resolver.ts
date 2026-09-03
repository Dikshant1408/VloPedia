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

export class EntityResolver {
  public static resolve(query: string, preferredType?: EntityType): ResolvedEntity | null {
    if (!query || typeof query !== "string") return null;

    const raw = query.trim();
    const cleanSlug = slugify(raw.replace(/^(agent|weapon|map|faction|lore|event):/, ""));

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
