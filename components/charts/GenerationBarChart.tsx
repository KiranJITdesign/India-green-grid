"use client";

import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { GENERATION_MIX_DATA } from "@/data/energyData";

export function GenerationBarChart() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-full h-72 flex items-center justify-center text-slate-500 text-xs">
        Loading Generation Mix bars...
      </div>
    );
  }

  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={GENERATION_MIX_DATA}
          margin={{ top: 20, right: 20, left: -10, bottom: 25 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
          <XAxis
            dataKey="source"
            stroke="#64748b"
            tick={{ fill: "#94a3b8", fontSize: 11 }}
            interval={0}
            angle={-15}
            textAnchor="end"
          />
          <YAxis
            stroke="#64748b"
            tick={{ fill: "#94a3b8", fontSize: 11 }}
            unit="%"
            domain={[0, 85]}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const data = payload[0].payload;
                return (
                  <div className="bg-slate-900/95 border border-emerald-500/30 p-2.5 rounded-lg shadow-xl text-xs backdrop-blur-md">
                    <p className="font-bold text-white mb-1">{data.source}</p>
                    <p className="text-emerald-400 font-semibold">
                      Share: {data.share}%
                    </p>
                    <p className="text-slate-400 text-[11px]">
                      {data.category === "fossil" ? "Fossil Fuel Baseline" : "Non-Fossil Clean Energy"}
                    </p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Bar dataKey="share" radius={[6, 6, 0, 0]}>
            {GENERATION_MIX_DATA.map((entry, index) => (
              <Cell
                key={`bar-cell-${index}`}
                fill={entry.color}
                className="transition-opacity duration-300 hover:opacity-80"
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
