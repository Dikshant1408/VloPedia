"use client";

import { useAuth } from "@/hooks/use-auth";
import { type FirestoreUserDocument } from "@/lib/firestore-user";
import { getFirebaseFirestore } from "@/services/firebase";
import { doc, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";

type FirestoreUserState = {
  data: FirestoreUserDocument | null;
  loading: boolean;
  error: string | null;
};

const initialState: FirestoreUserState = {
  data: null,
  loading: true,
  error: null
};

export function useFirestoreUserDocument() {
  const { user } = useAuth();
  const [state, setState] = useState<FirestoreUserState>(initialState);

  useEffect(() => {
    if (!user) {
      setState({ data: null, loading: false, error: null });
      return;
    }

    let active = true;

    try {
      const db = getFirebaseFirestore();
      const userRef = doc(db, "users", user.uid);

      setState({ data: null, loading: true, error: null });

      const unsubscribe = onSnapshot(
        userRef,
        (snapshot) => {
          if (!active) {
            return;
          }

          setState({
            data: snapshot.exists() ? (snapshot.data() as FirestoreUserDocument) : null,
            loading: false,
            error: null
          });
        },
        (snapshotError) => {
          if (!active) {
            return;
          }

          setState({
            data: null,
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
        data: null,
        loading: false,
        error: caughtError instanceof Error ? caughtError.message : "Unable to load user document"
      });
    }
  }, [user]);

  return state;
}