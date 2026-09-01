"use client";

import React, { useState, useEffect } from "react";
import { Bookmark, BookmarkCheck } from "lucide-react";
import { toast } from "sonner";

interface BookmarkItem {
  id: string;
  title: string;
  category: "Agent" | "Weapon" | "Map" | "Skin" | "Lore" | "Guide" | "Comparison";
  url: string;
  savedAt: string;
}

interface BookmarkButtonProps {
  id: string;
  title: string;
  category: BookmarkItem["category"];
  url: string;
  className?: string;
}

const STORAGE_KEY = "vlopedia_saved_bookmarks";

export function BookmarkButton({ id, title, category, url, className = "" }: BookmarkButtonProps) {
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]") as BookmarkItem[];
      setIsSaved(saved.some(item => item.id === id));
    } catch {
      setIsSaved(false);
    }
  }, [id]);

  const toggleBookmark = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]") as BookmarkItem[];
      let updated: BookmarkItem[];

      if (isSaved) {
        updated = saved.filter(item => item.id !== id);
        setIsSaved(false);
        toast.info(`Removed ${title} from saved bookmarks.`);
      } else {
        const newItem: BookmarkItem = {
          id,
          title,
          category,
          url,
          savedAt: new Date().toISOString(),
        };
        updated = [newItem, ...saved];
        setIsSaved(true);
        toast.success(`Saved ${title} to your bookmarks!`);
      }

      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      window.dispatchEvent(new Event("vlopedia_bookmarks_updated"));
    } catch (err) {
      console.error(err);
      toast.error("Failed to update bookmarks.");
    }
  };

  return (
    <button
      onClick={toggleBookmark}
      type="button"
      title={isSaved ? "Saved in Bookmarks" : "Save Bookmark"}
      className={`inline-flex items-center gap-1.5 font-mono text-xs uppercase px-3 py-1.5 border transition-all ${
        isSaved
          ? "border-primary bg-primary text-black font-bold"
          : "border-[rgba(236,232,225,0.15)] bg-surface text-secondary hover:border-primary/50 hover:text-white"
      } ${className}`}
    >
      {isSaved ? (
        <>
          <BookmarkCheck className="h-3.5 w-3.5" />
          <span>Saved</span>
        </>
      ) : (
        <>
          <Bookmark className="h-3.5 w-3.5" />
          <span>Bookmark</span>
        </>
      )}
    </button>
  );
}
