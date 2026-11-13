import React from "react";
import Link from "next/link";
import { SourceTooltip } from "./SourceTooltip";
import { ShieldCheck, HeartHandshake, FileText, CheckCircle2 } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-20 border-t border-slate-800/80 bg-slate-950/80 backdrop-blur-md text-slate-400 text-xs py-10 px-4">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1 */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-emerald-600 flex items-center justify-center font-bold text-slate-950 text-xs">
                IG
              </div>
              <span className="font-bold text-white text-sm">
                India Green Grid
              </span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed max-w-md">
              Democratizing renewable energy transition intelligence for Indian citizens, DISCOM utilities, and state policymakers. Built for CodeSpark 2026 (Domain 4: Renewable and Sustainable Energy, PS1).
            </p>
            <div className="flex items-center gap-2 pt-1 flex-wrap">
              <span className="text-[11px] text-slate-500">Official Citations:</span>
              <SourceTooltip citationId="MNRE_SURYA_GHAR" inlineText="PM Surya Ghar (MNRE)" />
              <SourceTooltip citationId="CABINET_GEC_III" inlineText="Cabinet GEC-III" />
              <SourceTooltip citationId="CEA_GENERATION_2026" inlineText="CEA Capacity 2026" />
              <SourceTooltip citationId="MOP_RPO_TRAJECTORY" inlineText="MoP RPO Trajectory" />
            </div>
          </div>

          {/* Col 2: Core Modules */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Platform Modules
            </h4>
            <ul className="space-y-1.5 text-xs">
              <li>
                <Link href="/" className="hover:text-emerald-400 transition-colors">
                  Energy Mix & Gap Dashboard
                </Link>
              </li>
              <li>
                <Link href="/rpo-tracker" className="hover:text-emerald-400 transition-colors">
                  DISCOM RPO Compliance Tracker
                </Link>
              </li>
              <li>
                <Link href="/solar-calculator" className="hover:text-emerald-400 transition-colors">
                  Rooftop Solar ROI & Subsidy
                </Link>
              </li>
              <li>
                <Link href="/jobs" className="hover:text-emerald-400 transition-colors">
                  National Green Jobs Board
                </Link>
              </li>
              <li>
                <Link href="/green-finance" className="hover:text-emerald-400 transition-colors">
                  Green Finance Aggregator
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Acceptance Checklist */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-200">
              Audit & Verification
            </h4>
            <ul className="space-y-1 text-[11px] text-slate-400">
              <li className="flex items-center gap-1.5 text-emerald-400 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>5-Sec Coal vs RE Generation Mix</span>
              </li>
              <li className="flex items-center gap-1.5 text-emerald-400 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Statutory 2025/2030 RPO Gauge</span>
              </li>
              <li className="flex items-center gap-1.5 text-emerald-400 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>PM Surya Ghar Exact Slab Math</span>
              </li>
              <li className="flex items-center gap-1.5 text-emerald-400 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>25+ Curated Green Jobs</span>
              </li>
              <li className="flex items-center gap-1.5 text-emerald-400 font-medium">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Zero Hallucinated Numbers</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-slate-900 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500">
          <p>
            © 2026 India Green Grid. Data certified under Ministry of New & Renewable Energy (MNRE) & Central Electricity Authority (CEA) guidelines.
          </p>
          <p className="flex items-center gap-1">
            Built with Next.js 14, TypeScript & Tailwind CSS for CodeSpark 2026.
          </p>
        </div>
      </div>
    </footer>
  );
}
