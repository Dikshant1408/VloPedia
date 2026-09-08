/**
 * VloPedia — Autonomous Growth Work Queue
 * 
 * Closes the loop between detection and operational execution:
 * Converts signals from Patch Impact, Query Cannibalization, Content Briefs,
 * and Unresolved Search Telemetry into prioritized, actionable editorial tasks.
 */

import { PatchImpactEngine } from "./patch-impact-engine";
import { SearchCannibalizationEngine } from "./gsc/cannibalization";
import { GscStorageService } from "./gsc/storage";
import { QueryClusteringEngine } from "./query-clustering";
import { SearchResolutionEngine } from "./search-resolution";

export type GrowthTaskSource = 
  | "PATCH_IMPACT"
  | "CANNIBALIZATION"
  | "CONTENT_BRIEF"
  | "UNRESOLVED_SEARCH"
  | "QUALITY_GATE";

export type GrowthTaskPriority = "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";

export type GrowthTaskStatus = "PENDING" | "IN_PROGRESS" | "RESOLVED";

export interface GrowthTask {
  id: string;
  source: GrowthTaskSource;
  priority: GrowthTaskPriority;
  status: GrowthTaskStatus;
  title: string;
  detail: string;
  targetUrl: string;
  affectedEntityId?: string;
  estimatedImpressionImpact: number;
  checklist: string[];
  createdAt: string;
  resolvedAt?: string;
}

export interface GrowthQueueSummary {
  totalTasks: number;
  criticalCount: number;
  highCount: number;
  pendingCount: number;
  resolvedCount: number;
  totalImpressionExposure: number;
  tasksBySource: Record<GrowthTaskSource, number>;
}

export class GrowthQueueEngine {
  private static tasks: GrowthTask[] = [];
  private static isInitialized = false;

  /**
   * Initializes the operational work queue by synthesizing all diagnostic engines
   */
  public static init(): void {
    if (this.isInitialized) return;

    const generatedTasks: GrowthTask[] = [];

    // 1. Ingest Patch Impact Tasks
    const patchResult = PatchImpactEngine.evaluateImpact("weapon:vandal", "9.04");
    if (patchResult.reviewStatus !== "FRESH") {
      generatedTasks.push({
        id: "gt-patch-vandal-904",
        source: "PATCH_IMPACT",
        priority: "CRITICAL",
        status: "PENDING",
        title: "Update 17 Dependent Pages for Vandal Patch 9.04",
        detail: "Vandal first-bullet accuracy or damage falloff adjusted in Patch 9.04. Dependent weapon comparison guides, skin hubs, and tier lists require immediate review.",
        targetUrl: "/weapons/vandal",
        affectedEntityId: "weapon:vandal",
        estimatedImpressionImpact: 450,
        checklist: [
          "Audit ballistic damage table in /weapons/vandal",
          "Update /compare/weapons/vandal-vs-phantom recoil dispersion notes",
          "Refresh weapon tier badge in /skins/vandal hub",
          "Verify and bump lastReviewed timestamp to Patch 9.04"
        ],
        createdAt: "2026-09-05"
      });
    }

    // 2. Ingest Search Cannibalization Tasks
    const latestSnapshot = GscStorageService.getLatestSnapshot();
    const cannibalizationCandidates = SearchCannibalizationEngine.detectCannibalization(latestSnapshot.rows);
    cannibalizationCandidates.forEach((c, idx) => {
      const totalImpr = c.competingUrls.reduce((sum, u) => sum + u.impressions, 0);
      generatedTasks.push({
        id: `gt-cannibal-${idx}-${c.query.replace(/\s+/g, "-")}`,
        source: "CANNIBALIZATION",
        priority: c.severity === "CRITICAL" ? "CRITICAL" : "HIGH",
        status: "PENDING",
        title: `Resolve SERP Cannibalization: "${c.query}"`,
        detail: `Query "${c.query}" is split across ${c.competingUrls.length} pages (${c.competingUrls.map(u => u.url).join(", ")}). Designate primary canonical landing page to unify authority.`,
        targetUrl: c.preferredUrl,
        estimatedImpressionImpact: totalImpr,
        checklist: [
          `Set primary internal linking anchor text pointing to ${c.preferredUrl}`,
          `Add explicit cross-link banner from competing secondary pages to ${c.preferredUrl}`,
          "Verify canonical tag configuration prevents duplicate indexing"
        ],
        createdAt: "2026-09-06"
      });
    });

    // 3. Ingest Content Brief Tasks from Query Clusters
    const clusters = QueryClusteringEngine.getAllClusters();
    clusters.slice(0, 3).forEach(cl => {
      const brief = QueryClusteringEngine.generateContentBrief(cl.clusterId);
      if (brief && brief.missingCoverage.length > 0) {
        generatedTasks.push({
          id: `gt-brief-${cl.clusterId}`,
          source: "CONTENT_BRIEF",
          priority: "HIGH",
          status: "PENDING",
          title: `Implement Content Brief: ${cl.displayName}`,
          detail: `High search demand (${cl.totalImpressions} impressions) for "${cl.displayName}". Missing crucial buyer-intent sections: ${brief.missingCoverage.join(", ")}.`,
          targetUrl: cl.canonicalUrl,
          affectedEntityId: cl.graphConnections?.primaryEntityId,
          estimatedImpressionImpact: cl.totalImpressions,
          checklist: brief.missingCoverage.map(section => `Add structured section: ${section}`),
          createdAt: "2026-09-06"
        });
      }
    });

    // 4. Ingest Unresolved Search Signals
    const searchReport = SearchResolutionEngine.generateReport();
    searchReport.topUnresolvedIntents.forEach(sig => {
      generatedTasks.push({
        id: `gt-search-${sig.patternId}`,
        source: "UNRESOLVED_SEARCH",
        priority: sig.priority,
        status: "PENDING",
        title: `Fix Unresolved Search Intent: "${sig.initialQuery}"`,
        detail: `${sig.diagnosedGap} (${sig.occurrences} session bounces recorded).`,
        targetUrl: sig.suggestedLandingUrl,
        estimatedImpressionImpact: sig.occurrences * 8, // projected monthly searches
        checklist: [
          sig.recommendedContentTask,
          "Validate search resolution rate increases after publishing update"
        ],
        createdAt: "2026-09-07"
      });
    });

    this.tasks = generatedTasks;
    this.isInitialized = true;
  }

  /**
   * Returns all tasks in the Growth Queue sorted by priority
   */
  public static getTasks(): GrowthTask[] {
    this.init();
    const priorityWeight: Record<GrowthTaskPriority, number> = {
      CRITICAL: 4,
      HIGH: 3,
      MEDIUM: 2,
      LOW: 1
    };

    return [...this.tasks].sort((a, b) => {
      if (a.status === "RESOLVED" && b.status !== "RESOLVED") return 1;
      if (a.status !== "RESOLVED" && b.status === "RESOLVED") return -1;
      return priorityWeight[b.priority] - priorityWeight[a.priority];
    });
  }

  /**
   * Marks a task as resolved or in-progress
   */
  public static updateTaskStatus(taskId: string, status: GrowthTaskStatus): void {
    this.init();
    const task = this.tasks.find(t => t.id === taskId);
    if (task) {
      task.status = status;
      if (status === "RESOLVED") {
        task.resolvedAt = new Date().toISOString().split("T")[0];
      }
    }
  }

  /**
   * Returns executive summary metrics for the queue
   */
  public static getSummary(): GrowthQueueSummary {
    const tasks = this.getTasks();
    const totalTasks = tasks.length;
    const criticalCount = tasks.filter(t => t.priority === "CRITICAL" && t.status !== "RESOLVED").length;
    const highCount = tasks.filter(t => t.priority === "HIGH" && t.status !== "RESOLVED").length;
    const pendingCount = tasks.filter(t => t.status === "PENDING").length;
    const resolvedCount = tasks.filter(t => t.status === "RESOLVED").length;
    const totalImpressionExposure = tasks
      .filter(t => t.status !== "RESOLVED")
      .reduce((sum, t) => sum + t.estimatedImpressionImpact, 0);

    const tasksBySource: Record<GrowthTaskSource, number> = {
      PATCH_IMPACT: 0,
      CANNIBALIZATION: 0,
      CONTENT_BRIEF: 0,
      UNRESOLVED_SEARCH: 0,
      QUALITY_GATE: 0
    };

    tasks.forEach(t => {
      tasksBySource[t.source] = (tasksBySource[t.source] || 0) + 1;
    });

    return {
      totalTasks,
      criticalCount,
      highCount,
      pendingCount,
      resolvedCount,
      totalImpressionExposure,
      tasksBySource
    };
  }
}
