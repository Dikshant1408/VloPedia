"use client";

import { useEffect } from "react";
import { recordRecentView } from "@/lib/recently-viewed";

interface RecordRecentViewProps {
  id: string;
  title: string;
  subtitle?: string;
  category: "Agent" | "Weapon" | "Skin" | "Map" | "Guide" | "Tool" | "Lore";
  href: string;
}

export function RecordRecentView({
  id,
  title,
  subtitle,
  category,
  href,
}: RecordRecentViewProps) {
  useEffect(() => {
    recordRecentView({
      id,
      title,
      subtitle,
      category,
      href,
    });
  }, [id, title, subtitle, category, href]);

  return null;
}
