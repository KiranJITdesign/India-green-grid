"use client";

import React, { useState, useEffect } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceDot,
  ReferenceLine,
} from "recharts";
import { RPO_TRAJECTORY_DATA } from "@/data/energyData";

export function RpoTrajectoryChart() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-full h-64 flex items-center justify-center text-slate-500 text-xs">
        Loading RPO Trajectory...
      </div>
    );
  }

  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={RPO_TRAJECTORY_DATA}
          margin={{ top: 20, right: 20, left: -10, bottom: 0 }}
        >
          <defs>
            <linearGradient id="rpoGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
          <XAxis
            dataKey="fiscalYear"
            stroke="#64748b"
            tick={{ fill: "#94a3b8", fontSize: 11 }}
          />
          <YAxis
            stroke="#64748b"
            tick={{ fill: "#94a3b8", fontSize: 11 }}
            unit="%"
            domain={[15, 50]}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const data = payload[0].payload;
                return (
                  <div className="bg-slate-900/95 border border-emerald-500/30 p-2.5 rounded-lg shadow-xl text-xs backdrop-blur-md">
                    <p className="font-bold text-white mb-0.5">FY {data.fiscalYear}</p>
                    <p className="text-emerald-400 font-semibold text-sm">
                      Mandatory Target: {data.targetPercent}%
                    </p>
                    <p className="text-slate-400 text-[11px] mt-1">{data.notes}</p>
                  </div>
                );
              }
              return null;
            }}
          />
          <ReferenceLine
            y={29.91}
            stroke="#10b981"
            strokeDasharray="4 4"
            label={{
              value: "2024-25 (29.91%)",
              fill: "#34d399",
              fontSize: 10,
              position: "insideTopLeft",
            }}
          />
          <ReferenceLine
            y={43.33}
            stroke="#06b6d4"
            strokeDasharray="4 4"
            label={{
              value: "2030 (43.33%)",
              fill: "#22d3ee",
              fontSize: 10,
              position: "insideTopLeft",
            }}
          />
          <Area
            type="monotone"
            dataKey="targetPercent"
            stroke="#10b981"
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#rpoGradient)"
          />
          <ReferenceDot
            x="2024-25"
            y={29.91}
            r={5}
            fill="#10b981"
            stroke="#ffffff"
            strokeWidth={2}
          />
          <ReferenceDot
            x="2029-30"
            y={43.33}
            r={5}
            fill="#06b6d4"
            stroke="#ffffff"
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
