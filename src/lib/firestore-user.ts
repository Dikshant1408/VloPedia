import { type User } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { getFirebaseFirestore } from "@/services/firebase";

export type FirestoreUserDocument = {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  onboardingCompleted: boolean;
};

export async function syncFirestoreUserDocument(authUser: User) {
  const db = getFirebaseFirestore();
  const userRef = doc(db, "users", authUser.uid);
  const snapshot = await getDoc(userRef);

  const userDocument: FirestoreUserDocument = {
    uid: authUser.uid,
    email: authUser.email ?? null,
    displayName: authUser.displayName ?? null,
    photoURL: authUser.photoURL ?? null,
    onboardingCompleted: snapshot.exists() ? Boolean(snapshot.data().onboardingCompleted) : false
  };

  await setDoc(userRef, userDocument, { merge: true });

  return userDocument;
}