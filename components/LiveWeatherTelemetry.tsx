"use client";

import React, { useState, useEffect } from "react";
import {
  Sun,
  Wind,
  BatteryCharging,
  CloudSun,
  Activity,
  AlertTriangle,
  RefreshCw,
  ChevronDown,
  ShieldCheck,
  ExternalLink,
  Sparkles,
  MapPin,
  TrendingDown,
  Leaf,
  X,
} from "lucide-react";

interface TelemetryData {
  success: boolean;
  isLiveApi: boolean;
  hub: {
    id: string;
    name: string;
    state: string;
    role: string;
    installedMw: number;
  };
  weather: {
    temperatureC: number;
    windSpeedKmh: number;
    cloudCoverPercent: number;
    condition: string;
  };
  renewables: {
    solarOutputPercent: number;
    windOutputPercent: number;
    compositeOutputFactor: number;
    statusLabel: string;
  };
  batterySizing: {
    intermittencyRisk: "Low" | "Moderate" | "Elevated";
    recommendedBufferHours: number;
    recommendedBessRatioMwhPerMw: number;
    regionalBessRequiredMwh: number;
    mitigationStrategy: string;
  };
  airQuality: {
    aqi: number;
    category: string;
    colorHex: string;
    pm25: number;
    pm10: number;
    standard: string;
  };
  emissions: {
    co2AvoidedTonnesToday: number;
    gridCarbonIntensityGPerKwh: number;
    ceaFactorKgPerKwh: number;
  };
  timestamp: string;
}

export function LiveWeatherTelemetry() {
  const [selectedHub, setSelectedHub] = useState<string>("delhi");
  const [data, setData] = useState<TelemetryData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const hubs = [
    { id: "delhi", label: "Delhi NCR (CPCB)" },
    { id: "rajasthan", label: "Rajasthan (Solar/Wind)" },
    { id: "gujarat", label: "Gujarat (Khavda Park)" },
    { id: "karnataka", label: "Karnataka (Pavagada)" },
    { id: "tamilnadu", label: "Tamil Nadu (Muppandal)" },
  ];

  const fetchTelemetry = async (hubKey: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/telemetry/live?hub=${hubKey}`);
      const json = await res.json();
      if (json.success) {
        setData(json);
      }
    } catch (err) {
      console.error("Telemetry fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTelemetry(selectedHub);
    const interval = setInterval(() => fetchTelemetry(selectedHub), 120000); // 2 min polling
    return () => clearInterval(interval);
  }, [selectedHub]);

  return (
    <div className="relative">
      {/* Top Header Live Telemetry Button / Pill */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 bg-white hover:border-emerald-500 shadow-sm transition-all text-xs text-slate-700"
        title="View Weather-Driven Renewable Telemetry & CPCB Air Quality"
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>

        <span className="font-bold text-slate-800 hidden sm:inline">
          {data ? data.hub.state.split(" ")[0] : "Grid Live"}:
        </span>

        {/* Quick summary metrics */}
        {data ? (
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-0.5 text-amber-700 font-semibold">
              <Sun className="w-3.5 h-3.5 text-amber-500" />
              <span>{data.renewables.solarOutputPercent}%</span>
            </span>

            <span className="flex items-center gap-0.5 text-sky-700 font-semibold hidden md:flex">
              <Wind className="w-3.5 h-3.5 text-sky-500" />
              <span>{data.renewables.windOutputPercent}%</span>
            </span>

            <span className="flex items-center gap-0.5 text-emerald-800 font-bold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 text-[11px]">
              <BatteryCharging className="w-3 h-3 text-emerald-700" />
              <span>BESS {data.batterySizing.recommendedBufferHours}h</span>
            </span>

            <span className="flex items-center gap-1 text-[11px] font-semibold text-slate-600 hidden lg:flex">
              <span
                className="w-2 h-2 rounded-full inline-block"
                style={{ backgroundColor: data.airQuality.colorHex }}
              ></span>
              <span>AQI {data.airQuality.aqi}</span>
            </span>
          </div>
        ) : (
          <span className="text-slate-400">Syncing live...</span>
        )}

        <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
      </button>

      {/* Dropdown Popover Card */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/20 backdrop-blur-[1px]"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute right-0 top-full mt-2 w-[340px] sm:w-[420px] bg-white border border-slate-200 rounded-2xl shadow-2xl p-5 z-50 text-slate-800 space-y-4 animate-in fade-in slide-in-from-top-2">
            {/* Header with Hub Select & Close */}
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    Live Telemetry Engine
                  </span>
                </div>
                <h3 className="font-extrabold text-base text-slate-900 mt-1">
                  Weather & Climate Decision Intelligence
                </h3>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Regional Hub Selector Pills */}
            <div className="space-y-1.5">
              <span className="text-[11px] font-semibold text-slate-500 block">
                Select Grid Monitoring Hub:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {hubs.map((h) => (
                  <button
                    key={h.id}
                    type="button"
                    onClick={() => setSelectedHub(h.id)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                      selectedHub === h.id
                        ? "bg-[#064e3b] text-white shadow-sm"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {h.label.split(" ")[0]}
                  </button>
                ))}
              </div>
            </div>

            {data && (
              <div className="space-y-4 text-xs">
                {/* Hub Metadata */}
                <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-slate-600">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-emerald-700" />
                    <span className="font-bold text-slate-800">{data.hub.name}</span>
                  </div>
                  <span className="text-[10px] text-slate-400">
                    {data.hub.installedMw.toLocaleString()} MW RE Grid
                  </span>
                </div>

                {/* Section 1: Weather-Driven Renewable Output Estimates */}
                <div className="p-3 rounded-xl bg-gradient-to-br from-amber-50/70 to-emerald-50/40 border border-amber-200/60 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 flex items-center gap-1.5">
                      <Sun className="w-4 h-4 text-amber-600" />
                      <span>Weather-API RE Output Potential</span>
                    </span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                      {data.renewables.statusLabel}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-center">
                    <div className="bg-white/80 p-2 rounded-lg border border-amber-100">
                      <span className="text-[10px] text-slate-500 block">Solar Output Factor</span>
                      <span className="text-lg font-black text-amber-700">
                        {data.renewables.solarOutputPercent}%
                      </span>
                      <span className="text-[10px] text-slate-400 block mt-0.5">
                        {data.weather.cloudCoverPercent}% Cloud • {data.weather.temperatureC}°C
                      </span>
                    </div>

                    <div className="bg-white/80 p-2 rounded-lg border border-sky-100">
                      <span className="text-[10px] text-slate-500 block">Wind Output Factor</span>
                      <span className="text-lg font-black text-sky-700">
                        {data.renewables.windOutputPercent}%
                      </span>
                      <span className="text-[10px] text-slate-400 block mt-0.5">
                        {data.weather.windSpeedKmh} km/h Wind
                      </span>
                    </div>
                  </div>
                </div>

                {/* Section 2: Battery Sizing to Address Intermittency */}
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 flex items-center gap-1.5">
                      <BatteryCharging className="w-4 h-4 text-emerald-700" />
                      <span>BESS Intermittency Buffer Sizing</span>
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        data.batterySizing.intermittencyRisk === "Elevated"
                          ? "bg-red-100 text-red-800"
                          : data.batterySizing.intermittencyRisk === "Moderate"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-emerald-100 text-emerald-800"
                      }`}
                    >
                      {data.batterySizing.intermittencyRisk} Volatility
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-white p-2 rounded-lg border border-slate-200">
                      <span className="text-[10px] text-slate-400 block font-semibold">
                        Storage Duration Required
                      </span>
                      <span className="text-base font-black text-slate-800">
                        {data.batterySizing.recommendedBufferHours} Hours
                      </span>
                      <span className="text-[10px] text-slate-500 block">
                        {(data.batterySizing.recommendedBessRatioMwhPerMw * 1000).toFixed(0)} kWh / MW ratio
                      </span>
                    </div>

                    <div className="bg-white p-2 rounded-lg border border-slate-200">
                      <span className="text-[10px] text-slate-400 block font-semibold">
                        Regional BESS Needed
                      </span>
                      <span className="text-base font-black text-emerald-800">
                        {data.batterySizing.regionalBessRequiredMwh.toLocaleString()} MWh
                      </span>
                      <span className="text-[10px] text-slate-500 block">
                        Firms local grid feeder
                      </span>
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-snug">
                    {data.batterySizing.mitigationStrategy}
                  </p>
                </div>

                {/* Section 3: Regional Emissions Avoided & Air Quality (CPCB / OpenAQ) */}
                <div className="p-3 rounded-xl bg-white border border-slate-200 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 flex items-center gap-1.5">
                      <Leaf className="w-4 h-4 text-emerald-600" />
                      <span>Emissions & CPCB / OpenAQ Indicators</span>
                    </span>
                    <a
                      href="https://app.cpcbccr.com/AQI_India/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[10px] text-emerald-700 font-bold hover:underline flex items-center gap-0.5"
                    >
                      <span>CPCB Portal</span>
                      <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-center">
                    <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                      <span className="text-[10px] text-slate-500 block">CO₂ Avoided Today</span>
                      <span className="text-base font-black text-emerald-700">
                        {data.emissions.co2AvoidedTonnesToday.toLocaleString()} tCO₂
                      </span>
                      <span className="text-[10px] text-slate-400 block mt-0.5">
                        @ 0.82 kg/kWh CEA baseline
                      </span>
                    </div>

                    <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                      <span className="text-[10px] text-slate-500 block">Air Quality Index (AQI)</span>
                      <div className="flex items-center justify-center gap-1.5 mt-0.5">
                        <span
                          className="w-2.5 h-2.5 rounded-full inline-block"
                          style={{ backgroundColor: data.airQuality.colorHex }}
                        ></span>
                        <span className="text-base font-black text-slate-900">
                          {data.airQuality.aqi}
                        </span>
                      </div>
                      <span className="text-[10px] font-semibold text-slate-600 block mt-0.5">
                        {data.airQuality.category} • PM2.5: {data.airQuality.pm25} µg/m³
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-[11px] text-slate-500">
                    <span>Grid Carbon Intensity:</span>
                    <span className="font-bold text-slate-800">
                      {data.emissions.gridCarbonIntensityGPerKwh} g CO₂/kWh
                    </span>
                  </div>
                </div>

                {/* Footer Status */}
                <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1">
                  <span>Open-Meteo & OpenAQ Station Feeds</span>
                  <button
                    type="button"
                    onClick={() => fetchTelemetry(selectedHub)}
                    className="flex items-center gap-1 text-emerald-700 font-bold hover:underline"
                  >
                    <RefreshCw className={`w-3 h-3 ${loading ? "animate-spin" : ""}`} />
                    <span>Refresh Live</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
