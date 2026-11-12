"use client";

import React, { useState, useEffect } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { GENERATION_MIX_DATA } from "@/data/energyData";

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    payload: {
      source: string;
      share: number;
      generationTWh?: number;
      category: string;
    };
  }>;
}

const CustomTooltip = ({ active, payload }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-slate-900/95 border border-emerald-500/30 p-2.5 rounded-lg shadow-xl text-xs backdrop-blur-md">
        <p className="font-bold text-white mb-1">{data.source}</p>
        <p className="text-emerald-400 font-semibold">
          Share: <span className="text-white">{data.share}%</span> of gross generation
        </p>
        {data.generationTWh && (
          <p className="text-slate-400">
            Estimated Volume: <span className="text-slate-200">~{data.generationTWh} TWh/yr</span>
          </p>
        )}
        <p className="text-[10px] text-slate-500 mt-1 border-t border-slate-800 pt-1">
          Source: CEA Monthly Generation Baseline (2026)
        </p>
      </div>
    );
  }
  return null;
};

export function GenerationMixPieChart() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-full h-72 flex items-center justify-center text-slate-500 text-xs">
        Loading Generation Mix visualization...
      </div>
    );
  }

  return (
    <div className="w-full h-80 flex flex-col items-center justify-center">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={GENERATION_MIX_DATA}
            cx="50%"
            cy="50%"
            innerRadius={65}
            outerRadius={105}
            paddingAngle={3}
            dataKey="share"
            nameKey="source"
          >
            {GENERATION_MIX_DATA.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.color}
                stroke="#0f172a"
                strokeWidth={2}
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            verticalAlign="bottom"
            height={46}
            formatter={(value, entry: any) => {
              const item = GENERATION_MIX_DATA.find((d) => d.source === value);
              return (
                <span className="text-xs text-slate-300 font-medium mr-2">
                  {value} <strong className="text-white">({item?.share}%)</strong>
                </span>
              );
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
