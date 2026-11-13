/**
 * India Green Grid - Pure Logic Calculation Engines
 * Sourced strictly from CodeSpark 2026 Problem Statement specifications:
 * Section 3: Solar Calculator Logic
 * Section 4: RPO Compliance Tracker Logic
 */

import { SOLAR_CONSTANTS, RPO_CONSTANTS } from "../data/energyData";

export interface SolarCalculationInput {
  monthlyBill: number; // in INR (₹)
  roofSqFt: number; // in square feet
  location?: string; // City / State for display & regional context
}

export interface SolarCalculationResult {
  monthlyBill: number;
  roofSqFt: number;
  location: string;
  estimatedUnits: number; // Monthly consumption units (kWh) based on ₹6/unit
  sizeFromConsumption: number; // Recommended kW based on consumption (rounded to nearest 0.5 kW)
  maxSizeFromRoof: number; // Maximum kW allowed by roof space (roofSqFt / 105)
  recommendedKw: number; // min(sizeFromConsumption, maxSizeFromRoof)
  isRoofConstrained: boolean; // True if roof limits optimal size
  estimatedCost: number; // Pre-subsidy cost at ₹70,000/kW benchmark
  subsidy: number; // PM Surya Ghar subsidy based on slabs (max ₹78,000)
  netCost: number; // estimatedCost - subsidy
  monthlyGeneration: number; // recommendedKw * 120 units
  monthlySavings: number; // min(monthlyGeneration, estimatedUnits) * 6
  annualSavings: number; // monthlySavings * 12
  paybackYears: number; // netCost / (monthlySavings * 12)
  lifetimeSavings25Years: number; // 25 years cumulative net savings (net of initial cost)
  co2AvoidedTonsPerYear: number; // Environmental impact (approx 0.82 kg CO2 / kWh)
  breakdown: {
    first2KwSubsidy: number;
    thirdKwSubsidy: number;
    effectiveSubsidyPercent: number;
  };
}

/**
 * Rounds a number to the nearest multiple of a given step (e.g. 0.5).
 */
export function roundToStep(value: number, step: number = 0.5): number {
  if (step <= 0) return value;
  const inv = 1.0 / step;
  return Math.round(value * inv) / inv;
}

/**
 * Calculates Rooftop Solar System sizing, capital cost, PM Surya Ghar subsidy,
 * monthly bill savings, and payback period.
 */
export function calculateSolarROI(input: SolarCalculationInput): SolarCalculationResult {
  const bill = Math.max(0, Number(input.monthlyBill) || 0);
  const roof = Math.max(0, Number(input.roofSqFt) || 0);
  const loc = input.location || "All-India Average";

  // 1. Assume average tariff of ₹6/unit for estimating consumption
  // UI note: "assumes ₹6/unit average tariff"
  const estimatedUnits = bill / SOLAR_CONSTANTS.averageTariffINR;

  // 2. Recommended size from consumption, rounded to nearest 0.5 kW
  const rawSizeFromConsumption = estimatedUnits / SOLAR_CONSTANTS.monthlyUnitsPerKw;
  const sizeFromConsumption = roundToStep(rawSizeFromConsumption, 0.5);

  // 3. Cap by available roof space (≈105 sq ft per kW)
  const maxSizeFromRoof = roof / SOLAR_CONSTANTS.roofSpacePerKwSqFt;

  // Recommended system size is capped by roof space
  // We round the capped result to nearest 0.1 kW for neat display if fractional
  const minSize = Math.min(sizeFromConsumption, maxSizeFromRoof);
  const recommendedKw = Math.max(0, Math.round(minSize * 10) / 10);
  const isRoofConstrained = maxSizeFromRoof < sizeFromConsumption && roof > 0;

  // 4. Cost before subsidy (approximate benchmark: ₹70,000 per kW)
  const estimatedCost = Math.round(recommendedKw * SOLAR_CONSTANTS.costPerKwBenchmarkINR);

  // 5. PM Surya Ghar subsidy (slab-based)
  // First 2 kW: ₹30,000/kW
  // 3rd kW: ₹18,000
  // Capped at ₹78,000 for 3 kW and above
  const kwForFirst2 = Math.min(recommendedKw, 2);
  const kwForThird = Math.max(0, Math.min(recommendedKw, 3) - 2);
  const first2KwSubsidy = Math.round(SOLAR_CONSTANTS.subsidyFirst2KwRate * kwForFirst2);
  const thirdKwSubsidy = Math.round(SOLAR_CONSTANTS.subsidy3rdKwRate * kwForThird);

  const rawSubsidy = first2KwSubsidy + thirdKwSubsidy;
  const subsidy = Math.min(SOLAR_CONSTANTS.subsidyCapINR, rawSubsidy);

  // 6. Net Out-of-Pocket Cost
  const netCost = Math.max(0, estimatedCost - subsidy);

  // 7. Monthly generation and savings
  const monthlyGeneration = Math.round(recommendedKw * SOLAR_CONSTANTS.monthlyUnitsPerKw);
  const monthlySavings = Math.round(
    Math.min(monthlyGeneration, estimatedUnits) * SOLAR_CONSTANTS.averageTariffINR
  );
  const annualSavings = monthlySavings * 12;

  // 8. Payback period in years
  let paybackYears = 0;
  if (annualSavings > 0 && netCost > 0) {
    paybackYears = Math.round((netCost / annualSavings) * 10) / 10;
  }

  // 9. 25-Year cumulative savings & CO2 avoided
  const lifetimeGrossSavings = annualSavings * SOLAR_CONSTANTS.panelLifespanYears;
  const lifetimeSavings25Years = Math.max(0, lifetimeGrossSavings - netCost);
  const co2AvoidedTonsPerYear =
    Math.round(((monthlyGeneration * 12 * SOLAR_CONSTANTS.co2SavedPerKwhKg) / 1000) * 10) / 10;

  const effectiveSubsidyPercent =
    estimatedCost > 0 ? Math.round((subsidy / estimatedCost) * 1000) / 10 : 0;

  return {
    monthlyBill: bill,
    roofSqFt: roof,
    location: loc,
    estimatedUnits: Math.round(estimatedUnits),
    sizeFromConsumption,
    maxSizeFromRoof: Math.round(maxSizeFromRoof * 10) / 10,
    recommendedKw,
    isRoofConstrained,
    estimatedCost,
    subsidy,
    netCost,
    monthlyGeneration,
    monthlySavings,
    annualSavings,
    paybackYears,
    lifetimeSavings25Years,
    co2AvoidedTonsPerYear,
    breakdown: {
      first2KwSubsidy,
      thirdKwSubsidy,
      effectiveSubsidyPercent
    }
  };
}

export interface RpoCalculationInput {
  totalProcuredMWh: number;
  renewableProcuredMWh: number;
  targetPercent?: number; // defaults to 29.91 (2025) or 43.33 (2030)
  targetYear?: "2025" | "2030" | "custom";
}

export interface RpoCalculationResult {
  totalProcuredMWh: number;
  renewableProcuredMWh: number;
  targetPercent: number;
  targetYear: string;
  compliancePercent: number; // (renewableProcured / totalProcured) * 100
  isCompliant: boolean;
  requiredRenewableMWh: number; // (targetPercent / 100) * totalProcured
  shortfallUnitsMWh: number; // max(0, requiredRenewableMWh - renewableProcured)
  surplusUnitsMWh: number; // max(0, renewableProcured - requiredRenewableMWh)
  estimatedPenaltyINR: number; // estimated financial exposure/REC cost
  complianceRatio: number; // compliancePercent / targetPercent (1.0 = exactly compliant)
  statusLabel: "Compliant (Surplus)" | "Near Compliance" | "Critical Shortfall";
  statusColor: string;
}

/**
 * Calculates statutory RPO compliance percentage and shortfall/surplus.
 */
export function calculateRPO(input: RpoCalculationInput): RpoCalculationResult {
  const total = Math.max(0, Number(input.totalProcuredMWh) || 0);
  const renewable = Math.max(0, Number(input.renewableProcuredMWh) || 0);

  let target = RPO_CONSTANTS.activeTarget2025; // 29.91% default
  let yearLabel = "FY 2024-25 Target (29.91%)";

  if (input.targetYear === "2030") {
    target = RPO_CONSTANTS.projectionTarget2030; // 43.33%
    yearLabel = "FY 2029-30 Target (43.33%)";
  } else if (input.targetPercent !== undefined && input.targetPercent > 0) {
    target = input.targetPercent;
    yearLabel = `Custom Target (${target}%)`;
  }

  // 1. Compliance Percentage
  const compliancePercent =
    total > 0 ? Math.round((renewable / total) * 10000) / 100 : 0;

  // 2. Required Renewable Generation & Shortfall
  const requiredRenewableMWh = Math.round((target / 100) * total);
  const shortfallUnitsMWh = Math.max(0, Math.round(requiredRenewableMWh - renewable));
  const surplusUnitsMWh = Math.max(0, Math.round(renewable - requiredRenewableMWh));

  const isCompliant = renewable >= requiredRenewableMWh;
  const complianceRatio = target > 0 ? Math.round((compliancePercent / target) * 100) / 100 : 0;

  // Financial exposure estimate: Penalty/REC buy out at ~₹1,500/MWh
  const estimatedPenaltyINR = shortfallUnitsMWh * RPO_CONSTANTS.penaltyPerShortfallMWhINR;

  let statusLabel: "Compliant (Surplus)" | "Near Compliance" | "Critical Shortfall" = "Compliant (Surplus)";
  let statusColor = "#10b981"; // emerald

  if (!isCompliant) {
    if (compliancePercent >= target * 0.85) {
      statusLabel = "Near Compliance";
      statusColor = "#f59e0b"; // amber
    } else {
      statusLabel = "Critical Shortfall";
      statusColor = "#ef4444"; // red
    }
  }

  return {
    totalProcuredMWh: total,
    renewableProcuredMWh: renewable,
    targetPercent: target,
    targetYear: yearLabel,
    compliancePercent,
    isCompliant,
    requiredRenewableMWh,
    shortfallUnitsMWh,
    surplusUnitsMWh,
    estimatedPenaltyINR,
    complianceRatio,
    statusLabel,
    statusColor
  };
}
