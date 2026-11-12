import { NextRequest, NextResponse } from "next/server";
import { getOriginalJobs } from "@/lib/datasets";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search");
    const sector = searchParams.get("sector");
    const experience = searchParams.get("experience");
    const state = searchParams.get("state");

    let jobs = getOriginalJobs().map((oj) => ({
      id: oj.id,
      title: oj.job_title,
      company: oj.employer_type,
      sector: oj.domain,
      location: oj.typical_locations,
      state: oj.typical_locations.includes(",") ? oj.typical_locations.split(",")[0].trim() : oj.typical_locations,
      type: "Full-Time" as const,
      experienceLevel: oj.level === "Entry" ? "Entry Level (0-2 yrs)" : oj.level === "Mid" ? "Mid Level (3-5 yrs)" : "Senior Level (6+ yrs)",
      salaryRangeINR: `₹${oj.salary_min_lpa} - ${oj.salary_max_lpa} LPA`,
      requiredSkills: oj.key_skills,
      description: `${oj.job_title} role in the ${oj.domain} sector. Qualification: ${oj.typical_qualification}. ${oj.note}`,
      postedDate: "2026-02-10",
      certificationPartner: "Skill Council for Green Jobs (SCGJ)",
      typicalQualification: oj.typical_qualification,
      salaryMinLpa: oj.salary_min_lpa,
      salaryMaxLpa: oj.salary_max_lpa,
    }));

    if (search) {
      const q = search.toLowerCase();
      jobs = jobs.filter(
        (j) =>
          j.title.toLowerCase().includes(q) ||
          j.company.toLowerCase().includes(q) ||
          j.location.toLowerCase().includes(q) ||
          j.requiredSkills.some((s) => s.toLowerCase().includes(q))
      );
    }

    if (sector && sector !== "All") {
      jobs = jobs.filter((j) => j.sector.toLowerCase() === sector.toLowerCase());
    }

    if (experience && experience !== "All") {
      jobs = jobs.filter((j) => j.experienceLevel.toLowerCase().includes(experience.toLowerCase()) || experience.toLowerCase().includes(j.experienceLevel.toLowerCase()));
    }

    if (state && state !== "All") {
      jobs = jobs.filter((j) => j.location.toLowerCase().includes(state.toLowerCase()));
    }

    return NextResponse.json({
      success: true,
      count: jobs.length,
      jobs,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to fetch green jobs" },
      { status: 500 }
    );
  }
}
