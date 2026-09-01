import rawGuides from "@/data/guides-database.json";

export interface Guide {
  slug: string;
  title: string;
  category: string;
  readTime: string;
  summary: string;
  content: string;
  author: string;
  publishedAt: string;
  relatedAgents?: string[];
  relatedWeapons?: string[];
  relatedTools?: string[];
}

export const guidesDb: Guide[] = rawGuides as Guide[];
