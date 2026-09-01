"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Bookmark, X, Trash2, ArrowRight, ExternalLink } from "lucide-react";

interface BookmarkItem {
  id: string;
  title: string;
  category: "Agent" | "Weapon" | "Map" | "Skin" | "Lore" | "Guide" | "Comparison";
  url: string;
  savedAt: string;
}

const STORAGE_KEY = "vlopedia_saved_bookmarks";

export function BookmarksDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([]);

  const loadBookmarks = () => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]") as BookmarkItem[];
      setBookmarks(saved);
    } catch {
      setBookmarks([]);
    }
  };

  useEffect(() => {
    loadBookmarks();
    const handleUpdate = () => loadBookmarks();
    window.addEventListener("vlopedia_bookmarks_updated", handleUpdate);
    return () => window.removeEventListener("vlopedia_bookmarks_updated", handleUpdate);
  }, []);

  const removeBookmark = (id: string) => {
    const updated = bookmarks.filter(b => b.id !== id);
    setBookmarks(updated);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event("vlopedia_bookmarks_updated"));
  };

  const clearAll = () => {
    setBookmarks([]);
    localStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(new Event("vlopedia_bookmarks_updated"));
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        type="button"
        className="relative inline-flex items-center gap-1.5 font-mono text-xs uppercase px-2.5 py-1 border border-[rgba(236,232,225,0.15)] bg-surface text-secondary hover:border-primary/50 hover:text-white transition-colors"
        title="Saved Bookmarks"
      >
        <Bookmark className="h-3.5 w-3.5 text-primary" />
        <span className="hidden sm:inline">Saved</span>
        {bookmarks.length > 0 && (
          <span className="flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-black">
            {bookmarks.length}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-md bg-[#0D1820] border-l border-[rgba(236,232,225,0.1)] p-6 flex flex-col h-full shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-[rgba(236,232,225,0.08)]">
              <div className="flex items-center gap-2">
                <Bookmark className="h-4 w-4 text-primary" />
                <h2 className="font-display font-black text-lg uppercase text-white tracking-wide">
                  Saved Bookmarks ({bookmarks.length})
                </h2>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 text-muted hover:text-white transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto py-4 space-y-3">
              {bookmarks.length === 0 ? (
                <div className="py-16 text-center text-muted font-mono text-xs space-y-2">
                  <Bookmark className="h-8 w-8 mx-auto opacity-30 text-primary" />
                  <p>No saved bookmarks yet.</p>
                  <p className="text-[10px] text-muted/60">
                    Click &quot;Bookmark&quot; on any agent, weapon, guide or comparison to save it for quick access.
                  </p>
                </div>
              ) : (
                bookmarks.map(item => (
                  <div
                    key={item.id}
                    className="group border border-[rgba(236,232,225,0.06)] bg-[#08111A] p-3 flex items-center justify-between gap-3 hover:border-primary/40 transition-colors"
                  >
                    <Link
                      href={item.url}
                      onClick={() => setIsOpen(false)}
                      className="flex-1 min-w-0"
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[9px] uppercase px-1.5 py-0.5 border border-primary/30 bg-primary/10 text-primary">
                          {item.category}
                        </span>
                        <h4 className="font-sans text-xs font-bold text-white truncate group-hover:text-primary transition-colors">
                          {item.title}
                        </h4>
                      </div>
                      <span className="font-mono text-[9px] text-muted">
                        {item.url}
                      </span>
                    </Link>

                    <button
                      onClick={() => removeBookmark(item.id)}
                      className="text-muted hover:text-red-400 p-1 transition-colors"
                      title="Remove"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {bookmarks.length > 0 && (
              <div className="pt-4 border-t border-[rgba(236,232,225,0.08)] flex justify-between items-center">
                <button
                  onClick={clearAll}
                  className="font-mono text-[10px] uppercase text-muted hover:text-red-400 transition-colors"
                >
                  Clear All
                </button>
                <span className="font-mono text-[10px] text-muted">
                  Saved locally on this device
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
