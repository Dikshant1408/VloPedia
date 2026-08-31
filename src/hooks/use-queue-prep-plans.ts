"use client";

import { useAuth } from "@/hooks/use-auth";
import {
  type FirestoreQueuePrepPlan,
  type QueuePrepPlanInput,
  type QueuePrepStatus,
  queuePrepStatuses
} from "@/lib/firestore-queue-prep";
import { getFirebaseFirestore } from "@/services/firebase";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc
} from "firebase/firestore";
import { useCallback, useEffect, useState } from "react";

type QueuePrepPlansState = {
  plans: FirestoreQueuePrepPlan[];
  loading: boolean;
  error: string | null;
};

const initialState: QueuePrepPlansState = {
  plans: [],
  loading: true,
  error: null
};

function readStatus(value: unknown): QueuePrepStatus {
  return typeof value === "string" && queuePrepStatuses.includes(value as QueuePrepStatus)
    ? (value as QueuePrepStatus)
    : "draft";
}

export function useQueuePrepPlans() {
  const { user } = useAuth();
  const [state, setState] = useState<QueuePrepPlansState>(initialState);

  useEffect(() => {
    if (!user) {
      setState({ plans: [], loading: false, error: null });
      return;
    }

    let active = true;

    try {
      const db = getFirebaseFirestore();
      const plansRef = collection(db, "users", user.uid, "queuePrepPlans");
      const plansQuery = query(plansRef, orderBy("updatedAt", "desc"));

      setState({ plans: [], loading: true, error: null });

      const unsubscribe = onSnapshot(
        plansQuery,
        (snapshot) => {
          if (!active) {
            return;
          }

          setState({
            plans: snapshot.docs.map((document) => {
              const data = document.data();

              return {
                id: document.id,
                title: typeof data.title === "string" ? data.title : "Untitled prep",
                mapName: typeof data.mapName === "string" ? data.mapName : "Any map",
                mode: typeof data.mode === "string" ? data.mode : "Competitive",
                agentRole: typeof data.agentRole === "string" ? data.agentRole : "Flex",
                status: readStatus(data.status),
                notes: typeof data.notes === "string" ? data.notes : "",
                createdAt: data.createdAt?.toDate?.() ?? null,
                updatedAt: data.updatedAt?.toDate?.() ?? null
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
            plans: [],
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
        plans: [],
        loading: false,
        error: caughtError instanceof Error ? caughtError.message : "Unable to load queue prep plans"
      });
    }
  }, [user]);

  const addQueuePrepPlan = useCallback(
    async (input: QueuePrepPlanInput) => {
      if (!user) {
        throw new Error("Sign in required");
      }

      const db = getFirebaseFirestore();
      const plansRef = collection(db, "users", user.uid, "queuePrepPlans");

      await addDoc(plansRef, {
        ...input,
        status: "draft",
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
    },
    [user]
  );

  const updateQueuePrepStatus = useCallback(
    async (planId: string, status: QueuePrepStatus) => {
      if (!user) {
        throw new Error("Sign in required");
      }

      const db = getFirebaseFirestore();
      const planRef = doc(db, "users", user.uid, "queuePrepPlans", planId);

      await updateDoc(planRef, {
        status,
        updatedAt: serverTimestamp()
      });
    },
    [user]
  );

  const removeQueuePrepPlan = useCallback(
    async (planId: string) => {
      if (!user) {
        throw new Error("Sign in required");
      }

      const db = getFirebaseFirestore();
      const planRef = doc(db, "users", user.uid, "queuePrepPlans", planId);

      await deleteDoc(planRef);
    },
    [user]
  );

  return {
    ...state,
    addQueuePrepPlan,
    updateQueuePrepStatus,
    removeQueuePrepPlan
  };
}
