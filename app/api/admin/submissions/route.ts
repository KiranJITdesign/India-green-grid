import { NextResponse } from "next/server";
import { getRpoAudits, getSolarLeads, getJobApplications, getDashboardStats } from "@/lib/db";

export async function GET() {
  try {
    const [audits, solarLeads, jobApps, stats] = await Promise.all([
      getRpoAudits(),
      getSolarLeads(),
      getJobApplications(),
      getDashboardStats(),
    ]);

    return NextResponse.json({
      success: true,
      timestamp: new Date().toISOString(),
      summary: stats,
      audits,
      solarLeads,
      jobApplications: jobApps,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to retrieve submissions" },
      { status: 500 }
    );
  }
}
