"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { normalizeWishlistTitle, wishlistCategories, type WishlistCategory } from "@/lib/firestore-wishlist";
import { cn } from "@/lib/utils";
import { useUserWishlist } from "@/hooks/use-user-wishlist";
import { Trash2 } from "lucide-react";
import { useMemo, useState, type FormEvent } from "react";
import { toast } from "sonner";

const categoryLabels: Record<WishlistCategory, string> = {
  bundle: "Bundle",
  weapon: "Weapon",
  skin: "Skin",
  agent: "Agent",
  other: "Other"
};

export function WishlistManager() {
  const { items, loading, error, addWishlistItem, removeWishlistItem } = useUserWishlist();
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<WishlistCategory>("weapon");
  const [notes, setNotes] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const itemCountLabel = useMemo(() => `${items.length} saved item${items.length === 1 ? "" : "s"}`, [items.length]);

  async function handleAddItem(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const normalizedTitle = normalizeWishlistTitle(title);

    if (normalizedTitle.length < 2) {
      toast.error("Enter a wishlist item title.");
      return;
    }

    setSubmitting(true);

    try {
      await addWishlistItem({
        title: normalizedTitle,
        category,
        notes
      });
      setTitle("");
      setNotes("");
      setCategory("weapon");
      toast.success("Wishlist item saved.");
    } catch {
      toast.error("Could not save that item.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDeleteItem(itemId: string) {
    try {
      await removeWishlistItem(itemId);
      toast.success("Wishlist item removed.");
    } catch {
      toast.error("Could not remove that item.");
    }
  }

  return (
    <Card className="space-y-6 border border-[rgba(236,232,225,0.08)] bg-[rgba(15,28,36,0.8)]">
      <div className="flex items-center justify-between gap-4 border-b border-border pb-5">
        <div>
          <Badge className="border-primary/30 bg-primary-soft text-primary">Wishlist</Badge>
          <p className="mt-2 text-2xl font-semibold text-foreground">Save what you want next.</p>
        </div>
        <p className="text-sm text-muted">{itemCountLabel}</p>
      </div>

      <form className="space-y-4" onSubmit={handleAddItem}>
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground" htmlFor="wishlist-title">
            Item title
          </label>
          <input
            id="wishlist-title"
            className="w-full border border-[rgba(236,232,225,0.08)] bg-[#08111A] px-4 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted focus:border-primary"
            placeholder="Radiant Entertainment System Vandal"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            maxLength={80}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground" htmlFor="wishlist-category">
              Category
            </label>
            <select
              id="wishlist-category"
              className="w-full border border-[rgba(236,232,225,0.08)] bg-[#08111A] px-4 py-3 text-sm text-foreground outline-none transition-colors focus:border-primary"
              value={category}
              onChange={(event) => setCategory(event.target.value as WishlistCategory)}
            >
              {wishlistCategories.map((itemCategory) => (
                <option key={itemCategory} value={itemCategory}>
                  {categoryLabels[itemCategory]}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground" htmlFor="wishlist-notes">
              Notes
            </label>
            <input
              id="wishlist-notes"
              className="w-full border border-[rgba(236,232,225,0.08)] bg-[#08111A] px-4 py-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted focus:border-primary"
              placeholder="Limited shop rotation, next bundle drop, etc."
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              maxLength={240}
            />
          </div>
        </div>

        <Button className="w-full sm:w-auto" disabled={submitting} type="submit">
          {submitting ? "Saving..." : "Save wishlist item"}
        </Button>
      </form>

      <div className="space-y-3">
        {loading ? (
          <div className="border border-[rgba(236,232,225,0.08)] bg-[#08111A] px-4 py-4 text-sm text-muted">Loading wishlist...</div>
        ) : error ? (
          <div className="border border-red-500/20 bg-red-500/10 px-4 py-4 text-sm text-red-200">{error}</div>
        ) : items.length === 0 ? (
          <div className="border border-[rgba(236,232,225,0.08)] bg-[#08111A] px-4 py-4 text-sm text-muted">
            Add your first bundle, weapon, or skin to start tracking it here.
          </div>
        ) : (
          items.map((item) => (
            <div key={item.id} className="flex items-start justify-between gap-4 border border-[rgba(236,232,225,0.08)] bg-[#08111A] px-4 py-4">
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-medium text-foreground">{item.title}</p>
                  <span className={cn("border border-border px-2 py-0.5 text-xs uppercase tracking-[0.18em] text-muted")}>{categoryLabels[item.category]}</span>
                </div>
                {item.notes ? <p className="text-sm leading-6 text-muted">{item.notes}</p> : null}
                <p className="text-xs text-muted">{item.createdAt ? item.createdAt.toLocaleDateString() : "Saving..."}</p>
              </div>
              <button
                aria-label={`Remove ${item.title}`}
                className="inline-flex h-10 w-10 items-center justify-center border border-border bg-background text-muted transition-colors hover:text-foreground hover:bg-surface"
                type="button"
                onClick={() => handleDeleteItem(item.id)}
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))
        )}
      </div>
    </Card>
  );
}
