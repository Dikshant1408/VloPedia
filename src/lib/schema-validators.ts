import { z } from "zod";

/**
 * Provenance confidence and source type schemas
 */
export const SourceTypeSchema = z.enum([
  "GAME_API",
  "VCT_SNAPSHOT",
  "EDITORIAL_ANALYSIS",
  "CONFIRMED_CANON",
  "COMMUNITY"
]);
export type SourceType = z.infer<typeof SourceTypeSchema>;

export const ConfidenceLevelSchema = z.enum([
  "CONFIRMED",
  "HIGH",
  "EDITORIAL",
  "PENDING_REVIEW"
]);
export type ConfidenceLevel = z.infer<typeof ConfidenceLevelSchema>;

export const DangerLevelSchema = z.enum([
  "HIGH",
  "MEDIUM",
  "SITUATIONAL"
]);
export type DangerLevel = z.infer<typeof DangerLevelSchema>;

export const DirectionalitySchema = z.enum([
  "DIRECTED",
  "UNDIRECTED"
]);
export type Directionality = z.infer<typeof DirectionalitySchema>;

/**
 * 1. Agent Meta Schema
 */
export const AgentMetaSchema = z.object({
  metadata: z.object({
    patchVersion: z.string(),
    season: z.string(),
    lastVerified: z.string(),
    source: z.string(),
  }).optional(),
  tiers: z.record(z.string(), z.string()).default({}),
  pickRates: z.record(z.string(), z.string()).default({}),
  difficulty: z.record(z.string(), z.string()).default({}),
  bestMaps: z.record(z.string(), z.array(z.string())).default({}),
  teammates: z.record(z.string(), z.array(z.string())).default({}),
  counters: z.record(z.string(), z.array(z.string())).default({}),
  signatureWeapons: z.record(z.string(), z.array(z.string())).default({}),
});
export type AgentMeta = z.infer<typeof AgentMetaSchema>;

export function parseAgentMeta(data: unknown): AgentMeta {
  return AgentMetaSchema.parse(data);
}

/**
 * 2. Relationship Edge Schema
 */
export const RelationshipEdgeSchema = z.object({
  fromEntity: z.string(),
  toEntity: z.string(),
  relationType: z.string(),
  directionality: DirectionalitySchema,
  dangerLevel: DangerLevelSchema.optional(),
  sourceId: z.string(),
  sourceType: SourceTypeSchema.optional(),
  source: z.string(),
  confidence: ConfidenceLevelSchema,
  patchVersion: z.string().optional(),
  evidence: z.string().optional(),
  explanation: z.string(),
  lastVerified: z.string().optional(),
});
export type RelationshipEdge = z.infer<typeof RelationshipEdgeSchema>;

export const RelationshipEdgesArraySchema = z.array(RelationshipEdgeSchema);

export function parseRelationshipEdges(data: unknown): RelationshipEdge[] {
  return RelationshipEdgesArraySchema.parse(data);
}

/**
 * 3. Source Registry Schema
 */
export const SourceRecordSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: SourceTypeSchema,
  url: z.string(),
  description: z.string(),
  reliability: z.string(),
  updateFrequency: z.string(),
});
export type SourceRecord = z.infer<typeof SourceRecordSchema>;

export const SourceRegistrySchema = z.object({
  version: z.string(),
  lastUpdated: z.string(),
  sources: z.array(SourceRecordSchema),
});
export type SourceRegistryData = z.infer<typeof SourceRegistrySchema>;

export function parseSourceRegistry(data: unknown): SourceRegistryData {
  return SourceRegistrySchema.parse(data);
}

/**
 * 4. Lore Database Schema
 */
export const LoreArticleSectionSchema = z.object({
  heading: z.string(),
  content: z.string(),
});

export const LoreArticleSchema = z.object({
  slug: z.string(),
  title: z.string(),
  category: z.string(),
  readTime: z.string(),
  summary: z.string(),
  canonStatus: z.enum(["CONFIRMED", "STRONGLY IMPLIED", "THEORY / SPECULATION"]),
  evidenceSource: z.string(),
  whyDoWeKnowThis: z.string(),
  sections: z.array(LoreArticleSectionSchema).default([]),
});
export type LoreArticle = z.infer<typeof LoreArticleSchema>;

export const LoreEraSchema = z.object({
  id: z.string(),
  name: z.string(),
  years: z.string(),
  summary: z.string(),
});

export const LoreDatabaseSchema = z.object({
  eras: z.array(LoreEraSchema),
  articles: z.array(LoreArticleSchema),
});
export type LoreDatabase = z.infer<typeof LoreDatabaseSchema>;

export function parseLoreDatabase(data: unknown): LoreDatabase {
  return LoreDatabaseSchema.parse(data);
}

/**
 * 5. Guides Database Schema
 */
export const GuideArticleSchema = z.object({
  slug: z.string(),
  title: z.string(),
  category: z.string(),
  readTime: z.string(),
  summary: z.string(),
  author: z.string().optional(),
  publishedAt: z.string().optional(),
  relatedAgents: z.array(z.string()).default([]),
  relatedWeapons: z.array(z.string()).default([]),
  relatedTools: z.array(z.string()).default([]),
  content: z.string(),
});
export type GuideArticle = z.infer<typeof GuideArticleSchema>;

export const GuidesDatabaseSchema = z.array(GuideArticleSchema);

export function parseGuidesDatabase(data: unknown): GuideArticle[] {
  return GuidesDatabaseSchema.parse(data);
}

/**
 * 6. GSC Snapshot Raw & Time Series Schema
 */
export const GscQuerySnapshotSchema = z.object({
  query: z.string(),
  url: z.string(),
  category: z.string(),
  baseline: z.object({
    impressions: z.number(),
    clicks: z.number(),
    position: z.number(),
    ctr: z.number(),
  }),
  current: z.object({
    impressions: z.number(),
    clicks: z.number(),
    position: z.number(),
    ctr: z.number(),
  }),
});

export const GscPeriodSnapshotSchema = z.object({
  id: z.string(),
  label: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  totalImpressions: z.number(),
  totalClicks: z.number(),
  avgPosition: z.number(),
  avgCtr: z.number(),
});

export const GscSnapshotDatasetSchema = z.object({
  lastImportDate: z.string(),
  periods: z.array(GscPeriodSnapshotSchema).default([]),
  querySnapshots: z.array(GscQuerySnapshotSchema).default([]),
});
export type GscSnapshotDataset = z.infer<typeof GscSnapshotDatasetSchema>;

export function parseGscSnapshotDataset(data: unknown): GscSnapshotDataset {
  return GscSnapshotDatasetSchema.parse(data);
}
