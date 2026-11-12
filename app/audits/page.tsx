"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  StoredRpoAudit,
  StoredSolarLead,
  StoredJobApplication,
} from "@/lib/db";
import { SourceTooltip } from "@/components/SourceTooltip";
import {
  Database,
  Building2,
  SunMedium,
  Briefcase,
  CheckCircle2,
  Clock,
  RefreshCw,
  Search,
  Download,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";

export default function AuditsAndRecordsPage() {
  const [activeTab, setActiveTab] = useState<"rpo" | "solar" | "jobs">("rpo");
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [audits, setAudits] = useState<StoredRpoAudit[]>([]);
  const [solarLeads, setSolarLeads] = useState<StoredSolarLead[]>([]);
  const [jobApplications, setJobApplications] = useState<StoredJobApplication[]>([]);
  const [summary, setSummary] = useState<any>(null);

  const fetchRecords = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/submissions");
      const data = await res.json();
      if (data.success) {
        setAudits(data.audits || []);
        setSolarLeads(data.solarLeads || []);
        setJobApplications(data.jobApplications || []);
        setSummary(data.summary || null);
      }
    } catch (err) {
      console.error("Failed to load records from backend:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const downloadJson = () => {
    const payload = { audits, solarLeads, jobApplications, exportedAt: new Date().toISOString() };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `india-green-grid-records-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
              <Database className="w-3.5 h-3.5 text-emerald-400" />
              Live Backend Store
            </span>
            <span className="text-xs text-slate-400">
              Persistent Multi-Tenant Registry
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Statutory Audits & Application Registry
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Real-time server-side database storing DISCOM RPO compliance filings, PM Surya Ghar registrations, and Green Job applications.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          <button
            onClick={fetchRecords}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            <span>Sync Live DB</span>
          </button>
          <button
            onClick={downloadJson}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-slate-950 transition-colors shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Registry JSON</span>
          </button>
        </div>
      </div>

      {/* Summary Stats Cards */}
      {summary && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3.5">
            <span className="text-[10px] text-slate-400 block mb-0.5">DISCOM Audits Filed</span>
            <span className="text-2xl font-black text-white">{summary.totalAudits}</span>
            <span className="text-[10px] text-emerald-400 block mt-0.5">
              {summary.compliantAudits} Compliant ({summary.auditComplianceRatePercent}%)
            </span>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3.5">
            <span className="text-[10px] text-slate-400 block mb-0.5">RE Power Audited</span>
            <span className="text-2xl font-black text-emerald-400">
              {(summary.totalREProcuredMWh / 1000000).toFixed(1)}M
            </span>
            <span className="text-[10px] text-slate-400 block mt-0.5">MWh verified clean power</span>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3.5">
            <span className="text-[10px] text-slate-400 block mb-0.5">PM Surya Ghar Subsidy</span>
            <span className="text-2xl font-black text-cyan-400">
              ₹{(summary.totalSubsidiesGrantedINR / 100000).toFixed(1)}L
            </span>
            <span className="text-[10px] text-slate-400 block mt-0.5">
              Across {summary.totalSolarCapacityKw} kW residential capacity
            </span>
          </div>

          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3.5">
            <span className="text-[10px] text-slate-400 block mb-0.5">Job Applications</span>
            <span className="text-2xl font-black text-teal-400">{summary.totalJobApps}</span>
            <span className="text-[10px] text-slate-400 block mt-0.5">SCGJ accredited candidates</span>
          </div>
        </div>
      )}

      {/* Tabs & Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Tab Buttons */}
        <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveTab("rpo")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === "rpo"
                ? "bg-amber-600 text-slate-950 shadow-md"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>DISCOM RPO Audits ({audits.length})</span>
          </button>
          <button
            onClick={() => setActiveTab("solar")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === "solar"
                ? "bg-emerald-600 text-slate-950 shadow-md"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <SunMedium className="w-3.5 h-3.5" />
            <span>Solar Registrations ({solarLeads.length})</span>
          </button>
          <button
            onClick={() => setActiveTab("jobs")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === "jobs"
                ? "bg-teal-600 text-slate-950 shadow-md"
                : "text-slate-400 hover:text-white"
            }`}
          >
            <Briefcase className="w-3.5 h-3.5" />
            <span>Job Applications ({jobApplications.length})</span>
          </button>
        </div>

        {/* Filter Input */}
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search records..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      {/* Tab 1: DISCOM RPO Audits Table */}
      {activeTab === "rpo" && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-white text-base">
              DISCOM Renewable Procurement Statutory Filings
            </h2>
            <Link
              href="/rpo-tracker"
              className="text-xs text-amber-400 hover:text-amber-300 font-bold flex items-center gap-1"
            >
              <span>+ New Audit Filing</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 text-[11px] uppercase tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-3 px-3">Audit ID</th>
                  <th className="py-3 px-3">DISCOM / Entity</th>
                  <th className="py-3 px-3">Target</th>
                  <th className="py-3 px-3">Total Procured</th>
                  <th className="py-3 px-3">RE Procured</th>
                  <th className="py-3 px-3">Compliance %</th>
                  <th className="py-3 px-3">Shortfall / REC Cost</th>
                  <th className="py-3 px-3">Filed Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {audits
                  .filter(
                    (a) =>
                      search === "" ||
                      a.discomName.toLowerCase().includes(search.toLowerCase()) ||
                      a.state.toLowerCase().includes(search.toLowerCase()) ||
                      a.id.toLowerCase().includes(search.toLowerCase())
                  )
                  .map((a) => (
                    <tr key={a.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-3 font-mono font-bold text-slate-400">{a.id}</td>
                      <td className="py-3 px-3">
                        <span className="font-bold text-white block">{a.discomName}</span>
                        <span className="text-[10px] text-slate-500">{a.state} • {a.submittedBy}</span>
                      </td>
                      <td className="py-3 px-3 text-slate-300 font-medium">{a.targetPercent}%</td>
                      <td className="py-3 px-3 font-mono">{(a.totalProcuredMWh / 1000).toLocaleString()}k MWh</td>
                      <td className="py-3 px-3 font-mono text-emerald-400">
                        {(a.renewableProcuredMWh / 1000).toLocaleString()}k MWh
                      </td>
                      <td className="py-3 px-3">
                        <span
                          className={`font-bold px-2 py-0.5 rounded text-[11px] inline-block ${
                            a.isCompliant
                              ? "bg-emerald-950 text-emerald-300 border border-emerald-700/50"
                              : "bg-red-950 text-red-300 border border-red-700/50"
                          }`}
                        >
                          {a.compliancePercent}%
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        {a.isCompliant ? (
                          <span className="text-emerald-400 font-semibold">+{(a.surplusUnitsMWh / 1000).toFixed(1)}k MWh Surplus</span>
                        ) : (
                          <div>
                            <span className="text-red-400 font-bold block">
                              -{(a.shortfallUnitsMWh / 1000).toFixed(1)}k MWh Deficit
                            </span>
                            <span className="text-[10px] text-slate-500">
                              REC: ₹{(a.estimatedPenaltyINR / 100000).toFixed(1)} Lakhs
                            </span>
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-3 text-slate-500 text-[11px]">
                        {new Date(a.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: PM Surya Ghar Solar Registrations */}
      {activeTab === "solar" && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-white text-base">
              PM Surya Ghar Consumer Subsidy Registrations
            </h2>
            <Link
              href="/solar-calculator"
              className="text-xs text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1"
            >
              <span>+ Calculate & Register</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 text-[11px] uppercase tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-3 px-3">Application No</th>
                  <th className="py-3 px-3">Applicant Name</th>
                  <th className="py-3 px-3">Location</th>
                  <th className="py-3 px-3">Bill / Roof</th>
                  <th className="py-3 px-3">Recommended Size</th>
                  <th className="py-3 px-3">Govt Subsidy</th>
                  <th className="py-3 px-3">Net Out-of-Pocket</th>
                  <th className="py-3 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {solarLeads
                  .filter(
                    (l) =>
                      search === "" ||
                      l.consumerName.toLowerCase().includes(search.toLowerCase()) ||
                      l.applicationNumber.toLowerCase().includes(search.toLowerCase()) ||
                      l.city.toLowerCase().includes(search.toLowerCase())
                  )
                  .map((lead) => (
                    <tr key={lead.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-3 font-mono font-bold text-emerald-400">
                        {lead.applicationNumber}
                      </td>
                      <td className="py-3 px-3">
                        <span className="font-bold text-white block">{lead.consumerName}</span>
                        <span className="text-[10px] text-slate-500">{lead.phone}</span>
                      </td>
                      <td className="py-3 px-3">
                        <span>{lead.city}, {lead.state}</span>
                      </td>
                      <td className="py-3 px-3 text-slate-400">
                        <span>₹{lead.monthlyBill}/mo • {lead.roofSqFt} sq ft</span>
                      </td>
                      <td className="py-3 px-3 font-bold text-white">
                        {lead.recommendedKw} kW
                      </td>
                      <td className="py-3 px-3 font-bold text-emerald-400">
                        ₹{lead.subsidy.toLocaleString()}
                      </td>
                      <td className="py-3 px-3 font-semibold text-slate-200">
                        ₹{lead.netCost.toLocaleString()}
                      </td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800/50">
                          {lead.status}
                        </span>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Job Applications */}
      {activeTab === "jobs" && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-white text-base">
              Clean Energy Career Applications (SCGJ Aligned)
            </h2>
            <Link
              href="/jobs"
              className="text-xs text-teal-400 hover:text-teal-300 font-bold flex items-center gap-1"
            >
              <span>+ Explore Jobs</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 text-[11px] uppercase tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-3 px-3">Application Ref</th>
                  <th className="py-3 px-3">Candidate</th>
                  <th className="py-3 px-3">Target Role</th>
                  <th className="py-3 px-3">Company</th>
                  <th className="py-3 px-3">Experience</th>
                  <th className="py-3 px-3">SCGJ Certified</th>
                  <th className="py-3 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {jobApplications
                  .filter(
                    (j) =>
                      search === "" ||
                      j.candidateName.toLowerCase().includes(search.toLowerCase()) ||
                      j.jobTitle.toLowerCase().includes(search.toLowerCase()) ||
                      j.company.toLowerCase().includes(search.toLowerCase())
                  )
                  .map((app) => (
                    <tr key={app.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-3 font-mono font-bold text-teal-400">
                        {app.applicationNumber}
                      </td>
                      <td className="py-3 px-3">
                        <span className="font-bold text-white block">{app.candidateName}</span>
                        <span className="text-[10px] text-slate-500">{app.email} • {app.phone}</span>
                      </td>
                      <td className="py-3 px-3 font-medium text-slate-200">
                        {app.jobTitle}
                      </td>
                      <td className="py-3 px-3 text-slate-400">
                        {app.company}
                      </td>
                      <td className="py-3 px-3 text-slate-300">
                        {app.experienceLevel}
                      </td>
                      <td className="py-3 px-3">
                        {app.scgjCertification ? (
                          <span className="text-emerald-400 font-bold text-[11px]">Yes ✓</span>
                        ) : (
                          <span className="text-slate-500 text-[11px]">No</span>
                        )}
                      </td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-slate-200 border border-slate-700">
                          {app.status}
                        </span>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
