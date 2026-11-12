"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type UserRole = "citizen" | "discom" | "policymaker";

export interface RoleConfig {
  id: UserRole;
  label: string;
  badge: string;
  description: string;
  primaryActionLabel: string;
  primaryActionPath: string;
}

export const ROLE_CONFIGS: Record<UserRole, RoleConfig> = {
  citizen: {
    id: "citizen",
    label: "Citizen & Homeowner",
    badge: "Residential",
    description: "Access PM Surya Ghar rooftop solar subsidies, calculate payback, and explore green energy careers.",
    primaryActionLabel: "Calculate Solar Subsidy",
    primaryActionPath: "/solar-calculator",
  },
  discom: {
    id: "discom",
    label: "DISCOM & Heavy Industry",
    badge: "Enterprise",
    description: "Track statutory RPO compliance against 2025 (29.91%) & 2030 (43.33%) targets, and monitor shortfall risks.",
    primaryActionLabel: "Check RPO Compliance",
    primaryActionPath: "/rpo-tracker",
  },
  policymaker: {
    id: "policymaker",
    label: "Policymaker & Analyst",
    badge: "Strategic",
    description: "Evaluate national generation fuel mix, monitor the coal-vs-RE gap, and assess GEC-III grid evacuation.",
    primaryActionLabel: "Analyze Energy Mix",
    primaryActionPath: "/",
  },
};

interface RoleContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  config: RoleConfig;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export function RoleProvider({ children }: { children: React.ReactNode }) {
  const [role, setRoleState] = useState<UserRole>("policymaker");

  useEffect(() => {
    const saved = localStorage.getItem("igg_user_role") as UserRole | null;
    if (saved && (saved === "citizen" || saved === "discom" || saved === "policymaker")) {
      setRoleState(saved);
    }
  }, []);

  const setRole = (newRole: UserRole) => {
    setRoleState(newRole);
    try {
      localStorage.setItem("igg_user_role", newRole);
    } catch {
      // ignore storage errors
    }
  };

  return (
    <RoleContext.Provider
      value={{
        role,
        setRole,
        config: ROLE_CONFIGS[role],
      }}
    >
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  const context = useContext(RoleContext);
  if (!context) {
    throw new Error("useRole must be used within a RoleProvider");
  }
  return context;
}
