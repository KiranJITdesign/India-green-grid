"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Zap,
  Layers,
  Radio,
  BatteryCharging,
  Info,
  ArrowRight,
  Leaf,
  BarChart3,
  Sun,
  Briefcase,
  FileText,
  ExternalLink,
} from "lucide-react";
import { ReferenceDonutChart } from "@/components/charts/ReferenceDonutChart";
import { ReferenceRpoBarChart } from "@/components/charts/ReferenceRpoBarChart";
import { DashboardIllustration } from "@/components/DashboardIllustration";
import { SourceTooltip } from "@/components/SourceTooltip";

export default function DashboardPage() {
  const [showMixInfo, setShowMixInfo] = useState(false);
  const [showRpoInfo, setShowRpoInfo] = useState(false);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Banner & Header matching Reference Image 1 */}
      <section className="relative bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-sm overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          {/* Left Title Content */}
          <div className="md:col-span-7 space-y-2 z-10">
            <div className="flex items-center gap-2">
              <span className="text-sm">🇮🇳</span>
              <span className="text-xs font-semibold text-slate-500 tracking-wide">
                A Renewable Energy Decision-Support for India
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-black text-[#064e3b] tracking-tight leading-tight">
              India Green Grid
            </h1>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-xl">
              Empowering citizens, DISCOMs and policymakers for a cleaner, renewable and sustainable India.
            </p>

            <div className="pt-2 flex items-center gap-2 flex-wrap">
              <a
                href="https://npp.gov.in/landing-home"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 transition-colors shadow-sm"
              >
                <span>National Power Portal (npp.gov.in)</span>
                <ExternalLink className="w-3.5 h-3.5 text-emerald-700" />
              </a>
              <a
                href="https://www.powermin.gov.in/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 transition-colors shadow-sm"
              >
                <span>Ministry of Power (powermin.gov.in)</span>
                <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
              </a>
            </div>
          </div>

          {/* Right Vector Illustration matching Reference Image 1 */}
          <div className="md:col-span-5 flex items-center justify-end">
            <DashboardIllustration />
          </div>
        </div>
      </section>

      {/* Row of 4 Metric Cards matching Reference Image 1 */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: 209.63 GW */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm flex items-start gap-3.5 hover:border-emerald-300 transition-all">
          <div className="w-10 h-10 rounded-full bg-emerald-100/70 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
            <Zap className="w-5 h-5 fill-emerald-600 text-emerald-600" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
              209.63 GW
            </h2>
            <p className="text-[11px] text-slate-500 font-medium leading-snug mt-0.5">
              Non-fossil Installed Capacity<br />
              <span className="text-emerald-700 font-semibold">(2024, ↑ 10.79% YoY)</span>
            </p>
          </div>
        </div>

        {/* Card 2: ₹1,86,405 Cr */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm flex items-start gap-3.5 hover:border-emerald-300 transition-all">
          <div className="w-10 h-10 rounded-full bg-emerald-100/70 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
            <Layers className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
              ₹1,86,405 Cr
            </h2>
            <p className="text-[11px] text-slate-500 font-medium leading-snug mt-0.5">
              Green Energy Corridor-III<br />
              <span className="text-slate-600">(Cabinet Approved)</span>
            </p>
          </div>
        </div>

        {/* Card 3: 135 GW */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm flex items-start gap-3.5 hover:border-emerald-300 transition-all">
          <div className="w-10 h-10 rounded-full bg-emerald-100/70 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
            <Radio className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
              135 GW
            </h2>
            <p className="text-[11px] text-slate-500 font-medium leading-snug mt-0.5">
              Renewable Evacuation<br />
              <span className="text-slate-600">Capacity (GEC-III)</span>
            </p>
          </div>
        </div>

        {/* Card 4: 50 GWh */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-sm flex items-start gap-3.5 hover:border-emerald-300 transition-all">
          <div className="w-10 h-10 rounded-full bg-emerald-100/70 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
            <BatteryCharging className="w-5 h-5 text-emerald-600" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
              50 GWh
            </h2>
            <p className="text-[11px] text-slate-500 font-medium leading-snug mt-0.5">
              Battery Storage Addition<br />
              <span className="text-slate-600">(GEC-III)</span>
            </p>
          </div>
        </div>
      </section>

      {/* Middle 3-Panel Row matching Reference Image 1 */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Panel 1: Generation Mix Donut (5 Cols) */}
        <div className="lg:col-span-5 bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-1.5">
              <h3 className="font-bold text-slate-900 text-sm">
                India&apos;s Electricity Generation Mix (2026)
              </h3>
              <button
                onClick={() => setShowMixInfo(!showMixInfo)}
                className="text-slate-400 hover:text-slate-600 p-0.5"
                title="View Source Information"
              >
                <Info className="w-3.5 h-3.5" />
              </button>
            </div>
            <SourceTooltip citationId="CEA_GENERATION_2026" />
          </div>

          {showMixInfo && (
            <p className="text-[11px] text-slate-500 bg-slate-50 p-2 rounded-lg border border-slate-100 my-2">
              Based on CEA gross electricity generation baseline: Coal (~75%), Solar (~7%), Wind (~3.5%), Hydro (~10%), Nuclear (~2.5%), Others (~2%).
            </p>
          )}

          <ReferenceDonutChart />
        </div>

        {/* Panel 2: RPO Trajectory Bars (4 Cols) */}
        <div className="lg:col-span-4 bg-white border border-slate-200/80 rounded-2xl p-5 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-1.5">
              <h3 className="font-bold text-slate-900 text-sm">
                RPO Trajectory
              </h3>
              <button
                onClick={() => setShowRpoInfo(!showRpoInfo)}
                className="text-slate-400 hover:text-slate-600 p-0.5"
                title="View Source Information"
              >
                <Info className="w-3.5 h-3.5" />
              </button>
            </div>
            <SourceTooltip citationId="MOP_RPO_TRAJECTORY" />
          </div>

          {showRpoInfo && (
            <p className="text-[11px] text-slate-500 bg-slate-50 p-2 rounded-lg border border-slate-100 my-2">
              Ministry of Power statutory uniform trajectory: 29.91% in 2025 scaling to 43.33% by 2030.
            </p>
          )}

          <ReferenceRpoBarChart />
        </div>

        {/* Panel 3: "The Gap" (3 Cols) matching Reference Image 1 */}
        <div className="lg:col-span-3 bg-[#e8f5e9] border border-emerald-200/60 rounded-2xl p-6 shadow-sm flex flex-col justify-center">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center">
              <Leaf className="w-3.5 h-3.5 fill-white text-white" />
            </div>
            <h3 className="font-extrabold text-slate-900 text-base">
              The Gap
            </h3>
          </div>

          <p className="text-slate-800 text-sm sm:text-base leading-relaxed">
            <strong className="font-extrabold text-slate-950 text-xl sm:text-2xl block mb-1">
              ~75%
            </strong>
            of electricity still from coal, while only{" "}
            <strong className="font-extrabold text-emerald-800 text-xl sm:text-2xl inline">
              ~12%
            </strong>{" "}
            from renewables.
          </p>
        </div>
      </section>

      {/* Quick Actions Row matching Reference Image 1 */}
      <section className="space-y-3">
        <h3 className="text-base font-bold text-slate-900">
          Quick Actions
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: RPO Tracker */}
          <Link
            href="/rpo-tracker"
            className="group bg-[#eef7f2] hover:bg-[#e4f2eb] border border-emerald-100 rounded-2xl p-4 shadow-sm transition-all flex flex-col justify-between"
          >
            <div>
              <div className="w-8 h-8 rounded-lg bg-emerald-600/10 text-emerald-800 flex items-center justify-center mb-2.5">
                <BarChart3 className="w-4 h-4 text-emerald-700" />
              </div>
              <h4 className="font-bold text-slate-900 text-sm group-hover:text-emerald-800 transition-colors">
                RPO Tracker
              </h4>
              <p className="text-xs text-slate-600 mt-0.5 leading-snug">
                Check RPO compliance and shortfall
              </p>
            </div>
            <div className="pt-3 flex justify-end">
              <ArrowRight className="w-4 h-4 text-emerald-700 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Card 2: Solar Calculator (Light warm yellow background matching ref) */}
          <Link
            href="/solar-calculator"
            className="group bg-[#fef9ec] hover:bg-[#fef3d6] border border-amber-100 rounded-2xl p-4 shadow-sm transition-all flex flex-col justify-between"
          >
            <div>
              <div className="w-8 h-8 rounded-lg bg-amber-500/15 text-amber-700 flex items-center justify-center mb-2.5">
                <Sun className="w-4 h-4 text-amber-600" />
              </div>
              <h4 className="font-bold text-slate-900 text-sm group-hover:text-amber-800 transition-colors">
                Solar Calculator
              </h4>
              <p className="text-xs text-slate-600 mt-0.5 leading-snug">
                Estimate system size, cost, subsidy and payback
              </p>
            </div>
            <div className="pt-3 flex justify-end">
              <ArrowRight className="w-4 h-4 text-emerald-700 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Card 3: Green Jobs */}
          <Link
            href="/jobs"
            className="group bg-[#eef7f2] hover:bg-[#e4f2eb] border border-emerald-100 rounded-2xl p-4 shadow-sm transition-all flex flex-col justify-between"
          >
            <div>
              <div className="w-8 h-8 rounded-lg bg-emerald-600/10 text-emerald-800 flex items-center justify-center mb-2.5">
                <Briefcase className="w-4 h-4 text-emerald-700" />
              </div>
              <h4 className="font-bold text-slate-900 text-sm group-hover:text-emerald-800 transition-colors">
                Green Jobs
              </h4>
              <p className="text-xs text-slate-600 mt-0.5 leading-snug">
                Explore 20+ renewable energy opportunities
              </p>
            </div>
            <div className="pt-3 flex justify-end">
              <ArrowRight className="w-4 h-4 text-emerald-700 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          {/* Card 4: Policy & Insights */}
          <Link
            href="/audits"
            className="group bg-[#eef7f2] hover:bg-[#e4f2eb] border border-emerald-100 rounded-2xl p-4 shadow-sm transition-all flex flex-col justify-between"
          >
            <div>
              <div className="w-8 h-8 rounded-lg bg-emerald-600/10 text-emerald-800 flex items-center justify-center mb-2.5">
                <FileText className="w-4 h-4 text-emerald-700" />
              </div>
              <h4 className="font-bold text-slate-900 text-sm group-hover:text-emerald-800 transition-colors">
                Policy & Insights
              </h4>
              <p className="text-xs text-slate-600 mt-0.5 leading-snug">
                GEC-III, national targets and key schemes
              </p>
            </div>
            <div className="pt-3 flex justify-end">
              <ArrowRight className="w-4 h-4 text-emerald-700 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>
      </section>

      {/* Footer matching Reference Image 1 with live redirect citations */}
      <footer className="pt-6 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
        <div className="flex items-center gap-1.5 flex-wrap">
          <Info className="w-3.5 h-3.5 text-slate-400" />
          <span>Data as of 2026 | Official Portals:</span>
          <a
            href="https://npp.gov.in/landing-home"
            target="_blank"
            rel="noopener noreferrer"
            className="text-emerald-700 hover:underline font-medium flex items-center gap-0.5"
          >
            <span>CEA / NPP</span>
            <ExternalLink className="w-3 h-3" />
          </a>
          <span>•</span>
          <a
            href="https://pmsuryaghar.gov.in/#/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-emerald-700 hover:underline font-medium flex items-center gap-0.5"
          >
            <span>PM Surya Ghar</span>
            <ExternalLink className="w-3 h-3" />
          </a>
          <span>•</span>
          <a
            href="https://www.powermin.gov.in/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-emerald-700 hover:underline font-medium flex items-center gap-0.5"
          >
            <span>Ministry of Power</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
        <div className="flex items-center gap-1 font-medium text-emerald-800">
          <span>India towards a Cleaner, Greener Grid</span>
          <span>🍃</span>
        </div>
      </footer>
    </div>
  );
}
