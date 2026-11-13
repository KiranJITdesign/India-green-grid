"use client";

import React from "react";
import { RpoCalculationResult } from "@/lib/calculators";

interface RpoGaugeProps {
  result: RpoCalculationResult;
}

export function RpoGauge({ result }: RpoGaugeProps) {
  const {
    compliancePercent,
    targetPercent,
    isCompliant,
    shortfallUnitsMWh,
    surplusUnitsMWh,
    statusLabel,
    statusColor,
  } = result;

  // Max scale is 100% or target * 1.5, whichever is higher
  const maxScale = Math.max(60, targetPercent * 1.3);
  const normalizedPercent = Math.min(100, (compliancePercent / maxScale) * 100);
  const targetMarkPercent = (targetPercent / maxScale) * 100;

  // SVG parameters
  const radius = 80;
  const strokeWidth = 14;
  const circumference = 2 * Math.PI * radius;
  // Use a semi-circle arc from 180 to 360 deg
  const arcLength = Math.PI * radius;
  const strokeDashoffset = arcLength - (arcLength * Math.min(100, normalizedPercent)) / 100;

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="relative w-64 h-36 flex items-end justify-center overflow-hidden">
        <svg
          viewBox="0 0 200 115"
          className="w-64 h-36 transform"
        >
          {/* Background Track */}
          <path
            d="M 20 100 A 80 80 0 0 1 180 100"
            fill="none"
            stroke="#1e293b"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />

          {/* Active Progress Arc */}
          <path
            d="M 20 100 A 80 80 0 0 1 180 100"
            fill="none"
            stroke={statusColor}
            strokeWidth={strokeWidth}
            strokeDasharray={arcLength}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-700 ease-out"
          />

          {/* Target marker notch */}
          {(() => {
            const angleDeg = 180 + (targetMarkPercent / 100) * 180;
            const angleRad = (angleDeg * Math.PI) / 180;
            const x1 = 100 + (radius - 12) * Math.cos(angleRad);
            const y1 = 100 + (radius - 12) * Math.sin(angleRad);
            const x2 = 100 + (radius + 12) * Math.cos(angleRad);
            const y2 = 100 + (radius + 12) * Math.sin(angleRad);
            return (
              <line
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="#f8fafc"
                strokeWidth={3}
              />
            );
          })()}
        </svg>

        {/* Center Label */}
        <div className="absolute bottom-1 flex flex-col items-center text-center">
          <span className="text-3xl font-black text-white tracking-tight">
            {compliancePercent}%
          </span>
          <span className="text-[11px] text-slate-400 font-medium">
            Target: <strong className="text-emerald-400">{targetPercent}%</strong>
          </span>
        </div>
      </div>

      {/* Target Marker Legend */}
      <div className="w-full max-w-xs mt-3 flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-800 pt-2 px-2">
        <span>0%</span>
        <span className="flex items-center gap-1 font-semibold text-slate-200">
          <span className="w-2 h-2 rounded-full bg-white inline-block"></span>
          Statutory Target ({targetPercent}%)
        </span>
        <span>{Math.round(maxScale)}%+</span>
      </div>

      {/* Status Callout Box */}
      <div
        className={`mt-4 w-full p-3 rounded-xl border text-center transition-all ${
          isCompliant
            ? "bg-emerald-950/50 border-emerald-500/40 text-emerald-200"
            : "bg-red-950/40 border-red-500/40 text-red-200"
        }`}
      >
        <div className="text-xs font-bold uppercase tracking-wider mb-0.5">
          {statusLabel}
        </div>
        {isCompliant ? (
          <p className="text-xs text-slate-300">
            Surplus Renewable Power:{" "}
            <strong className="text-emerald-300">
              +{surplusUnitsMWh.toLocaleString()} MWh
            </strong>{" "}
            above statutory mandate.
          </p>
        ) : (
          <p className="text-xs text-slate-300">
            Statutory Shortfall:{" "}
            <strong className="text-red-400">
              {shortfallUnitsMWh.toLocaleString()} MWh
            </strong>{" "}
            deficit to be fulfilled via RECs or green market purchase.
          </p>
        )}
      </div>
    </div>
  );
}
