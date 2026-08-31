export const wishlistCategories = ["bundle", "weapon", "skin", "agent", "other"] as const;

export type WishlistCategory = (typeof wishlistCategories)[number];

export type FirestoreWishlistItem = {
  id: string;
  title: string;
  category: WishlistCategory;
  notes: string | null;
  createdAt: Date | null;
};

export function normalizeWishlistTitle(title: string) {
  return title.trim().replace(/\s+/g, " ");
}