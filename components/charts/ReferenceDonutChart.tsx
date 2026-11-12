"use client";

import React, { useState, useEffect } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const GENERATION_DATA_REF = [
  { name: "Coal", value: 75.0, color: "#164e39" },
  { name: "Solar", value: 7.0, color: "#facc15" },
  { name: "Wind", value: 3.5, color: "#38bdf8" },
  { name: "Hydro", value: 10.0, color: "#0284c7" },
  { name: "Nuclear", value: 2.5, color: "#c084fc" },
  { name: "Others", value: 2.0, color: "#cbd5e1" },
];

export function ReferenceDonutChart() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-full h-56 flex items-center justify-center text-xs text-slate-400">
        Loading Generation Mix...
      </div>
    );
  }

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-1">
      {/* Donut Chart with Center Text */}
      <div className="relative w-48 h-48 sm:w-52 sm:h-52 shrink-0 flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={GENERATION_DATA_REF}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={85}
              paddingAngle={2}
              dataKey="value"
            >
              {GENERATION_DATA_REF.map((entry, index) => (
                <Cell key={`donut-cell-${index}`} fill={entry.color} stroke="#ffffff" strokeWidth={2} />
              ))}
            </Pie>
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-slate-900 text-white text-[11px] p-2 rounded-lg shadow-lg">
                      <p className="font-bold">{data.name}</p>
                      <p className="text-emerald-400 font-semibold">{data.value}% of gross power</p>
                    </div>
                  );
                }
                return null;
              }}
            />
          </PieChart>
        </ResponsiveContainer>

        {/* Center Text matching Reference Image 1 */}
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
          <span className="text-xl sm:text-2xl font-black text-slate-900 leading-none">
            1,248
          </span>
          <span className="text-xs font-bold text-slate-700">TWh</span>
          <span className="text-[9px] text-slate-400 leading-tight mt-0.5">
            Total Generation<br />(Approx.)
          </span>
        </div>
      </div>

      {/* Legend on Right matching Reference Image 1 */}
      <div className="space-y-1.5 w-full sm:w-auto text-xs pr-4">
        {GENERATION_DATA_REF.map((item) => (
          <div key={item.name} className="flex items-center justify-between sm:justify-start gap-4">
            <div className="flex items-center gap-2">
              <span
                className="w-2.5 h-2.5 rounded-full inline-block shrink-0"
                style={{ backgroundColor: item.color }}
              ></span>
              <span className="text-slate-600 font-medium">{item.name}</span>
            </div>
            <span className="font-semibold text-slate-800 font-mono text-[11px]">
              ~{item.value.toFixed(1)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
