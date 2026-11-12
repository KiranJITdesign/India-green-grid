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
  Sun,
  Building,
  Users,
  Lightbulb,
  Home,
  CircleDollarSign,
  Zap,
  ExternalLink,
  ShieldCheck,
  Send,
  X,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";

export default function SolarCalculatorPage() {
  // Image 2 Form Fields
  const [selectedState, setSelectedState] = useState<string>("Gujarat");
  const [customerCategory, setCustomerCategory] = useState<string>("Residential");
  const [monthlyBill, setMonthlyBill] = useState<number>(3500); // Image 2 default: 3500

  // Optional accuracy fields
  const [roofAreaSqM, setRoofAreaSqM] = useState<number>(51); // Image 2 default: 51 sq.m (~550 sq.ft)
  const [investmentBudget, setInvestmentBudget] = useState<number>(48000); // Image 2 default: 48000
  const [desiredCapacityKw, setDesiredCapacityKw] = useState<number>(3); // Image 2 default: 3 kW

  // Conversion: 1 sq.m ≈ 10.764 sq.ft
  const roofSqFt = Math.round(roofAreaSqM * 10.764);

  // Registration modal state
  const [showRegisterModal, setShowRegisterModal] = useState<boolean>(false);
  const [consumerName, setConsumerName] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [registeredAppNumber, setRegisteredAppNumber] = useState<string | null>(null);

  // Exact statutory calculation
  const result: SolarCalculationResult = calculateSolarROI({
    monthlyBill,
    roofSqFt,
    location: selectedState,
  });

  const allStates = [
    "Bihar",
    "Gujarat",
    "Karnataka",
    "Rajasthan",
    "Delhi",
    "Maharashtra",
    "Tamil Nadu",
    "Uttar Pradesh",
    "Telangana",
    "West Bengal",
    "Haryana",
    "Punjab",
    "Madhya Pradesh",
    "Kerala",
    "Odisha",
    "Assam",
  ];

  // Submit to backend API
  const handleRegisterSubsidy = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!consumerName || !phone) {
      alert("Please enter applicant name and phone");
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
          city: selectedState,
          state: selectedState,
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
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Centered Solar Rooftop Calculator Container matching Reference Image 2 */}
      <div className="max-w-4xl mx-auto bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-10 shadow-sm">
        {/* Header Icon & Title */}
        <div className="text-center space-y-2 mb-8">
          <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto">
            <Sun className="w-6 h-6 text-emerald-700" />
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Solar Rooftop Calculator
          </h1>

          <p className="text-xs sm:text-sm text-slate-500 max-w-xl mx-auto">
            Estimate your solar system size, cost, subsidy, and savings as per the PM Surya Ghar Yojana.
          </p>
        </div>

        {/* Two-Column Form Layout matching Reference Image 2 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Column: Required Details */}
          <div className="space-y-6">
            <h3 className="text-xs font-bold text-indigo-900 uppercase tracking-wider">
              Please enter the following details
            </h3>

            {/* State Dropdown */}
            <div className="space-y-1.5">
              <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                <Building className="w-3.5 h-3.5 text-slate-500" />
                <span>Your State <span className="text-red-500">*</span></span>
              </label>
              <select
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-lg px-3.5 py-2 text-xs text-slate-800 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
              >
                {allStates.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
            </div>

            {/* Category of Customer */}
            <div className="space-y-1.5">
              <label className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                <Users className="w-3.5 h-3.5 text-slate-500" />
                <span>Category of Customer <span className="text-red-500">*</span></span>
              </label>
              <select
                value={customerCategory}
                onChange={(e) => setCustomerCategory(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-lg px-3.5 py-2 text-xs text-slate-800 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
              >
                <option value="Residential">Residential</option>
                <option value="Commercial">Commercial</option>
                <option value="Industrial">Industrial</option>
                <option value="Institutional">Institutional / NGO</option>
              </select>
            </div>

            {/* Average Monthly Bill with Slider */}
            <div className="space-y-1.5">
              <label className="flex items-center justify-between text-xs font-semibold text-slate-700">
                <span className="flex items-center gap-1.5">
                  <Lightbulb className="w-3.5 h-3.5 text-slate-500" />
                  <span>Average Monthly Bill (₹) <span className="text-red-500">*</span></span>
                </span>
                <span className="font-mono text-emerald-800 font-bold">₹{monthlyBill}</span>
              </label>
              <input
                type="number"
                min={300}
                max={50000}
                step={100}
                value={monthlyBill}
                onChange={(e) => setMonthlyBill(Math.max(0, Number(e.target.value) || 0))}
                className="w-full bg-white border border-slate-300 rounded-lg px-3.5 py-2 text-xs font-mono text-slate-800 focus:outline-none focus:border-emerald-600"
              />
              <input
                type="range"
                min={500}
                max={15000}
                step={100}
                value={monthlyBill}
                onChange={(e) => setMonthlyBill(Number(e.target.value))}
                className="w-full accent-emerald-700 cursor-pointer"
              />
            </div>
          </div>

          {/* Right Column: Enter Details for More Accuracy (Optional) */}
          <div className="space-y-6">
            <h3 className="text-xs font-bold text-indigo-900 uppercase tracking-wider">
              Enter Details for More Accuracy (Optional)
            </h3>

            {/* Roof Top Area */}
            <div className="space-y-1.5">
              <label className="flex items-center justify-between text-xs font-semibold text-slate-700">
                <span className="flex items-center gap-1.5">
                  <Home className="w-3.5 h-3.5 text-slate-500" />
                  <span>Roof Top Area (sq.m)</span>
                </span>
                <span className="font-mono text-slate-600">{roofAreaSqM} sq.m (~{roofSqFt} sq.ft)</span>
              </label>
              <input
                type="number"
                min={10}
                max={2000}
                value={roofAreaSqM}
                onChange={(e) => setRoofAreaSqM(Math.max(1, Number(e.target.value) || 0))}
                className="w-full bg-white border border-slate-300 rounded-lg px-3.5 py-2 text-xs font-mono text-slate-800 focus:outline-none focus:border-emerald-600"
              />
              <input
                type="range"
                min={10}
                max={250}
                value={roofAreaSqM}
                onChange={(e) => setRoofAreaSqM(Number(e.target.value))}
                className="w-full accent-emerald-700 cursor-pointer"
              />
            </div>

            {/* Investment Budget */}
            <div className="space-y-1.5">
              <label className="flex items-center justify-between text-xs font-semibold text-slate-700">
                <span className="flex items-center gap-1.5">
                  <CircleDollarSign className="w-3.5 h-3.5 text-slate-500" />
                  <span>Investment Budget (₹)</span>
                </span>
                <span className="font-mono text-slate-600">₹{investmentBudget.toLocaleString()}</span>
              </label>
              <input
                type="number"
                min={10000}
                max={1000000}
                step={5000}
                value={investmentBudget}
                onChange={(e) => setInvestmentBudget(Math.max(0, Number(e.target.value) || 0))}
                className="w-full bg-white border border-slate-300 rounded-lg px-3.5 py-2 text-xs font-mono text-slate-800 focus:outline-none focus:border-emerald-600"
              />
              <input
                type="range"
                min={20000}
                max={250000}
                step={5000}
                value={investmentBudget}
                onChange={(e) => setInvestmentBudget(Number(e.target.value))}
                className="w-full accent-emerald-700 cursor-pointer"
              />
            </div>

            {/* Desired Plant Capacity */}
            <div className="space-y-1.5">
              <label className="flex items-center justify-between text-xs font-semibold text-slate-700">
                <span className="flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-slate-500" />
                  <span>Desired Plant Capacity (kW)</span>
                </span>
                <span className="font-mono text-slate-600">{desiredCapacityKw} kW</span>
              </label>
              <input
                type="number"
                min={1}
                max={50}
                step={0.5}
                value={desiredCapacityKw}
                onChange={(e) => setDesiredCapacityKw(Math.max(0.5, Number(e.target.value) || 0))}
                className="w-full bg-white border border-slate-300 rounded-lg px-3.5 py-2 text-xs font-mono text-slate-800 focus:outline-none focus:border-emerald-600"
              />
              <input
                type="range"
                min={1}
                max={10}
                step={0.5}
                value={desiredCapacityKw}
                onChange={(e) => setDesiredCapacityKw(Number(e.target.value))}
                className="w-full accent-emerald-700 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Center Calculate Button matching Reference Image 2 */}
        <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => {
              // Smooth scroll to output
              const el = document.getElementById("results-panel");
              el?.scrollIntoView({ behavior: "smooth" });
            }}
            className="w-full sm:w-auto px-10 py-2.5 rounded-full bg-[#064e3b] hover:bg-[#043d2e] text-white font-bold text-xs shadow-md transition-all"
          >
            Calculate
          </button>
          <a
            href="https://pmsuryaghar.gov.in/#/"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-6 py-2.5 rounded-full border border-emerald-700 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 font-bold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-sm"
            title="Redirect to National PM Surya Ghar Portal (pmsuryaghar.gov.in)"
          >
            <span>Register Subsidy Application</span>
            <ExternalLink className="w-3.5 h-3.5 text-emerald-700" />
          </a>
        </div>

        {/* Footer Reference Link matching Reference Image 2 */}
        <div className="mt-8 pt-4 border-t border-slate-100 flex items-center justify-center gap-2 text-xs text-slate-500 text-center flex-wrap">
          <span>🇮🇳</span>
          <a
            href="https://pmsuryaghar.gov.in/#/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-emerald-700 font-semibold underline flex items-center gap-1 text-slate-700"
          >
            <span>pmsuryaghar.gov.in • Solar Rooftop Calculator 2026 - PM Surya Ghar Yojana</span>
            <ExternalLink className="w-3.5 h-3.5 text-emerald-700" />
          </a>
        </div>
      </div>

      {/* Sizing & Financial Results Card */}
      <div id="results-panel" className="max-w-4xl mx-auto bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              System Sizing & Financial Evaluation
            </h2>
            <p className="text-xs text-slate-500">
              Assumes ₹6/unit domestic tariff • ~120 units/month per kW installed
            </p>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-slate-400 uppercase font-semibold">Recommended Capacity</span>
            <p className="text-2xl font-black text-emerald-700">
              {result.recommendedKw} kW
            </p>
          </div>
        </div>

        {/* 4 Financial Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80">
            <span className="text-[11px] text-slate-500 block mb-1">Pre-Subsidy Cost</span>
            <span className="text-xl font-bold text-slate-800">
              ₹{result.estimatedCost.toLocaleString()}
            </span>
            <span className="text-[10px] text-slate-400 block mt-0.5">Benchmark ₹70k/kW</span>
          </div>

          <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-200">
            <span className="text-[11px] text-emerald-800 font-semibold block mb-1">PM Surya Ghar Subsidy</span>
            <span className="text-xl font-black text-emerald-700">
              ₹{result.subsidy.toLocaleString()}
            </span>
            <span className="text-[10px] text-emerald-600 block mt-0.5">
              {result.breakdown.effectiveSubsidyPercent}% Govt Assistance
            </span>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80">
            <span className="text-[11px] text-slate-500 block mb-1">Net Cost to Owner</span>
            <span className="text-xl font-bold text-slate-900">
              ₹{result.netCost.toLocaleString()}
            </span>
            <span className="text-[10px] text-slate-400 block mt-0.5">Payable to empaneled vendor</span>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80">
            <span className="text-[11px] text-slate-500 block mb-1">Payback Period</span>
            <span className="text-xl font-black text-emerald-800">
              {result.paybackYears} Years
            </span>
            <span className="text-[10px] text-slate-400 block mt-0.5">25-year panel lifecycle</span>
          </div>
        </div>

        {/* Savings & Cashflow */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200/80 text-xs">
          <div>
            <span className="text-slate-500 block">Monthly Yield & Consumption</span>
            <span className="text-sm font-bold text-slate-800">
              ~{result.monthlyGeneration} units / mo
            </span>
          </div>
          <div>
            <span className="text-slate-500 block">Monthly Bill Savings</span>
            <span className="text-sm font-bold text-emerald-700">
              ₹{result.monthlySavings.toLocaleString()} / month
            </span>
          </div>
          <div>
            <span className="text-slate-500 block">25-Year Net Cumulative Savings</span>
            <span className="text-sm font-bold text-emerald-800">
              ₹{(result.lifetimeSavings25Years / 100000).toFixed(2)} Lakhs
            </span>
          </div>
        </div>

        {/* Cashflow Chart */}
        <div>
          <h4 className="text-xs font-semibold text-slate-700 mb-2">
            25-Year Net Cashflow Projection
          </h4>
          <SolarCashflowChart result={result} />
        </div>
      </div>

      {/* Subsidy Registration Modal */}
      {showRegisterModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full p-6 shadow-2xl text-slate-800">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <div className="flex items-center gap-2">
                <Sun className="w-5 h-5 text-emerald-700" />
                <h3 className="font-bold text-base text-slate-900">
                  Register for PM Surya Ghar Subsidy
                </h3>
              </div>
              <button
                onClick={() => {
                  setShowRegisterModal(false);
                  setRegisteredAppNumber(null);
                }}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {registeredAppNumber ? (
              <div className="text-center py-6 space-y-4">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-slate-900">Application Submitted!</h4>
                  <p className="text-xs text-slate-500 mt-1">
                    Your PM Surya Ghar subsidy application has been stored in the persistent database.
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] text-slate-400 block uppercase font-bold">Registration Number</span>
                  <span className="text-lg font-mono font-bold text-emerald-700">{registeredAppNumber}</span>
                </div>
                <div className="pt-2 flex flex-col sm:flex-row justify-center gap-2">
                  <a
                    href="https://pmsuryaghar.gov.in/#/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <span>Proceed to pmsuryaghar.gov.in</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                  <Link
                    href="/audits"
                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold"
                  >
                    View in Registry
                  </Link>
                  <button
                    onClick={() => {
                      setShowRegisterModal(false);
                      setRegisteredAppNumber(null);
                    }}
                    className="px-4 py-2 rounded-xl bg-[#064e3b] text-white text-xs font-bold"
                  >
                    Close
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleRegisterSubsidy} className="space-y-4 text-xs">
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-100">
                  <div className="flex justify-between font-bold text-emerald-900">
                    <span>{result.recommendedKw} kW Sized System</span>
                    <span>Subsidy: ₹{result.subsidy.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-[11px] text-emerald-700 mt-0.5">
                    <span>State: {selectedState}</span>
                    <span>Net Cost: ₹{result.netCost.toLocaleString()}</span>
                  </div>
                </div>

                <div>
                  <label className="text-slate-700 font-semibold block mb-1">
                    Applicant Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Chandra Verma"
                    value={consumerName}
                    onChange={(e) => setConsumerName(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:border-emerald-600"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-slate-700 font-semibold block mb-1">
                      Mobile Number *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:border-emerald-600"
                    />
                  </div>
                  <div>
                    <label className="text-slate-700 font-semibold block mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      placeholder="applicant@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:border-emerald-600"
                    />
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowRegisterModal(false)}
                    className="px-4 py-2 rounded-xl text-slate-500 hover:text-slate-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-5 py-2 rounded-xl bg-[#064e3b] hover:bg-[#043d2e] disabled:opacity-50 text-white font-bold"
                  >
                    {isSubmitting ? "Submitting..." : "Submit Registration"}
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
