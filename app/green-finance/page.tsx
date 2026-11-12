"use client";

import React, { useState } from "react";
import Link from "next/link";
import { GREEN_FINANCE_SCHEMES } from "@/data/energyData";
import { SourceTooltip } from "@/components/SourceTooltip";
import {
  Coins,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  Percent,
  Clock,
  Landmark,
  Calculator,
  ArrowRight,
  TrendingDown,
  Building,
} from "lucide-react";

export default function GreenFinancePage() {
  const [activeSchemeId, setActiveSchemeId] = useState<string>("ireda-rooftop");

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header Banner */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
              <Coins className="w-3.5 h-3.5 text-emerald-700" />
              Concessional Clean Energy Lending
            </span>
            <SourceTooltip citationId="IREDA_OFFICIAL" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Green Finance & Solar Loan Aggregator
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Compare national concessional credit schemes supporting PM Surya Ghar rooftop solar, MSME installations, and commercial decarbonization.
          </p>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap self-start md:self-auto">
          <a
            href="https://ireda.in/IredaWebPortal/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-[#064e3b] hover:bg-[#043d2e] text-white transition-colors shadow-sm"
            title="Redirect to Indian Renewable Energy Development Agency Portal"
          >
            <Landmark className="w-3.5 h-3.5 text-emerald-300" />
            <span>IREDA Web Portal (ireda.in)</span>
            <ExternalLink className="w-3.5 h-3.5 text-emerald-300" />
          </a>

          <Link
            href="/solar-calculator"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition-colors shadow-sm"
          >
            <Calculator className="w-3.5 h-3.5 text-slate-600" />
            <span>Calculate Subsidy First</span>
          </Link>
        </div>
      </div>

      {/* Featured IREDA Institutional Highlight Banner */}
      <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-white border border-emerald-200 rounded-2xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-700 text-white">
                Apex Green Financier
              </span>
              <span className="text-xs text-emerald-800 font-semibold">
                Ministry of New and Renewable Energy (Govt. of India)
              </span>
            </div>
            <h2 className="text-lg font-black text-slate-900">
              Indian Renewable Energy Development Agency (IREDA)
            </h2>
            <p className="text-xs text-slate-600 max-w-2xl">
              India&apos;s premier Non-Banking Financial Institution dedicated exclusively to financing renewable energy, rooftop solar aggregator portfolios, and energy efficiency projects with concessional interest rates.
            </p>
          </div>
          <a
            href="https://ireda.in/IredaWebPortal/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-md transition-all shrink-0"
          >
            <span>Open IREDA Portal (ireda.in)</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Comparison Grid of 4 Real Green Schemes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {GREEN_FINANCE_SCHEMES.map((scheme) => {
          const isSelected = activeSchemeId === scheme.id;

          return (
            <div
              key={scheme.id}
              onClick={() => setActiveSchemeId(scheme.id)}
              className={`rounded-2xl p-6 border transition-all cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? "bg-white border-emerald-600 shadow-md ring-1 ring-emerald-500/30"
                  : "bg-white border-slate-200 hover:border-slate-300 shadow-sm"
              }`}
            >
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center shrink-0">
                      <Landmark className="w-5 h-5 text-emerald-700" />
                    </div>
                    <div>
                      <span className="text-[11px] font-semibold text-slate-500 block">
                        {scheme.bankName}
                      </span>
                      <h3 className="text-base font-bold text-slate-900 leading-tight">
                        {scheme.schemeName}
                      </h3>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 whitespace-nowrap">
                    {scheme.interestRate}
                  </span>
                </div>

                {/* Specs Grid */}
                <div className="grid grid-cols-2 gap-2.5 text-xs">
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <span className="text-[10px] text-slate-400 block font-semibold uppercase">Max Repayment Tenure</span>
                    <span className="font-bold text-slate-800 text-sm">{scheme.maxTenureYears} Years</span>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <span className="text-[10px] text-slate-400 block font-semibold uppercase">Maximum Sanction</span>
                    <span className="font-bold text-slate-800 text-sm">{scheme.maxLoanAmountINR}</span>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <span className="text-[10px] text-slate-400 block font-semibold uppercase">Collateral Security</span>
                    <span className="font-semibold text-emerald-800 text-xs">{scheme.collateralRequirement}</span>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <span className="text-[10px] text-slate-400 block font-semibold uppercase">Processing Charge</span>
                    <span className="font-semibold text-slate-700 text-xs">{scheme.processingFee}</span>
                  </div>
                </div>

                {/* Key Features */}
                <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 text-xs space-y-1">
                  <span className="font-semibold text-slate-800 block">
                    Eligibility & Advantage:
                  </span>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    <strong>Eligible:</strong> {scheme.eligibleBorrowers}.<br />
                    <strong>Advantage:</strong> {scheme.keyFeature}.
                  </p>
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-500 font-medium">
                  Repo-rate linked concession
                </span>
                <a
                  href={scheme.applyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-bold bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 transition-colors shadow-sm"
                  title={`Redirect to ${scheme.applyUrlLabel}`}
                >
                  <span>{scheme.applyUrlLabel}</span>
                  <ExternalLink className="w-3.5 h-3.5 text-emerald-700" />
                </a>
              </div>
            </div>
          );
        })}
      </div>

      {/* Financial Comparison Summary Table */}
      <section className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <h2 className="font-bold text-slate-900 text-base">
            Side-by-Side Concessional Scheme Matrix
          </h2>
          <span className="text-xs text-slate-500 font-medium">
            Updated for FY 2025-26
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 text-slate-600 text-[11px] uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="py-3 px-3">Lending Institution</th>
                <th className="py-3 px-3">Scheme Name</th>
                <th className="py-3 px-3">Concessional Rate</th>
                <th className="py-3 px-3">Max Tenure</th>
                <th className="py-3 px-3">Loan Cap</th>
                <th className="py-3 px-3">Collateral</th>
                <th className="py-3 px-3 text-right">Official Redirection</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {GREEN_FINANCE_SCHEMES.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-3 font-semibold text-slate-900">{s.bankName}</td>
                  <td className="py-3 px-3 text-slate-600">{s.schemeName}</td>
                  <td className="py-3 px-3 font-bold text-emerald-700">{s.interestRate}</td>
                  <td className="py-3 px-3">{s.maxTenureYears} Years</td>
                  <td className="py-3 px-3 font-medium">{s.maxLoanAmountINR}</td>
                  <td className="py-3 px-3 text-slate-500">{s.collateralRequirement}</td>
                  <td className="py-3 px-3 text-right">
                    <a
                      href={s.applyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 hover:text-emerald-900 underline"
                    >
                      <span>Portal</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
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
