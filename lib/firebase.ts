import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getAuth, Auth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore, Firestore, doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "",
};

// Check if valid Firebase credentials are provided
export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey &&
  firebaseConfig.apiKey !== "AIzaSyExampleKey1234567890abcdef" &&
  firebaseConfig.projectId &&
  firebaseConfig.projectId !== "india-green-grid"
);

let app: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;
let googleProvider: GoogleAuthProvider | null = null;

if (typeof window !== "undefined" || process.env.NODE_ENV !== "test") {
  try {
    if (firebaseConfig.apiKey && firebaseConfig.projectId) {
      app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
      auth = getAuth(app);
      db = getFirestore(app);
      googleProvider = new GoogleAuthProvider();
      googleProvider.setCustomParameters({ prompt: "select_account" });
    }
  } catch (error) {
    console.warn("Firebase initialization warning (running in demo/fallback mode):", error);
  }
}

export { app, auth, db, googleProvider };

export interface UserProfileData {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL?: string | null;
  role: "citizen" | "discom" | "policymaker";
  organization?: string;
  createdAt?: any;
  lastLogin?: any;
}

/**
 * Saves or updates a user profile record in the Firestore 'users' collection.
 */
export async function syncUserProfileToFirestore(
  user: { uid: string; email: string | null; displayName: string | null; photoURL?: string | null },
  additionalData: { role?: "citizen" | "discom" | "policymaker"; organization?: string } = {}
): Promise<UserProfileData | null> {
  const profile: UserProfileData = {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName || user.email?.split("@")[0] || "Energy Advocate",
    photoURL: user.photoURL || null,
    role: additionalData.role || "citizen",
    organization: additionalData.organization || "",
  };

  if (!db) {
    // If Firebase Firestore isn't connected, store in localStorage for demo persistence
    try {
      localStorage.setItem(`igg_profile_${user.uid}`, JSON.stringify(profile));
    } catch {
      // ignore
    }
    return profile;
  }

  try {
    const userRef = doc(db, "users", user.uid);
    const snap = await getDoc(userRef);

    if (!snap.exists()) {
      await setDoc(userRef, {
        ...profile,
        createdAt: serverTimestamp(),
        lastLogin: serverTimestamp(),
      });
    } else {
      const existingData = snap.data() as UserProfileData;
      const mergedProfile = {
        ...existingData,
        ...additionalData,
        lastLogin: serverTimestamp(),
      };
      await setDoc(userRef, mergedProfile, { merge: true });
      return mergedProfile;
    }
    return profile;
  } catch (error) {
    console.error("Error syncing profile to Firestore:", error);
    return profile;
  }
}

/**
 * Loads a user's profile from Firestore or local cache.
 */
export async function fetchUserProfileFromFirestore(uid: string): Promise<UserProfileData | null> {
  if (!db) {
    try {
      const cached = localStorage.getItem(`igg_profile_${uid}`);
      return cached ? JSON.parse(cached) : null;
    } catch {
      return null;
    }
  }

  try {
    const userRef = doc(db, "users", uid);
    const snap = await getDoc(userRef);
    if (snap.exists()) {
      return snap.data() as UserProfileData;
    }
    return null;
  } catch (error) {
    console.error("Error fetching user profile from Firestore:", error);
    return null;
  }
}
