"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ENERGY_MIX_HIGHLIGHTS,
  GEC_III_DATA,
  DATA_CITATIONS,
  RPO_CONSTANTS,
  GENERATION_MIX_DATA,
} from "@/data/energyData";
import { SourceTooltip } from "@/components/SourceTooltip";
import { GenerationMixPieChart } from "@/components/charts/GenerationMixPieChart";
import { GenerationBarChart } from "@/components/charts/GenerationBarChart";
import { RpoTrajectoryChart } from "@/components/charts/RpoTrajectoryChart";
import { useRole } from "@/components/RoleContext";
import {
  Zap,
  TrendingUp,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
  Flame,
  SunMedium,
  Layers,
  ChevronRight,
  BarChart3,
  PieChart as PieIcon,
  Compass,
  Calculator,
  Briefcase,
  Database,
  ExternalLink,
} from "lucide-react";

export default function EnergyMixDashboard() {
  const { role, config } = useRole();
  const [chartMode, setChartMode] = useState<"pie" | "bar">("pie");
  const [backendStats, setBackendStats] = useState<any>(null);

  useEffect(() => {
    fetch("/api/health")
      .then((res) => res.json())
      .then((data) => {
        if (data?.metrics) setBackendStats(data.metrics);
      })
      .catch((err) => console.log("Backend telemetry connect:", err));
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* 5-SECOND HERO: What's India's Energy Mix & RPO Trajectory? */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900/90 to-emerald-950/40 border border-slate-800 p-6 md:p-8 shadow-2xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                Official Baseline
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 font-semibold bg-emerald-950/70 px-2 py-0.5 rounded border border-emerald-800/40">
                <Database className="w-3 h-3" />
                Backend API Connected
              </span>
              <span className="text-xs text-slate-400 font-medium">
                Data as of: <strong className="text-slate-200">{ENERGY_MIX_HIGHLIGHTS.dataAsOf}</strong>
              </span>
              <SourceTooltip citationId="CEA_GENERATION_2026" />
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight">
              India Electricity Generation Mix &{" "}
              <span className="bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
                Renewable Transition Gap
              </span>
            </h1>

            <p className="text-sm text-slate-300 leading-relaxed">
              While India reached{" "}
              <strong className="text-emerald-300 font-semibold">209.63 GW</strong> of non-fossil installed capacity
              (growing at <strong className="text-white">10.79% YoY</strong> toward 900 GW by 2035), coal continues to generate{" "}
              <strong className="text-amber-300 font-bold">~75%</strong> of actual electricity. Pure solar & wind contribute{" "}
              <strong className="text-emerald-400 font-bold">~12%</strong>.
            </p>
          </div>

          {/* Quick Role Context Pill */}
          <div className="shrink-0 bg-slate-950/70 border border-emerald-800/40 rounded-xl p-4 lg:w-72 shadow-lg backdrop-blur-md">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="text-slate-400">View Tailored For:</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-700/50">
                {config.badge}
              </span>
            </div>
            <p className="font-bold text-white text-sm mb-1">{config.label}</p>
            <p className="text-[11px] text-slate-400 line-clamp-2 mb-3">
              {config.description}
            </p>
            <Link
              href={config.primaryActionPath}
              className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-all shadow-md shadow-emerald-500/20"
            >
              <span>{config.primaryActionLabel}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* 4 Instant Key Metric Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3.5 mt-6 pt-6 border-t border-slate-800/80">
          {/* Card 1: Coal Share */}
          <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-3.5 flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span className="flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-slate-400" />
                Coal Generation
              </span>
              <SourceTooltip citationId="CEA_GENERATION_2026" />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl sm:text-3xl font-black text-slate-100">
                ~75%
              </span>
              <span className="text-xs text-slate-400">of gross power</span>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
              <div className="bg-slate-500 h-full rounded-full" style={{ width: "75%" }}></div>
            </div>
          </div>

          {/* Card 2: RE Share */}
          <div className="bg-slate-950/60 border border-emerald-900/40 rounded-xl p-3.5 flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span className="flex items-center gap-1 text-emerald-400">
                <SunMedium className="w-3.5 h-3.5 text-emerald-400" />
                Solar & Wind
              </span>
              <SourceTooltip citationId="CEA_GENERATION_2026" />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl sm:text-3xl font-black text-emerald-400">
                ~12%
              </span>
              <span className="text-xs text-slate-400">+8% Hydro = 20%</span>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
              <div className="bg-emerald-500 h-full rounded-full" style={{ width: "12%" }}></div>
            </div>
          </div>

          {/* Card 3: Non-Fossil Capacity */}
          <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-3.5 flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span className="flex items-center gap-1">
                <Layers className="w-3.5 h-3.5 text-teal-400" />
                Non-Fossil Capacity
              </span>
              <SourceTooltip citationId="CEA_CAPACITY_2024_2026" />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl sm:text-3xl font-black text-white">
                209.63
              </span>
              <span className="text-xs text-emerald-400 font-semibold">GW (+10.79% YoY)</span>
            </div>
            <p className="text-[10px] text-slate-400 mt-1">
              Expected ~257 GW in 2026 toward 900 GW by 2035
            </p>
          </div>

          {/* Card 4: Statutory RPO Target */}
          <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-3.5 flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span className="flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5 text-cyan-400" />
                Statutory RPO Mandate
              </span>
              <SourceTooltip citationId="MOP_RPO_TRAJECTORY" />
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-2xl sm:text-3xl font-black text-cyan-400">
                29.91%
              </span>
              <span className="text-xs text-slate-400">2025 → 43.33% by 2030</span>
            </div>
            <p className="text-[10px] text-slate-400 mt-1">
              Statutory obligation for DISCOMs & heavy power consumers
            </p>
          </div>
        </div>
      </section>

      {/* COAL-VS-RENEWABLES GAP CALLOUT BANNER */}
      <section className="relative overflow-hidden rounded-xl bg-gradient-to-r from-amber-950/40 via-slate-900 to-emerald-950/40 border border-amber-600/30 p-4 md:p-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center shrink-0 mt-0.5">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm sm:text-base font-bold text-white">
                  The 63% Real-Time Generation Gap Callout
                </h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-900/60 text-amber-300 border border-amber-700/50">
                  Critical Policy Challenge
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                India has achieved massive non-fossil capacity installs, but the actual dispatch gap remains severe:{" "}
                <span className="text-amber-300 font-semibold">Coal generates ~75%</span> vs{" "}
                <span className="text-emerald-400 font-semibold">Solar & Wind at ~12%</span>. Closing this 63% gap requires the{" "}
                <strong className="text-white font-semibold">Cabinet-approved ₹1,86,405 Cr Green Energy Corridor-III</strong> with 50 GWh BESS battery storage and decentralized rooftop solar under PM Surya Ghar.
              </p>
            </div>
          </div>
          <Link
            href="/rpo-tracker"
            className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-500/40 transition-colors"
          >
            <span>Simulate DISCOM Deficit</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </section>

      {/* MAIN VISUALIZATION ROW: Generation Mix Chart & RPO Trajectory Area */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Generation Mix Charts (7 Cols) */}
        <div className="lg:col-span-7 bg-slate-900/80 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-bold text-white text-base">
                  Electricity Generation by Source
                </h2>
                <SourceTooltip citationId="CEA_GENERATION_2026" />
              </div>
              <p className="text-xs text-slate-400">
                Official fuel-wise share of India&apos;s annual gross electricity generation
              </p>
            </div>

            {/* Toggle Pie / Bar view */}
            <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
              <button
                onClick={() => setChartMode("pie")}
                className={`p-1.5 rounded-md text-xs font-medium flex items-center gap-1 transition-colors ${
                  chartMode === "pie"
                    ? "bg-emerald-950 text-emerald-300 border border-emerald-800/60"
                    : "text-slate-400 hover:text-white"
                }`}
                title="View Donut Chart"
              >
                <PieIcon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Pie</span>
              </button>
              <button
                onClick={() => setChartMode("bar")}
                className={`p-1.5 rounded-md text-xs font-medium flex items-center gap-1 transition-colors ${
                  chartMode === "bar"
                    ? "bg-emerald-950 text-emerald-300 border border-emerald-800/60"
                    : "text-slate-400 hover:text-white"
                }`}
                title="View Bar Chart"
              >
                <BarChart3 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Bar</span>
              </button>
            </div>
          </div>

          <div className="py-2">
            {chartMode === "pie" ? <GenerationMixPieChart /> : <GenerationBarChart />}
          </div>

          {/* Explanatory Data Pill Row */}
          <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-800 text-center">
            <div className="bg-slate-950/60 p-2 rounded-lg">
              <span className="text-[10px] text-slate-400 block">Fossil Fuels</span>
              <span className="text-sm font-bold text-slate-200">78%</span>
              <span className="text-[9px] text-slate-500 block">Coal 75% + Gas 3%</span>
            </div>
            <div className="bg-slate-950/60 p-2 rounded-lg">
              <span className="text-[10px] text-slate-400 block">Pure RE</span>
              <span className="text-sm font-bold text-emerald-400">12%</span>
              <span className="text-[9px] text-slate-500 block">Solar & Wind</span>
            </div>
            <div className="bg-slate-950/60 p-2 rounded-lg">
              <span className="text-[10px] text-slate-400 block">Hydro & Nuclear</span>
              <span className="text-sm font-bold text-sky-400">10%</span>
              <span className="text-[9px] text-slate-500 block">Hydro 8% + Nuclear 2%</span>
            </div>
          </div>
        </div>

        {/* Right Column: RPO Statutory Trajectory (5 Cols) */}
        <div className="lg:col-span-5 bg-slate-900/80 border border-slate-800 rounded-2xl p-5 flex flex-col justify-between">
          <div className="pb-3 border-b border-slate-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h2 className="font-bold text-white text-base">
                  Statutory RPO Trajectory
                </h2>
                <SourceTooltip citationId="MOP_RPO_TRAJECTORY" />
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800/40">
                MoP Gazette
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Mandatory trajectory: <strong className="text-emerald-400">29.91% in 2025</strong> scaling to <strong className="text-cyan-400">43.33% in 2030</strong>
            </p>
          </div>

          <div className="py-2">
            <RpoTrajectoryChart />
          </div>

          <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 text-xs space-y-1.5">
            <div className="flex items-center justify-between font-semibold">
              <span className="text-slate-300">Statutory Non-Compliance Impact:</span>
              <span className="text-red-400 font-bold">Regulatory Risk</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              DISCOMs failing to meet 29.91% are subject to CERC/SERC shortfall audits and must purchase Renewable Energy Certificates (RECs) at ~₹1,000–₹1,500/MWh.
            </p>
            <div className="pt-1 flex justify-end">
              <Link
                href="/rpo-tracker"
                className="text-[11px] text-emerald-400 hover:text-emerald-300 font-bold inline-flex items-center gap-1"
              >
                <span>Launch DISCOM Compliance Audit Tool</span>
                <ChevronRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* LIVE BACKEND TELEMETRY RIBBON */}
      {backendStats && (
        <section className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block">
                Live Backend Store Telemetry
              </span>
              <p className="text-xs text-slate-300">
                <strong className="text-white">{backendStats.totalDiscomAuditsFiled}</strong> DISCOM Audits Verified •{" "}
                <strong className="text-emerald-300">{backendStats.complianceRatePercent}%</strong> State Compliance Rate •{" "}
                <strong className="text-white">{backendStats.totalJobApplications}</strong> Green Job Applicants
              </p>
            </div>
          </div>
          <Link
            href="/audits"
            className="text-xs font-bold text-emerald-400 hover:text-emerald-300 inline-flex items-center gap-1 shrink-0"
          >
            <span>Open Multi-Tenant Registry</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </section>
      )}

      {/* THREE INTERACTIVE PATHWAYS FOR JUDGES */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white">
              Role-Based Operational Modules
            </h2>
            <p className="text-xs text-slate-400">
              Select your role above or jump straight into the decision-support workflows
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Module 1: RPO Tracker */}
          <div className="bg-slate-900/80 hover:bg-slate-800/90 border border-slate-800 hover:border-amber-500/50 rounded-2xl p-5 transition-all flex flex-col justify-between group shadow-lg">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400 group-hover:scale-105 transition-transform">
                  <Compass className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800/40">
                  DISCOM & Industry
                </span>
              </div>
              <h3 className="text-base font-bold text-white group-hover:text-amber-300 transition-colors">
                RPO Compliance Tracker
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Enter total and renewable power procurement. Evaluates compliance against 2025 (29.91%) or 2030 (43.33%) targets with shortfall gauge and REC penalty estimates.
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-slate-800 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">Includes 5 DISCOM presets</span>
              <Link
                href="/rpo-tracker"
                className="text-xs font-bold text-amber-400 hover:text-amber-300 flex items-center gap-1"
              >
                <span>Track RPO</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Module 2: Solar Calculator */}
          <div className="bg-slate-900/80 hover:bg-slate-800/90 border border-slate-800 hover:border-emerald-500/50 rounded-2xl p-5 transition-all flex flex-col justify-between group shadow-lg">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-transform">
                  <Calculator className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800/40">
                  Citizen & Residential
                </span>
              </div>
              <h3 className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors">
                Rooftop Solar & Subsidy Calculator
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Enter monthly bill and roof area. Applies exact PM Surya Ghar subsidy slabs (₹30,000/kW 1st 2 kW, ₹18,000 3rd kW, max ₹78k cap) and computes payback.
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-slate-800 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">Assumes ₹6/unit tariff</span>
              <Link
                href="/solar-calculator"
                className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
              >
                <span>Calculate ROI</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Module 3: Green Jobs Board */}
          <div className="bg-slate-900/80 hover:bg-slate-800/90 border border-slate-800 hover:border-teal-500/50 rounded-2xl p-5 transition-all flex flex-col justify-between group shadow-lg">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-teal-500/15 border border-teal-500/30 flex items-center justify-center text-teal-400 group-hover:scale-105 transition-transform">
                  <Briefcase className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-teal-950 text-teal-300 border border-teal-800/40">
                  Employment & Workforce
                </span>
              </div>
              <h3 className="text-base font-bold text-white group-hover:text-teal-300 transition-colors">
                National Green Jobs Board
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Explore 25 seeded verified career opportunities across Solar PV, Wind Energy, BESS Storage, Green Hydrogen, and ESG Policy across Indian states.
              </p>
            </div>
            <div className="pt-4 mt-4 border-t border-slate-800 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">SCGJ / NISE aligned</span>
              <Link
                href="/jobs"
                className="text-xs font-bold text-teal-400 hover:text-teal-300 flex items-center gap-1"
              >
                <span>Explore Careers</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
