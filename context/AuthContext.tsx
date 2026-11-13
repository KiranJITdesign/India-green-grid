"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  signInWithPopup,
  onAuthStateChanged,
  sendPasswordResetEmail,
  updateProfile,
} from "firebase/auth";
import {
  auth,
  googleProvider,
  isFirebaseConfigured,
  syncUserProfileToFirestore,
  fetchUserProfileFromFirestore,
  UserProfileData,
} from "@/lib/firebase";
import { useRole, UserRole } from "@/components/RoleContext";

export interface DemoUser {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string | null;
  isDemo: true;
}

export type AuthUser = (User | DemoUser) & { isDemo?: boolean };

interface AuthContextType {
  user: AuthUser | null;
  userProfile: UserProfileData | null;
  loading: boolean;
  isDemoMode: boolean;
  isFirebaseConfigured: boolean;
  loginWithEmail: (email: string, password: string) => Promise<User | void>;
  registerWithEmail: (
    email: string,
    password: string,
    displayName: string,
    role: UserRole,
    organization?: string
  ) => Promise<User | void>;
  loginWithGoogle: () => Promise<void>;
  loginAsDemo: (role: UserRole, customName?: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isDemoMode, setIsDemoMode] = useState(false);
  const { setRole } = useRole();

  // Listen to Firebase Auth state if auth is initialized
  useEffect(() => {
    // Check if there is an active demo session in localStorage
    const savedDemo = localStorage.getItem("igg_demo_user");
    if (savedDemo) {
      try {
        const parsed = JSON.parse(savedDemo);
        setUser(parsed);
        setIsDemoMode(true);
        const profile = localStorage.getItem(`igg_profile_${parsed.uid}`);
        if (profile) {
          const parsedProfile = JSON.parse(profile);
          setUserProfile(parsedProfile);
          if (parsedProfile.role) setRole(parsedProfile.role);
        }
        setLoading(false);
        return;
      } catch {
        localStorage.removeItem("igg_demo_user");
      }
    }

    if (!auth) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        setIsDemoMode(false);
        // Fetch or create profile in Firestore
        const profile = await fetchUserProfileFromFirestore(firebaseUser.uid);
        if (profile) {
          setUserProfile(profile);
          if (profile.role) {
            setRole(profile.role);
          }
        } else {
          // If profile doesn't exist yet, create default
          const newProfile = await syncUserProfileToFirestore(firebaseUser, { role: "citizen" });
          if (newProfile) setUserProfile(newProfile);
        }
      } else {
        // If not in demo mode, clear user
        if (!localStorage.getItem("igg_demo_user")) {
          setUser(null);
          setUserProfile(null);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [setRole]);

  // Login with Email & Password using Firebase signInWithEmailAndPassword
  const loginWithEmail = async (email: string, password: string) => {
    if (!auth || !isFirebaseConfigured) {
      // If Firebase is not configured, fall back to simulated credentials check
      return loginAsDemo("citizen", email.split("@")[0]);
    }

    return signInWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        // Signed in 
        const user = userCredential.user;
        const profile = await fetchUserProfileFromFirestore(user.uid);
        if (profile) {
          setUserProfile(profile);
          if (profile.role) setRole(profile.role);
        }
        return user;
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error("Firebase signInWithEmailAndPassword error:", errorCode, errorMessage);
        throw error;
      });
  };

  // Register new account with Email & Password using Firebase createUserWithEmailAndPassword
  const registerWithEmail = async (
    email: string,
    password: string,
    displayName: string,
    role: UserRole,
    organization?: string
  ) => {
    if (!auth || !isFirebaseConfigured) {
      // Demo registration
      return loginAsDemo(role, displayName);
    }

    return createUserWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        // Signed up 
        const user = userCredential.user;
        await updateProfile(user, { displayName });
        
        // Save to Firestore 'users' collection
        const profile = await syncUserProfileToFirestore(
          { ...user, displayName },
          { role, organization }
        );
        if (profile) {
          setUserProfile(profile);
          setRole(role);
        }
        return user;
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error("Firebase createUserWithEmailAndPassword error:", errorCode, errorMessage);
        throw error;
      });
  };

  // Login with Google
  const loginWithGoogle = async () => {
    if (!auth || !googleProvider || !isFirebaseConfigured) {
      return loginAsDemo("policymaker", "Google Energy Officer");
    }
    const cred = await signInWithPopup(auth, googleProvider);
    const profile = await syncUserProfileToFirestore(cred.user, { role: "citizen" });
    if (profile) {
      setUserProfile(profile);
      if (profile.role) setRole(profile.role);
    }
  };

  // Instant Demo login (Citizen / DISCOM / Policymaker)
  const loginAsDemo = async (role: UserRole, customName?: string) => {
    const roleLabels: Record<UserRole, string> = {
      citizen: "Dr. Ananya Sharma (Citizen & Homeowner)",
      discom: "Rajesh Verma (Tata Power Delhi / DISCOM)",
      policymaker: "Kavita Rao (Ministry of Power / Analyst)",
    };

    const demoUid = `demo_${role}_${Date.now()}`;
    const name = customName || roleLabels[role] || "Energy Delegate";
    const demoUserObj: DemoUser = {
      uid: demoUid,
      email: `${role}.demo@indiagreengrid.org`,
      displayName: name,
      photoURL: null,
      isDemo: true,
    };

    const demoProfile: UserProfileData = {
      uid: demoUid,
      email: demoUserObj.email,
      displayName: name,
      role: role,
      organization: role === "discom" ? "TPDDL" : role === "policymaker" ? "CEA / MNRE" : "Delhi Resident",
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
    };

    localStorage.setItem("igg_demo_user", JSON.stringify(demoUserObj));
    localStorage.setItem(`igg_profile_${demoUid}`, JSON.stringify(demoProfile));

    setUser(demoUserObj);
    setUserProfile(demoProfile);
    setIsDemoMode(true);
    setRole(role);
  };

  // Logout
  const logout = async () => {
    localStorage.removeItem("igg_demo_user");
    if (auth) {
      try {
        await signOut(auth);
      } catch (e) {
        console.warn("Sign out warning:", e);
      }
    }
    setUser(null);
    setUserProfile(null);
    setIsDemoMode(false);
  };

  // Reset password
  const resetPassword = async (email: string) => {
    if (!auth || !isFirebaseConfigured) {
      // Simulate delay for demo
      await new Promise((res) => setTimeout(res, 800));
      return;
    }
    await sendPasswordResetEmail(auth, email);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        userProfile,
        loading,
        isDemoMode,
        isFirebaseConfigured,
        loginWithEmail,
        registerWithEmail,
        loginWithGoogle,
        loginAsDemo,
        logout,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
