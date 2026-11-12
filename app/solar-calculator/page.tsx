"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  calculateSolarROI,
  SolarCalculationResult,
} from "@/lib/calculators";
import {
  POPULAR_LOCATIONS,
  SOLAR_CONSTANTS,
} from "@/data/energyData";
import { SolarCashflowChart } from "@/components/charts/SolarCashflowChart";
import { SourceTooltip } from "@/components/SourceTooltip";
import {
  SunMedium,
  IndianRupee,
  Maximize2,
  MapPin,
  AlertTriangle,
  Coins,
  ShieldCheck,
  ArrowRight,
  Database,
  Send,
  X,
  CheckCircle2,
} from "lucide-react";

export default function SolarCalculatorPage() {
  // Inputs
  const [monthlyBill, setMonthlyBill] = useState<number>(2400); // Default ₹2,400/month
  const [roofSqFt, setRoofSqFt] = useState<number>(350); // Default 350 sq ft
  const [selectedLocation, setSelectedLocation] = useState<string>("Ahmedabad");

  // Registration modal state
  const [showRegisterModal, setShowRegisterModal] = useState<boolean>(false);
  const [consumerName, setConsumerName] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [registeredAppNumber, setRegisteredAppNumber] = useState<string | null>(null);

  // Calculate results using the exact logic engine
  const result: SolarCalculationResult = calculateSolarROI({
    monthlyBill,
    roofSqFt,
    location: selectedLocation,
  });

  const locationInfo =
    POPULAR_LOCATIONS.find((l) => l.city === selectedLocation) || POPULAR_LOCATIONS[0];

  // Bill presets for rapid exploration
  const billPresets = [
    { label: "₹1,200/mo", bill: 1200, roof: 200, tip: "Small 1-2 BHK (~1.5 kW)" },
    { label: "₹2,400/mo", bill: 2400, roof: 350, tip: "Standard 3 BHK (~3 kW)" },
    { label: "₹4,000/mo", bill: 4000, roof: 600, tip: "Large Villa (~5 kW)" },
    { label: "₹7,200/mo", bill: 7200, roof: 1100, tip: "High AC / Commercial (~10 kW)" },
  ];

  // Submit consumer application to backend
  const handleRegisterSubsidy = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!consumerName || !phone) {
      alert("Please provide both name and contact mobile number");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/solar/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          consumerName,
          phone,
          email,
          city: locationInfo.city,
          state: locationInfo.state,
          monthlyBill,
          roofSqFt,
        }),
      });
      const data = await res.json();
      if (data.success && data.lead) {
        setRegisteredAppNumber(data.lead.applicationNumber);
      } else {
        alert(data.error || "Failed to register subsidy application");
      }
    } catch (err) {
      console.error("Submission failed:", err);
      alert("Network error connecting to backend API");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
              <SunMedium className="w-3.5 h-3.5 text-emerald-400" />
              PM Surya Ghar: Muft Bijli Yojana
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 font-semibold bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">
              <Database className="w-3 h-3" />
              Backend Connected
            </span>
            <SourceTooltip citationId="MNRE_SURYA_GHAR" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Rooftop Solar ROI & Subsidy Calculator
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Estimate recommended system size, Central Government subsidy, bill savings, and register your application.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          <button
            type="button"
            onClick={() => setShowRegisterModal(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-colors shadow-md shadow-emerald-500/20"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Register for Subsidy</span>
          </button>
          <Link
            href="/green-finance"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 transition-colors shadow-sm"
          >
            <Coins className="w-3.5 h-3.5 text-amber-400" />
            <span>7% Solar Loans</span>
          </Link>
        </div>
      </div>

      {/* Preset Quick Select Row */}
      <section className="flex items-center gap-2 overflow-x-auto pb-1">
        <span className="text-xs text-slate-400 shrink-0 font-medium">Quick Scenarios:</span>
        {billPresets.map((preset) => (
          <button
            key={preset.label}
            onClick={() => {
              setMonthlyBill(preset.bill);
              setRoofSqFt(preset.roof);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium border shrink-0 transition-all ${
              monthlyBill === preset.bill
                ? "bg-emerald-950 text-emerald-300 border-emerald-600 font-bold shadow-sm"
                : "bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700"
            }`}
          >
            <span>{preset.label}</span>
            <span className="text-[10px] text-slate-500 ml-1.5 hidden sm:inline">
              ({preset.tip})
            </span>
          </button>
        ))}
      </section>

      {/* Main Grid: Inputs (5 Cols) and Outputs (7 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Form Controls */}
        <div className="lg:col-span-5 bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h2 className="font-bold text-white text-base">
              Rooftop & Consumption Inputs
            </h2>
            <span className="text-[11px] text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">
              Assumes ₹6/unit tariff
            </span>
          </div>

          {/* Location Selector */}
          <div className="space-y-1.5">
            <label htmlFor="location-select" className="flex items-center justify-between text-xs font-semibold text-slate-300">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                State / City Location
              </span>
              <span className="text-slate-400 text-[11px]">
                {locationInfo.solarIrradianceKwhM2Day} kWh/m²/day
              </span>
            </label>
            <select
              id="location-select"
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
            >
              {POPULAR_LOCATIONS.map((loc) => (
                <option key={loc.city} value={loc.city}>
                  {loc.city}, {loc.state} — DISCOM: {loc.stateDiscom}
                </option>
              ))}
            </select>
            {locationInfo.stateTopUpSubsidyNote && (
              <p className="text-[11px] text-emerald-300/80 bg-emerald-950/30 px-2 py-1 rounded border border-emerald-900/30">
                {locationInfo.stateTopUpSubsidyNote}
              </p>
            )}
          </div>

          {/* Monthly Bill Input */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <label htmlFor="bill-input" className="font-semibold text-slate-300 flex items-center gap-1">
                <IndianRupee className="w-3.5 h-3.5 text-emerald-400" />
                Average Monthly Electricity Bill
              </label>
              <span className="text-emerald-400 font-mono font-bold text-sm">
                ₹{monthlyBill.toLocaleString()}
              </span>
            </div>
            <input
              id="bill-input"
              type="number"
              min={300}
              max={100000}
              step={100}
              value={monthlyBill}
              onChange={(e) => setMonthlyBill(Math.max(0, Number(e.target.value) || 0))}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white font-mono focus:outline-none focus:border-emerald-500"
            />
            <input
              type="range"
              min={500}
              max={15000}
              step={100}
              value={monthlyBill}
              onChange={(e) => setMonthlyBill(Number(e.target.value))}
              className="w-full cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>Estimated Consumption: <strong className="text-slate-200">{result.estimatedUnits} units/month</strong></span>
              <span>Formula: Bill / ₹6</span>
            </div>
          </div>

          {/* Available Roof Area Input */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <label htmlFor="roof-input" className="font-semibold text-slate-300 flex items-center gap-1">
                <Maximize2 className="w-3.5 h-3.5 text-cyan-400" />
                Available Shadow-Free Roof Space (sq ft)
              </label>
              <span className="text-cyan-400 font-mono font-bold text-sm">
                {roofSqFt.toLocaleString()} sq ft
              </span>
            </div>
            <input
              id="roof-input"
              type="number"
              min={50}
              max={20000}
              step={25}
              value={roofSqFt}
              onChange={(e) => setRoofSqFt(Math.max(0, Number(e.target.value) || 0))}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white font-mono focus:outline-none focus:border-emerald-500"
            />
            <input
              type="range"
              min={50}
              max={2500}
              step={25}
              value={roofSqFt}
              onChange={(e) => setRoofSqFt(Number(e.target.value))}
              className="w-full cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>Roof Capacity: <strong className="text-slate-200">up to {result.maxSizeFromRoof} kW</strong></span>
              <span>~105 sq ft required per kW</span>
            </div>
          </div>

          {/* Roof constraint warning banner if applicable */}
          {result.isRoofConstrained && (
            <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-600/40 text-xs text-amber-200 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Roof Space Constraint Detected</span>
                <p className="text-[11px] text-slate-300 mt-0.5">
                  Your consumption justifies a {result.sizeFromConsumption} kW system, but your roof space ({roofSqFt} sq ft) caps the installation at {result.recommendedKw} kW.
                </p>
              </div>
            </div>
          )}

          {/* Statutory Subsidy Formula Reference Card */}
          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 text-xs space-y-1 text-slate-300">
            <div className="flex items-center gap-1.5 text-emerald-400 font-semibold text-[11px]">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Official PM Surya Ghar Subsidy Slabs (MNRE):</span>
            </div>
            <ul className="text-[11px] text-slate-400 space-y-0.5 list-disc list-inside">
              <li>First 2 kW: <strong className="text-slate-200">₹30,000 per kW</strong> (₹60,000 for 2 kW)</li>
              <li>3rd kW: <strong className="text-slate-200">+₹18,000</strong></li>
              <li>Cap: <strong className="text-slate-200">₹78,000</strong> for systems 3 kW and larger</li>
              <li>Benchmark Cost: <strong className="text-slate-200">₹70,000 per kW</strong></li>
            </ul>
          </div>
        </div>

        {/* Right Column: Output Summary & Sizing Cards */}
        <div className="lg:col-span-7 bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-6 flex flex-col justify-between">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h2 className="font-bold text-white text-base">
                Recommended System & Financial Analysis
              </h2>
              <p className="text-xs text-slate-400">
                Calculated strictly adhering to CodeSpark 2026 problem formulas
              </p>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-500 uppercase font-semibold">Recommended Size</span>
              <p className="text-xl font-black text-emerald-400">
                {result.recommendedKw} kW
              </p>
            </div>
          </div>

          {/* 4 Financial Metric Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {/* Metric 1: Benchmark Cost */}
            <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 block mb-0.5">Pre-Subsidy Cost</span>
              <span className="text-lg font-bold text-slate-200">
                ₹{result.estimatedCost.toLocaleString()}
              </span>
              <span className="text-[10px] text-slate-400 block mt-0.5">@ ₹70k/kW</span>
            </div>

            {/* Metric 2: PM Surya Ghar Subsidy */}
            <div className="bg-emerald-950/40 p-3 rounded-xl border border-emerald-800/50">
              <span className="text-[10px] text-emerald-400 block mb-0.5">Govt Subsidy</span>
              <span className="text-lg font-black text-emerald-400">
                ₹{result.subsidy.toLocaleString()}
              </span>
              <span className="text-[10px] text-emerald-300 block mt-0.5">
                {result.breakdown.effectiveSubsidyPercent}% covered
              </span>
            </div>

            {/* Metric 3: Net Out-of-Pocket Cost */}
            <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 block mb-0.5">Net Cost</span>
              <span className="text-lg font-bold text-white">
                ₹{result.netCost.toLocaleString()}
              </span>
              <span className="text-[10px] text-slate-400 block mt-0.5">Payable to vendor</span>
            </div>

            {/* Metric 4: Payback Period */}
            <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 block mb-0.5">Payback Period</span>
              <span className="text-lg font-black text-cyan-400">
                {result.paybackYears} Years
              </span>
              <span className="text-[10px] text-slate-400 block mt-0.5">25-yr panel life</span>
            </div>
          </div>

          {/* Generation & Savings Breakdown */}
          <div className="p-4 rounded-xl bg-slate-950/90 border border-slate-800/90 space-y-3">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-200 border-b border-slate-800/80 pb-2">
              <span>Operational Savings Telemetry</span>
              <span className="text-emerald-400">Monthly Yield: ~{result.monthlyGeneration} units</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <span className="text-slate-400 text-[11px] block">Monthly Bill Savings</span>
                <span className="text-base font-bold text-emerald-400">
                  ₹{result.monthlySavings.toLocaleString()}/mo
                </span>
              </div>
              <div>
                <span className="text-slate-400 text-[11px] block">Annual Direct Savings</span>
                <span className="text-base font-bold text-white">
                  ₹{result.annualSavings.toLocaleString()}/yr
                </span>
              </div>
              <div>
                <span className="text-slate-400 text-[11px] block">25-Yr Lifetime Net Savings</span>
                <span className="text-base font-bold text-cyan-400">
                  ₹{(result.lifetimeSavings25Years / 100000).toFixed(2)} Lakhs
                </span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
              <span>CO2 Emissions Avoided: <strong className="text-emerald-300">{result.co2AvoidedTonsPerYear} tons/year</strong></span>
              <SourceTooltip citationId="CEA_GENERATION_2026" inlineText="0.82 kg/kWh Factor" />
            </div>
          </div>

          {/* Cashflow Projection Chart */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-300">
                Cumulative Net Cashflow (Years 0 - 25)
              </span>
              <span className="text-[11px] text-slate-400">
                Break-even occurs at {result.paybackYears} years
              </span>
            </div>
            <SolarCashflowChart result={result} />
          </div>

          {/* Action Row */}
          <div className="pt-3 border-t border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            <button
              onClick={() => setShowRegisterModal(true)}
              className="py-2 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-500/20"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Submit Subsidy Registration to Database</span>
            </button>
            <Link
              href="/green-finance"
              className="text-emerald-400 hover:text-emerald-300 font-bold inline-flex items-center gap-1 text-xs"
            >
              <span>Explore Concessional Solar Financing</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Registration Modal */}
      {showRegisterModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 border border-emerald-500/30 rounded-2xl max-w-lg w-full p-6 shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <SunMedium className="w-5 h-5 text-emerald-400" />
                <h3 className="text-base font-bold text-white">
                  PM Surya Ghar Consumer Subsidy Registration
                </h3>
              </div>
              <button
                onClick={() => {
                  setShowRegisterModal(false);
                  setRegisteredAppNumber(null);
                }}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {registeredAppNumber ? (
              <div className="text-center py-6 space-y-4">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500 text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-white">Registration Successful!</h4>
                  <p className="text-xs text-slate-400 mt-1">
                    Your consumer application has been stored in the persistent database.
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-500 block uppercase font-bold">Official Application Number</span>
                  <span className="text-lg font-mono font-bold text-emerald-400">{registeredAppNumber}</span>
                </div>
                <div className="pt-2 flex justify-center gap-3">
                  <Link
                    href="/audits"
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
                  >
                    View in Registry
                  </Link>
                  <button
                    onClick={() => {
                      setShowRegisterModal(false);
                      setRegisteredAppNumber(null);
                    }}
                    className="px-4 py-2 rounded-xl bg-emerald-600 text-slate-950 text-xs font-bold"
                  >
                    Done
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleRegisterSubsidy} className="space-y-4 text-xs">
                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
                  <span className="text-[10px] text-slate-400 block">System Configuration Sized</span>
                  <div className="flex justify-between font-bold text-white">
                    <span>{result.recommendedKw} kW Rooftop System</span>
                    <span className="text-emerald-400">Subsidy: ₹{result.subsidy.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-[11px] text-slate-400">
                    <span>Net Out-of-Pocket: ₹{result.netCost.toLocaleString()}</span>
                    <span>Location: {locationInfo.city}, {locationInfo.state}</span>
                  </div>
                </div>

                <div>
                  <label className="text-slate-300 font-semibold block mb-1">
                    Applicant Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Chandra Verma"
                    value={consumerName}
                    onChange={(e) => setConsumerName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-slate-300 font-semibold block mb-1">
                      Mobile Number (10 digits) *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="text-slate-300 font-semibold block mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      placeholder="consumer@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <p className="text-[10px] text-slate-500 leading-relaxed">
                  By submitting, your rooftop specifications and consumer telemetry will be forwarded to empaneled state DISCOM vendors under MNRE National Operational Guidelines.
                </p>

                <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowRegisterModal(false)}
                    className="px-4 py-2 rounded-xl text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-bold"
                  >
                    {isSubmitting ? "Transmitting..." : "Submit Registration"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
