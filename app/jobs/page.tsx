"use client";

import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { SEEDED_GREEN_JOBS, GreenJob } from "@/data/energyData";
import {
  Briefcase,
  Search,
  MapPin,
  Building,
  CheckCircle2,
  X,
  Send,
  Laptop,
  GraduationCap,
  Globe2,
  ArrowRight,
  Database,
  ShieldCheck,
  ExternalLink,
} from "lucide-react";

export default function GreenJobsPage() {
  const [jobs, setJobs] = useState<GreenJob[]>(SEEDED_GREEN_JOBS);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSector, setSelectedSector] = useState<string>("All");
  const [selectedExperience, setSelectedExperience] = useState<string>("All");
  const [selectedState, setSelectedState] = useState<string>("All");

  // Application Modal state
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

  const sectors = ["All", "Solar PV", "Wind Energy", "Battery & BESS", "ESG & Policy", "Green Hydrogen", "Smart Grid"];
  const experienceLevels = ["All", "Entry Level (0-2 yrs)", "Mid Level (3-5 yrs)", "Senior Level (6+ yrs)"];

  // Fetch from backend
  useEffect(() => {
    fetch("/api/jobs")
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.jobs)) {
          setJobs(data.jobs);
        }
      })
      .catch((err) => console.log("Jobs backend fetch:", err));
  }, []);

  const states = useMemo(() => {
    const list = Array.from(new Set(jobs.map((j) => j.state))).sort();
    return ["All", ...list];
  }, [jobs]);

  // Filtered jobs
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

  // Submit to backend
  const handleSubmitApplication = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!candidateName || !email || !applyingJob) {
      alert("Please enter your name and email");
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
        alert(data.error || "Failed to submit application");
      }
    } catch (err) {
      console.error("Submission failed:", err);
      alert("Network error connecting to backend API");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Hero Section matching Reference Image 3 */}
      <section className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-10 shadow-sm text-center space-y-6">
        <div className="max-w-2xl mx-auto space-y-2">
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Welcome to the green <span className="text-emerald-600">jobs</span> platform.
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            Powered by <strong className="text-emerald-800">India Green Grid</strong> &{" "}
            <a
              href="https://sscgj.in/?utm_source=chatgpt.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-emerald-700 underline font-bold hover:text-emerald-900 inline-flex items-center gap-0.5"
            >
              <span>Skill Council for Green Jobs (SCGJ)</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </p>

          <div className="pt-2 flex justify-center">
            <a
              href="https://sscgj.in/?utm_source=chatgpt.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-bold shadow-sm transition-colors"
            >
              <span>Visit Official SCGJ Portal (sscgj.in)</span>
              <ExternalLink className="w-3.5 h-3.5 text-emerald-700" />
            </a>
          </div>
        </div>

        {/* 3 Prominent Colored Feature Blocks matching Reference Image 3 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-2">
          {/* Card 1: Work (Bright Green #10b981) */}
          <div
            onClick={() => {
              setSelectedSector("All");
              const el = document.getElementById("jobs-listings");
              el?.scrollIntoView({ behavior: "smooth" });
            }}
            className="bg-[#10b981] hover:bg-[#059669] text-white rounded-2xl p-6 text-left shadow-sm transition-all cursor-pointer flex flex-col justify-between min-h-[160px] group"
          >
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center mb-4">
              <Laptop className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold tracking-tight mb-1">
                Work
              </h3>
              <p className="text-xs text-white/90 leading-snug">
                Apply for our green job board vacancies across India.
              </p>
            </div>
          </div>

          {/* Card 2: Learn (Warm Orange #f97316 - redirects to official SCGJ training portal) */}
          <a
            href="https://sscgj.in/?utm_source=chatgpt.com"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#f97316] hover:bg-[#ea580c] text-white rounded-2xl p-6 text-left shadow-sm transition-all cursor-pointer flex flex-col justify-between min-h-[160px] group"
            title="Redirect to SCGJ Training & Certification Portal"
          >
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center mb-4">
                <GraduationCap className="w-5 h-5 text-white" />
              </div>
              <ExternalLink className="w-4 h-4 text-white/80 group-hover:text-white" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 mb-1">
                <h3 className="text-xl font-bold tracking-tight">
                  Learn
                </h3>
                <span className="text-[10px] bg-white/20 px-1.5 py-0.2 rounded font-semibold">External ↗</span>
              </div>
              <p className="text-xs text-white/90 leading-snug">
                Gain access to accredited clean energy training programmes on sscgj.in.
              </p>
            </div>
          </a>

          {/* Card 3: Explore (Dark Forest Green #064e3b) */}
          <div
            onClick={() => {
              const el = document.getElementById("jobs-listings");
              el?.scrollIntoView({ behavior: "smooth" });
            }}
            className="bg-[#064e3b] hover:bg-[#043e2e] text-white rounded-2xl p-6 text-left shadow-sm transition-all cursor-pointer flex flex-col justify-between min-h-[160px] group"
          >
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center mb-4">
              <Globe2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold tracking-tight mb-1">
                Explore
              </h3>
              <p className="text-xs text-white/90 leading-snug">
                Discover all the green jobs near you across states.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Search and Filters Bar */}
      <section id="jobs-listings" className="bg-white border border-slate-200/90 rounded-2xl p-4 sm:p-5 space-y-4 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          <div className="md:col-span-6 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by role, company, skill (e.g. PVsyst, SCADA, BESS)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-600 focus:bg-white"
            />
          </div>

          <div className="md:col-span-2">
            <select
              value={selectedSector}
              onChange={(e) => setSelectedSector(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 focus:outline-none focus:border-emerald-600"
            >
              {sectors.map((sec) => (
                <option key={sec} value={sec}>
                  {sec === "All" ? "All Sectors" : sec}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2">
            <select
              value={selectedExperience}
              onChange={(e) => setSelectedExperience(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 focus:outline-none focus:border-emerald-600"
            >
              {experienceLevels.map((exp) => (
                <option key={exp} value={exp}>
                  {exp === "All" ? "All Experience" : exp}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2">
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 focus:outline-none focus:border-emerald-600"
            >
              {states.map((st) => (
                <option key={st} value={st}>
                  {st === "All" ? "All States" : st}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Quick Sector Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto text-xs pt-1">
          <span className="text-slate-400 text-[11px] shrink-0 font-medium">Domain:</span>
          {sectors.map((sec) => (
            <button
              key={sec}
              onClick={() => setSelectedSector(sec)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold shrink-0 transition-all ${
                selectedSector === sec
                  ? "bg-[#064e3b] text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
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
              className="text-xs text-emerald-700 hover:underline font-semibold ml-2 shrink-0"
            >
              Reset Filters
            </button>
          )}
        </div>
      </section>

      {/* Job Card Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredJobs.map((job) => {
          const appliedAppNo = appliedJobIds[job.id];

          return (
            <div
              key={job.id}
              className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-sm hover:border-emerald-400 hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                    {job.sector}
                  </span>
                  <span className="text-slate-400 text-[11px]">
                    {job.type}
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-slate-900 text-base line-clamp-1">
                    {job.title}
                  </h3>
                  <p className="text-xs text-slate-600 font-medium flex items-center gap-1 mt-0.5">
                    <Building className="w-3.5 h-3.5 text-slate-400" />
                    <span>{job.company}</span>
                  </p>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500 border-y border-slate-100 py-2">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{job.location}, {job.state}</span>
                  </span>
                  <span className="font-bold text-slate-900">
                    {job.salaryRangeINR}
                  </span>
                </div>

                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                  {job.description}
                </p>

                <div className="flex flex-wrap gap-1">
                  {job.requiredSkills.slice(0, 3).map((sk) => (
                    <span
                      key={sk}
                      className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-medium"
                    >
                      {sk}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[10px] text-slate-400 truncate max-w-[120px]">
                  {job.certificationPartner}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedJob(job)}
                    className="px-2.5 py-1 rounded-lg text-xs font-semibold text-slate-600 hover:text-slate-900 bg-slate-100"
                  >
                    Details
                  </button>
                  <button
                    onClick={() => {
                      setApplyingJob(job);
                      setConfirmedAppNumber(null);
                    }}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                      appliedAppNo
                        ? "bg-emerald-600 text-white"
                        : "bg-[#064e3b] hover:bg-[#043d2e] text-white"
                    }`}
                  >
                    {appliedAppNo ? "Applied ✓" : "Apply"}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </section>

      {/* Application Modal */}
      {applyingJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full p-6 shadow-2xl text-slate-800">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3 mb-4">
              <div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800">
                  {applyingJob.sector}
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-1">
                  Apply for: {applyingJob.title}
                </h3>
                <p className="text-xs text-slate-500">
                  {applyingJob.company} • {applyingJob.location}, {applyingJob.state}
                </p>
              </div>
              <button
                onClick={() => {
                  setApplyingJob(null);
                  setConfirmedAppNumber(null);
                }}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {confirmedAppNumber ? (
              <div className="text-center py-6 space-y-4">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-slate-900">Application Submitted!</h4>
                  <p className="text-xs text-slate-500 mt-1">
                    Your profile was saved in the database and dispatched to {applyingJob.company}.
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] text-slate-400 block uppercase font-bold">SCGJ Application Reference</span>
                  <span className="text-lg font-mono font-bold text-emerald-700">{confirmedAppNumber}</span>
                </div>
                <div className="pt-2 flex justify-center gap-3">
                  <Link
                    href="/audits"
                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold"
                  >
                    View in Database Registry
                  </Link>
                  <button
                    onClick={() => {
                      setApplyingJob(null);
                      setConfirmedAppNumber(null);
                    }}
                    className="px-4 py-2 rounded-xl bg-[#064e3b] text-white text-xs font-bold"
                  >
                    Done
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmitApplication} className="space-y-4 text-xs">
                <div>
                  <label className="text-slate-700 font-semibold block mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Suresh Kumar"
                    value={candidateName}
                    onChange={(e) => setCandidateName(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:border-emerald-600"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-slate-700 font-semibold block mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="suresh@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:border-emerald-600"
                    />
                  </div>
                  <div>
                    <label className="text-slate-700 font-semibold block mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:border-emerald-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-slate-700 font-semibold block mb-1">
                    Educational / Technical Qualification
                  </label>
                  <select
                    value={qualification}
                    onChange={(e) => setQualification(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:border-emerald-600"
                  >
                    <option value="B.Tech / B.E. Electrical">B.Tech / B.E. Electrical</option>
                    <option value="B.Tech / B.E. Mechanical">B.Tech / B.E. Mechanical</option>
                    <option value="Diploma in Electrical / Solar">Diploma in Electrical / Solar</option>
                    <option value="ITI Electrician / Wireman">ITI Electrician / Wireman</option>
                    <option value="M.Sc. / M.Tech Renewable Energy">M.Sc. / M.Tech Renewable Energy</option>
                  </select>
                </div>

                <div className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                  <input
                    type="checkbox"
                    id="scgj-cert"
                    checked={scgjCertified}
                    onChange={(e) => setScgjCertified(e.target.checked)}
                    className="rounded accent-emerald-600 w-4 h-4"
                  />
                  <label htmlFor="scgj-cert" className="text-xs text-slate-700 cursor-pointer">
                    Hold Skill Council for Green Jobs (SCGJ) or Suryamitra accreditation
                  </label>
                </div>

                <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setApplyingJob(null)}
                    className="px-4 py-2 rounded-xl text-slate-500 hover:text-slate-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-5 py-2 rounded-xl bg-[#064e3b] hover:bg-[#043d2e] disabled:opacity-50 text-white font-bold"
                  >
                    {isSubmitting ? "Submitting..." : "Submit Application"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Details Modal */}
      {selectedJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full p-6 shadow-2xl text-slate-800">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3 mb-4">
              <div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800">
                  {selectedJob.sector}
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-1">
                  {selectedJob.title}
                </h3>
                <p className="text-xs text-slate-500">
                  {selectedJob.company} • {selectedJob.location}, {selectedJob.state}
                </p>
              </div>
              <button
                onClick={() => setSelectedJob(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
                <div>
                  <span className="text-slate-400 block text-[10px]">Annual Compensation</span>
                  <span className="text-sm font-bold text-slate-900">{selectedJob.salaryRangeINR}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">Experience Required</span>
                  <span className="text-sm font-bold text-slate-900">{selectedJob.experienceLevel}</span>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 mb-1">Key Responsibilities</h4>
                <p className="text-slate-600 leading-relaxed">{selectedJob.description}</p>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 mb-1.5">Required Skills</h4>
                <div className="flex flex-wrap gap-1">
                  {selectedJob.requiredSkills.map((sk) => (
                    <span key={sk} className="px-2 py-1 rounded bg-slate-100 text-slate-700 font-medium">
                      {sk}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-100 text-xs text-emerald-900">
                <span className="font-bold block mb-0.5">Accredited Skill Body:</span>
                <p className="text-emerald-800">{selectedJob.certificationPartner}</p>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 flex justify-end gap-2">
              <button
                onClick={() => setSelectedJob(null)}
                className="px-4 py-2 rounded-xl text-slate-500 hover:text-slate-700"
              >
                Close
              </button>
              <button
                onClick={() => {
                  const toApply = selectedJob;
                  setSelectedJob(null);
                  setApplyingJob(toApply);
                  setConfirmedAppNumber(null);
                }}
                className="px-5 py-2 rounded-xl bg-[#064e3b] text-white font-bold"
              >
                Apply Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
