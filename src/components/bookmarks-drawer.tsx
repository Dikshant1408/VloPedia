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

  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = "hidden";
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

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
        aria-label="Saved Bookmarks"
        aria-expanded={isOpen}
        aria-controls="bookmarks-drawer"
        className="relative inline-flex items-center gap-1.5 font-mono text-[10px] font-bold uppercase px-2 sm:px-2.5 py-1.5 border border-border bg-surface text-secondary hover:border-primary/50 hover:text-foreground transition-colors cursor-pointer"
        title="Saved Bookmarks"
      >
        <Bookmark className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
        <span className="hidden sm:inline">Saved</span>
        {bookmarks.length > 0 && (
          <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-primary text-[8px] font-bold text-black">
            {bookmarks.length}
          </span>
        )}
      </button>

      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Saved Bookmarks"
          id="bookmarks-drawer"
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-in fade-in"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md bg-background border-l border-border p-6 flex flex-col h-full shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-border">
              <div className="flex items-center gap-2">
                <Bookmark className="h-4 w-4 text-primary" aria-hidden="true" />
                <h2 className="font-display font-black text-lg uppercase text-foreground tracking-wide">
                  Saved Bookmarks ({bookmarks.length})
                </h2>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                aria-label="Close saved bookmarks"
                className="p-1 text-muted hover:text-foreground transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto py-4 space-y-3">
              {bookmarks.length === 0 ? (
                <div className="py-16 text-center text-muted font-mono text-xs space-y-3">
                  <Bookmark className="h-8 w-8 mx-auto opacity-30 text-primary" aria-hidden="true" />
                  <p>No saved bookmarks yet.</p>
                  <p className="text-[10px] text-muted/60 max-w-xs mx-auto">
                    Click &quot;Bookmark&quot; on any agent, weapon, guide or comparison to save it for quick access.
                  </p>
                  <Link
                    href="/agents"
                    onClick={() => setIsOpen(false)}
                    className="inline-block mt-2 px-3 py-1.5 border border-border bg-surface text-secondary hover:border-primary/60 hover:text-foreground font-mono text-[10px] uppercase transition-colors"
                  >
                    Browse Operatives →
                  </Link>
                </div>
              ) : (
                bookmarks.map(item => (
                  <div
                    key={item.id}
                    className="group border border-border bg-surface p-3 flex items-center justify-between gap-3 hover:border-primary/40 transition-colors"
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
                        <h4 className="font-sans text-xs font-bold text-foreground truncate group-hover:text-primary transition-colors">
                          {item.title}
                        </h4>
                      </div>
                      <span className="font-mono text-[9px] text-muted">
                        {item.url}
                      </span>
                    </Link>

                    <button
                      onClick={() => removeBookmark(item.id)}
                      aria-label={`Remove ${item.title} from saved bookmarks`}
                      className="text-muted hover:text-red-400 p-1 transition-colors cursor-pointer"
                      title="Remove bookmark"
                    >
                      <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {bookmarks.length > 0 && (
              <div className="pt-4 border-t border-border flex justify-between items-center">
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
