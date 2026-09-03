import { KnowledgeGraphService, CanonicalEntity, CanonicalRelationship } from "./knowledge-graph-service";

export interface GraphIntegrityReport {
  totalEntities: number;
  totalRelationships: number;
  orphanNodes: CanonicalEntity[];
  contradictoryEdges: Array<{
    entityA: string;
    entityB: string;
    relations: string[];
    issue: string;
  }>;
  staleEdges: CanonicalRelationship[];
  invalidEdges: CanonicalRelationship[];
  healthScore: number; // 0 - 100
}

export class GraphIntegrityEngine {
  public static runAudit(currentPatch: string = "9.04"): GraphIntegrityReport {
    const allEntities = KnowledgeGraphService.getAllEntities();
    const entityIdSet = new Set(allEntities.map(e => e.id));

    // Gather all relationships from all sources
    const relationships: CanonicalRelationship[] = [];
    for (const entity of allEntities) {
      const rels = KnowledgeGraphService.getRelationshipsForEntity(entity.id);
      for (const r of rels) {
        // avoid duplicates
        if (!relationships.some(existing => existing.from === r.from && existing.to === r.to && existing.relationType === r.relationType)) {
          relationships.push(r);
        }
      }
    }

    // 1. Orphan Nodes detection
    const orphanNodes: CanonicalEntity[] = [];
    for (const entity of allEntities) {
      const edgeCount = relationships.filter(r => r.from === entity.id || r.to === entity.id).length;
      if (edgeCount === 0) {
        orphanNodes.push(entity);
      }
    }

    // 2. Invalid Edge References
    const invalidEdges: CanonicalRelationship[] = [];
    for (const r of relationships) {
      if (!entityIdSet.has(r.from) || !entityIdSet.has(r.to)) {
        invalidEdges.push(r);
      }
    }

    // 3. Contradictory Edges
    const pairMap: Record<string, string[]> = {};
    const contradictoryEdges: GraphIntegrityReport["contradictoryEdges"] = [];
    for (const r of relationships) {
      const key = [r.from, r.to].sort().join("⟷");
      if (!pairMap[key]) {
        pairMap[key] = [r.relationType];
      } else {
        pairMap[key].push(r.relationType);
      }
    }

    for (const [pair, types] of Object.entries(pairMap)) {
      if (types.includes("HARD_COUNTER") && types.includes("TACTICAL_SYNERGY")) {
        const [entityA, entityB] = pair.split("⟷");
        contradictoryEdges.push({
          entityA,
          entityB,
          relations: types,
          issue: "Entities are simultaneously marked as Tactical Synergy and Hard Counter without situational boundary."
        });
      }
    }

    // 4. Stale Edges
    const staleEdges = relationships.filter(r => r.patchVersion !== currentPatch);

    // Calculate overall health score
    let penalties = (orphanNodes.length * 5) + (invalidEdges.length * 15) + (contradictoryEdges.length * 10) + (staleEdges.length * 2);
    const healthScore = Math.max(100 - penalties, 0);

    return {
      totalEntities: allEntities.length,
      totalRelationships: relationships.length,
      orphanNodes,
      contradictoryEdges,
      staleEdges,
      invalidEdges,
      healthScore
    };
  }
}
