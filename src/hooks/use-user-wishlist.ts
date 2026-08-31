"use client";

import { useAuth } from "@/hooks/use-auth";
import { type FirestoreWishlistItem, type WishlistCategory } from "@/lib/firestore-wishlist";
import { getFirebaseFirestore } from "@/services/firebase";
import { addDoc, collection, deleteDoc, doc, onSnapshot, orderBy, query, serverTimestamp } from "firebase/firestore";
import { useCallback, useEffect, useState } from "react";

type WishlistState = {
  items: FirestoreWishlistItem[];
  loading: boolean;
  error: string | null;
};

const initialState: WishlistState = {
  items: [],
  loading: true,
  error: null
};

type WishlistInput = {
  title: string;
  category: WishlistCategory;
  notes?: string;
};

export function useUserWishlist() {
  const { user } = useAuth();
  const [state, setState] = useState<WishlistState>(initialState);

  useEffect(() => {
    if (!user) {
      setState({ items: [], loading: false, error: null });
      return;
    }

    let active = true;

    try {
      const db = getFirebaseFirestore();
      const wishlistRef = collection(db, "users", user.uid, "wishlistItems");
      const wishlistQuery = query(wishlistRef, orderBy("createdAt", "desc"));

      setState({ items: [], loading: true, error: null });

      const unsubscribe = onSnapshot(
        wishlistQuery,
        (snapshot) => {
          if (!active) {
            return;
          }

          setState({
            items: snapshot.docs.map((document) => {
              const data = document.data();

              return {
                id: document.id,
                title: typeof data.title === "string" ? data.title : "Untitled",
                category: (data.category as WishlistCategory) ?? "other",
                notes: typeof data.notes === "string" && data.notes.trim().length > 0 ? data.notes : null,
                createdAt: data.createdAt?.toDate?.() ?? null
              };
            }),
            loading: false,
            error: null
          });
        },
        (snapshotError) => {
          if (!active) {
            return;
          }

          setState({
            items: [],
            loading: false,
            error: snapshotError.message
          });
        }
      );

      return () => {
        active = false;
        unsubscribe();
      };
    } catch (caughtError) {
      setState({
        items: [],
        loading: false,
        error: caughtError instanceof Error ? caughtError.message : "Unable to load wishlist"
      });
    }
  }, [user]);

  const addWishlistItem = useCallback(
    async (input: WishlistInput) => {
      if (!user) {
        throw new Error("Sign in required");
      }

      const db = getFirebaseFirestore();
      const wishlistRef = collection(db, "users", user.uid, "wishlistItems");

      await addDoc(wishlistRef, {
        title: input.title,
        category: input.category,
        notes: input.notes?.trim() ? input.notes.trim() : null,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    },
    [user]
  );

  const removeWishlistItem = useCallback(
    async (itemId: string) => {
      if (!user) {
        throw new Error("Sign in required");
      }

      const db = getFirebaseFirestore();
      const itemRef = doc(db, "users", user.uid, "wishlistItems", itemId);

      await deleteDoc(itemRef);
    },
    [user]
  );

  return {
    ...state,
    addWishlistItem,
    removeWishlistItem
  };
}