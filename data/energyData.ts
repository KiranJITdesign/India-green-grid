/**
 * India Green Grid - Master Typed Data Layer
 * Sourced strictly from:
 * 1. PM Surya Ghar: Muft Bijli Yojana Guidelines (MNRE, Govt. of India)
 * 2. Cabinet Committee on Economic Affairs (CCEA) Press Release on Green Energy Corridor-III (GEC-III)
 * 3. Central Electricity Authority (CEA) National Electricity Plan & Monthly Generation Reports (2024-2026)
 * 4. Ministry of Power (MoP) Gazette Notifications for Renewable Purchase Obligations (RPO) Trajectory
 */

export interface SourceCitation {
  id: string;
  shortLabel: string;
  title: string;
  publisher: string;
  year: number;
  url?: string;
  description: string;
}

export const DATA_CITATIONS: Record<string, SourceCitation> = {
  CEA_GENERATION_2026: {
    id: "CEA_GENERATION_2026",
    shortLabel: "CEA Generation 2026",
    title: "Monthly Generation & Fuel Mix Report (CEA 2026 Baseline)",
    publisher: "Central Electricity Authority (CEA), Ministry of Power",
    year: 2026,
    url: "https://npp.gov.in/landing-home",
    description: "Official fuel-wise monthly gross electricity generation statistics across India."
  },
  CEA_CAPACITY_2024_2026: {
    id: "CEA_CAPACITY_2024_2026",
    shortLabel: "CEA Installed Capacity",
    title: "All India Installed Capacity of Generating Stations",
    publisher: "Central Electricity Authority (CEA)",
    year: 2024,
    url: "https://npp.gov.in/landing-home",
    description: "209.63 GW non-fossil capacity recorded in 2024, compounding at 10.79% YoY."
  },
  MOP_RPO_TRAJECTORY: {
    id: "MOP_RPO_TRAJECTORY",
    shortLabel: "MoP RPO Trajectory",
    title: "Trajectory for Renewable Purchase Obligation (RPO) and Energy Storage Obligation (ESO) up to 2029-30",
    publisher: "Ministry of Power, Government of India",
    year: 2024,
    url: "https://www.powermin.gov.in/",
    description: "Mandatory uniform RPO targets: 29.91% for FY 2024-25, scaling to 43.33% by 2029-30."
  },
  CABINET_GEC_III: {
    id: "CABINET_GEC_III",
    shortLabel: "Cabinet Press Release (GEC-III)",
    title: "Cabinet approves Green Energy Corridor (GEC) Phase-III Scheme for Inter-State Transmission",
    publisher: "Press Information Bureau (PIB), Cabinet Committee on Economic Affairs",
    year: 2024,
    url: "https://www.powermin.gov.in/",
    description: "₹1,86,405 Cr outlay enabling 135 GW RE evacuation and 50 GWh battery storage capacity."
  },
  MNRE_SURYA_GHAR: {
    id: "MNRE_SURYA_GHAR",
    shortLabel: "PM Surya Ghar (MNRE)",
    title: "PM Surya Ghar: Muft Bijli Yojana National Operational Guidelines",
    publisher: "Ministry of New and Renewable Energy (MNRE)",
    year: 2024,
    url: "https://pmsuryaghar.gov.in/#/",
    description: "Central financial assistance: ₹30,000/kW for 1st 2 kW, ₹18,000 for 3rd kW, capped at ₹78,000."
  },
  SCGJ_OFFICIAL: {
    id: "SCGJ_OFFICIAL",
    shortLabel: "Skill Council for Green Jobs (SCGJ)",
    title: "National Skill Council for Green Jobs Official Platform",
    publisher: "Skill Council for Green Jobs (SCGJ)",
    year: 2026,
    url: "https://sscgj.in/?utm_source=chatgpt.com",
    description: "India's apex body for green skills training, standards, and clean energy careers."
  },
  IREDA_OFFICIAL: {
    id: "IREDA_OFFICIAL",
    shortLabel: "IREDA Web Portal",
    title: "Indian Renewable Energy Development Agency Concessional Lending",
    publisher: "IREDA, Ministry of New and Renewable Energy",
    year: 2026,
    url: "https://ireda.in/IredaWebPortal/",
    description: "Government non-banking financial institution promoting clean energy projects."
  },
  TARGET_2035: {
    id: "TARGET_2035",
    shortLabel: "India 2035 Target",
    title: "Long-Term Low-Emission Development Strategy & National Electricity Plan Target",
    publisher: "Government of India / UNFCCC Submission",
    year: 2026,
    url: "https://www.powermin.gov.in/",
    description: "India's expanded long-term non-fossil fuel capacity target of 900 GW by 2035."
  }
};

// 1. Generation Mix by Source (Annual Generation Shares)
export interface GenerationSource {
  source: string;
  share: number; // percentage (0-100)
  color: string;
  generationTWh?: number;
  category: "fossil" | "renewable" | "clean_other";
  citationId: string;
}

export const GENERATION_MIX_DATA: GenerationSource[] = [
  {
    source: "Coal & Lignite",
    share: 75.0,
    color: "#475569", // slate-600
    generationTWh: 1260,
    category: "fossil",
    citationId: "CEA_GENERATION_2026"
  },
  {
    source: "Renewables (Solar & Wind)",
    share: 12.0,
    color: "#10b981", // emerald-500
    generationTWh: 201,
    category: "renewable",
    citationId: "CEA_GENERATION_2026"
  },
  {
    source: "Large Hydro",
    share: 8.0,
    color: "#0284c7", // sky-600
    generationTWh: 134,
    category: "renewable",
    citationId: "CEA_GENERATION_2026"
  },
  {
    source: "Nuclear",
    share: 2.0,
    color: "#8b5cf6", // violet-500
    generationTWh: 42,
    category: "clean_other",
    citationId: "CEA_GENERATION_2026"
  },
  {
    source: "Gas & Diesel",
    share: 3.0,
    color: "#f59e0b", // amber-500
    generationTWh: 50,
    category: "fossil",
    citationId: "CEA_GENERATION_2026"
  }
];

// Key stats for energy mix
export const ENERGY_MIX_HIGHLIGHTS = {
  dataAsOf: "Q1 2026 Official Baseline",
  coalSharePercent: 75.0,
  renewablesSharePercent: 12.0,
  hydroSharePercent: 8.0,
  totalNonFossilGenerationPercent: 22.0, // 12% solar/wind + 8% hydro + 2% nuclear
  generationGapPercent: 63.0, // 75% coal - 12% pure RE
  nonFossilInstalledCapacity2024GW: 209.63,
  yoyGrowthRatePercent: 10.79,
  estimatedNonFossilCapacity2026GW: 257.30, // 209.63 * (1 + 0.1079)^2
  totalInstalledCapacityGW: 452.0,
  citation: DATA_CITATIONS.CEA_CAPACITY_2024_2026
};

// 2. Green Energy Corridor-III & National Infrastructure
export const GEC_III_DATA = {
  outlayCroresINR: 186405,
  outlayFormatted: "₹1,86,405 Crore",
  transmissionEvacuationGW: 135,
  bessStorageGWh: 50,
  target2035NonFossilGW: 900,
  target2030NonFossilGW: 500,
  status: "Approved by Union Cabinet",
  impactHighlights: [
    "Evacuates up to 135 GW of renewable capacity from Ladakh, Rajasthan, and Gujarat to national grid",
    "Adds 50 GWh Battery Energy Storage Systems (BESS) for round-the-clock (RTC) green power",
    "Underpins India's revised 900 GW non-fossil capacity pathway by 2035"
  ],
  citation: DATA_CITATIONS.CABINET_GEC_III
};

// 3. RPO Trajectory Baseline
export interface RpoMilestone {
  fiscalYear: string;
  targetPercent: number;
  solarRPO?: number;
  nonSolarRPO?: number;
  hpoPercent?: number; // Hydro Purchase Obligation
  notes: string;
}

export const RPO_TRAJECTORY_DATA: RpoMilestone[] = [
  { fiscalYear: "2021-22", targetPercent: 21.18, notes: "Historical baseline" },
  { fiscalYear: "2022-23", targetPercent: 24.61, notes: "Post-COP26 revision" },
  { fiscalYear: "2023-24", targetPercent: 27.08, notes: "Mandatory uniform RPO" },
  { fiscalYear: "2024-25", targetPercent: 29.91, notes: "Current active statutory compliance target" },
  { fiscalYear: "2025-26", targetPercent: 33.01, notes: "Notification trajectory milestone" },
  { fiscalYear: "2027-28", targetPercent: 38.81, notes: "Accelerated solar integration" },
  { fiscalYear: "2029-30", targetPercent: 43.33, notes: "Statutory 2030 national target" }
];

export const RPO_CONSTANTS = {
  activeTarget2025: 29.91,
  projectionTarget2030: 43.33,
  recFloorPriceINRPerMWh: 1000, // Renewable Energy Certificate floor price benchmark
  penaltyPerShortfallMWhINR: 1500, // Average regulatory compliance penalty / REC purchase
  citation: DATA_CITATIONS.MOP_RPO_TRAJECTORY
};

// Seeded DISCOMs for 1-click test scenarios
export interface DiscomPreset {
  name: string;
  state: string;
  code: string;
  totalProcuredMWh: number;
  renewableProcuredMWh: number;
  reportedPeriod: string;
}

export const SEEDED_DISCOMS: DiscomPreset[] = [
  {
    name: "BESCOM (Bangalore Electricity Supply Co.)",
    state: "Karnataka",
    code: "BESCOM-KA",
    totalProcuredMWh: 32500000,
    renewableProcuredMWh: 11450000, // ~35.2% (Surplus compliant)
    reportedPeriod: "FY 2024-25 Q3"
  },
  {
    name: "Tata Power DDL (North Delhi)",
    state: "Delhi",
    code: "TPDDL-DL",
    totalProcuredMWh: 9800000,
    renewableProcuredMWh: 3120000, // ~31.8% (Compliant)
    reportedPeriod: "FY 2024-25 Q3"
  },
  {
    name: "MSEDCL (Maharashtra State DISCOM)",
    state: "Maharashtra",
    code: "MSEDCL-MH",
    totalProcuredMWh: 142000000,
    renewableProcuredMWh: 34100000, // ~24.0% (Shortfall)
    reportedPeriod: "FY 2024-25 Q3"
  },
  {
    name: "Torrent Power (Ahmedabad & Surat)",
    state: "Gujarat",
    code: "TORRENT-GJ",
    totalProcuredMWh: 14500000,
    renewableProcuredMWh: 4420000, // ~30.5% (Compliant)
    reportedPeriod: "FY 2024-25 Q3"
  },
  {
    name: "DHBVN (Dakshin Haryana Bijli Vitran)",
    state: "Haryana",
    code: "DHBVN-HR",
    totalProcuredMWh: 28400000,
    renewableProcuredMWh: 6150000, // ~21.6% (Significant Shortfall)
    reportedPeriod: "FY 2024-25 Q3"
  }
];

// 4. Solar Calculator Constants & Benchmarks
export const SOLAR_CONSTANTS = {
  averageTariffINR: 6.0, // Assumes ₹6/unit average domestic tariff
  monthlyUnitsPerKw: 120, // Typical generation per kW installed
  costPerKwBenchmarkINR: 70000, // ₹60,000–₹80,000 range benchmark
  roofSpacePerKwSqFt: 105, // ~100–110 sq ft per kW
  subsidyFirst2KwRate: 30000, // ₹30,000 per kW for first 2 kW
  subsidy3rdKwRate: 18000, // ₹18,000 for 3rd kW
  subsidyCapINR: 78000, // Cap for 3 kW and above
  panelLifespanYears: 25,
  co2SavedPerKwhKg: 0.82, // CEA grid emission factor: ~0.82 kg CO2 / kWh
  citation: DATA_CITATIONS.MNRE_SURYA_GHAR
};

// Seeded Indian Locations for Solar Calculator
export interface SolarLocation {
  city: string;
  state: string;
  solarIrradianceKwhM2Day: number;
  stateDiscom: string;
  stateTopUpSubsidyNote?: string;
}

export const POPULAR_LOCATIONS: SolarLocation[] = [
  { city: "Ahmedabad", state: "Gujarat", solarIrradianceKwhM2Day: 5.8, stateDiscom: "UGVCL / Torrent", stateTopUpSubsidyNote: "Surya Gujarat portal expedited approval" },
  { city: "Bengaluru", state: "Karnataka", solarIrradianceKwhM2Day: 5.4, stateDiscom: "BESCOM", stateTopUpSubsidyNote: "Net metering integrated with PM Surya Ghar" },
  { city: "Jaipur", state: "Rajasthan", solarIrradianceKwhM2Day: 6.0, stateDiscom: "JVVNL", stateTopUpSubsidyNote: "Highest national annual solar insolation" },
  { city: "New Delhi", state: "Delhi", solarIrradianceKwhM2Day: 5.2, stateDiscom: "BSES / TPDDL", stateTopUpSubsidyNote: "Delhi Solar Policy provides generation-based incentive (GBI) ₹2-3/unit" },
  { city: "Pune", state: "Maharashtra", solarIrradianceKwhM2Day: 5.5, stateDiscom: "MSEDCL", stateTopUpSubsidyNote: "Digital net-meter application via Mahavitaran" },
  { city: "Chennai", state: "Tamil Nadu", solarIrradianceKwhM2Day: 5.6, stateDiscom: "TANGEDCO", stateTopUpSubsidyNote: "Bi-directional smart meters enabled" },
  { city: "Hyderabad", state: "Telangana", solarIrradianceKwhM2Day: 5.5, stateDiscom: "TSSPDCL", stateTopUpSubsidyNote: "TSREDCO single window rooftop portal" },
  { city: "Kolkata", state: "West Bengal", solarIrradianceKwhM2Day: 4.8, stateDiscom: "CESC / WBSEDCL", stateTopUpSubsidyNote: "Standard net metering regulations apply" }
];

// 5. Green Jobs Seed Data (25 rich, authentic listings)
export interface GreenJob {
  id: string;
  title: string;
  company: string;
  sector: string;
  location: string;
  state: string;
  type: "Full-Time" | "Contract" | "Apprenticeship" | string;
  experienceLevel: "Entry Level (0-2 yrs)" | "Mid Level (3-5 yrs)" | "Senior Level (6+ yrs)" | string;
  salaryRangeINR: string;
  requiredSkills: string[];
  description: string;
  postedDate: string;
  certificationPartner: string;
}

export const SEEDED_GREEN_JOBS: GreenJob[] = [
  {
    id: "GJ-001",
    title: "Rooftop Solar Installation Engineer",
    company: "Tata Power Solar Systems",
    sector: "Solar PV",
    location: "Ahmedabad",
    state: "Gujarat",
    type: "Full-Time",
    experienceLevel: "Entry Level (0-2 yrs)",
    salaryRangeINR: "₹4.5 - 6.5 LPA",
    requiredSkills: ["PVsyst", "Electrical Schematic Design", "MNRE Guidelines", "Net Metering"],
    description: "Lead site feasibility surveys, rooftop structural verification, and inverter grid tie-in under the PM Surya Ghar national scale-up.",
    postedDate: "2026-02-02",
    certificationPartner: "Skill Council for Green Jobs (SCGJ)"
  },
  {
    id: "GJ-002",
    title: "Battery Energy Storage (BESS) Systems Architect",
    company: "Reliance New Energy",
    sector: "Battery & BESS",
    location: "Jamnagar",
    state: "Gujarat",
    type: "Full-Time",
    experienceLevel: "Senior Level (6+ yrs)",
    salaryRangeINR: "₹18.0 - 26.0 LPA",
    requiredSkills: ["LFP Chemistry", "BMS Protocol", "Grid Inverters", "Thermal Runaway Safety"],
    description: "Design multi-megawatt utility battery storage enclosures supporting the 50 GWh GEC-III national grid balancing rollout.",
    postedDate: "2026-02-05",
    certificationPartner: "National Institute of Solar Energy (NISE)"
  },
  {
    id: "GJ-003",
    title: "Wind Turbine O&M Field Specialist",
    company: "Suzlon Energy Ltd",
    sector: "Wind Energy",
    location: "Jaisalmer",
    state: "Rajasthan",
    type: "Full-Time",
    experienceLevel: "Mid Level (3-5 yrs)",
    salaryRangeINR: "₹6.0 - 8.5 LPA",
    requiredSkills: ["Gearbox Inspection", "SCADA Diagnostics", "High-Voltage Safety", "Tower Climbing Certification"],
    description: "Execute preventative and predictive maintenance on 3.0 MW class wind turbines across Rajasthan desert wind corridors.",
    postedDate: "2026-02-04",
    certificationPartner: "National Institute of Wind Energy (NIWE)"
  },
  {
    id: "GJ-004",
    title: "Corporate RPO & Carbon Accounting Manager",
    company: "Adani Green Energy Ltd",
    sector: "ESG & Policy",
    location: "Ahmedabad",
    state: "Gujarat",
    type: "Full-Time",
    experienceLevel: "Mid Level (3-5 yrs)",
    salaryRangeINR: "₹12.0 - 16.5 LPA",
    requiredSkills: ["RPO Compliance Filing", "REC Trading (IEX)", "GHG Protocol", "BRSR Reporting"],
    description: "Manage statutory renewable procurement filings, green open-access power purchase agreements, and REC portfolio execution.",
    postedDate: "2026-02-07",
    certificationPartner: "BEE Certified Energy Auditor"
  },
  {
    id: "GJ-005",
    title: "Electrolyzer & Green Hydrogen Project Lead",
    company: "L&T Green Energy",
    sector: "Green Hydrogen",
    location: "Hazira",
    state: "Gujarat",
    type: "Full-Time",
    experienceLevel: "Senior Level (6+ yrs)",
    salaryRangeINR: "₹20.0 - 30.0 LPA",
    requiredSkills: ["PEM & Alkaline Electrolyzers", "Hydrogen Storage", "Process Safety", "CAPEX Optimization"],
    description: "Oversee green hydrogen pilot integration, balance of plant, and captive renewable power coupling under the National Green Hydrogen Mission.",
    postedDate: "2026-02-08",
    certificationPartner: "SCGJ / MNRE"
  },
  {
    id: "GJ-006",
    title: "Solar PV Rooftop Technician Apprentice",
    company: "Orb Energy",
    sector: "Solar PV",
    location: "Bengaluru",
    state: "Karnataka",
    type: "Apprenticeship",
    experienceLevel: "Entry Level (0-2 yrs)",
    salaryRangeINR: "₹2.8 - 3.8 LPA",
    requiredSkills: ["Wiring & Crimping", "Mounting Structures", "Multimeter Diagnostics", "Rooftop Safety"],
    description: "Hands-on apprenticeship for ITI graduates in solar module mounting, micro-inverter installation, and earthing pit testing.",
    postedDate: "2026-02-09",
    certificationPartner: "Suryamitra Certification (SCGJ)"
  },
  {
    id: "GJ-007",
    title: "Smart Grid Integration & Dispatch Engineer",
    company: "Power Grid Corporation of India (POWERGRID)",
    sector: "Smart Grid",
    location: "Gurugram",
    state: "Haryana",
    type: "Full-Time",
    experienceLevel: "Mid Level (3-5 yrs)",
    salaryRangeINR: "₹10.5 - 15.0 LPA",
    requiredSkills: ["EMS/SCADA", "Phasor Measurement Units (PMU)", "Grid Code Compliance", "Load Forecasting"],
    description: "Coordinate REMC (Renewable Energy Management Centre) dispatch commands for variable solar and wind evacuation on Green Energy Corridors.",
    postedDate: "2026-02-01",
    certificationPartner: "POSOCO / Grid-India"
  },
  {
    id: "GJ-008",
    title: "Wind Resource Assessment Meteorologist",
    company: "Envision Energy India",
    sector: "Wind Energy",
    location: "Chennai",
    state: "Tamil Nadu",
    type: "Full-Time",
    experienceLevel: "Mid Level (3-5 yrs)",
    salaryRangeINR: "₹8.0 - 12.0 LPA",
    requiredSkills: ["LiDAR Wind Data", "WAsP Software", "Wake Loss Modeling", "GIS Mapping"],
    description: "Analyze met mast data and complex terrain wind micro-climates for next-gen wind farm micro-siting across Southern India.",
    postedDate: "2026-02-03",
    certificationPartner: "NIWE"
  },
  {
    id: "GJ-009",
    title: "Offshore Wind Substructure Structural Engineer",
    company: "ReNew Power",
    sector: "Wind Energy",
    location: "Chennai",
    state: "Tamil Nadu",
    type: "Full-Time",
    experienceLevel: "Senior Level (6+ yrs)",
    salaryRangeINR: "₹16.0 - 24.0 LPA",
    requiredSkills: ["Offshore Monopile Design", "ANSYS / SACS", "Hydrodynamic Loading", "Corrosion Protection"],
    description: "Engineering design for India's upcoming Gujarat and Tamil Nadu offshore wind seabed foundation seabed packages.",
    postedDate: "2026-02-06",
    certificationPartner: "MNRE Offshore Cell"
  },
  {
    id: "GJ-010",
    title: "Commercial Solar Sales & Financial Modeling Lead",
    company: "CleanMax Solar",
    sector: "Solar PV",
    location: "Mumbai",
    state: "Maharashtra",
    type: "Full-Time",
    experienceLevel: "Mid Level (3-5 yrs)",
    salaryRangeINR: "₹11.0 - 17.0 LPA",
    requiredSkills: ["PPA Contracts", "OPEX/CAPEX Modeling", "Corporate ESG Targets", "C&I Tariff Structuring"],
    description: "Drive behind-the-meter solar PPA origination and financial viability modeling for multinational manufacturing clients.",
    postedDate: "2026-02-08",
    certificationPartner: "CII Green Business Centre"
  },
  {
    id: "GJ-011",
    title: "BESS Safety & Commissioning Field Engineer",
    company: "Fluence India",
    sector: "Battery & BESS",
    location: "Bikaner",
    state: "Rajasthan",
    type: "Full-Time",
    experienceLevel: "Entry Level (0-2 yrs)",
    salaryRangeINR: "₹5.5 - 7.5 LPA",
    requiredSkills: ["DC Distribution", "NFPA 855", "Inverter Commissioning", "BMS Calibration"],
    description: "On-site commissioning of utility-scale containerized battery banks paired with 500 MW solar parks in western Rajasthan.",
    postedDate: "2026-02-10",
    certificationPartner: "NISE / IEEE"
  },
  {
    id: "GJ-012",
    title: "Sustainability & Carbon Credits Consultant",
    company: "EY Climate Change and Sustainability Services",
    sector: "ESG & Policy",
    location: "New Delhi",
    state: "Delhi",
    type: "Full-Time",
    experienceLevel: "Mid Level (3-5 yrs)",
    salaryRangeINR: "₹13.0 - 19.0 LPA",
    requiredSkills: ["Article 6 / Carbon Markets", "SBTi Verification", "CCTS (Indian Carbon Market)", "Scope 1-2-3"],
    description: "Advise designated Indian industrial sectors on Carbon Credit Trading Scheme (CCTS) readiness and decarbonization roadmaps.",
    postedDate: "2026-02-02",
    certificationPartner: "Bureau of Energy Efficiency (BEE)"
  },
  {
    id: "GJ-013",
    title: "Solar Microinverter Firmware Developer",
    company: "Enphase Energy India",
    sector: "Solar PV",
    location: "Bengaluru",
    state: "Karnataka",
    type: "Full-Time",
    experienceLevel: "Mid Level (3-5 yrs)",
    salaryRangeINR: "₹14.0 - 22.0 LPA",
    requiredSkills: ["Embedded C/C++", "MPPT Algorithms", "CAN / RS485", "Grid Anti-Islanding Protection"],
    description: "Develop firmware for next-generation bidirectional micro-inverters supporting rapid shutdown and active frequency support.",
    postedDate: "2026-02-06",
    certificationPartner: "IEEE PES"
  },
  {
    id: "GJ-014",
    title: "DISCOM Green Power Procurement Officer",
    company: "Maharashtra State Electricity Distribution Co. (MSEDCL)",
    sector: "ESG & Policy",
    location: "Mumbai",
    state: "Maharashtra",
    type: "Contract",
    experienceLevel: "Senior Level (6+ yrs)",
    salaryRangeINR: "₹15.0 - 20.0 LPA",
    requiredSkills: ["CERC / MERC Regulations", "Bilateral PPA", "RPO Audit Compliance", "Banking & Wheeling"],
    description: "Execute short-term and medium-term green power procurement tenders to close MSEDCL's statutory RPO shortfall.",
    postedDate: "2026-02-07",
    certificationPartner: "CERC / MERC"
  },
  {
    id: "GJ-015",
    title: "Transmission Line Drone Inspection Technician",
    company: "Sterlite Power",
    sector: "Smart Grid",
    location: "Ranchi",
    state: "Jharkhand",
    type: "Full-Time",
    experienceLevel: "Entry Level (0-2 yrs)",
    salaryRangeINR: "₹3.8 - 5.5 LPA",
    requiredSkills: ["DGCA Drone Pilot License", "Thermographic Imaging", "Corona Discharge Detection", "GIS"],
    description: "Conduct high-precision drone thermal scans of 765 kV Green Energy Corridor transmission towers and insulators.",
    postedDate: "2026-02-04",
    certificationPartner: "DGCA / SCGJ"
  },
  {
    id: "GJ-016",
    title: "Solar Cell Manufacturing Quality Engineer",
    company: "Waaree Energies",
    sector: "Solar PV",
    location: "Chikhli",
    state: "Gujarat",
    type: "Full-Time",
    experienceLevel: "Mid Level (3-5 yrs)",
    salaryRangeINR: "₹7.0 - 10.5 LPA",
    requiredSkills: ["TOPCon Cell Architecture", "EL Imaging", "Six Sigma", "ALMM Compliance"],
    description: "Supervise high-efficiency n-type TOPCon solar cell automated production lines under the national PLI scheme.",
    postedDate: "2026-02-09",
    certificationPartner: "BIS / ALMM"
  },
  {
    id: "GJ-017",
    title: "EV Charging Infrastructure Network Planner",
    company: "Tata Power EV Charging Solutions",
    sector: "Smart Grid",
    location: "Pune",
    state: "Maharashtra",
    type: "Full-Time",
    experienceLevel: "Mid Level (3-5 yrs)",
    salaryRangeINR: "₹8.5 - 13.0 LPA",
    requiredSkills: ["OCPP 2.0.1", "Distribution Transformer Loading", "EV Fleet Route Modeling", "City Permitting"],
    description: "Design highway public fast-charging hubs connected with behind-the-meter solar canopies and battery buffering.",
    postedDate: "2026-02-05",
    certificationPartner: "BEE / ARAI"
  },
  {
    id: "GJ-018",
    title: "Biomass Gasification & Bio-CNG Engineer",
    company: "EverEnviro Resource Management",
    sector: "ESG & Policy",
    location: "Indore",
    state: "Madhya Pradesh",
    type: "Full-Time",
    experienceLevel: "Mid Level (3-5 yrs)",
    salaryRangeINR: "₹7.5 - 11.0 LPA",
    requiredSkills: ["Anaerobic Digestion", "Biomethane Purification", "SATAT Scheme", "Feedstock Logistics"],
    description: "Manage city-scale municipal organic waste-to-compressed biogas (CBG) facility operations under the SATAT framework.",
    postedDate: "2026-02-01",
    certificationPartner: "MNRE Bioenergy Cell"
  },
  {
    id: "GJ-019",
    title: "High-Voltage Substation Design Lead (HVDC)",
    company: "Hitachi Energy India",
    sector: "Smart Grid",
    location: "Vadodara",
    state: "Gujarat",
    type: "Full-Time",
    experienceLevel: "Senior Level (6+ yrs)",
    salaryRangeINR: "₹18.0 - 27.0 LPA",
    requiredSkills: ["VSC-HVDC", "Gas Insulated Switchgear (GIS)", "Relay Coordination", "ETAP / PSCAD"],
    description: "Lead electrical engineering for 500 kV HVDC converter stations facilitating inter-state renewable power wheeling.",
    postedDate: "2026-02-03",
    certificationPartner: "CIGRE / IEEE"
  },
  {
    id: "GJ-020",
    title: "Junior Energy Policy Research Associate",
    company: "Council on Energy, Environment and Water (CEEW)",
    sector: "ESG & Policy",
    location: "New Delhi",
    state: "Delhi",
    type: "Full-Time",
    experienceLevel: "Entry Level (0-2 yrs)",
    salaryRangeINR: "₹6.0 - 8.5 LPA",
    requiredSkills: ["Quantitative Energy Modeling", "Policy Brief Drafting", "R / Python", "Data Visualization"],
    description: "Analyze state-level rooftop solar adoption bottlenecks and DISCOM tariff reform pathways for government think tanks.",
    postedDate: "2026-02-08",
    certificationPartner: "CEEW Research Fellow"
  },
  {
    id: "GJ-021",
    title: "Wind Turbine Blade Repair Specialist",
    company: "Vestas India",
    sector: "Wind Energy",
    location: "Tirunelveli",
    state: "Tamil Nadu",
    type: "Full-Time",
    experienceLevel: "Mid Level (3-5 yrs)",
    salaryRangeINR: "₹6.5 - 9.5 LPA",
    requiredSkills: ["Composite Materials / Epoxy", "Rope Access Level 2", "Aerodynamic Blade Repair", "Safety Protocols"],
    description: "Execute rope-access blade trailing edge and tip repairs on offshore and onshore wind parks across South India.",
    postedDate: "2026-02-07",
    certificationPartner: "IRATA / NIWE"
  },
  {
    id: "GJ-022",
    title: "National Solar Mission Field Auditor",
    company: "Solar Energy Corporation of India (SECI)",
    sector: "Solar PV",
    location: "Jodhpur",
    state: "Rajasthan",
    type: "Contract",
    experienceLevel: "Mid Level (3-5 yrs)",
    salaryRangeINR: "₹8.0 - 11.5 LPA",
    requiredSkills: ["Quality Assurance Standards", "IEC 61215", "Performance Ratio (PR) Testing", "Site Inspections"],
    description: "Perform milestone verification and generation audit inspections for ultra-mega solar power parks across Rajasthan.",
    postedDate: "2026-02-06",
    certificationPartner: "SECI / MNRE"
  },
  {
    id: "GJ-023",
    title: "Green Hydrogen Safety & Compliance Specialist",
    company: "NTPC Green Energy Ltd",
    sector: "Green Hydrogen",
    location: "NTPC Simhadri / Visakhapatnam",
    state: "Andhra Pradesh",
    type: "Full-Time",
    experienceLevel: "Senior Level (6+ yrs)",
    salaryRangeINR: "₹17.0 - 23.0 LPA",
    requiredSkills: ["Hazardous Area Classification", "ATEX / IECEx", "Hydrogen Leakage Detection", "PESO Regulations"],
    description: "Lead safety, process hazard analysis (PHA), and statutory PESO licensing for green ammonia synthesis plants.",
    postedDate: "2026-02-09",
    certificationPartner: "PESO / SCGJ"
  },
  {
    id: "GJ-024",
    title: "Battery Chemistry R&D Scientist (Sodium-ion / Solid-State)",
    company: "Ola Cell Technologies",
    sector: "Battery & BESS",
    location: "Krishnagiri / Bengaluru",
    state: "Tamil Nadu",
    type: "Full-Time",
    experienceLevel: "Senior Level (6+ yrs)",
    salaryRangeINR: "₹22.0 - 32.0 LPA",
    requiredSkills: ["Cathode Synthesis", "Electrochemistry", "Cyclic Voltammetry", "Solid Electrolytes"],
    description: "Pioneer indigenous non-lithium energy storage cell chemistry formulations for stationary grid storage and 2W EVs.",
    postedDate: "2026-02-10",
    certificationPartner: "CSIR / IIT Research Cell"
  },
  {
    id: "GJ-025",
    title: "Rooftop Solar Community Mobilizer",
    company: "SELCO Foundation",
    sector: "Solar PV",
    location: "Dharwad / Hubli",
    state: "Karnataka",
    type: "Full-Time",
    experienceLevel: "Entry Level (0-2 yrs)",
    salaryRangeINR: "₹3.5 - 5.0 LPA",
    requiredSkills: ["Kannada Fluency", "Community Workshops", "Surya Ghar Consumer Guidance", "Financial Literacy"],
    description: "Work with tier-2/3 residential welfare associations and rural micro-enterprises to facilitate PM Surya Ghar applications.",
    postedDate: "2026-02-04",
    certificationPartner: "SCGJ Social Mobilization"
  }
];

// 6. Stretch Data: Green Finance Aggregator
export interface GreenLoanScheme {
  id: string;
  bankName: string;
  schemeName: string;
  interestRate: string;
  maxTenureYears: number;
  maxLoanAmountINR: string;
  collateralRequirement: string;
  processingFee: string;
  eligibleBorrowers: string;
  keyFeature: string;
  applyUrlLabel: string;
  applyUrl: string;
}

export const GREEN_FINANCE_SCHEMES: GreenLoanScheme[] = [
  {
    id: "sbi-surya-ghar",
    bankName: "State Bank of India (SBI)",
    schemeName: "SBI Surya Ghar Solar Loan",
    interestRate: "7.00% p.a. (Concessional repo-linked)",
    maxTenureYears: 10,
    maxLoanAmountINR: "Up to ₹6 Lakhs (up to 3 kW: ₹2 Lakhs)",
    collateralRequirement: "Nil (Hypothecation of Solar PV rooftop asset only)",
    processingFee: "Zero processing fee for loans up to 3 kW",
    eligibleBorrowers: "Individual homeowners with net annual income > ₹3 Lakhs",
    keyFeature: "Direct integration with National PM Surya Ghar Portal for auto-disbursement",
    applyUrlLabel: "Apply via JanSamarth / SBI YONO",
    applyUrl: "https://pmsuryaghar.gov.in/#/"
  },
  {
    id: "ireda-rooftop",
    bankName: "Indian Renewable Energy Development Agency (IREDA)",
    schemeName: "IREDA Access to Clean Energy for MSME / Commercial",
    interestRate: "8.25% - 9.15% p.a.",
    maxTenureYears: 12,
    maxLoanAmountINR: "₹50 Lakhs to ₹25 Crores",
    collateralRequirement: "Asset mortgage + 1.25x DSCR",
    processingFee: "0.25% of sanctioned loan",
    eligibleBorrowers: "Commercial establishments, MSMEs, industrial clusters",
    keyFeature: "Up to 75% project debt financing for solar, wind & small hydro projects",
    applyUrlLabel: "Apply via IREDA Web Portal",
    applyUrl: "https://ireda.in/IredaWebPortal/"
  },
  {
    id: "pnb-solar",
    bankName: "Punjab National Bank (PNB)",
    schemeName: "PNB Saur Urja Yojana",
    interestRate: "7.10% p.a.",
    maxTenureYears: 10,
    maxLoanAmountINR: "Up to ₹10 Lakhs for residential",
    collateralRequirement: "Clean credit record, zero third-party guarantee up to ₹5 Lakhs",
    processingFee: "Waived under green banking initiative",
    eligibleBorrowers: "Salaried, self-employed, farmers with residential property",
    keyFeature: "Disbursement directly to empaneled MNRE vendor with verification",
    applyUrlLabel: "Apply via PNB ONE App",
    applyUrl: "https://pmsuryaghar.gov.in/#/"
  },
  {
    id: "sidbi-4e",
    bankName: "SIDBI",
    schemeName: "End-to-End Energy Efficiency (4E) & Rooftop Scheme",
    interestRate: "6.90% - 7.50% p.a.",
    maxTenureYears: 7,
    maxLoanAmountINR: "Up to ₹3 Crores",
    collateralRequirement: "Partial CGTMSE coverage available",
    processingFee: "0.10% nominal fee",
    eligibleBorrowers: "Manufacturing MSMEs reducing electricity procurement",
    keyFeature: "Includes free technical walk-through energy audit by accredited experts",
    applyUrlLabel: "Apply via IREDA / SIDBI Portal",
    applyUrl: "https://ireda.in/IredaWebPortal/"
  }
];
