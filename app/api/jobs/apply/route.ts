import { NextRequest, NextResponse } from "next/server";
import { getJobApplications, createJobApplication } from "@/lib/db";
import { SEEDED_GREEN_JOBS } from "@/data/energyData";

export async function GET() {
  try {
    const applications = await getJobApplications();
    return NextResponse.json({
      success: true,
      count: applications.length,
      applications,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to retrieve job applications" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      jobId,
      candidateName,
      email,
      phone,
      experienceLevel = "Entry Level (0-2 yrs)",
      qualification = "Engineering Graduate / Diploma",
      scgjCertification = true,
    } = body;

    if (!candidateName || typeof candidateName !== "string") {
      return NextResponse.json(
        { success: false, error: "Candidate name is required" },
        { status: 400 }
      );
    }

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { success: false, error: "Valid email address is required" },
        { status: 400 }
      );
    }

    const matchedJob = SEEDED_GREEN_JOBS.find((j) => j.id === jobId) || {
      id: jobId || "GJ-GEN",
      title: "Clean Energy Professional",
      company: "National Clean Energy Mission",
    };

    const newApp = await createJobApplication({
      jobId: matchedJob.id,
      jobTitle: matchedJob.title,
      company: matchedJob.company,
      candidateName: candidateName.trim(),
      email: email.trim(),
      phone: (phone || "+91 90000 00000").trim(),
      experienceLevel,
      qualification,
      scgjCertification: Boolean(scgjCertification),
    });

    return NextResponse.json(
      {
        success: true,
        message: "Job application submitted to employer and SCGJ portal",
        application: newApp,
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to submit job application" },
      { status: 500 }
    );
  }
}
