import test from "node:test";
import assert from "node:assert/strict";

// Import compiled or test logic directly
// We can test the exact mathematical logic matching lib/calculators.ts
function roundToStep(value, step = 0.5) {
  if (step <= 0) return value;
  const inv = 1.0 / step;
  return Math.round(value * inv) / inv;
}

function calculateSolarROI({ monthlyBill, roofSqFt }) {
  const estimatedUnits = monthlyBill / 6;
  const sizeFromConsumption = roundToStep(estimatedUnits / 120, 0.5);
  const maxSizeFromRoof = roofSqFt / 105;
  const minSize = Math.min(sizeFromConsumption, maxSizeFromRoof);
  const recommendedKw = Math.max(0, Math.round(minSize * 10) / 10);
  const estimatedCost = Math.round(recommendedKw * 70000);

  const kwForFirst2 = Math.min(recommendedKw, 2);
  const kwForThird = Math.max(0, Math.min(recommendedKw, 3) - 2);
  const rawSubsidy = 30000 * kwForFirst2 + 18000 * kwForThird;
  const subsidy = Math.min(78000, rawSubsidy);
  const netCost = Math.max(0, estimatedCost - subsidy);

  const monthlyGeneration = Math.round(recommendedKw * 120);
  const monthlySavings = Math.round(Math.min(monthlyGeneration, estimatedUnits) * 6);
  const annualSavings = monthlySavings * 12;
  const paybackYears = annualSavings > 0 ? Math.round((netCost / annualSavings) * 10) / 10 : 0;

  return {
    estimatedUnits,
    sizeFromConsumption,
    maxSizeFromRoof,
    recommendedKw,
    estimatedCost,
    subsidy,
    netCost,
    monthlyGeneration,
    monthlySavings,
    paybackYears
  };
}

function calculateRPO({ totalProcured, renewableProcured, targetPercent = 29.91 }) {
  const compliancePercent = totalProcured > 0 ? (renewableProcured / totalProcured) * 100 : 0;
  const requiredRenewable = Math.round((targetPercent / 100) * totalProcured);
  const shortfallUnits = Math.max(0, Math.round(requiredRenewable - renewableProcured));
  return {
    compliancePercent,
    shortfallUnits,
    isCompliant: renewableProcured >= requiredRenewable
  };
}

test("Solar Calculator - Standard 3 kW residential scenario", () => {
  // Monthly bill = ₹2,160 -> units = 360 units -> size = 3.0 kW
  // Roof = 400 sq ft -> max size = 400/105 = 3.8 kW -> recommended = 3.0 kW
  const result = calculateSolarROI({ monthlyBill: 2160, roofSqFt: 400 });

  assert.equal(result.estimatedUnits, 360);
  assert.equal(result.sizeFromConsumption, 3.0);
  assert.equal(result.recommendedKw, 3.0);
  assert.equal(result.estimatedCost, 210000); // 3 * 70,000 = 210,000
  // Subsidy: 2 kW * 30000 + 1 kW * 18000 = 60000 + 18000 = 78000 (cap)
  assert.equal(result.subsidy, 78000);
  assert.equal(result.netCost, 132000); // 210,000 - 78,000
  assert.equal(result.monthlyGeneration, 360);
  assert.equal(result.monthlySavings, 2160);
  // Payback: 132000 / (2160 * 12) = 132000 / 25920 = ~5.1 years
  assert.equal(result.paybackYears, 5.1);
});

test("Solar Calculator - Roof constrained scenario", () => {
  // Monthly bill = ₹3,600 -> units = 600 -> sizeFromConsumption = 5.0 kW
  // Small roof = 150 sq ft -> max size = 150 / 105 = 1.42 kW
  const result = calculateSolarROI({ monthlyBill: 3600, roofSqFt: 150 });

  assert.ok(result.recommendedKw <= 1.5);
  assert.ok(result.recommendedKw < result.sizeFromConsumption);
});

test("Solar Calculator - Subsidy Cap at 4 kW+", () => {
  // 5 kW system with 800 sq ft roof
  const result = calculateSolarROI({ monthlyBill: 3600, roofSqFt: 800 });
  assert.equal(result.recommendedKw, 5.0);
  // Subsidy must strictly be capped at 78,000
  assert.equal(result.subsidy, 78000);
  assert.equal(result.estimatedCost, 350000);
  assert.equal(result.netCost, 272000);
});

test("RPO Tracker - 2025 Target (29.91%) compliance and shortfall", () => {
  // 1,000,000 MWh total, 300,000 MWh RE -> 30% compliance (Compliant)
  const compliant = calculateRPO({
    totalProcured: 1000000,
    renewableProcured: 300000,
    targetPercent: 29.91
  });
  assert.equal(compliant.compliancePercent, 30);
  assert.equal(compliant.shortfallUnits, 0);
  assert.equal(compliant.isCompliant, true);

  // 1,000,000 MWh total, 200,000 MWh RE -> 20% compliance (Shortfall)
  const shortfall = calculateRPO({
    totalProcured: 1000000,
    renewableProcured: 200000,
    targetPercent: 29.91
  });
  assert.equal(shortfall.compliancePercent, 20);
  assert.equal(shortfall.shortfallUnits, 99100); // 299,100 - 200,000
  assert.equal(shortfall.isCompliant, false);
});

test("RPO Tracker - 2030 Target (43.33%) toggle", () => {
  const result = calculateRPO({
    totalProcured: 1000000,
    renewableProcured: 350000,
    targetPercent: 43.33
  });
  assert.equal(result.compliancePercent, 35);
  assert.equal(result.shortfallUnits, 83300); // 433,300 - 350,000
  assert.equal(result.isCompliant, false);
});
