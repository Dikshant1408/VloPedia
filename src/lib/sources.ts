import sourcesData from "@/data/sources/registry.json";

export type SourceType = 
  | "GAME_API" 
  | "VCT_SNAPSHOT" 
  | "CONFIRMED_CANON" 
  | "EDITORIAL_ANALYSIS" 
  | "COMMUNITY";

export interface DataSourceRecord {
  id: string;
  name: string;
  type: SourceType;
  url: string;
  description: string;
  reliability: "OFFICIAL" | "CALCULATED" | "CONFIRMED_CANON" | "EDITORIAL" | "COMMUNITY";
  updateFrequency: string;
}

export class SourceRegistry {
  private static sourceMap: Map<string, DataSourceRecord> = new Map();

  private static init() {
    if (this.sourceMap.size === 0) {
      for (const s of sourcesData.sources as DataSourceRecord[]) {
        this.sourceMap.set(s.id, s);
      }
    }
  }

  public static getAllSources(): DataSourceRecord[] {
    this.init();
    return Array.from(this.sourceMap.values());
  }

  public static getSourceById(id: string): DataSourceRecord | undefined {
    this.init();
    return this.sourceMap.get(id);
  }
}
