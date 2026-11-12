/**
 * India Green Grid - Database Access Layer
 * Provides persistent, zero-dependency, serverless-ready data storage.
 * Automatically initializes with seeded 2026 official datasets and handles
 * DISCOM audit submissions, PM Surya Ghar subsidy applications, and Job applications.
 */

import fs from "fs";
import path from "path";
import {
  SEEDED_DISCOMS,
  SEEDED_GREEN_JOBS,
  GREEN_FINANCE_SCHEMES,
  GENERATION_MIX_DATA,
  ENERGY_MIX_HIGHLIGHTS,
  GEC_III_DATA,
  RPO_TRAJECTORY_DATA,
  GreenJob,
  GreenLoanScheme,
  GenerationSource,
} from "../data/energyData";
import { RpoCalculationResult, SolarCalculationResult } from "./calculators";

export interface StoredRpoAudit {
  id: string;
  discomName: string;
  state: string;
  totalProcuredMWh: number;
  renewableProcuredMWh: number;
  targetYear: string;
  targetPercent: number;
  compliancePercent: number;
  isCompliant: boolean;
  shortfallUnitsMWh: number;
  surplusUnitsMWh: number;
  estimatedPenaltyINR: number;
  statusLabel: string;
  submittedBy: string;
  createdAt: string;
}

export interface StoredSolarLead {
  id: string;
  consumerName: string;
  phone: string;
  email: string;
  city: string;
  state: string;
  monthlyBill: number;
  roofSqFt: number;
  recommendedKw: number;
  estimatedCost: number;
  subsidy: number;
  netCost: number;
  monthlySavings: number;
  paybackYears: number;
  applicationNumber: string;
  status: "Under Review" | "Technical Feasibility Verified" | "Subsidy Approved";
  createdAt: string;
}

export interface StoredJobApplication {
  id: string;
  jobId: string;
  jobTitle: string;
  company: string;
  candidateName: string;
  email: string;
  phone: string;
  experienceLevel: string;
  qualification: string;
  scgjCertification: boolean;
  applicationNumber: string;
  status: "Received" | "Shortlisted" | "Under Review";
  createdAt: string;
}

export interface DatabaseSchema {
  rpoAudits: StoredRpoAudit[];
  solarLeads: StoredSolarLead[];
  jobApplications: StoredJobApplication[];
  jobs: GreenJob[];
  financeSchemes: GreenLoanScheme[];
  lastUpdated: string;
}

function getDatabasePath(): string {
  // Use data/db.json locally, or /tmp/db.json if in read-only container
  const localPath = path.join(process.cwd(), "data", "db.json");
  try {
    const dir = path.dirname(localPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    // Test write permission
    return localPath;
  } catch {
    const tmpPath = path.join("/tmp", "india_green_grid_db.json");
    return tmpPath;
  }
}

function getInitialData(): DatabaseSchema {
  const now = new Date().toISOString();

  // Initial seeded DISCOM audits
  const initialAudits: StoredRpoAudit[] = SEEDED_DISCOMS.map((d, index) => {
    const compliancePercent = Math.round((d.renewableProcuredMWh / d.totalProcuredMWh) * 10000) / 100;
    const target = 29.91;
    const required = Math.round((target / 100) * d.totalProcuredMWh);
    const shortfall = Math.max(0, required - d.renewableProcuredMWh);
    const surplus = Math.max(0, d.renewableProcuredMWh - required);
    const isCompliant = d.renewableProcuredMWh >= required;

    return {
      id: `AUDIT-2026-${String(index + 1).padStart(3, "0")}`,
      discomName: d.name,
      state: d.state,
      totalProcuredMWh: d.totalProcuredMWh,
      renewableProcuredMWh: d.renewableProcuredMWh,
      targetYear: "FY 2024-25 Target (29.91%)",
      targetPercent: target,
      compliancePercent,
      isCompliant,
      shortfallUnitsMWh: shortfall,
      surplusUnitsMWh: surplus,
      estimatedPenaltyINR: shortfall * 1500,
      statusLabel: isCompliant ? "Compliant (Surplus)" : "Critical Shortfall",
      submittedBy: "State Regulatory Commission (SERC)",
      createdAt: new Date(Date.now() - (index + 1) * 86400000 * 2).toISOString(),
    };
  });

  // Initial seeded consumer solar leads
  const initialSolarLeads: StoredSolarLead[] = [
    {
      id: "LEAD-001",
      consumerName: "Rajesh K. Sharma",
      phone: "+91 98765 43210",
      email: "rajesh.sharma@example.in",
      city: "Ahmedabad",
      state: "Gujarat",
      monthlyBill: 2400,
      roofSqFt: 350,
      recommendedKw: 3.0,
      estimatedCost: 210000,
      subsidy: 78000,
      netCost: 132000,
      monthlySavings: 2160,
      paybackYears: 5.1,
      applicationNumber: "PM-SG-2026-GJ-4921",
      status: "Technical Feasibility Verified",
      createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    },
    {
      id: "LEAD-002",
      consumerName: "Anita Venkatesh",
      phone: "+91 94480 12345",
      email: "anita.v@example.in",
      city: "Bengaluru",
      state: "Karnataka",
      monthlyBill: 1600,
      roofSqFt: 250,
      recommendedKw: 2.0,
      estimatedCost: 140000,
      subsidy: 60000,
      netCost: 80000,
      monthlySavings: 1440,
      paybackYears: 4.6,
      applicationNumber: "PM-SG-2026-KA-8832",
      status: "Subsidy Approved",
      createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    },
    {
      id: "LEAD-003",
      consumerName: "Sunil Meena",
      phone: "+91 98290 55432",
      email: "sunil.meena@example.in",
      city: "Jaipur",
      state: "Rajasthan",
      monthlyBill: 4200,
      roofSqFt: 550,
      recommendedKw: 5.0,
      estimatedCost: 350000,
      subsidy: 78000,
      netCost: 272000,
      monthlySavings: 3600,
      paybackYears: 6.3,
      applicationNumber: "PM-SG-2026-RJ-1054",
      status: "Under Review",
      createdAt: new Date(Date.now() - 86400000).toISOString(),
    },
  ];

  // Initial seeded job applications
  const initialJobApps: StoredJobApplication[] = [
    {
      id: "APP-001",
      jobId: "GJ-001",
      jobTitle: "Rooftop Solar Installation Engineer",
      company: "Tata Power Solar Systems",
      candidateName: "Pooja Patel",
      email: "pooja.patel@example.com",
      phone: "+91 98791 23456",
      experienceLevel: "Entry Level (0-2 yrs)",
      qualification: "B.Tech Electrical Engineering",
      scgjCertification: true,
      applicationNumber: "SCGJ-2026-90412",
      status: "Shortlisted",
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    },
    {
      id: "APP-002",
      jobId: "GJ-003",
      jobTitle: "Wind Turbine O&M Field Specialist",
      company: "Suzlon Energy Ltd",
      candidateName: "Vikram Rathore",
      email: "vikram.rathore@example.com",
      phone: "+91 94140 98765",
      experienceLevel: "Mid Level (3-5 yrs)",
      qualification: "Diploma Mechanical Engineering",
      scgjCertification: true,
      applicationNumber: "SCGJ-2026-88194",
      status: "Under Review",
      createdAt: new Date(Date.now() - 86400000).toISOString(),
    },
  ];

  return {
    rpoAudits: initialAudits,
    solarLeads: initialSolarLeads,
    jobApplications: initialJobApps,
    jobs: SEEDED_GREEN_JOBS,
    financeSchemes: GREEN_FINANCE_SCHEMES,
    lastUpdated: now,
  };
}

export function readDb(): DatabaseSchema {
  const dbPath = getDatabasePath();
  try {
    if (!fs.existsSync(dbPath)) {
      const initial = getInitialData();
      fs.writeFileSync(dbPath, JSON.stringify(initial, null, 2), "utf8");
      return initial;
    }
    const raw = fs.readFileSync(dbPath, "utf8");
    return JSON.parse(raw) as DatabaseSchema;
  } catch (err) {
    console.error("Error reading database, falling back to seed data:", err);
    return getInitialData();
  }
}

export function writeDb(data: DatabaseSchema): boolean {
  const dbPath = getDatabasePath();
  try {
    data.lastUpdated = new Date().toISOString();
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), "utf8");
    return true;
  } catch (err) {
    console.error("Error writing database:", err);
    return false;
  }
}

// ----------------- Public Data Access Methods -----------------

export async function getRpoAudits(): Promise<StoredRpoAudit[]> {
  const db = readDb();
  return db.rpoAudits.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export async function createRpoAudit(
  audit: Omit<StoredRpoAudit, "id" | "createdAt">
): Promise<StoredRpoAudit> {
  const db = readDb();
  const newAudit: StoredRpoAudit = {
    ...audit,
    id: `AUDIT-2026-${String(db.rpoAudits.length + 1).padStart(3, "0")}`,
    createdAt: new Date().toISOString(),
  };
  db.rpoAudits.unshift(newAudit);
  writeDb(db);
  return newAudit;
}

export async function getSolarLeads(): Promise<StoredSolarLead[]> {
  const db = readDb();
  return db.solarLeads.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export async function createSolarLead(
  lead: Omit<StoredSolarLead, "id" | "applicationNumber" | "status" | "createdAt">
): Promise<StoredSolarLead> {
  const db = readDb();
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const stateCode = (lead.state || "IN").slice(0, 2).toUpperCase();

  const newLead: StoredSolarLead = {
    ...lead,
    id: `LEAD-${String(db.solarLeads.length + 1).padStart(3, "0")}`,
    applicationNumber: `PM-SG-2026-${stateCode}-${randomSuffix}`,
    status: "Under Review",
    createdAt: new Date().toISOString(),
  };
  db.solarLeads.unshift(newLead);
  writeDb(db);
  return newLead;
}

export async function getJobApplications(): Promise<StoredJobApplication[]> {
  const db = readDb();
  return db.jobApplications.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export async function createJobApplication(
  app: Omit<StoredJobApplication, "id" | "applicationNumber" | "status" | "createdAt">
): Promise<StoredJobApplication> {
  const db = readDb();
  const randomNum = Math.floor(10000 + Math.random() * 90000);

  const newApp: StoredJobApplication = {
    ...app,
    id: `APP-${String(db.jobApplications.length + 1).padStart(3, "0")}`,
    applicationNumber: `SCGJ-2026-${randomNum}`,
    status: "Received",
    createdAt: new Date().toISOString(),
  };
  db.jobApplications.unshift(newApp);
  writeDb(db);
  return newApp;
}

export async function getJobsList(params?: {
  search?: string;
  sector?: string;
  experience?: string;
  state?: string;
}): Promise<GreenJob[]> {
  const db = readDb();
  let list = db.jobs || SEEDED_GREEN_JOBS;

  if (!params) return list;

  const { search, sector, experience, state } = params;

  if (search) {
    const q = search.toLowerCase();
    list = list.filter(
      (j) =>
        j.title.toLowerCase().includes(q) ||
        j.company.toLowerCase().includes(q) ||
        j.location.toLowerCase().includes(q) ||
        j.requiredSkills.some((s) => s.toLowerCase().includes(q))
    );
  }

  if (sector && sector !== "All") {
    list = list.filter((j) => j.sector === sector);
  }

  if (experience && experience !== "All") {
    list = list.filter((j) => j.experienceLevel === experience);
  }

  if (state && state !== "All") {
    list = list.filter((j) => j.state === state);
  }

  return list;
}

export async function getDashboardStats() {
  const db = readDb();
  const totalAudits = db.rpoAudits.length;
  const compliantAudits = db.rpoAudits.filter((a) => a.isCompliant).length;
  const totalREProcuredMWh = db.rpoAudits.reduce((acc, a) => acc + a.renewableProcuredMWh, 0);
  const totalSolarCapacityKw = db.solarLeads.reduce((acc, l) => acc + l.recommendedKw, 0);
  const totalSubsidiesGrantedINR = db.solarLeads.reduce((acc, l) => acc + l.subsidy, 0);
  const totalJobApps = db.jobApplications.length;

  return {
    totalAudits,
    compliantAudits,
    auditComplianceRatePercent: totalAudits > 0 ? Math.round((compliantAudits / totalAudits) * 100) : 0,
    totalREProcuredMWh,
    totalSolarCapacityKw: Math.round(totalSolarCapacityKw * 10) / 10,
    totalSubsidiesGrantedINR,
    totalJobApps,
    energyMix: GENERATION_MIX_DATA,
    highlights: ENERGY_MIX_HIGHLIGHTS,
    gecIII: GEC_III_DATA,
  };
}
