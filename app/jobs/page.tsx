"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { SEEDED_GREEN_JOBS, GreenJob } from "@/data/energyData";
import { SourceTooltip } from "@/components/SourceTooltip";
import {
  Briefcase,
  Search,
  MapPin,
  Building,
  Sparkles,
  CheckCircle2,
  X,
  Send,
  Database,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

export default function GreenJobsPage() {
  const [jobs, setJobs] = useState<GreenJob[]>(SEEDED_GREEN_JOBS);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSector, setSelectedSector] = useState<string>("All");
  const [selectedExperience, setSelectedExperience] = useState<string>("All");
  const [selectedState, setSelectedState] = useState<string>("All");

  // Job selection and application modal
  const [selectedJob, setSelectedJob] = useState<GreenJob | null>(null);
  const [applyingJob, setApplyingJob] = useState<GreenJob | null>(null);
  const [candidateName, setCandidateName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [qualification, setQualification] = useState("B.Tech / B.E. Electrical");
  const [scgjCertified, setScgjCertified] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedAppNumber, setConfirmedAppNumber] = useState<string | null>(null);
  const [appliedJobIds, setAppliedJobIds] = useState<Record<string, string>>({});

  // Distinct filters
  const sectors = ["All", "Solar PV", "Wind Energy", "Battery & BESS", "ESG & Policy", "Green Hydrogen", "Smart Grid"];
  const experienceLevels = ["All", "Entry Level (0-2 yrs)", "Mid Level (3-5 yrs)", "Senior Level (6+ yrs)"];

  // Fetch jobs dynamically from backend API
  const fetchBackendJobs = async () => {
    try {
      const res = await fetch("/api/jobs");
      const data = await res.json();
      if (data.success && Array.isArray(data.jobs)) {
        setJobs(data.jobs);
      }
    } catch (err) {
      console.error("Failed to fetch jobs from backend API:", err);
    }
  };

  useEffect(() => {
    fetchBackendJobs();
  }, []);

  const states = useMemo(() => {
    const list = Array.from(new Set(jobs.map((j) => j.state))).sort();
    return ["All", ...list];
  }, [jobs]);

  // Client-side filtering
  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const matchesSearch =
        searchQuery === "" ||
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.requiredSkills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase())) ||
        job.location.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesSector = selectedSector === "All" || job.sector === selectedSector;
      const matchesExperience = selectedExperience === "All" || job.experienceLevel === selectedExperience;
      const matchesState = selectedState === "All" || job.state === selectedState;

      return matchesSearch && matchesSector && matchesExperience && matchesState;
    });
  }, [jobs, searchQuery, selectedSector, selectedExperience, selectedState]);

  const handleOpenApplyModal = (job: GreenJob) => {
    setApplyingJob(job);
    setConfirmedAppNumber(null);
  };

  const handleSubmitApplication = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!candidateName || !email || !applyingJob) {
      alert("Please enter your name and valid email");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/jobs/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          jobId: applyingJob.id,
          candidateName,
          email,
          phone: phone || "+91 98000 00000",
          experienceLevel: applyingJob.experienceLevel,
          qualification,
          scgjCertification: scgjCertified,
        }),
      });
      const data = await res.json();
      if (data.success && data.application) {
        setConfirmedAppNumber(data.application.applicationNumber);
        setAppliedJobIds((prev) => ({
          ...prev,
          [applyingJob.id]: data.application.applicationNumber,
        }));
      } else {
        alert(data.error || "Failed to submit job application");
      }
    } catch (err) {
      console.error("Submission failed:", err);
      alert("Network error connecting to backend API");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-teal-500/15 text-teal-300 border border-teal-500/30">
              <Briefcase className="w-3.5 h-3.5 text-teal-400" />
              Workforce Transition Engine
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400 font-semibold bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">
              <Database className="w-3 h-3" />
              Live Backend API
            </span>
            <span className="text-xs text-slate-400">
              Affiliated with Skill Council for Green Jobs (SCGJ)
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            National Green Jobs & Clean Energy Careers
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            {jobs.length} verified career openings across India&apos;s solar, wind, BESS storage, and hydrogen corridors.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto">
          <Link
            href="/audits"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 transition-colors"
          >
            <Database className="w-3.5 h-3.5 text-emerald-400" />
            <span>View Submitted Applications</span>
          </Link>
        </div>
      </div>

      {/* Search and Filters Bar */}
      <section className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 space-y-3 shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Keyword Search (6 Cols) */}
          <div className="md:col-span-6 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by role, company, skill (e.g. PVsyst, SCADA, BESS, Hydrogen)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Sector Filter (2 Cols) */}
          <div className="md:col-span-2">
            <select
              value={selectedSector}
              onChange={(e) => setSelectedSector(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
            >
              {sectors.map((sec) => (
                <option key={sec} value={sec}>
                  {sec === "All" ? "All Sectors" : sec}
                </option>
              ))}
            </select>
          </div>

          {/* Experience Filter (2 Cols) */}
          <div className="md:col-span-2">
            <select
              value={selectedExperience}
              onChange={(e) => setSelectedExperience(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
            >
              {experienceLevels.map((exp) => (
                <option key={exp} value={exp}>
                  {exp === "All" ? "All Experience" : exp}
                </option>
              ))}
            </select>
          </div>

          {/* State Filter (2 Cols) */}
          <div className="md:col-span-2">
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500"
            >
              {states.map((st) => (
                <option key={st} value={st}>
                  {st === "All" ? "All States" : st}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Sector Quick Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-1 text-xs">
          <span className="text-slate-400 text-[11px] shrink-0">Domain:</span>
          {sectors.map((sec) => (
            <button
              key={sec}
              onClick={() => setSelectedSector(sec)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-medium shrink-0 transition-all ${
                selectedSector === sec
                  ? "bg-emerald-950 text-emerald-300 border border-emerald-600 font-bold"
                  : "bg-slate-950/60 text-slate-400 hover:text-white border border-slate-800"
              }`}
            >
              {sec}
            </button>
          ))}
          {(searchQuery || selectedSector !== "All" || selectedExperience !== "All" || selectedState !== "All") && (
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedSector("All");
                setSelectedExperience("All");
                setSelectedState("All");
              }}
              className="text-[11px] text-amber-400 hover:text-amber-300 underline ml-2 shrink-0"
            >
              Reset Filters
            </button>
          )}
        </div>
      </section>

      {/* Jobs Grid */}
      {filteredJobs.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
          <Briefcase className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-white">No green job openings match your query</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Try adjusting your search keywords, clearing the sector filter, or selecting &quot;All States&quot;.
          </p>
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedSector("All");
              setSelectedExperience("All");
              setSelectedState("All");
            }}
            className="px-4 py-2 rounded-xl bg-emerald-600 text-slate-950 font-bold text-xs"
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredJobs.map((job) => {
            const appliedAppNo = appliedJobIds[job.id];

            return (
              <div
                key={job.id}
                className="bg-slate-900/80 hover:bg-slate-850/90 border border-slate-800 hover:border-emerald-600/50 rounded-2xl p-4.5 transition-all flex flex-col justify-between group shadow-lg"
              >
                <div className="space-y-3">
                  {/* Top Badges */}
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800/40">
                      {job.sector}
                    </span>
                    <span className="text-slate-400 font-mono text-[10px]">
                      {job.type}
                    </span>
                  </div>

                  {/* Title & Company */}
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-white group-hover:text-emerald-300 transition-colors line-clamp-1">
                      {job.title}
                    </h3>
                    <p className="text-xs text-slate-300 font-medium flex items-center gap-1 mt-0.5">
                      <Building className="w-3.5 h-3.5 text-slate-400" />
                      <span>{job.company}</span>
                    </p>
                  </div>

                  {/* Location & Compensation */}
                  <div className="flex items-center justify-between text-xs text-slate-400 border-y border-slate-800/80 py-2">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{job.location}, {job.state}</span>
                    </span>
                    <span className="font-bold text-slate-200">
                      {job.salaryRangeINR}
                    </span>
                  </div>

                  {/* Description preview */}
                  <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                    {job.description}
                  </p>

                  {/* Skill Tags */}
                  <div className="flex flex-wrap gap-1">
                    {job.requiredSkills.slice(0, 3).map((skill) => (
                      <span
                        key={skill}
                        className="text-[10px] px-1.5 py-0.5 rounded bg-slate-950 text-slate-300 border border-slate-800"
                      >
                        {skill}
                      </span>
                    ))}
                    {job.requiredSkills.length > 3 && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-950 text-slate-500">
                        +{job.requiredSkills.length - 3}
                      </span>
                    )}
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-[10px] text-slate-500">
                    Cert: {job.certificationPartner}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setSelectedJob(job)}
                      className="px-2.5 py-1 rounded-lg text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors"
                    >
                      Details
                    </button>
                    <button
                      type="button"
                      onClick={() => handleOpenApplyModal(job)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                        appliedAppNo
                          ? "bg-emerald-500 text-slate-950"
                          : "bg-emerald-600 hover:bg-emerald-500 text-slate-950"
                      }`}
                    >
                      {appliedAppNo ? "Applied ✓" : "Apply"}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Application Form Modal (Submits to Backend) */}
      {applyingJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 border border-emerald-500/30 rounded-2xl max-w-lg w-full p-6 shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="flex items-start justify-between border-b border-slate-800 pb-3 mb-4">
              <div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800/40">
                  {applyingJob.sector}
                </span>
                <h3 className="text-base font-bold text-white mt-1">
                  Apply for: {applyingJob.title}
                </h3>
                <p className="text-xs text-slate-400">
                  {applyingJob.company} • {applyingJob.location}, {applyingJob.state}
                </p>
              </div>
              <button
                onClick={() => {
                  setApplyingJob(null);
                  setConfirmedAppNumber(null);
                }}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {confirmedAppNumber ? (
              <div className="text-center py-6 space-y-4">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500 text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-white">Application Recorded in DB!</h4>
                  <p className="text-xs text-slate-400 mt-1">
                    Your profile was submitted via the backend API to {applyingJob.company}.
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-500 block uppercase font-bold">SCGJ Application Reference</span>
                  <span className="text-lg font-mono font-bold text-emerald-400">{confirmedAppNumber}</span>
                </div>
                <div className="pt-2 flex justify-center gap-3">
                  <Link
                    href="/audits"
                    className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold"
                  >
                    View in Database Registry
                  </Link>
                  <button
                    onClick={() => {
                      setApplyingJob(null);
                      setConfirmedAppNumber(null);
                    }}
                    className="px-4 py-2 rounded-xl bg-emerald-600 text-slate-950 text-xs font-bold"
                  >
                    Close
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmitApplication} className="space-y-4 text-xs">
                <div>
                  <label className="text-slate-300 font-semibold block mb-1">
                    Candidate Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Suresh Kumar"
                    value={candidateName}
                    onChange={(e) => setCandidateName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-slate-300 font-semibold block mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="suresh@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="text-slate-300 font-semibold block mb-1">
                      Mobile Number
                    </label>
                    <input
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-slate-300 font-semibold block mb-1">
                    Highest Educational / Technical Qualification
                  </label>
                  <select
                    value={qualification}
                    onChange={(e) => setQualification(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="B.Tech / B.E. Electrical">B.Tech / B.E. Electrical</option>
                    <option value="B.Tech / B.E. Mechanical">B.Tech / B.E. Mechanical</option>
                    <option value="Diploma in Electrical / Solar">Diploma in Electrical / Solar</option>
                    <option value="ITI Electrician / Wireman">ITI Electrician / Wireman</option>
                    <option value="M.Sc. / M.Tech Renewable Energy">M.Sc. / M.Tech Renewable Energy</option>
                    <option value="MBA Sustainability / Carbon Markets">MBA Sustainability / Carbon Markets</option>
                  </select>
                </div>

                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                  <input
                    type="checkbox"
                    id="scgj-check"
                    checked={scgjCertified}
                    onChange={(e) => setScgjCertified(e.target.checked)}
                    className="rounded accent-emerald-500 w-4 h-4"
                  />
                  <label htmlFor="scgj-check" className="text-[11px] text-slate-300 cursor-pointer">
                    Hold Skill Council for Green Jobs (SCGJ) or Suryamitra accreditation
                  </label>
                </div>

                <div className="pt-3 border-t border-slate-800 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setApplyingJob(null)}
                    className="px-4 py-2 rounded-xl text-slate-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-bold flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{isSubmitting ? "Transmitting..." : "Submit to Employer"}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Job Detail Modal */}
      {selectedJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-xl w-full p-6 shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="flex items-start justify-between border-b border-slate-800 pb-4 mb-4">
              <div>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800/40">
                  {selectedJob.sector}
                </span>
                <h3 className="text-lg font-bold text-white mt-1.5">
                  {selectedJob.title}
                </h3>
                <p className="text-xs text-slate-300 font-medium">
                  {selectedJob.company} • {selectedJob.location}, {selectedJob.state}
                </p>
              </div>
              <button
                onClick={() => setSelectedJob(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-slate-950 border border-slate-800">
                <div>
                  <span className="text-[10px] text-slate-400 block">Annual Compensation</span>
                  <span className="text-sm font-bold text-emerald-400">{selectedJob.salaryRangeINR}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Experience Requirement</span>
                  <span className="text-sm font-bold text-white">{selectedJob.experienceLevel}</span>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-200 mb-1">Key Responsibilities</h4>
                <p className="text-slate-300 leading-relaxed">{selectedJob.description}</p>
              </div>

              <div>
                <h4 className="font-bold text-slate-200 mb-1.5">Technical Competencies</h4>
                <div className="flex flex-wrap gap-1.5">
                  {selectedJob.requiredSkills.map((sk) => (
                    <span
                      key={sk}
                      className="px-2 py-1 rounded bg-slate-800 text-slate-200 text-[11px] border border-slate-700"
                    >
                      {sk}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-slate-300">
                <span className="font-semibold text-emerald-400 block mb-0.5">
                  Accredited Skill Body:
                </span>
                <p className="text-[11px] text-slate-400">
                  {selectedJob.certificationPartner} (National Occupational Standards verified).
                </p>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between">
              <button
                type="button"
                onClick={() => setSelectedJob(null)}
                className="px-3.5 py-2 rounded-xl text-slate-400 hover:text-white text-xs font-semibold"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  const jobToApply = selectedJob;
                  setSelectedJob(null);
                  handleOpenApplyModal(jobToApply);
                }}
                className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-500/20"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Apply for this Position</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
