-- ============================================================================
-- VloPedia — Production PostgreSQL Relational Schema Blueprint
-- 
-- Transitions the Knowledge Graph, Source Registry, SEO Telemetry, and Growth
-- Work Queue from developer-maintained JSON files to a durable relational database.
-- ============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Sources Registry Table (Provenance & Reliability Tracking)
CREATE TABLE IF NOT EXISTS sources (
    id VARCHAR(64) PRIMARY KEY,                    -- e.g. 'riot-game-api', 'vct-tournament-telemetry'
    name VARCHAR(255) NOT NULL,
    source_type VARCHAR(32) NOT NULL,              -- 'GAME_API', 'VCT_SNAPSHOT', 'CONFIRMED_CANON', 'EDITORIAL_ANALYSIS'
    url TEXT NOT NULL,
    reliability VARCHAR(32) NOT NULL,              -- 'OFFICIAL', 'CALCULATED', 'CONFIRMED_CANON', 'EDITORIAL'
    trust_score INTEGER CHECK (trust_score BETWEEN 0 AND 100) DEFAULT 90,
    http_status INTEGER DEFAULT 200,
    latency_ms INTEGER DEFAULT 0,
    health_status VARCHAR(16) DEFAULT 'HEALTHY',   -- 'HEALTHY', 'DEGRADED', 'DOWN'
    last_checked_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Entities Table (Canonical Identity Layer)
CREATE TABLE IF NOT EXISTS entities (
    id VARCHAR(128) PRIMARY KEY,                   -- Canonical ID e.g. 'agent:jett', 'weapon:vandal', 'skin:aemondir-vandal'
    slug VARCHAR(128) NOT NULL UNIQUE,
    entity_type VARCHAR(32) NOT NULL,              -- 'AGENT', 'WEAPON', 'MAP', 'SKIN', 'BUNDLE', 'COLLECTION'
    display_name VARCHAR(255) NOT NULL,
    description TEXT,
    canonical_url VARCHAR(255) NOT NULL,
    metadata JSONB DEFAULT '{}'::jsonb,            -- Category-specific attributes (tier, cost, role, abilities)
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_entities_slug ON entities(slug);
CREATE INDEX IF NOT EXISTS idx_entities_type ON entities(entity_type);

-- 3. Relationships Table (Knowledge Graph Edges)
CREATE TABLE IF NOT EXISTS relationships (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    from_entity_id VARCHAR(128) NOT NULL REFERENCES entities(id) ON DELETE CASCADE,
    to_entity_id VARCHAR(128) NOT NULL REFERENCES entities(id) ON DELETE CASCADE,
    relation_type VARCHAR(32) NOT NULL,            -- 'COUNTERS', 'SYNERGIZES_WITH', 'MAP_FIT', 'RECOMMENDED_FOR', 'BUNDLE_INCLUDES'
    reason TEXT NOT NULL,
    confidence VARCHAR(16) NOT NULL DEFAULT 'HIGH', -- 'HIGH', 'MEDIUM', 'SPECULATIVE'
    source_id VARCHAR(64) REFERENCES sources(id) ON DELETE SET NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_entity_relationship UNIQUE (from_entity_id, to_entity_id, relation_type)
);

CREATE INDEX IF NOT EXISTS idx_rel_from ON relationships(from_entity_id);
CREATE INDEX IF NOT EXISTS idx_rel_to ON relationships(to_entity_id);
CREATE INDEX IF NOT EXISTS idx_rel_type ON relationships(relation_type);

-- 4. Relationship Evidence (Auditable Proof Behind Every Edge)
CREATE TABLE IF NOT EXISTS relationship_evidence (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    relationship_id UUID NOT NULL REFERENCES relationships(id) ON DELETE CASCADE,
    source_type VARCHAR(32) NOT NULL,
    quote_or_stat TEXT NOT NULL,                   -- e.g. "Pick rate 72% across 58 VCT Masters Ascent games"
    verification_url TEXT,
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_evidence_rel ON relationship_evidence(relationship_id);

-- 5. Patches Table (Balance Evolution Tracking)
CREATE TABLE IF NOT EXISTS patches (
    version VARCHAR(32) PRIMARY KEY,               -- e.g. '9.04'
    release_date DATE NOT NULL,
    headline TEXT NOT NULL,
    raw_notes JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. Historical GSC Search Warehouse (Daily Ingestion Time-Series)
CREATE TABLE IF NOT EXISTS gsc_snapshots (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    snapshot_date DATE NOT NULL,
    query VARCHAR(512) NOT NULL,
    url VARCHAR(512) NOT NULL,
    country VARCHAR(8) DEFAULT 'ALL',
    device VARCHAR(16) DEFAULT 'ALL',              -- 'MOBILE', 'DESKTOP', 'TABLET', 'ALL'
    clicks INTEGER NOT NULL DEFAULT 0,
    impressions INTEGER NOT NULL DEFAULT 0,
    ctr NUMERIC(6, 4) NOT NULL DEFAULT 0.0000,
    avg_position NUMERIC(6, 2) NOT NULL DEFAULT 0.00,
    imported_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_daily_gsc_row UNIQUE (snapshot_date, query, url, country, device)
);

CREATE INDEX IF NOT EXISTS idx_gsc_date ON gsc_snapshots(snapshot_date);
CREATE INDEX IF NOT EXISTS idx_gsc_query ON gsc_snapshots(query);
CREATE INDEX IF NOT EXISTS idx_gsc_url ON gsc_snapshots(url);

-- 7. Autonomous Growth Work Queue
CREATE TABLE IF NOT EXISTS growth_tasks (
    id VARCHAR(128) PRIMARY KEY,
    source VARCHAR(32) NOT NULL,                   -- 'PATCH_IMPACT', 'CANNIBALIZATION', 'CONTENT_BRIEF', 'UNRESOLVED_SEARCH', 'QUALITY_GATE'
    priority VARCHAR(16) NOT NULL,                 -- 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'
    status VARCHAR(16) NOT NULL DEFAULT 'PENDING',  -- 'PENDING', 'IN_PROGRESS', 'RESOLVED'
    title VARCHAR(255) NOT NULL,
    detail TEXT NOT NULL,
    target_url VARCHAR(255) NOT NULL,
    affected_entity_id VARCHAR(128) REFERENCES entities(id) ON DELETE SET NULL,
    estimated_impressions INTEGER DEFAULT 0,
    checklist JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    resolved_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX IF NOT EXISTS idx_tasks_status_priority ON growth_tasks(status, priority);

-- 8. Search Resolution & Refinement Tracking
CREATE TABLE IF NOT EXISTS search_refinement_sessions (
    id VARCHAR(64) PRIMARY KEY,
    initial_query VARCHAR(255) NOT NULL,
    vertical VARCHAR(32) NOT NULL,                 -- 'Agents', 'Skins', 'Weapons', 'Lore', 'Guides', 'Tools'
    refinements JSONB NOT NULL DEFAULT '[]'::jsonb,
    final_status VARCHAR(32) NOT NULL,             -- 'RESOLVED_IMMEDIATE', 'RESOLVED_AFTER_REFINEMENT', 'UNRESOLVED_REFINED_BOUNCE', 'UNRESOLVED_ZERO_RESULTS'
    resolution_time_seconds INTEGER DEFAULT 0,
    final_target_url VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_search_refine_vertical ON search_refinement_sessions(vertical, final_status);
