"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  StoredRpoAudit,
  StoredSolarLead,
  StoredJobApplication,
} from "@/lib/db";
import {
  Database,
  Building2,
  Sun,
  Briefcase,
  RefreshCw,
  Search,
  Download,
  ArrowRight,
  ShieldCheck,
  FileText,
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
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
              <Database className="w-3.5 h-3.5 text-emerald-700" />
              Policy & Insights Database
            </span>
            <span className="text-xs text-slate-400">
              Multi-Tenant Compliance Registry
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Statutory Audits & Application Registry
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Server-side repository of DISCOM RPO compliance filings, PM Surya Ghar registrations, and Clean Energy job applicants.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          <button
            onClick={fetchRecords}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            <span>Sync Live DB</span>
          </button>
          <button
            onClick={downloadJson}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-[#064e3b] hover:bg-[#043d2e] text-white transition-colors shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Registry JSON</span>
          </button>
        </div>
      </div>

      {/* Summary Stats Cards */}
      {summary && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-sm">
            <span className="text-[11px] text-slate-500 block mb-0.5">DISCOM Audits Filed</span>
            <span className="text-2xl font-black text-slate-900">{summary.totalAudits}</span>
            <span className="text-[11px] text-emerald-700 font-semibold block mt-0.5">
              {summary.compliantAudits} Compliant ({summary.auditComplianceRatePercent}%)
            </span>
          </div>

          <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-sm">
            <span className="text-[11px] text-slate-500 block mb-0.5">RE Power Audited</span>
            <span className="text-2xl font-black text-emerald-800">
              {(summary.totalREProcuredMWh / 1000000).toFixed(1)}M
            </span>
            <span className="text-[11px] text-slate-400 block mt-0.5">MWh verified clean power</span>
          </div>

          <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-sm">
            <span className="text-[11px] text-slate-500 block mb-0.5">PM Surya Ghar Subsidy</span>
            <span className="text-2xl font-black text-slate-900">
              ₹{(summary.totalSubsidiesGrantedINR / 100000).toFixed(1)}L
            </span>
            <span className="text-[11px] text-slate-400 block mt-0.5">
              Across {summary.totalSolarCapacityKw} kW capacity
            </span>
          </div>

          <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-sm">
            <span className="text-[11px] text-slate-500 block mb-0.5">Job Applications</span>
            <span className="text-2xl font-black text-slate-900">{summary.totalJobApps}</span>
            <span className="text-[11px] text-slate-400 block mt-0.5">SCGJ accredited candidates</span>
          </div>
        </div>
      )}

      {/* Tabs & Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Tab Buttons */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl">
          <button
            onClick={() => setActiveTab("rpo")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === "rpo"
                ? "bg-[#064e3b] text-white shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>DISCOM Audits ({audits.length})</span>
          </button>
          <button
            onClick={() => setActiveTab("solar")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === "solar"
                ? "bg-[#064e3b] text-white shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Sun className="w-3.5 h-3.5" />
            <span>Solar Registrations ({solarLeads.length})</span>
          </button>
          <button
            onClick={() => setActiveTab("jobs")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === "jobs"
                ? "bg-[#064e3b] text-white shadow-sm"
                : "text-slate-600 hover:text-slate-900"
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
            className="w-full bg-white border border-slate-300 rounded-xl pl-9 pr-3 py-1.5 text-xs text-slate-800 focus:outline-none focus:border-emerald-600"
          />
        </div>
      </div>

      {/* Tab 1: DISCOM Audits Table */}
      {activeTab === "rpo" && (
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-slate-900 text-sm">
              DISCOM Renewable Procurement Statutory Filings
            </h2>
            <Link
              href="/rpo-tracker"
              className="text-xs text-emerald-800 hover:underline font-bold flex items-center gap-1"
            >
              <span>+ New Audit Filing</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-slate-500 text-[11px] uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Audit ID</th>
                  <th className="py-2.5 px-3">DISCOM / Entity</th>
                  <th className="py-2.5 px-3">Target</th>
                  <th className="py-2.5 px-3">Total Procured</th>
                  <th className="py-2.5 px-3">RE Procured</th>
                  <th className="py-2.5 px-3">Compliance %</th>
                  <th className="py-2.5 px-3">Shortfall / REC Cost</th>
                  <th className="py-2.5 px-3">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {audits
                  .filter(
                    (a) =>
                      search === "" ||
                      a.discomName.toLowerCase().includes(search.toLowerCase()) ||
                      a.state.toLowerCase().includes(search.toLowerCase()) ||
                      a.id.toLowerCase().includes(search.toLowerCase())
                  )
                  .map((a) => (
                    <tr key={a.id} className="hover:bg-slate-50">
                      <td className="py-2.5 px-3 font-mono font-bold text-slate-500">{a.id}</td>
                      <td className="py-2.5 px-3">
                        <span className="font-bold text-slate-900 block">{a.discomName}</span>
                        <span className="text-[10px] text-slate-400">{a.state} • {a.submittedBy}</span>
                      </td>
                      <td className="py-2.5 px-3">{a.targetPercent}%</td>
                      <td className="py-2.5 px-3 font-mono">{(a.totalProcuredMWh / 1000).toLocaleString()}k MWh</td>
                      <td className="py-2.5 px-3 font-mono text-emerald-700">
                        {(a.renewableProcuredMWh / 1000).toLocaleString()}k MWh
                      </td>
                      <td className="py-2.5 px-3">
                        <span
                          className={`font-bold px-2 py-0.5 rounded text-[11px] inline-block ${
                            a.isCompliant
                              ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                              : "bg-red-50 text-red-800 border border-red-200"
                          }`}
                        >
                          {a.compliancePercent}%
                        </span>
                      </td>
                      <td className="py-2.5 px-3">
                        {a.isCompliant ? (
                          <span className="text-emerald-700 font-semibold">+{(a.surplusUnitsMWh / 1000).toFixed(1)}k MWh Surplus</span>
                        ) : (
                          <span className="text-red-700 font-semibold">-{(a.shortfallUnitsMWh / 1000).toFixed(1)}k MWh Deficit</span>
                        )}
                      </td>
                      <td className="py-2.5 px-3 text-slate-400 text-[11px]">
                        {new Date(a.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 2: Solar Registrations */}
      {activeTab === "solar" && (
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-slate-900 text-sm">
              PM Surya Ghar Consumer Registrations
            </h2>
            <Link
              href="/solar-calculator"
              className="text-xs text-emerald-800 hover:underline font-bold flex items-center gap-1"
            >
              <span>+ Calculate & Register</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-slate-500 text-[11px] uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Application No</th>
                  <th className="py-2.5 px-3">Applicant Name</th>
                  <th className="py-2.5 px-3">State</th>
                  <th className="py-2.5 px-3">Bill / Roof</th>
                  <th className="py-2.5 px-3">Recommended kW</th>
                  <th className="py-2.5 px-3">Subsidy</th>
                  <th className="py-2.5 px-3">Net Cost</th>
                  <th className="py-2.5 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {solarLeads
                  .filter(
                    (l) =>
                      search === "" ||
                      l.consumerName.toLowerCase().includes(search.toLowerCase()) ||
                      l.applicationNumber.toLowerCase().includes(search.toLowerCase())
                  )
                  .map((lead) => (
                    <tr key={lead.id} className="hover:bg-slate-50">
                      <td className="py-2.5 px-3 font-mono font-bold text-emerald-800">
                        {lead.applicationNumber}
                      </td>
                      <td className="py-2.5 px-3">
                        <span className="font-bold text-slate-900 block">{lead.consumerName}</span>
                        <span className="text-[10px] text-slate-400">{lead.phone}</span>
                      </td>
                      <td className="py-2.5 px-3">{lead.city}, {lead.state}</td>
                      <td className="py-2.5 px-3 text-slate-500">₹{lead.monthlyBill}/mo • {lead.roofSqFt} sq ft</td>
                      <td className="py-2.5 px-3 font-bold text-slate-900">{lead.recommendedKw} kW</td>
                      <td className="py-2.5 px-3 font-bold text-emerald-700">₹{lead.subsidy.toLocaleString()}</td>
                      <td className="py-2.5 px-3 font-semibold text-slate-800">₹{lead.netCost.toLocaleString()}</td>
                      <td className="py-2.5 px-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
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
        <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-slate-900 text-sm">
              Clean Energy Career Applications
            </h2>
            <Link
              href="/jobs"
              className="text-xs text-emerald-800 hover:underline font-bold flex items-center gap-1"
            >
              <span>+ Explore Jobs</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-700">
              <thead className="bg-slate-50 text-slate-500 text-[11px] uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Application Ref</th>
                  <th className="py-2.5 px-3">Candidate</th>
                  <th className="py-2.5 px-3">Role</th>
                  <th className="py-2.5 px-3">Company</th>
                  <th className="py-2.5 px-3">SCGJ Certified</th>
                  <th className="py-2.5 px-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {jobApplications
                  .filter(
                    (j) =>
                      search === "" ||
                      j.candidateName.toLowerCase().includes(search.toLowerCase()) ||
                      j.jobTitle.toLowerCase().includes(search.toLowerCase())
                  )
                  .map((app) => (
                    <tr key={app.id} className="hover:bg-slate-50">
                      <td className="py-2.5 px-3 font-mono font-bold text-slate-700">
                        {app.applicationNumber}
                      </td>
                      <td className="py-2.5 px-3">
                        <span className="font-bold text-slate-900 block">{app.candidateName}</span>
                        <span className="text-[10px] text-slate-400">{app.email}</span>
                      </td>
                      <td className="py-2.5 px-3 font-medium text-slate-800">{app.jobTitle}</td>
                      <td className="py-2.5 px-3 text-slate-500">{app.company}</td>
                      <td className="py-2.5 px-3">
                        {app.scgjCertification ? (
                          <span className="text-emerald-700 font-bold">Yes ✓</span>
                        ) : (
                          <span className="text-slate-400">No</span>
                        )}
                      </td>
                      <td className="py-2.5 px-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-700">
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
