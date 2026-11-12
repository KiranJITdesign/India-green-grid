"use client";

import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { SolarCalculationResult } from "@/lib/calculators";

interface SolarCashflowChartProps {
  result: SolarCalculationResult;
}

export function SolarCashflowChart({ result }: SolarCashflowChartProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-full h-60 flex items-center justify-center text-slate-500 text-xs">
        Loading Cashflow projection...
      </div>
    );
  }

  // Generate 15-year cumulative cashflow data
  const { netCost, annualSavings } = result;
  const years = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 15, 20, 25];

  const cashflowData = years.map((year) => {
    const cumulativeGrossSavings = year * annualSavings;
    const cumulativeNet = cumulativeGrossSavings - netCost;
    return {
      year: `Yr ${year}`,
      yearNum: year,
      netCashflow: Math.round(cumulativeNet),
      grossSavings: Math.round(cumulativeGrossSavings),
    };
  });

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={cashflowData}
          margin={{ top: 15, right: 20, left: 10, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
          <XAxis
            dataKey="year"
            stroke="#64748b"
            tick={{ fill: "#94a3b8", fontSize: 11 }}
          />
          <YAxis
            stroke="#64748b"
            tick={{ fill: "#94a3b8", fontSize: 10 }}
            tickFormatter={(val) => `₹${(val / 1000).toFixed(0)}k`}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const data = payload[0].payload;
                return (
                  <div className="bg-slate-900/95 border border-emerald-500/30 p-2.5 rounded-lg shadow-xl text-xs backdrop-blur-md">
                    <p className="font-bold text-white mb-1">
                      {data.yearNum === 0 ? "Initial Out-of-Pocket" : `After ${data.yearNum} Years`}
                    </p>
                    <p
                      className={`font-semibold ${
                        data.netCashflow >= 0 ? "text-emerald-400" : "text-amber-400"
                      }`}
                    >
                      Cumulative Net: ₹{data.netCashflow.toLocaleString()}
                    </p>
                    <p className="text-slate-400 text-[11px]">
                      Gross Bill Savings: ₹{data.grossSavings.toLocaleString()}
                    </p>
                  </div>
                );
              }
              return null;
            }}
          />
          <ReferenceLine y={0} stroke="#475569" strokeWidth={1.5} />
          <Line
            type="monotone"
            dataKey="netCashflow"
            stroke="#10b981"
            strokeWidth={3}
            dot={{ r: 3, fill: "#10b981" }}
            activeDot={{ r: 6, fill: "#34d399" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
