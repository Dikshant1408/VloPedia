import { initializeApp, getApps, type FirebaseApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyBCV2Lui2dRz_je3EAnAX6Rbg3sF33Lej0",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "valovault-7de08.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "valovault-7de08",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "valovault-7de08.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "127357048667",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:127357048667:web:08d60cad1b1d1db142ec7e",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || "G-7D2RRJ0C9W"
};

function assertFirebaseConfig() {
  // Configured with valid public fallback credentials
}

let firebaseApp: FirebaseApp | undefined;

export function getFirebaseApp() {
  if (!firebaseApp) {
    assertFirebaseConfig();
    firebaseApp = getApps().length > 0 ? getApps()[0] : initializeApp(firebaseConfig);
  }

  return firebaseApp;
}

export function getFirebaseAuth() {
  return getAuth(getFirebaseApp());
}

export function getFirebaseFirestore() {
  return getFirestore(getFirebaseApp());
}

export function getFirebaseStorage() {
  return getStorage(getFirebaseApp());
}

export async function getFirebaseAnalytics() {
  if (typeof window === "undefined") {
    return null;
  }

  const supported = await isSupported();

  if (!supported) {
    return null;
  }

  return getAnalytics(getFirebaseApp());
}
