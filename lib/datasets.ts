import fs from "fs";
import path from "path";

/**
 * Robust CSV Line Parser supporting quoted fields with commas
 */
export function parseCsvLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++; // skip escaped quote
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === "," && !inQuotes) {
      result.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

export function parseCsvFile<T = Record<string, string>>(filePath: string): T[] {
  const fullPath = path.isAbsolute(filePath)
    ? filePath
    : path.join(process.cwd(), filePath);

  if (!fs.existsSync(fullPath)) {
    return [];
  }

  const raw = fs.readFileSync(fullPath, "utf8");
  const lines = raw.split(/\r?\n/).filter((l) => l.trim().length > 0);
  if (lines.length < 2) return [];

  const headers = parseCsvLine(lines[0]).map((h) => h.trim());
  const rows: T[] = [];

  for (let i = 1; i < lines.length; i++) {
    const cols = parseCsvLine(lines[i]);
    const obj: any = {};
    headers.forEach((h, idx) => {
      obj[h] = cols[idx] !== undefined ? cols[idx] : "";
    });
    rows.push(obj as T);
  }

  return rows;
}

// 1. Schemes Dataset
export interface OriginalScheme {
  scheme: string;
  type: string;
  provider: string;
  focus_area: string;
  benefit_summary: string;
  eligible_beneficiary: string;
  official_source: string;
  note: string;
  redirectUrl: string;
}

export function getOriginalSchemes(): OriginalScheme[] {
  const raw = parseCsvFile<any>("data/datasets/schemes.csv");
  return raw.map((r) => {
    let redirectUrl = "https://pmsuryaghar.gov.in/#/";
    if (r.official_source.includes("ireda.in")) {
      redirectUrl = "https://ireda.in/IredaWebPortal/";
    } else if (r.official_source.includes("powermin.gov.in") || r.official_source.includes("mop.gov.in")) {
      redirectUrl = "https://www.powermin.gov.in/";
    } else if (r.official_source.includes("sscgj.in")) {
      redirectUrl = "https://sscgj.in/?utm_source=chatgpt.com";
    } else if (r.official_source.includes("rbi.org.in")) {
      redirectUrl = "https://rbi.org.in";
    } else if (r.official_source.includes("mnre.gov.in")) {
      redirectUrl = "https://mnre.gov.in";
    }

    return {
      scheme: r.scheme,
      type: r.type,
      provider: r.provider,
      focus_area: r.focus_area,
      benefit_summary: r.benefit_summary,
      eligible_beneficiary: r.eligible_beneficiary,
      official_source: r.official_source,
      note: r.note,
      redirectUrl,
    };
  });
}

// 2. Jobs Dataset
export interface OriginalJob {
  id: string;
  job_title: string;
  domain: string;
  level: string;
  typical_qualification: string;
  salary_min_lpa: number;
  salary_max_lpa: number;
  key_skills: string[];
  employer_type: string;
  typical_locations: string;
  note: string;
}

export function getOriginalJobs(): OriginalJob[] {
  const raw = parseCsvFile<any>("data/datasets/jobs.csv");
  return raw.map((r, idx) => ({
    id: `OJ-${String(idx + 1).padStart(3, "0")}`,
    job_title: r.job_title,
    domain: r.domain,
    level: r.level,
    typical_qualification: r.typical_qualification,
    salary_min_lpa: parseFloat(r.salary_min_lpa) || 0,
    salary_max_lpa: parseFloat(r.salary_max_lpa) || 0,
    key_skills: r.key_skills ? r.key_skills.split(",").map((s: string) => s.trim()) : [],
    employer_type: r.employer_type,
    typical_locations: r.typical_locations,
    note: r.note,
  }));
}

// 3. Solar Benchmarks & Parameters Dataset
export interface SolarBenchmarkRow {
  system_kw: number;
  est_gross_cost_inr: number;
  pm_surya_ghar_subsidy_inr: number;
  net_cost_inr: number;
  annual_generation_kwh: number;
  annual_savings_inr: number;
  payback_years: number;
  assumptions: string;
}

export function getOriginalSolarBenchmarks(): SolarBenchmarkRow[] {
  const raw = parseCsvFile<any>("data/datasets/solar_benchmarks.csv");
  // Filter only rows that have numeric system_kw
  return raw
    .filter((r) => r.system_kw && !isNaN(Number(r.system_kw)))
    .map((r) => ({
      system_kw: Number(r.system_kw),
      est_gross_cost_inr: Number(r.est_gross_cost_inr),
      pm_surya_ghar_subsidy_inr: Number(r.pm_surya_ghar_subsidy_inr),
      net_cost_inr: Number(r.net_cost_inr),
      annual_generation_kwh: Number(r.annual_generation_kwh),
      annual_savings_inr: Number(r.annual_savings_inr),
      payback_years: Number(r.payback_years),
      assumptions: r.assumptions || "",
    }));
}

export function getOriginalSolarParameters(): Record<string, number> {
  const raw = parseCsvFile<any>("data/datasets/solar_benchmarks.csv");
  const params: Record<string, number> = {};
  raw.forEach((r) => {
    if (r.parameter && r.value) {
      params[r.parameter] = parseFloat(r.value);
    }
  });
  return params;
}

// 4. RPO Trajectory Dataset
export interface OriginalRpoTrajectory {
  fiscal_year: string;
  wind_percent: number;
  hydro_hpo_percent: number;
  other_re_percent: number;
  total_re_percent: number;
  note: string;
}

export function getOriginalRpoTrajectory(): OriginalRpoTrajectory[] {
  const raw = parseCsvFile<any>("data/datasets/rpo_trajectory.csv");
  return raw.map((r) => ({
    fiscal_year: r.fiscal_year,
    wind_percent: parseFloat(r.wind_percent) || 0,
    hydro_hpo_percent: parseFloat(r.hydro_hpo_percent) || 0,
    other_re_percent: parseFloat(r.other_re_percent) || 0,
    total_re_percent: parseFloat(r.total_re_percent) || 0,
    note: r.note,
  }));
}

// 5. RPO Sample Entities
export interface OriginalRpoEntity {
  entity: string;
  entity_type: string;
  fiscal_year: string;
  total_consumption_mu: number;
  re_consumption_mu: number;
  re_share_percent: number;
  meets_target: boolean;
  note: string;
}

export function getOriginalRpoEntities(): OriginalRpoEntity[] {
  const raw = parseCsvFile<any>("data/datasets/rpo_entities.csv");
  return raw.map((r) => ({
    entity: r.entity,
    entity_type: r.entity_type,
    fiscal_year: r.fiscal_year,
    total_consumption_mu: parseFloat(r.total_consumption_mu) || 0,
    re_consumption_mu: parseFloat(r.re_consumption_mu) || 0,
    re_share_percent: parseFloat(r.re_share_percent_FORMULA) || 0,
    meets_target: r.meets_target_Y_N === "Y",
    note: r.note,
  }));
}

// 6. Generation Mix Dataset
export interface OriginalGenerationMix {
  fiscal_year: string;
  source: string;
  generation_billion_units: number;
  share_percent: number;
  data_quality: string;
}

export function getOriginalGenerationMix(): OriginalGenerationMix[] {
  const raw = parseCsvFile<any>("data/datasets/generation_mix.csv");
  return raw.map((r) => ({
    fiscal_year: r.fiscal_year,
    source: r.source,
    generation_billion_units: parseFloat(r.generation_billion_units_approx) || 0,
    share_percent: parseFloat(r.share_percent_approx) || 0,
    data_quality: r.data_quality,
  }));
}

// 7. Capacity Growth Trajectory (FY2015 - FY2025)
export interface OriginalCapacityGrowth {
  fiscal_year: string;
  coal_lignite_mw: number;
  solar_mw: number;
  wind_mw: number;
  data_quality: string;
}

export function getOriginalCapacityGrowth(): OriginalCapacityGrowth[] {
  const raw = parseCsvFile<any>("data/datasets/capacity_growth.csv");
  return raw.map((r) => ({
    fiscal_year: r.fiscal_year,
    coal_lignite_mw: parseFloat(r.coal_lignite_mw) || 0,
    solar_mw: parseFloat(r.solar_mw) || 0,
    wind_mw: parseFloat(r.wind_mw) || 0,
    data_quality: r.data_quality,
  }));
}

// 8. Station Level Generation Dataset
export interface StationGenerationRecord {
  regionId: string;
  month: string;
  region: string;
  state: string;
  sector: string;
  category: string;
  fuel: string;
  utility: string;
  station: string;
  installedCapacityMw: number;
  programGenerationMu: number;
  actualGenerationMu: number;
}

export function getOriginalStationGeneration(limit = 100): StationGenerationRecord[] {
  const raw = parseCsvFile<any>("data/datasets/station_generation.csv");
  return raw.slice(0, limit).map((r) => ({
    regionId: r["REGION ID"] || "",
    month: r["MONTH"] || "",
    region: r["REGION"] || "",
    state: r["STATE"] || "",
    sector: r["SECTOR"] || "",
    category: r["CATEGORY"] || "",
    fuel: r["FUEL"] || "",
    utility: r["UTILITY"] || "",
    station: r["STATION"] || "",
    installedCapacityMw: parseFloat(r["INSTALLED CAPACITY"]) || 0,
    programGenerationMu: parseFloat(r["PROGRAM GENERATION"]) || 0,
    actualGenerationMu: parseFloat(r["ACTUAL GENERATION"]) || 0,
  }));
}
