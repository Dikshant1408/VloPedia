import canonicalData from "@/data/canonical-graph.json";

export type EntityType = "AGENT" | "FACTION" | "EVENT" | "WEAPON" | "MAP";
export type ConfidenceLevel = "CONFIRMED" | "HIGH" | "EDITORIAL" | "COMMUNITY";
export type RelationType = 
  | "LORE_ALLY" 
  | "LORE_RIVAL" 
  | "TACTICAL_SYNERGY" 
  | "HARD_COUNTER" 
  | "OPTIMAL_MAP_FIT" 
  | "SIGNATURE_LOADOUT" 
  | "ORIGIN_FACTION" 
  | "HISTORICAL_CAUSE";

export interface CanonicalEntity {
  id: string;
  slug: string;
  type: EntityType;
  displayName: string;
  category: string;
  tier?: string;
  patchVersion: string;
  source: string;
  confidence: ConfidenceLevel;
  lastReviewed: string;
}

export interface CanonicalRelationship {
  from: string;
  to: string;
  relationType: RelationType;
  confidence: ConfidenceLevel;
  source: string;
  patchVersion: string;
  evidence: string;
  rationale: string;
  lastReviewed: string;
}

export class KnowledgeGraphService {
  private static entities: Map<string, CanonicalEntity> = new Map();
  private static relationships: CanonicalRelationship[] = [];

  private static init() {
    if (this.entities.size === 0) {
      for (const entity of canonicalData.entities as CanonicalEntity[]) {
        this.entities.set(entity.id, entity);
      }
      this.relationships = canonicalData.relationships as CanonicalRelationship[];
    }
  }

  public static getAllEntities(): CanonicalEntity[] {
    this.init();
    return Array.from(this.entities.values());
  }

  public static getEntityById(id: string): CanonicalEntity | undefined {
    this.init();
    return this.entities.get(id);
  }

  public static getEntityBySlug(slug: string, type?: EntityType): CanonicalEntity | undefined {
    this.init();
    const clean = slug.toLowerCase().trim();
    for (const e of this.entities.values()) {
      if (e.slug === clean && (!type || e.type === type)) {
        return e;
      }
    }
    return undefined;
  }

  public static getRelationshipsForEntity(entityId: string): CanonicalRelationship[] {
    this.init();
    return this.relationships.filter(
      r => r.from === entityId || r.to === entityId
    );
  }

  public static getSynergies(entityId: string): CanonicalRelationship[] {
    this.init();
    return this.relationships.filter(
      r => (r.from === entityId || r.to === entityId) && r.relationType === "TACTICAL_SYNERGY"
    );
  }

  public static getCounters(entityId: string): CanonicalRelationship[] {
    this.init();
    return this.relationships.filter(
      r => (r.from === entityId || r.to === entityId) && r.relationType === "HARD_COUNTER"
    );
  }

  public static getMapFits(entityId: string): CanonicalRelationship[] {
    this.init();
    return this.relationships.filter(
      r => (r.from === entityId || r.to === entityId) && r.relationType === "OPTIMAL_MAP_FIT"
    );
  }

  /**
   * Find connection path between two canonical entities using BFS
   */
  public static getPathBetween(startId: string, endId: string): string[] | null {
    this.init();
    if (startId === endId) return [startId];

    const queue: string[][] = [[startId]];
    const visited = new Set<string>([startId]);

    while (queue.length > 0) {
      const path = queue.shift()!;
      const current = path[path.length - 1];

      const neighbors = this.relationships
        .filter(r => r.from === current || r.to === current)
        .map(r => (r.from === current ? r.to : r.from));

      for (const neighbor of neighbors) {
        if (neighbor === endId) {
          return [...path, neighbor];
        }
        if (!visited.has(neighbor)) {
          visited.add(neighbor);
          queue.push([...path, neighbor]);
        }
      }
    }

    return null;
  }
}
