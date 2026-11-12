/**
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

export const ORIGINAL_SCHEMES: SchemeRecord[] = [
  {
    "scheme": "PM Surya Ghar: Muft Bijli Yojana",
    "type": "Subsidy",
    "provider": "Central Govt (MNRE)",
    "focus_area": "Residential rooftop solar",
    "benefit_summary": "Rs 30,000/kW up to 2 kW, Rs 18,000 for 3rd kW; cap Rs 78,000",
    "eligible_beneficiary": "Homeowners with valid electricity connection",
    "official_source": "pmsuryaghar.gov.in",
    "note": "Summary from memory; rates/terms change - verify on official source before applying",
    "redirectUrl": "https://pmsuryaghar.gov.in/#/"
  },
  {
    "scheme": "Collateral-free rooftop solar loan (PSU banks)",
    "type": "Loan",
    "provider": "Public sector banks",
    "focus_area": "Residential rooftop solar",
    "benefit_summary": "Concessional rate; check bank (up to ~3 kW)",
    "eligible_beneficiary": "Homeowners under PM Surya Ghar",
    "official_source": "pmsuryaghar.gov.in",
    "note": "Summary from memory; rates/terms change - verify on official source before applying",
    "redirectUrl": "https://pmsuryaghar.gov.in/#/"
  },
  {
    "scheme": "PM-KUSUM",
    "type": "Subsidy",
    "provider": "Central Govt (MNRE)",
    "focus_area": "Solar pumps / farm solar",
    "benefit_summary": "Central financial assistance (30% typical) + state share + farmer share",
    "eligible_beneficiary": "Farmers",
    "official_source": "mnre.gov.in",
    "note": "Summary from memory; rates/terms change - verify on official source before applying",
    "redirectUrl": "https://mnre.gov.in"
  },
  {
    "scheme": "IREDA term loans",
    "type": "Loan",
    "provider": "IREDA",
    "focus_area": "Utility & commercial renewables",
    "benefit_summary": "Project finance; rates vary by project",
    "eligible_beneficiary": "Developers, companies",
    "official_source": "ireda.in",
    "note": "Summary from memory; rates/terms change - verify on official source before applying",
    "redirectUrl": "https://ireda.in/IredaWebPortal/"
  },
  {
    "scheme": "Sovereign Green Bonds",
    "type": "Bond",
    "provider": "Govt of India / RBI",
    "focus_area": "Green public projects",
    "benefit_summary": "Fixed coupon; issued via RBI auctions",
    "eligible_beneficiary": "Investors",
    "official_source": "rbi.org.in",
    "note": "Summary from memory; rates/terms change - verify on official source before applying",
    "redirectUrl": "https://rbi.org.in"
  },
  {
    "scheme": "PLI - High efficiency solar modules",
    "type": "Incentive",
    "provider": "Central Govt (MNRE)",
    "focus_area": "Manufacturing",
    "benefit_summary": "Production-linked; ~Rs 24,000 crore outlay",
    "eligible_beneficiary": "Manufacturers",
    "official_source": "mnre.gov.in",
    "note": "Summary from memory; rates/terms change - verify on official source before applying",
    "redirectUrl": "https://mnre.gov.in"
  },
  {
    "scheme": "PLI - Advanced Chemistry Cell batteries",
    "type": "Incentive",
    "provider": "Ministry of Heavy Industries",
    "focus_area": "Battery manufacturing",
    "benefit_summary": "~Rs 18,100 crore outlay",
    "eligible_beneficiary": "Manufacturers",
    "official_source": "heavyindustries.gov.in",
    "note": "Summary from memory; rates/terms change - verify on official source before applying",
    "redirectUrl": "https://pmsuryaghar.gov.in/#/"
  },
  {
    "scheme": "Viability Gap Funding - Battery storage",
    "type": "Grant",
    "provider": "Central Govt",
    "focus_area": "Grid-scale BESS",
    "benefit_summary": "VGF for ~30 GWh capacity",
    "eligible_beneficiary": "Developers",
    "official_source": "mnre.gov.in / mop.gov.in",
    "note": "Summary from memory; rates/terms change - verify on official source before applying",
    "redirectUrl": "https://www.powermin.gov.in/"
  },
  {
    "scheme": "National Green Hydrogen Mission",
    "type": "Incentive",
    "provider": "Central Govt (MNRE)",
    "focus_area": "Green hydrogen",
    "benefit_summary": "~Rs 19,744 crore outlay",
    "eligible_beneficiary": "Producers, electrolyser makers",
    "official_source": "mnre.gov.in",
    "note": "Summary from memory; rates/terms change - verify on official source before applying",
    "redirectUrl": "https://mnre.gov.in"
  },
  {
    "scheme": "Green Credit Programme",
    "type": "Credit scheme",
    "provider": "MoEFCC",
    "focus_area": "Environmental actions",
    "benefit_summary": "Tradable green credits",
    "eligible_beneficiary": "Companies, individuals",
    "official_source": "moef.gov.in",
    "note": "Summary from memory; rates/terms change - verify on official source before applying",
    "redirectUrl": "https://pmsuryaghar.gov.in/#/"
  },
  {
    "scheme": "Bank green deposits / green loans",
    "type": "Loan/Deposit",
    "provider": "Banks (e.g. SBI, others)",
    "focus_area": "Green projects/EV",
    "benefit_summary": "Product-specific rates",
    "eligible_beneficiary": "Individuals, firms",
    "official_source": "bank websites",
    "note": "Summary from memory; rates/terms change - verify on official source before applying",
    "redirectUrl": "https://pmsuryaghar.gov.in/#/"
  }
];

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

export const ORIGINAL_JOBS: JobRecord[] = [
  {
    "id": "OJ-001",
    "job_title": "Solar PV Installer",
    "domain": "Solar",
    "level": "Entry",
    "typical_qualification": "ITI/Diploma",
    "salary_min_lpa": 2,
    "salary_max_lpa": 3.5,
    "key_skills": [
      "Rooftop wiring",
      "panel mounting"
    ],
    "employer_type": "Installer/EPC",
    "typical_locations": "Pan-India",
    "note": "Illustrative role taxonomy and approximate salary bands - not live job postings"
  },
  {
    "id": "OJ-002",
    "job_title": "Solar Site Engineer",
    "domain": "Solar",
    "level": "Mid",
    "typical_qualification": "B.Tech Electrical",
    "salary_min_lpa": 4,
    "salary_max_lpa": 8,
    "key_skills": [
      "Commissioning",
      "QA"
    ],
    "employer_type": "EPC",
    "typical_locations": "Rajasthan, Gujarat, TN",
    "note": "Illustrative role taxonomy and approximate salary bands - not live job postings"
  },
  {
    "id": "OJ-003",
    "job_title": "Solar Design Engineer",
    "domain": "Solar",
    "level": "Mid",
    "typical_qualification": "B.Tech",
    "salary_min_lpa": 5,
    "salary_max_lpa": 10,
    "key_skills": [
      "PVsyst",
      "AutoCAD"
    ],
    "employer_type": "EPC/IPP",
    "typical_locations": "Bengaluru, Delhi NCR",
    "note": "Illustrative role taxonomy and approximate salary bands - not live job postings"
  },
  {
    "id": "OJ-004",
    "job_title": "Solar O&M Technician",
    "domain": "Solar",
    "level": "Entry",
    "typical_qualification": "ITI/Diploma",
    "salary_min_lpa": 2.2,
    "salary_max_lpa": 4,
    "key_skills": [
      "Inverter",
      "SCADA basics"
    ],
    "employer_type": "IPP/O&M",
    "typical_locations": "Rajasthan, Gujarat",
    "note": "Illustrative role taxonomy and approximate salary bands - not live job postings"
  },
  {
    "id": "OJ-005",
    "job_title": "Solar Project Manager",
    "domain": "Solar",
    "level": "Senior",
    "typical_qualification": "B.Tech/MBA",
    "salary_min_lpa": 15,
    "salary_max_lpa": 30,
    "key_skills": [
      "Project planning",
      "PPA"
    ],
    "employer_type": "IPP/EPC",
    "typical_locations": "Delhi NCR, Mumbai",
    "note": "Illustrative role taxonomy and approximate salary bands - not live job postings"
  },
  {
    "id": "OJ-006",
    "job_title": "PV Module Manufacturing Engineer",
    "domain": "Solar",
    "level": "Mid",
    "typical_qualification": "B.Tech",
    "salary_min_lpa": 5,
    "salary_max_lpa": 12,
    "key_skills": [
      "Cell/module process"
    ],
    "employer_type": "Manufacturer",
    "typical_locations": "Gujarat, Tamil Nadu",
    "note": "Illustrative role taxonomy and approximate salary bands - not live job postings"
  },
  {
    "id": "OJ-007",
    "job_title": "Wind Turbine Technician",
    "domain": "Wind",
    "level": "Entry",
    "typical_qualification": "ITI/Diploma",
    "salary_min_lpa": 2.5,
    "salary_max_lpa": 4.5,
    "key_skills": [
      "Height safety",
      "mechanical"
    ],
    "employer_type": "OEM/O&M",
    "typical_locations": "Tamil Nadu, Gujarat",
    "note": "Illustrative role taxonomy and approximate salary bands - not live job postings"
  },
  {
    "id": "OJ-008",
    "job_title": "Wind Resource Analyst",
    "domain": "Wind",
    "level": "Mid",
    "typical_qualification": "B.Tech/M.Tech",
    "salary_min_lpa": 6,
    "salary_max_lpa": 12,
    "key_skills": [
      "Wind data modelling"
    ],
    "employer_type": "Developer/Consultant",
    "typical_locations": "Chennai, Pune",
    "note": "Illustrative role taxonomy and approximate salary bands - not live job postings"
  },
  {
    "id": "OJ-009",
    "job_title": "Wind Project Engineer",
    "domain": "Wind",
    "level": "Mid",
    "typical_qualification": "B.Tech",
    "salary_min_lpa": 6,
    "salary_max_lpa": 14,
    "key_skills": [
      "Civil/electrical BoP"
    ],
    "employer_type": "Developer",
    "typical_locations": "Pan-India",
    "note": "Illustrative role taxonomy and approximate salary bands - not live job postings"
  },
  {
    "id": "OJ-010",
    "job_title": "Battery Cell Process Engineer",
    "domain": "Battery",
    "level": "Mid",
    "typical_qualification": "B.Tech/M.Tech",
    "salary_min_lpa": 6,
    "salary_max_lpa": 14,
    "key_skills": [
      "Li-ion cell manufacturing"
    ],
    "employer_type": "Manufacturer",
    "typical_locations": "Gujarat, Telangana",
    "note": "Illustrative role taxonomy and approximate salary bands - not live job postings"
  },
  {
    "id": "OJ-011",
    "job_title": "BESS Systems Engineer",
    "domain": "Battery",
    "level": "Mid",
    "typical_qualification": "B.Tech",
    "salary_min_lpa": 7,
    "salary_max_lpa": 16,
    "key_skills": [
      "Grid-scale storage design"
    ],
    "employer_type": "Developer/EPC",
    "typical_locations": "Bengaluru, Delhi NCR",
    "note": "Illustrative role taxonomy and approximate salary bands - not live job postings"
  },
  {
    "id": "OJ-012",
    "job_title": "Battery Management Systems Engineer",
    "domain": "Battery",
    "level": "Mid",
    "typical_qualification": "B.Tech/M.Tech",
    "salary_min_lpa": 8,
    "salary_max_lpa": 18,
    "key_skills": [
      "BMS firmware"
    ],
    "employer_type": "EV/Storage OEM",
    "typical_locations": "Bengaluru, Pune",
    "note": "Illustrative role taxonomy and approximate salary bands - not live job postings"
  },
  {
    "id": "OJ-013",
    "job_title": "EV Charging Infrastructure Engineer",
    "domain": "Battery/EV",
    "level": "Mid",
    "typical_qualification": "B.Tech",
    "salary_min_lpa": 5,
    "salary_max_lpa": 12,
    "key_skills": [
      "Charger deployment"
    ],
    "employer_type": "CPO/OEM",
    "typical_locations": "Metro cities",
    "note": "Illustrative role taxonomy and approximate salary bands - not live job postings"
  },
  {
    "id": "OJ-014",
    "job_title": "Green Hydrogen Process Engineer",
    "domain": "Hydrogen",
    "level": "Mid",
    "typical_qualification": "B.Tech Chemical",
    "salary_min_lpa": 7,
    "salary_max_lpa": 16,
    "key_skills": [
      "Electrolyser operations"
    ],
    "employer_type": "Energy majors",
    "typical_locations": "Gujarat, Odisha",
    "note": "Illustrative role taxonomy and approximate salary bands - not live job postings"
  },
  {
    "id": "OJ-015",
    "job_title": "Energy Auditor",
    "domain": "Efficiency",
    "level": "Mid",
    "typical_qualification": "BEE certified",
    "salary_min_lpa": 4,
    "salary_max_lpa": 9,
    "key_skills": [
      "Industrial audits"
    ],
    "employer_type": "Consultant",
    "typical_locations": "Pan-India",
    "note": "Illustrative role taxonomy and approximate salary bands - not live job postings"
  },
  {
    "id": "OJ-016",
    "job_title": "ESG Analyst",
    "domain": "Sustainability",
    "level": "Entry",
    "typical_qualification": "MBA/Any degree",
    "salary_min_lpa": 5,
    "salary_max_lpa": 10,
    "key_skills": [
      "BRSR reporting"
    ],
    "employer_type": "Corporate/Consulting",
    "typical_locations": "Mumbai, Bengaluru",
    "note": "Illustrative role taxonomy and approximate salary bands - not live job postings"
  },
  {
    "id": "OJ-017",
    "job_title": "Sustainability Manager",
    "domain": "Sustainability",
    "level": "Senior",
    "typical_qualification": "MBA/Env. Science",
    "salary_min_lpa": 15,
    "salary_max_lpa": 35,
    "key_skills": [
      "Net-zero strategy"
    ],
    "employer_type": "Corporate",
    "typical_locations": "Mumbai, Delhi NCR",
    "note": "Illustrative role taxonomy and approximate salary bands - not live job postings"
  },
  {
    "id": "OJ-018",
    "job_title": "Carbon Markets Analyst",
    "domain": "Sustainability",
    "level": "Mid",
    "typical_qualification": "Any + Env.",
    "salary_min_lpa": 6,
    "salary_max_lpa": 14,
    "key_skills": [
      "Carbon credits",
      "CCTS"
    ],
    "employer_type": "Consultant/Corporate",
    "typical_locations": "Delhi NCR, Mumbai",
    "note": "Illustrative role taxonomy and approximate salary bands - not live job postings"
  },
  {
    "id": "OJ-019",
    "job_title": "Renewable Energy Policy Analyst",
    "domain": "Policy",
    "level": "Mid",
    "typical_qualification": "Public policy/Eng.",
    "salary_min_lpa": 6,
    "salary_max_lpa": 15,
    "key_skills": [
      "Regulatory analysis"
    ],
    "employer_type": "Think tank/Developer",
    "typical_locations": "Delhi NCR",
    "note": "Illustrative role taxonomy and approximate salary bands - not live job postings"
  },
  {
    "id": "OJ-020",
    "job_title": "Power Systems Engineer (RE integration)",
    "domain": "Grid",
    "level": "Senior",
    "typical_qualification": "B.Tech/M.Tech",
    "salary_min_lpa": 12,
    "salary_max_lpa": 28,
    "key_skills": [
      "Grid studies",
      "forecasting"
    ],
    "employer_type": "Utility/Consultant",
    "typical_locations": "Pan-India",
    "note": "Illustrative role taxonomy and approximate salary bands - not live job postings"
  },
  {
    "id": "OJ-021",
    "job_title": "Solar Sales Executive (residential)",
    "domain": "Solar",
    "level": "Entry",
    "typical_qualification": "Any graduate",
    "salary_min_lpa": 2.5,
    "salary_max_lpa": 6,
    "key_skills": [
      "Lead gen",
      "subsidy guidance"
    ],
    "employer_type": "Installer",
    "typical_locations": "Pan-India",
    "note": "Illustrative role taxonomy and approximate salary bands - not live job postings"
  }
];

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

export const ORIGINAL_SOLAR_BENCHMARKS: SolarBenchmarkItem[] = [];

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

export const ORIGINAL_RPO_TRAJECTORY: RpoTrajectoryItem[] = [
  {
    "fiscal_year": "FY2023-24",
    "wind_percent": 0.81,
    "hydro_hpo_percent": 0.66,
    "other_re_percent": 28.44,
    "total_re_percent": 29.91,
    "note": "Ministry of Power RCO trajectory (Oct 2023); verify before compliance use"
  },
  {
    "fiscal_year": "FY2024-25",
    "wind_percent": 1.6,
    "hydro_hpo_percent": 1.08,
    "other_re_percent": 30.33,
    "total_re_percent": 33.01,
    "note": "Ministry of Power RCO trajectory (Oct 2023); verify before compliance use"
  },
  {
    "fiscal_year": "FY2025-26",
    "wind_percent": 2.46,
    "hydro_hpo_percent": 1.48,
    "other_re_percent": 32.14,
    "total_re_percent": 36.08,
    "note": "Ministry of Power RCO trajectory (Oct 2023); verify before compliance use"
  },
  {
    "fiscal_year": "FY2026-27",
    "wind_percent": 3.36,
    "hydro_hpo_percent": 1.8,
    "other_re_percent": 34.02,
    "total_re_percent": 39.18,
    "note": "Ministry of Power RCO trajectory (Oct 2023); verify before compliance use"
  },
  {
    "fiscal_year": "FY2027-28",
    "wind_percent": 4.29,
    "hydro_hpo_percent": 2.15,
    "other_re_percent": 35.83,
    "total_re_percent": 42.27,
    "note": "Ministry of Power RCO trajectory (Oct 2023); verify before compliance use"
  },
  {
    "fiscal_year": "FY2028-29",
    "wind_percent": 5.23,
    "hydro_hpo_percent": 2.51,
    "other_re_percent": 35.59,
    "total_re_percent": 43.33,
    "note": "Ministry of Power RCO trajectory (Oct 2023); verify before compliance use"
  },
  {
    "fiscal_year": "FY2029-30",
    "wind_percent": 6.16,
    "hydro_hpo_percent": 2.82,
    "other_re_percent": 34.35,
    "total_re_percent": 43.33,
    "note": "Ministry of Power RCO trajectory (Oct 2023); verify before compliance use"
  }
];

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

export const ORIGINAL_RPO_ENTITIES: RpoEntityItem[] = [
  {
    "entity": "EXAMPLE Steel Co (sample)",
    "entity_type": "Industry (designated consumer)",
    "fiscal_year": "FY2024-25",
    "total_consumption_mu": 5000,
    "re_consumption_mu": 1400,
    "re_share_percent": 28,
    "meets_target": false,
    "note": "Illustrative rows only; target 33.01% for FY2024-25"
  },
  {
    "entity": "EXAMPLE DISCOM (sample)",
    "entity_type": "Distribution utility",
    "fiscal_year": "FY2024-25",
    "total_consumption_mu": 12000,
    "re_consumption_mu": 3500,
    "re_share_percent": 29.17,
    "meets_target": false,
    "note": "Illustrative rows only; target 33.01% for FY2024-25"
  }
];

export interface GenerationMixItem {
  fiscal_year: string;
  source: string;
  generation_billion_units: number;
  share_percent: number;
  data_quality: string;
}

export const ORIGINAL_GENERATION_MIX: GenerationMixItem[] = [
  {
    "fiscal_year": "FY2023-24",
    "source": "Coal & lignite",
    "generation_billion_units": 1300,
    "share_percent": 74,
    "data_quality": "approximate; verify at cea.nic.in"
  },
  {
    "fiscal_year": "FY2023-24",
    "source": "Large hydro",
    "generation_billion_units": 160,
    "share_percent": 9,
    "data_quality": "approximate; verify at cea.nic.in"
  },
  {
    "fiscal_year": "FY2023-24",
    "source": "Solar",
    "generation_billion_units": 130,
    "share_percent": 7.4,
    "data_quality": "approximate; verify at cea.nic.in"
  },
  {
    "fiscal_year": "FY2023-24",
    "source": "Wind",
    "generation_billion_units": 80,
    "share_percent": 4.5,
    "data_quality": "approximate; verify at cea.nic.in"
  },
  {
    "fiscal_year": "FY2023-24",
    "source": "Nuclear",
    "generation_billion_units": 48,
    "share_percent": 2.7,
    "data_quality": "approximate; verify at cea.nic.in"
  },
  {
    "fiscal_year": "FY2023-24",
    "source": "Gas",
    "generation_billion_units": 40,
    "share_percent": 2.2,
    "data_quality": "approximate; verify at cea.nic.in"
  },
  {
    "fiscal_year": "FY2023-24",
    "source": "Biomass/small hydro/other RE",
    "generation_billion_units": 20,
    "share_percent": 1.1,
    "data_quality": "approximate; verify at cea.nic.in"
  }
];

export interface CapacityGrowthItem {
  fiscal_year: string;
  coal_lignite_mw: number;
  solar_mw: number;
  wind_mw: number;
  data_quality: string;
}

export const ORIGINAL_CAPACITY_GROWTH: CapacityGrowthItem[] = [
  {
    "fiscal_year": "FY2015",
    "coal_lignite_mw": 164636,
    "solar_mw": 3744,
    "wind_mw": 23444,
    "data_quality": "approximate (rounded from CEA/MNRE year-end figures)"
  },
  {
    "fiscal_year": "FY2016",
    "coal_lignite_mw": 185172,
    "solar_mw": 6763,
    "wind_mw": 26777,
    "data_quality": "approximate (rounded from CEA/MNRE year-end figures)"
  },
  {
    "fiscal_year": "FY2017",
    "coal_lignite_mw": 192163,
    "solar_mw": 12289,
    "wind_mw": 32280,
    "data_quality": "approximate (rounded from CEA/MNRE year-end figures)"
  },
  {
    "fiscal_year": "FY2018",
    "coal_lignite_mw": 197171,
    "solar_mw": 21651,
    "wind_mw": 34046,
    "data_quality": "approximate (rounded from CEA/MNRE year-end figures)"
  },
  {
    "fiscal_year": "FY2019",
    "coal_lignite_mw": 200704,
    "solar_mw": 28181,
    "wind_mw": 35129,
    "data_quality": "approximate (rounded from CEA/MNRE year-end figures)"
  },
  {
    "fiscal_year": "FY2020",
    "coal_lignite_mw": 205135,
    "solar_mw": 34627,
    "wind_mw": 37669,
    "data_quality": "approximate (rounded from CEA/MNRE year-end figures)"
  },
  {
    "fiscal_year": "FY2021",
    "coal_lignite_mw": 205100,
    "solar_mw": 40085,
    "wind_mw": 39247,
    "data_quality": "approximate (rounded from CEA/MNRE year-end figures)"
  },
  {
    "fiscal_year": "FY2022",
    "coal_lignite_mw": 210000,
    "solar_mw": 53997,
    "wind_mw": 40358,
    "data_quality": "approximate (rounded from CEA/MNRE year-end figures)"
  },
  {
    "fiscal_year": "FY2023",
    "coal_lignite_mw": 211855,
    "solar_mw": 66780,
    "wind_mw": 42633,
    "data_quality": "approximate (rounded from CEA/MNRE year-end figures)"
  },
  {
    "fiscal_year": "FY2024",
    "coal_lignite_mw": 218000,
    "solar_mw": 82630,
    "wind_mw": 46429,
    "data_quality": "approximate (rounded from CEA/MNRE year-end figures)"
  },
  {
    "fiscal_year": "FY2025",
    "coal_lignite_mw": 217000,
    "solar_mw": 105646,
    "wind_mw": 50038,
    "data_quality": "approximate (rounded from CEA/MNRE year-end figures)"
  }
];
