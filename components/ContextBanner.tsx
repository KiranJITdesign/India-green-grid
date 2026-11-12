"use client";

import React, { useState } from "react";
import { GEC_III_DATA, DATA_CITATIONS } from "@/data/energyData";
import { SourceTooltip } from "./SourceTooltip";
import { Zap, ChevronRight, X, ShieldAlert, BatteryCharging, Network } from "lucide-react";

export function ContextBanner() {
  const [isDismissed, setIsDismissed] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  if (isDismissed) return null;

  return (
    <aside aria-label="Policy & Grid Milestone" className="w-full bg-gradient-to-r from-emerald-950/80 via-slate-900/90 to-teal-950/80 border-b border-emerald-800/40 text-slate-200 text-xs py-2.5 px-4 transition-all">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 flex-wrap">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 uppercase tracking-wider">
            <Zap className="w-3 h-3 text-emerald-400 fill-emerald-400" />
            2026 Grid Milestone
          </span>
          <span className="font-semibold text-slate-100">
            Green Energy Corridor-III (GEC-III):
          </span>
          <span className="text-emerald-300 font-bold bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-800/40">
            {GEC_III_DATA.outlayFormatted}
          </span>
          <span className="text-slate-300">
            Cabinet Outlay enabling{" "}
            <strong className="text-white font-semibold">135 GW RE evacuation</strong> &{" "}
            <strong className="text-emerald-300 font-semibold">50 GWh BESS</strong> toward India&apos;s{" "}
            <strong className="text-white font-semibold">900 GW 2035 target</strong>.
          </span>
          <SourceTooltip citationId="CABINET_GEC_III" />
        </div>

        <div className="flex items-center gap-2 self-end md:self-auto shrink-0">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-[11px] text-emerald-400 hover:text-emerald-300 underline font-medium flex items-center gap-0.5"
          >
            <span>{isExpanded ? "Hide Details" : "Why this matters now"}</span>
            <ChevronRight className={`w-3 h-3 transition-transform ${isExpanded ? "rotate-90" : ""}`} />
          </button>
          <button
            onClick={() => setIsDismissed(true)}
            className="text-slate-400 hover:text-slate-200 p-0.5 rounded transition-colors"
            title="Dismiss banner"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="max-w-7xl mx-auto mt-3 pt-3 border-t border-emerald-800/30 grid grid-cols-1 md:grid-cols-3 gap-3 text-slate-300 animate-in fade-in">
          <div className="flex items-start gap-2 bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
            <Network className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-slate-200 text-xs">135 GW RE Evacuation</p>
              <p className="text-[11px] text-slate-400">
                High-voltage green corridor links desert solar parks in Ladakh & Rajasthan to national load centers.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-2 bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
            <BatteryCharging className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-slate-200 text-xs">50 GWh BESS Addition</p>
              <p className="text-[11px] text-slate-400">
                Directly provides round-the-clock (RTC) green power and frequency stability against solar duck curves.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-2 bg-slate-900/60 p-2.5 rounded-lg border border-slate-800">
            <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-slate-200 text-xs">The Delivery Gap</p>
              <p className="text-[11px] text-slate-400">
                While transmission is scaling rapidly, DISCOMs and citizens need real-time decision support to adopt and comply.
              </p>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
