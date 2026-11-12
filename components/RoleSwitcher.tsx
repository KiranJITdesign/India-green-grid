"use client";

import React from "react";
import { useRole, UserRole, ROLE_CONFIGS } from "./RoleContext";
import { User, Factory, Landmark, ChevronDown } from "lucide-react";

export function RoleSwitcher() {
  const { role, setRole } = useRole();

  const roleIcons = {
    citizen: <User className="w-4 h-4 text-emerald-400" />,
    discom: <Factory className="w-4 h-4 text-amber-400" />,
    policymaker: <Landmark className="w-4 h-4 text-sky-400" />,
  };

  return (
    <div className="flex items-center gap-2">
      <div className="relative inline-block">
        <label htmlFor="role-select" className="sr-only">
          Select View Role
        </label>
        <div className="flex items-center gap-2 bg-slate-900/90 border border-slate-700/80 hover:border-emerald-500/50 rounded-lg px-2.5 py-1.5 transition-all shadow-sm">
          <span className="hidden sm:inline text-xs text-slate-400 font-medium">
            Role:
          </span>
          <div className="flex items-center gap-1.5">
            {roleIcons[role]}
            <select
              id="role-select"
              value={role}
              onChange={(e) => setRole(e.target.value as UserRole)}
              className="bg-transparent text-xs font-semibold text-slate-200 focus:outline-none cursor-pointer appearance-none pr-5 py-0.5"
            >
              <option value="policymaker" className="bg-slate-900 text-slate-200">
                Policymaker & Analyst
              </option>
              <option value="discom" className="bg-slate-900 text-slate-200">
                DISCOM & Industry
              </option>
              <option value="citizen" className="bg-slate-900 text-slate-200">
                Citizen & Homeowner
              </option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 pointer-events-none -ml-4" />
          </div>
          <span className="hidden md:inline-block ml-1 px-1.5 py-0.2 rounded text-[10px] font-semibold bg-emerald-950 text-emerald-300 border border-emerald-800/40">
            {ROLE_CONFIGS[role].badge}
          </span>
        </div>
      </div>
    </div>
  );
}
