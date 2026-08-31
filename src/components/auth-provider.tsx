"use client";

import { getFirebaseAuth } from "@/services/firebase";
import { syncFirestoreUserDocument } from "@/lib/firestore-user";
import {
  OAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut as firebaseSignOut,
  type User
} from "firebase/auth";
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  signInWithDiscord: () => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const auth = getFirebaseAuth();

      const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        setUser(currentUser);
        setLoading(false);

        if (currentUser) {
          void syncFirestoreUserDocument(currentUser).catch(() => undefined);
        }
      });

      return unsubscribe;
    } catch {
      setLoading(false);
      return undefined;
    }
  }, []);

  const value = useMemo<AuthContextValue>(() => {
    return {
      user,
      loading,
      async signInWithDiscord() {
        await signInWithPopup(getFirebaseAuth(), new OAuthProvider("oidc.discord"));
      },
      async signOut() {
        await firebaseSignOut(getFirebaseAuth());
      }
    };
  }, [loading, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}