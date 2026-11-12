import { NextRequest, NextResponse } from "next/server";
import { getJobsList } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || undefined;
    const sector = searchParams.get("sector") || undefined;
    const experience = searchParams.get("experience") || undefined;
    const state = searchParams.get("state") || undefined;

    const jobs = await getJobsList({
      search,
      sector,
      experience,
      state,
    });

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
