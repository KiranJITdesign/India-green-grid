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
  ShieldCheck,
  Zap,
  Send,
  Database,
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
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Page Header */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
              <Compass className="w-3.5 h-3.5 text-emerald-700" />
              Statutory Utility Module
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] text-emerald-800 font-semibold bg-slate-100 px-2 py-0.5 rounded">
              <Database className="w-3 h-3 text-emerald-600" />
              Backend Connected
            </span>
            <SourceTooltip citationId="MOP_RPO_TRAJECTORY" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            DISCOM & Industry RPO Compliance Tracker
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Audit renewable electricity procurement against statutory Ministry of Power mandates.
          </p>
        </div>

        {/* Target Year Selector Toggle */}
        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl self-start md:self-auto text-xs">
          <span className="text-slate-500 px-2 font-medium">Target:</span>
          <button
            type="button"
            onClick={() => setTargetYear("2025")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              targetYear === "2025"
                ? "bg-[#064e3b] text-white shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            2025 (29.91%)
          </button>
          <button
            type="button"
            onClick={() => setTargetYear("2030")}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              targetYear === "2030"
                ? "bg-[#064e3b] text-white shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            2030 (43.33%)
          </button>
        </div>
      </div>

      {/* Preset DISCOM Scenarios */}
      <section className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-1.5 text-xs text-slate-800 font-semibold">
            <Building2 className="w-4 h-4 text-emerald-700" />
            <span>Select Real-World DISCOM Benchmark:</span>
          </div>
          <span className="text-[11px] text-slate-400">
            Click any entity below to populate telemetry
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {SEEDED_DISCOMS.map((discom) => {
            const isSelected = activeDiscomCode === discom.code;
            const rePercent = ((discom.renewableProcuredMWh / discom.totalProcuredMWh) * 100).toFixed(1);
            const isCompliant2025 = Number(rePercent) >= RPO_CONSTANTS.activeTarget2025;

            return (
              <button
                key={discom.code}
                onClick={() => handleSelectPreset(discom)}
                className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                  isSelected
                    ? "bg-emerald-50 border-emerald-600 shadow-sm"
                    : "bg-slate-50 border-slate-200 hover:border-slate-300"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between text-[10px] text-slate-400 mb-0.5">
                    <span className="font-semibold text-slate-600">{discom.state}</span>
                    <span
                      className={`font-bold px-1.5 py-0.2 rounded ${
                        isCompliant2025
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {rePercent}% RE
                    </span>
                  </div>
                  <p className="text-xs font-bold text-slate-800 truncate">
                    {discom.name.split(" ")[0]}
                  </p>
                </div>
                <div className="mt-2 pt-1 border-t border-slate-200/80 text-[10px] text-slate-500 flex items-center justify-between">
                  <span>{(discom.totalProcuredMWh / 1000000).toFixed(1)}M MWh</span>
                  <span className="text-[9px] text-slate-400">{discom.reportedPeriod}</span>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Main Grid: Form Inputs (Left) and Compliance Gauge & Telemetry (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Form & Sliders (5 Cols) */}
        <div className="lg:col-span-5 bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 space-y-5 shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h2 className="font-bold text-slate-900 text-base">
              Electricity Procurement Parameters
            </h2>
            <div className="flex items-center gap-1 text-xs">
              <span className="text-slate-400 text-[11px]">Units:</span>
              <button
                type="button"
                onClick={() => setUnitMode("MWh")}
                className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                  unitMode === "MWh"
                    ? "bg-[#064e3b] text-white"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                MWh
              </button>
              <button
                type="button"
                onClick={() => setUnitMode("MU")}
                className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                  unitMode === "MU"
                    ? "bg-[#064e3b] text-white"
                    : "text-slate-500 hover:text-slate-800"
                }`}
              >
                MU
              </button>
            </div>
          </div>

          {/* DISCOM Name & State Input */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                DISCOM Name
              </label>
              <input
                type="text"
                value={discomNameInput}
                onChange={(e) => {
                  setDiscomNameInput(e.target.value);
                  setActiveDiscomCode("custom");
                }}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-emerald-600"
              />
            </div>
            <div>
              <label className="text-[11px] font-semibold text-slate-700 block mb-1">
                State
              </label>
              <input
                type="text"
                value={stateInput}
                onChange={(e) => {
                  setStateInput(e.target.value);
                  setActiveDiscomCode("custom");
                }}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-emerald-600"
              />
            </div>
          </div>

          {/* Input 1: Total Electricity Procured */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <label className="font-semibold text-slate-700">
                Total Electricity Procured ({unitMode})
              </label>
              <span className="text-slate-800 font-mono font-bold">
                {displayTotal.toLocaleString()} {unitMode}
              </span>
            </div>
            <input
              type="number"
              min={1000}
              step={unitMode === "MU" ? 10 : 10000}
              value={displayTotal}
              onChange={(e) => {
                const val = Math.max(0, Number(e.target.value) || 0);
                setTotalProcured(val * unitMultiplier);
                setActiveDiscomCode("custom");
              }}
              className="w-full border border-slate-300 rounded-lg px-3.5 py-2 text-xs text-slate-800 font-mono focus:outline-none focus:border-emerald-600"
            />
          </div>

          {/* Input 2: Renewable Electricity Procured */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <label className="font-semibold text-slate-700">
                Renewable Electricity Procured ({unitMode})
              </label>
              <span className="text-emerald-700 font-mono font-bold">
                {displayRenewable.toLocaleString()} {unitMode}
              </span>
            </div>
            <input
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
              className="w-full border border-slate-300 rounded-lg px-3.5 py-2 text-xs text-slate-800 font-mono focus:outline-none focus:border-emerald-600"
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
              className="w-full accent-emerald-700 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-mono">
              <span>0% RE</span>
              <span>Target: {targetYear === "2025" ? "29.91%" : "43.33%"}</span>
              <span>100% RE</span>
            </div>
          </div>

          {/* Action: Submit Official Filing to Backend */}
          <div className="pt-2">
            <button
              type="button"
              onClick={handleFileStatutoryAudit}
              disabled={isSubmitting}
              className="w-full py-2.5 px-4 rounded-xl bg-[#064e3b] hover:bg-[#043d2e] disabled:opacity-50 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{isSubmitting ? "Transmitting Audit..." : "File Official DISCOM Audit to Backend"}</span>
            </button>
            {auditSuccessMsg && (
              <p className="mt-2 text-xs font-semibold text-emerald-800 bg-emerald-50 p-2 rounded-lg border border-emerald-200 text-center animate-in fade-in">
                {auditSuccessMsg}
              </p>
            )}
          </div>
        </div>

        {/* Right Column: Results & Radial Gauge (7 Cols) */}
        <div className="lg:col-span-7 bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 space-y-6 flex flex-col justify-between shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="font-bold text-slate-900 text-base">
                Audit Results & Statutory Status
              </h2>
              <p className="text-xs text-slate-400">
                Evaluation under {calculationResult.targetYear}
              </p>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-xs font-bold border ${
                calculationResult.isCompliant
                  ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                  : "bg-red-50 text-red-800 border-red-300"
              }`}
            >
              {calculationResult.statusLabel}
            </span>
          </div>

          {/* Visual Gauge Component */}
          <RpoGauge result={calculationResult} />

          {/* 3 Metric Summary Boxes */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-4 border-t border-slate-100">
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80">
              <span className="text-[10px] text-slate-500 block mb-1">
                Required RE Volume
              </span>
              <span className="text-lg font-bold text-slate-900">
                {(calculationResult.requiredRenewableMWh / unitMultiplier).toLocaleString(undefined, { maximumFractionDigits: 1 })}
              </span>
              <span className="text-[10px] text-slate-400 ml-1">{unitMode}</span>
              <p className="text-[10px] text-slate-400 mt-0.5">
                At {calculationResult.targetPercent}% target
              </p>
            </div>

            <div
              className={`p-3 rounded-xl border ${
                calculationResult.isCompliant
                  ? "bg-emerald-50 border-emerald-200"
                  : "bg-red-50 border-red-200"
              }`}
            >
              <span className="text-[10px] text-slate-500 block mb-1">
                {calculationResult.isCompliant ? "Surplus RE Power" : "Deficit / Shortfall"}
              </span>
              <span
                className={`text-lg font-bold ${
                  calculationResult.isCompliant ? "text-emerald-700" : "text-red-600"
                }`}
              >
                {calculationResult.isCompliant
                  ? `+${(calculationResult.surplusUnitsMWh / unitMultiplier).toLocaleString(undefined, { maximumFractionDigits: 1 })}`
                  : `-${(calculationResult.shortfallUnitsMWh / unitMultiplier).toLocaleString(undefined, { maximumFractionDigits: 1 })}`}
              </span>
              <span className="text-[10px] text-slate-400 ml-1">{unitMode}</span>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80">
              <span className="text-[10px] text-slate-500 block mb-1">
                REC Financial Exposure
              </span>
              <span
                className={`text-lg font-bold ${
                  calculationResult.isCompliant ? "text-emerald-700" : "text-amber-600"
                }`}
              >
                {calculationResult.isCompliant
                  ? "₹0 (Safe)"
                  : `₹${(calculationResult.estimatedPenaltyINR / 10000000).toFixed(2)} Cr`}
              </span>
              <p className="text-[10px] text-slate-400 mt-0.5">
                Approx ₹1,500/MWh buyout
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Backend Live Audit Registry Section */}
      <section className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-emerald-700" />
            <h2 className="font-bold text-slate-900 text-sm">
              Live Backend Audit Registry (Recent Filings)
            </h2>
          </div>
          <Link
            href="/audits"
            className="text-xs text-emerald-800 hover:text-emerald-900 font-semibold flex items-center gap-1"
          >
            <span>View Full Database Registry</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-slate-500 text-[11px] uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-2.5 px-3">Audit ID</th>
                <th className="py-2.5 px-3">DISCOM / Entity</th>
                <th className="py-2.5 px-3">State</th>
                <th className="py-2.5 px-3">Compliance %</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentAudits.map((a) => (
                <tr key={a.id} className="hover:bg-slate-50">
                  <td className="py-2.5 px-3 font-mono font-bold text-slate-600">{a.id}</td>
                  <td className="py-2.5 px-3 font-semibold text-slate-900">{a.discomName}</td>
                  <td className="py-2.5 px-3">{a.state}</td>
                  <td className="py-2.5 px-3 font-mono">{a.compliancePercent}%</td>
                  <td className="py-2.5 px-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        a.isCompliant
                          ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                          : "bg-red-50 text-red-800 border border-red-200"
                      }`}
                    >
                      {a.statusLabel}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 text-slate-400 text-[11px]">
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
