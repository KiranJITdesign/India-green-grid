"use client";

import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Cell,
  LabelList,
  Tooltip,
} from "recharts";

const RPO_REF_DATA = [
  { year: "2025\n(Target)", displayLabel: "2025 (Target)", value: 29.91, color: "#86efac" },
  { year: "2030\n(Target)", displayLabel: "2030 (Target)", value: 43.33, color: "#064e3b" },
];

export function ReferenceRpoBarChart() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-full h-56 flex items-center justify-center text-xs text-slate-400">
        Loading RPO Bars...
      </div>
    );
  }

  return (
    <div className="w-full h-56 pt-2">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={RPO_REF_DATA}
          margin={{ top: 25, right: 15, left: -20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
          <XAxis
            dataKey="year"
            stroke="#94a3b8"
            tick={{ fill: "#64748b", fontSize: 10 }}
            tickLine={false}
          />
          <YAxis
            stroke="#94a3b8"
            tick={{ fill: "#64748b", fontSize: 10 }}
            unit="%"
            domain={[0, 50]}
            ticks={[0, 10, 20, 30, 40, 50]}
            tickLine={false}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const data = payload[0].payload;
                return (
                  <div className="bg-slate-900 text-white text-xs p-2 rounded-lg shadow-lg">
                    <p className="font-bold">{data.displayLabel}</p>
                    <p className="text-emerald-400 font-semibold">Statutory Target: {data.value}%</p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Bar dataKey="value" barSize={55} radius={[4, 4, 0, 0]}>
            <LabelList
              dataKey="value"
              position="top"
              formatter={(val: number) => `${val}%`}
              fill="#0f172a"
              fontSize={11}
              fontWeight="bold"
            />
            {RPO_REF_DATA.map((entry, index) => (
              <Cell key={`bar-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
