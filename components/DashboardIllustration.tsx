import React from "react";

export function DashboardIllustration() {
  return (
    <div className="w-full h-full relative overflow-hidden select-none pointer-events-none min-h-[140px] flex items-end justify-end">
      <svg
        viewBox="0 0 420 180"
        className="w-full max-w-[420px] h-auto text-emerald-800"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient id="sunGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#fef08a" stopOpacity="0.9" />
            <stop offset="60%" stopColor="#fef9c3" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#fef9c3" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="hillGreen1" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#bbf7d0" />
            <stop offset="100%" stopColor="#86efac" />
          </linearGradient>
          <linearGradient id="hillGreen2" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#86efac" />
            <stop offset="100%" stopColor="#4ade80" />
          </linearGradient>
          <linearGradient id="solarBlue" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="100%" stopColor="#0284c7" />
          </linearGradient>
        </defs>

        {/* Glowing Sun */}
        <circle cx="360" cy="80" r="55" fill="url(#sunGlow)" />
        <circle cx="360" cy="80" r="35" fill="#fef08a" />

        {/* Back Rolling Green Hill */}
        <path
          d="M 120 180 Q 220 90, 340 120 T 450 140 L 450 180 Z"
          fill="url(#hillGreen1)"
          opacity="0.7"
        />

        {/* Round Trees in Background */}
        <circle cx="210" cy="140" r="14" fill="#15803d" />
        <circle cx="230" cy="144" r="11" fill="#16a34a" />
        <circle cx="250" cy="142" r="13" fill="#15803d" />
        <circle cx="395" cy="145" r="16" fill="#15803d" />

        {/* Front Hill */}
        <path
          d="M 180 180 Q 280 115, 420 145 L 420 180 Z"
          fill="url(#hillGreen2)"
        />

        {/* Big Wind Turbine 1 (Main Right) */}
        <g stroke="#064e3b" strokeWidth="2.5" strokeLinecap="round">
          <line x1="365" y1="145" x2="365" y2="40" />
          <circle cx="365" cy="40" r="4.5" fill="#064e3b" stroke="none" />
          {/* Blade 1 (Top) */}
          <line x1="365" y1="40" x2="378" y2="10" strokeWidth="2.2" />
          {/* Blade 2 (Left Down) */}
          <line x1="365" y1="40" x2="340" y2="55" strokeWidth="2.2" />
          {/* Blade 3 (Right Down) */}
          <line x1="365" y1="40" x2="385" y2="60" strokeWidth="2.2" />
        </g>

        {/* Medium Wind Turbine 2 (Left) */}
        <g stroke="#064e3b" strokeWidth="1.8" strokeLinecap="round" opacity="0.85">
          <line x1="305" y1="150" x2="305" y2="70" />
          <circle cx="305" cy="70" r="3" fill="#064e3b" stroke="none" />
          <line x1="305" y1="70" x2="295" y2="48" strokeWidth="1.6" />
          <line x1="305" y1="70" x2="322" y2="65" strokeWidth="1.6" />
          <line x1="305" y1="70" x2="300" y2="90" strokeWidth="1.6" />
        </g>

        {/* Small Wind Turbine 3 (Far Left) */}
        <g stroke="#064e3b" strokeWidth="1.3" strokeLinecap="round" opacity="0.6">
          <line x1="270" y1="155" x2="270" y2="95" />
          <circle cx="270" cy="95" r="2" fill="#064e3b" stroke="none" />
          <line x1="270" y1="95" x2="262" y2="78" strokeWidth="1.2" />
          <line x1="270" y1="95" x2="282" y2="92" strokeWidth="1.2" />
          <line x1="270" y1="95" x2="267" y2="108" strokeWidth="1.2" />
        </g>

        {/* Blue Solar Panels in Foreground */}
        <g stroke="#ffffff" strokeWidth="1">
          <polygon
            points="310,165 345,148 375,152 338,172"
            fill="url(#solarBlue)"
          />
          {/* Grid lines on panels */}
          <line x1="328" y1="156" x2="356" y2="162" stroke="#e0f2fe" strokeWidth="0.8" />
          <line x1="320" y1="168" x2="358" y2="150" stroke="#e0f2fe" strokeWidth="0.8" />
          <line x1="335" y1="171" x2="368" y2="151" stroke="#e0f2fe" strokeWidth="0.8" />
        </g>
      </svg>
    </div>
  );
}
