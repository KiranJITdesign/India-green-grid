"use client";

import React, { useState } from "react";
import Link from "next/link";
import { GREEN_FINANCE_SCHEMES, GreenLoanScheme } from "@/data/energyData";
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
} from "lucide-react";

export default function GreenFinancePage() {
  const [activeSchemeId, setActiveSchemeId] = useState<string>("sbi-surya-ghar");

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
              <Coins className="w-3.5 h-3.5 text-emerald-400" />
              Concessional Clean Energy Lending
            </span>
            <SourceTooltip citationId="MNRE_SURYA_GHAR" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Green Finance & Solar Loan Aggregator
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Compare national concessional credit schemes supporting PM Surya Ghar rooftop solar and commercial decarbonization.
          </p>
        </div>

        <Link
          href="/solar-calculator"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-slate-950 transition-colors shadow-sm self-start md:self-auto"
        >
          <Calculator className="w-3.5 h-3.5" />
          <span>Calculate Subsidy First</span>
        </Link>
      </div>

      {/* Comparison Grid of 4 Real Green Schemes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {GREEN_FINANCE_SCHEMES.map((scheme) => {
          const isSelected = activeSchemeId === scheme.id;

          return (
            <div
              key={scheme.id}
              onClick={() => setActiveSchemeId(scheme.id)}
              className={`rounded-2xl p-5 border transition-all cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? "bg-slate-900/95 border-emerald-500 shadow-xl shadow-emerald-950/40"
                  : "bg-slate-900/60 border-slate-800 hover:border-slate-700"
              }`}
            >
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-start gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center shrink-0">
                      <Landmark className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div>
                      <span className="text-[11px] font-semibold text-slate-400 block">
                        {scheme.bankName}
                      </span>
                      <h3 className="text-sm sm:text-base font-bold text-white">
                        {scheme.schemeName}
                      </h3>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800/40">
                    {scheme.interestRate}
                  </span>
                </div>

                {/* Specs Grid */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-slate-950/70 p-2.5 rounded-xl border border-slate-800/80">
                    <span className="text-[10px] text-slate-400 block">Max Repayment Tenure</span>
                    <span className="font-bold text-slate-200">{scheme.maxTenureYears} Years</span>
                  </div>
                  <div className="bg-slate-950/70 p-2.5 rounded-xl border border-slate-800/80">
                    <span className="text-[10px] text-slate-400 block">Maximum Sanction</span>
                    <span className="font-bold text-slate-200">{scheme.maxLoanAmountINR}</span>
                  </div>
                  <div className="bg-slate-950/70 p-2.5 rounded-xl border border-slate-800/80">
                    <span className="text-[10px] text-slate-400 block">Collateral Security</span>
                    <span className="font-semibold text-emerald-300">{scheme.collateralRequirement}</span>
                  </div>
                  <div className="bg-slate-950/70 p-2.5 rounded-xl border border-slate-800/80">
                    <span className="text-[10px] text-slate-400 block">Processing Charge</span>
                    <span className="font-semibold text-slate-200">{scheme.processingFee}</span>
                  </div>
                </div>

                {/* Key Features */}
                <div className="p-3 rounded-xl bg-slate-950/90 border border-slate-800 text-xs text-slate-300">
                  <span className="font-semibold text-slate-200 block mb-0.5">
                    Eligibility & Advantage:
                  </span>
                  <p className="text-[11px] text-slate-400">
                    {scheme.eligibleBorrowers}. {scheme.keyFeature}.
                  </p>
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
                <span className="text-[10px] text-slate-500">
                  Repo-rate linked concession
                </span>
                <a
                  href="https://pmsuryaghar.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-bold text-emerald-400 hover:text-emerald-300"
                >
                  <span>{scheme.applyUrlLabel}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          );
        })}
      </div>

      {/* Financial Comparison Summary Table */}
      <section className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4">
        <h2 className="font-bold text-white text-base">
          Side-by-Side Scheme Matrix
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 text-[11px] uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3 px-3">Lending Institution</th>
                <th className="py-3 px-3">Scheme Name</th>
                <th className="py-3 px-3">Concessional Rate</th>
                <th className="py-3 px-3">Max Tenure</th>
                <th className="py-3 px-3">Loan Cap</th>
                <th className="py-3 px-3">Collateral</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {GREEN_FINANCE_SCHEMES.map((s) => (
                <tr key={s.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-3 font-semibold text-white">{s.bankName}</td>
                  <td className="py-3 px-3">{s.schemeName}</td>
                  <td className="py-3 px-3 font-bold text-emerald-400">{s.interestRate}</td>
                  <td className="py-3 px-3">{s.maxTenureYears} Years</td>
                  <td className="py-3 px-3">{s.maxLoanAmountINR}</td>
                  <td className="py-3 px-3 text-slate-400">{s.collateralRequirement}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
