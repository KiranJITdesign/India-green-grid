import fs from "fs";
import path from "path";

function parseCsvLine(line) {
  const result = [];
  let current = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
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

function parseCsv(filename) {
  const raw = fs.readFileSync(path.join(process.cwd(), "data/datasets", filename), "utf8");
  const lines = raw.split(/\r?\n/).filter((l) => l.trim().length > 0);
  const headers = parseCsvLine(lines[0]);
  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    const cols = parseCsvLine(lines[i]);
    const obj = {};
    headers.forEach((h, idx) => {
      obj[h] = cols[idx] !== undefined ? cols[idx] : "";
    });
    rows.push(obj);
  }
  return rows;
}

const schemes = parseCsv("schemes.csv");
const jobs = parseCsv("jobs.csv");
const solar = parseCsv("solar_benchmarks.csv");
const rpoEntities = parseCsv("rpo_entities.csv");
const rpoTrajectory = parseCsv("rpo_trajectory.csv");
const generationMix = parseCsv("generation_mix.csv");
const capacityGrowth = parseCsv("capacity_growth.csv");

const transformedSchemes = schemes.map((s) => {
  let redirectUrl = "https://pmsuryaghar.gov.in/#/";
  if (s.official_source.includes("ireda.in")) redirectUrl = "https://ireda.in/IredaWebPortal/";
  else if (s.official_source.includes("powermin.gov.in") || s.official_source.includes("mop.gov.in")) redirectUrl = "https://www.powermin.gov.in/";
  else if (s.official_source.includes("sscgj.in")) redirectUrl = "https://sscgj.in/?utm_source=chatgpt.com";
  else if (s.official_source.includes("rbi.org.in")) redirectUrl = "https://rbi.org.in";
  else if (s.official_source.includes("mnre.gov.in")) redirectUrl = "https://mnre.gov.in";
  return { ...s, redirectUrl };
});

const transformedJobs = jobs.map((j, idx) => ({
  id: "OJ-" + String(idx + 1).padStart(3, "0"),
  job_title: j.job_title,
  domain: j.domain,
  level: j.level,
  typical_qualification: j.typical_qualification,
  salary_min_lpa: parseFloat(j.salary_min_lpa) || 0,
  salary_max_lpa: parseFloat(j.salary_max_lpa) || 0,
  key_skills: j.key_skills ? j.key_skills.split(",").map((s) => s.trim()) : [],
  employer_type: j.employer_type,
  typical_locations: j.typical_locations,
  note: j.note,
}));

const transformedSolarBenchmarks = solar
  .filter((s) => s.system_kw && !isNaN(Number(s.system_kw)))
  .map((s) => ({
    system_kw: Number(s.system_kw),
    est_gross_cost_inr: Number(s.est_gross_cost_inr),
    pm_surya_ghar_subsidy_inr: Number(s.pm_surya_ghar_subsidy_inr),
    net_cost_inr: Number(s.net_cost_inr),
    annual_generation_kwh: Number(s.annual_generation_kwh),
    annual_savings_inr: Number(s.annual_savings_inr),
    payback_years: Number(s.payback_years),
    assumptions: s.assumptions || "",
  }));

const transformedRpoTrajectory = rpoTrajectory.map((r) => ({
  fiscal_year: r.fiscal_year,
  wind_percent: parseFloat(r.wind_percent) || 0,
  hydro_hpo_percent: parseFloat(r.hydro_hpo_percent) || 0,
  other_re_percent: parseFloat(r.other_re_percent) || 0,
  total_re_percent: parseFloat(r.total_re_percent) || 0,
  note: r.note,
}));

const transformedRpoEntities = rpoEntities.map((r) => ({
  entity: r.entity,
  entity_type: r.entity_type,
  fiscal_year: r.fiscal_year,
  total_consumption_mu: parseFloat(r.total_consumption_mu) || 0,
  re_consumption_mu: parseFloat(r.re_consumption_mu) || 0,
  re_share_percent: parseFloat(r.re_share_percent_FORMULA) || 0,
  meets_target: r.meets_target_Y_N === "Y",
  note: r.note,
}));

const transformedGenerationMix = generationMix.map((g) => ({
  fiscal_year: g.fiscal_year,
  source: g.source,
  generation_billion_units: parseFloat(g.generation_billion_units_approx) || 0,
  share_percent: parseFloat(g.share_percent_approx) || 0,
  data_quality: g.data_quality,
}));

const transformedCapacityGrowth = capacityGrowth.map((c) => ({
  fiscal_year: c.fiscal_year,
  coal_lignite_mw: parseFloat(c.coal_lignite_mw) || 0,
  solar_mw: parseFloat(c.solar_mw) || 0,
  wind_mw: parseFloat(c.wind_mw) || 0,
  data_quality: c.data_quality,
}));

const content = `/**
 * India Green Grid - Original Pre-Parsed Datasets
 * Sourced directly from official datasets in data/datasets/*.csv
 * Pure TypeScript (no fs dependency, works seamlessly on Client and Server)
 */

export interface SchemeRecord {
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

export const ORIGINAL_SCHEMES: SchemeRecord[] = ${JSON.stringify(transformedSchemes, null, 2)};

export interface JobRecord {
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

export const ORIGINAL_JOBS: JobRecord[] = ${JSON.stringify(transformedJobs, null, 2)};

export interface SolarBenchmarkItem {
  system_kw: number;
  est_gross_cost_inr: number;
  pm_surya_ghar_subsidy_inr: number;
  net_cost_inr: number;
  annual_generation_kwh: number;
  annual_savings_inr: number;
  payback_years: number;
  assumptions: string;
}

export const ORIGINAL_SOLAR_BENCHMARKS: SolarBenchmarkItem[] = ${JSON.stringify(transformedSolarBenchmarks, null, 2)};

export const ORIGINAL_SOLAR_PARAMS = {
  costPerKwInr: 60000.0,
  annualYieldKwhPerKw: 1450.0,
  avgTariffInrPerKwh: 7.0,
  subsidyFirst2KwInrPerKw: 30000.0,
  subsidy3rdKwInr: 18000.0,
  subsidyCapInr: 78000.0,
  panelDegradationPercentPerYear: 0.5,
  systemLifeYears: 25.0
};

export interface RpoTrajectoryItem {
  fiscal_year: string;
  wind_percent: number;
  hydro_hpo_percent: number;
  other_re_percent: number;
  total_re_percent: number;
  note: string;
}

export const ORIGINAL_RPO_TRAJECTORY: RpoTrajectoryItem[] = ${JSON.stringify(transformedRpoTrajectory, null, 2)};

export interface RpoEntityItem {
  entity: string;
  entity_type: string;
  fiscal_year: string;
  total_consumption_mu: number;
  re_consumption_mu: number;
  re_share_percent: number;
  meets_target: boolean;
  note: string;
}

export const ORIGINAL_RPO_ENTITIES: RpoEntityItem[] = ${JSON.stringify(transformedRpoEntities, null, 2)};

export interface GenerationMixItem {
  fiscal_year: string;
  source: string;
  generation_billion_units: number;
  share_percent: number;
  data_quality: string;
}

export const ORIGINAL_GENERATION_MIX: GenerationMixItem[] = ${JSON.stringify(transformedGenerationMix, null, 2)};

export interface CapacityGrowthItem {
  fiscal_year: string;
  coal_lignite_mw: number;
  solar_mw: number;
  wind_mw: number;
  data_quality: string;
}

export const ORIGINAL_CAPACITY_GROWTH: CapacityGrowthItem[] = ${JSON.stringify(transformedCapacityGrowth, null, 2)};
`;

fs.writeFileSync(path.join(process.cwd(), "data/originalDatasets.ts"), content, "utf8");
console.log("Successfully generated data/originalDatasets.ts!");
