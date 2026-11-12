"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  calculateRPO,
  RpoCalculationResult,
} from "@/lib/calculators";
import {
  SEEDED_DISCOMS,
  DiscomPreset,
  RPO_CONSTANTS,
} from "@/data/energyData";
import { RpoGauge } from "@/components/charts/RpoGauge";
import { SourceTooltip } from "@/components/SourceTooltip";
import { StoredRpoAudit } from "@/lib/db";
import {
  Compass,
  Building2,
  CheckCircle2,
  TrendingUp,
  Coins,
  ShieldCheck,
  Zap,
  Send,
  Database,
  ArrowRight,
  ExternalLink,
} from "lucide-react";

export default function RpoTrackerPage() {
  // Unit mode: MWh or MU (1 MU = 1,000 MWh)
  const [unitMode, setUnitMode] = useState<"MWh" | "MU">("MWh");
  const unitMultiplier = unitMode === "MU" ? 1000 : 1;

  // Form Inputs
  const [discomNameInput, setDiscomNameInput] = useState<string>("BESCOM (Bangalore Electricity)");
  const [stateInput, setStateInput] = useState<string>("Karnataka");
  const [totalProcured, setTotalProcured] = useState<number>(32500000); // 32,500,000 MWh
  const [renewableProcured, setRenewableProcured] = useState<number>(11450000); // 11,450,000 MWh (~35.2%)
  const [targetYear, setTargetYear] = useState<"2025" | "2030">("2025");
  const [activeDiscomCode, setActiveDiscomCode] = useState<string>("BESCOM-KA");

  // Backend state
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [auditSuccessMsg, setAuditSuccessMsg] = useState<string | null>(null);
  const [recentAudits, setRecentAudits] = useState<StoredRpoAudit[]>([]);

  // Run pure calculation
  const calculationResult: RpoCalculationResult = calculateRPO({
    totalProcuredMWh: totalProcured,
    renewableProcuredMWh: renewableProcured,
    targetYear: targetYear,
  });

  // Fetch live backend audits on load
  const loadBackendAudits = async () => {
    try {
      const res = await fetch("/api/rpo/audit");
      const data = await res.json();
      if (data.success && Array.isArray(data.audits)) {
        setRecentAudits(data.audits.slice(0, 5));
      }
    } catch (err) {
      console.error("Failed to fetch backend audits:", err);
    }
  };

  useEffect(() => {
    loadBackendAudits();
  }, []);

  // Handler for preset selection
  const handleSelectPreset = (preset: DiscomPreset) => {
    setActiveDiscomCode(preset.code);
    setDiscomNameInput(preset.name);
    setStateInput(preset.state);
    setTotalProcured(preset.totalProcuredMWh);
    setRenewableProcured(preset.renewableProcuredMWh);
  };

  // Submit to backend API
  const handleFileStatutoryAudit = async () => {
    setIsSubmitting(true);
    setAuditSuccessMsg(null);
    try {
      const res = await fetch("/api/rpo/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          discomName: discomNameInput,
          state: stateInput,
          totalProcuredMWh: totalProcured,
          renewableProcuredMWh: renewableProcured,
          targetYear: targetYear,
          submittedBy: "State Regulatory Commission Officer",
        }),
      });
      const data = await res.json();
      if (data.success && data.audit) {
        setAuditSuccessMsg(`Statutory filing registered with ID: ${data.audit.id}`);
        // Refresh recent audits from backend
        loadBackendAudits();
        setTimeout(() => setAuditSuccessMsg(null), 5000);
      } else {
        alert(data.error || "Failed to submit statutory audit");
      }
    } catch (err) {
      console.error("Failed to submit audit:", err);
      alert("Network error connecting to backend API");
    } finally {
      setIsSubmitting(false);
    }
  };

  const displayTotal = unitMode === "MU" ? totalProcured / 1000 : totalProcured;
  const displayRenewable = unitMode === "MU" ? renewableProcured / 1000 : renewableProcured;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/30">
              <Compass className="w-3.5 h-3.5 text-amber-400" />
              Statutory Utility Module
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 font-semibold bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">
              <Database className="w-3 h-3" />
              Connected to Backend API
            </span>
            <SourceTooltip citationId="MOP_RPO_TRAJECTORY" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            DISCOM & Industry RPO Compliance Tracker
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Audit renewable electricity procurement against statutory Ministry of Power mandates and submit live filings.
          </p>
        </div>

        {/* Target Year Selector Toggle */}
        <div className="flex items-center gap-2 bg-slate-900 p-1 rounded-xl border border-slate-800 self-start md:self-auto">
          <span className="text-xs text-slate-400 px-2 font-medium">Compliance Target:</span>
          <button
            type="button"
            onClick={() => setTargetYear("2025")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              targetYear === "2025"
                ? "bg-emerald-600 text-slate-950 shadow-md shadow-emerald-500/20"
                : "text-slate-300 hover:text-white"
            }`}
          >
            FY 2024-25 (29.91%)
          </button>
          <button
            type="button"
            onClick={() => setTargetYear("2030")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              targetYear === "2030"
                ? "bg-cyan-600 text-slate-950 shadow-md shadow-cyan-500/20"
                : "text-slate-300 hover:text-white"
            }`}
          >
            FY 2029-30 (43.33%)
          </button>
        </div>
      </div>

      {/* Preset DISCOM Scenarios (1-click evaluation) */}
      <section className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4">
        <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
          <div className="flex items-center gap-1.5 text-xs text-slate-300 font-semibold">
            <Building2 className="w-4 h-4 text-emerald-400" />
            <span>Select Real-World DISCOM Benchmark:</span>
          </div>
          <span className="text-[11px] text-slate-500">
            Click any entity below to populate procurement telemetry
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
          {SEEDED_DISCOMS.map((discom) => {
            const isSelected = activeDiscomCode === discom.code;
            const rePercent = ((discom.renewableProcuredMWh / discom.totalProcuredMWh) * 100).toFixed(1);
            const isCompliant2025 = Number(rePercent) >= RPO_CONSTANTS.activeTarget2025;

            return (
              <button
                key={discom.code}
                onClick={() => handleSelectPreset(discom)}
                className={`p-2.5 rounded-xl border text-left transition-all flex flex-col justify-between ${
                  isSelected
                    ? "bg-emerald-950/70 border-emerald-500 text-white shadow-lg shadow-emerald-950"
                    : "bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-300"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between text-[10px] text-slate-400 mb-0.5">
                    <span className="font-semibold text-slate-300">{discom.state}</span>
                    <span
                      className={`font-bold px-1 rounded ${
                        isCompliant2025
                          ? "bg-emerald-900/80 text-emerald-300"
                          : "bg-amber-900/80 text-amber-300"
                      }`}
                    >
                      {rePercent}% RE
                    </span>
                  </div>
                  <p className="text-xs font-bold text-slate-100 truncate">
                    {discom.name.split(" ")[0]}
                  </p>
                </div>
                <div className="mt-2 pt-1 border-t border-slate-800/80 text-[10px] text-slate-400 flex items-center justify-between">
                  <span>{(discom.totalProcuredMWh / 1000000).toFixed(1)}M MWh</span>
                  <span className="text-[9px] text-slate-500">{discom.reportedPeriod}</span>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Main Grid: Form Inputs (Left) and Compliance Gauge & Telemetry (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Form & Sliders (5 Cols) */}
        <div className="lg:col-span-5 bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h2 className="font-bold text-white text-base">
              Electricity Procurement Parameters
            </h2>
            {/* Units Toggle */}
            <div className="flex items-center gap-1 text-xs">
              <span className="text-slate-400 text-[11px]">Units:</span>
              <button
                type="button"
                onClick={() => setUnitMode("MWh")}
                className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                  unitMode === "MWh"
                    ? "bg-slate-800 text-emerald-300 border border-emerald-700/50"
                    : "text-slate-500 hover:text-slate-300"
                }`}
              >
                MWh
              </button>
              <button
                type="button"
                onClick={() => setUnitMode("MU")}
                className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                  unitMode === "MU"
                    ? "bg-slate-800 text-emerald-300 border border-emerald-700/50"
                    : "text-slate-500 hover:text-slate-300"
                }`}
              >
                MU
              </button>
            </div>
          </div>

          {/* DISCOM Name & State Input */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label htmlFor="discom-name-input" className="text-[11px] font-semibold text-slate-300 block mb-1">
                DISCOM / Utility Name
              </label>
              <input
                id="discom-name-input"
                type="text"
                value={discomNameInput}
                onChange={(e) => {
                  setDiscomNameInput(e.target.value);
                  setActiveDiscomCode("custom");
                }}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div>
              <label htmlFor="state-input" className="text-[11px] font-semibold text-slate-300 block mb-1">
                State / Jurisdiction
              </label>
              <input
                id="state-input"
                type="text"
                value={stateInput}
                onChange={(e) => {
                  setStateInput(e.target.value);
                  setActiveDiscomCode("custom");
                }}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Input 1: Total Electricity Procured */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <label htmlFor="total-procured" className="font-semibold text-slate-300">
                Total Electricity Procured ({unitMode})
              </label>
              <span className="text-slate-400 font-mono font-bold">
                {displayTotal.toLocaleString()} {unitMode}
              </span>
            </div>
            <input
              id="total-procured"
              type="number"
              min={1000}
              step={unitMode === "MU" ? 10 : 10000}
              value={displayTotal}
              onChange={(e) => {
                const val = Math.max(0, Number(e.target.value) || 0);
                setTotalProcured(val * unitMultiplier);
                setActiveDiscomCode("custom");
              }}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white font-mono focus:outline-none focus:border-emerald-500"
            />
            <p className="text-[11px] text-slate-400">
              Total volume supplied to consumer base across licensed distribution zone.
            </p>
          </div>

          {/* Input 2: Renewable Electricity Procured */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <label htmlFor="re-procured" className="font-semibold text-slate-300">
                Renewable Electricity Procured ({unitMode})
              </label>
              <span className="text-emerald-400 font-mono font-bold">
                {displayRenewable.toLocaleString()} {unitMode}
              </span>
            </div>
            <input
              id="re-procured"
              type="number"
              min={0}
              max={displayTotal}
              step={unitMode === "MU" ? 5 : 5000}
              value={displayRenewable}
              onChange={(e) => {
                const val = Math.max(0, Number(e.target.value) || 0);
                setRenewableProcured(val * unitMultiplier);
                setActiveDiscomCode("custom");
              }}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white font-mono focus:outline-none focus:border-emerald-500"
            />
            <input
              type="range"
              min={0}
              max={totalProcured}
              step={totalProcured / 200 || 1000}
              value={renewableProcured}
              onChange={(e) => {
                setRenewableProcured(Number(e.target.value));
                setActiveDiscomCode("custom");
              }}
              className="w-full mt-2 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>0% RE</span>
              <span>
                Target: {targetYear === "2025" ? "29.91%" : "43.33%"}
              </span>
              <span>100% RE</span>
            </div>
          </div>

          {/* Action: Submit Official Filing to Backend */}
          <div className="pt-2">
            <button
              type="button"
              onClick={handleFileStatutoryAudit}
              disabled={isSubmitting}
              className="w-full py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition-all"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isSubmitting ? "Transmitting Audit..." : "File Official DISCOM Audit to Backend"}</span>
            </button>
            {auditSuccessMsg && (
              <p className="mt-2 text-xs font-semibold text-emerald-400 bg-emerald-950/60 p-2 rounded-lg border border-emerald-800 text-center animate-in fade-in">
                {auditSuccessMsg}
              </p>
            )}
          </div>
        </div>

        {/* Right Column: Results & Radial Gauge (7 Cols) */}
        <div className="lg:col-span-7 bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-6 flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h2 className="font-bold text-white text-base">
                Audit Results & Statutory Status
              </h2>
              <p className="text-xs text-slate-400">
                Evaluation under {calculationResult.targetYear}
              </p>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold border ${
                calculationResult.isCompliant
                  ? "bg-emerald-950 text-emerald-300 border-emerald-600/50"
                  : "bg-red-950 text-red-300 border-red-600/50"
              }`}
            >
              {calculationResult.statusLabel}
            </span>
          </div>

          {/* Visual Gauge Component */}
          <RpoGauge result={calculationResult} />

          {/* 3 Metric Summary Boxes */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-slate-800">
            {/* Box 1: Required RE volume */}
            <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 block mb-1">
                Required RE Volume
              </span>
              <span className="text-lg font-bold text-white">
                {(calculationResult.requiredRenewableMWh / unitMultiplier).toLocaleString(undefined, { maximumFractionDigits: 1 })}
              </span>
              <span className="text-[10px] text-slate-400 ml-1">{unitMode}</span>
              <p className="text-[10px] text-slate-500 mt-0.5">
                At {calculationResult.targetPercent}% target
              </p>
            </div>

            {/* Box 2: Shortfall or Surplus */}
            <div
              className={`p-3 rounded-xl border ${
                calculationResult.isCompliant
                  ? "bg-emerald-950/30 border-emerald-800/40"
                  : "bg-red-950/30 border-red-800/40"
              }`}
            >
              <span className="text-[10px] text-slate-400 block mb-1">
                {calculationResult.isCompliant ? "Surplus Renewable Power" : "Deficit / Shortfall"}
              </span>
              <span
                className={`text-lg font-bold ${
                  calculationResult.isCompliant ? "text-emerald-400" : "text-red-400"
                }`}
              >
                {calculationResult.isCompliant
                  ? `+${(calculationResult.surplusUnitsMWh / unitMultiplier).toLocaleString(undefined, { maximumFractionDigits: 1 })}`
                  : `-${(calculationResult.shortfallUnitsMWh / unitMultiplier).toLocaleString(undefined, { maximumFractionDigits: 1 })}`}
              </span>
              <span className="text-[10px] text-slate-400 ml-1">{unitMode}</span>
              <p className="text-[10px] text-slate-400 mt-0.5">
                {calculationResult.isCompliant ? "Can bank or sell as RECs" : "Subject to regulatory action"}
              </p>
            </div>

            {/* Box 3: REC / Penalty Exposure */}
            <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 block mb-1">
                REC Financial Exposure
              </span>
              <span
                className={`text-lg font-bold ${
                  calculationResult.isCompliant ? "text-emerald-400" : "text-amber-400"
                }`}
              >
                {calculationResult.isCompliant
                  ? "₹0 (Safe)"
                  : `₹${(calculationResult.estimatedPenaltyINR / 10000000).toFixed(2)} Cr`}
              </span>
              <p className="text-[10px] text-slate-500 mt-0.5">
                {calculationResult.isCompliant
                  ? "Zero compliance liability"
                  : `Approx ₹1,500/MWh REC buyout`}
              </p>
            </div>
          </div>

          {/* Actionable recommendations banner */}
          <div className="p-3.5 rounded-xl bg-slate-950/90 border border-slate-800 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span className="text-slate-300">
                {calculationResult.isCompliant
                  ? "Entity fulfills statutory RPO obligations for the evaluated compliance cycle."
                  : "Bridge your shortfall via Green Energy Corridor-III open access or PM Surya Ghar net-metering."}
              </span>
            </div>
            {!calculationResult.isCompliant && (
              <button
                onClick={() => {
                  setRenewableProcured(calculationResult.requiredRenewableMWh);
                }}
                className="shrink-0 text-[11px] font-bold text-emerald-400 hover:text-emerald-300 underline"
              >
                Simulate 100% Compliance Target
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Backend Live Audit Registry Section */}
      <section className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-emerald-400" />
            <h2 className="font-bold text-white text-sm">
              Live Backend Audit Registry (Recent Filings)
            </h2>
          </div>
          <Link
            href="/audits"
            className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold flex items-center gap-1"
          >
            <span>View Full Database Registry</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 text-[11px] uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-2.5 px-3">Audit ID</th>
                <th className="py-2.5 px-3">DISCOM / Entity</th>
                <th className="py-2.5 px-3">State</th>
                <th className="py-2.5 px-3">Compliance %</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {recentAudits.map((a) => (
                <tr key={a.id} className="hover:bg-slate-800/40">
                  <td className="py-2.5 px-3 font-mono font-bold text-slate-400">{a.id}</td>
                  <td className="py-2.5 px-3 font-semibold text-white">{a.discomName}</td>
                  <td className="py-2.5 px-3">{a.state}</td>
                  <td className="py-2.5 px-3 font-mono">{a.compliancePercent}%</td>
                  <td className="py-2.5 px-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        a.isCompliant
                          ? "bg-emerald-950 text-emerald-300 border border-emerald-800/40"
                          : "bg-red-950 text-red-300 border border-red-800/40"
                      }`}
                    >
                      {a.statusLabel}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-slate-500 text-[11px]">
                    {new Date(a.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
