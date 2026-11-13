import { NextRequest, NextResponse } from "next/server";
import {
  getOriginalSchemes,
  getOriginalJobs,
  getOriginalSolarBenchmarks,
  getOriginalSolarParameters,
  getOriginalRpoTrajectory,
  getOriginalRpoEntities,
  getOriginalGenerationMix,
  getOriginalCapacityGrowth,
  getOriginalStationGeneration,
} from "@/lib/datasets";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type");

    if (type === "schemes") {
      return NextResponse.json({ success: true, schemes: getOriginalSchemes() });
    }
    if (type === "jobs") {
      return NextResponse.json({ success: true, jobs: getOriginalJobs() });
    }
    if (type === "solar") {
      return NextResponse.json({
        success: true,
        benchmarks: getOriginalSolarBenchmarks(),
        parameters: getOriginalSolarParameters(),
      });
    }
    if (type === "rpo") {
      return NextResponse.json({
        success: true,
        trajectory: getOriginalRpoTrajectory(),
        entities: getOriginalRpoEntities(),
      });
    }
    if (type === "generation") {
      return NextResponse.json({
        success: true,
        generationMix: getOriginalGenerationMix(),
        capacityGrowth: getOriginalCapacityGrowth(),
      });
    }
    if (type === "stations") {
      const limit = Number(searchParams.get("limit")) || 50;
      return NextResponse.json({
        success: true,
        stations: getOriginalStationGeneration(limit),
      });
    }

    // Default: Return all datasets summary
    return NextResponse.json({
      success: true,
      datasets: {
        schemes: getOriginalSchemes(),
        jobs: getOriginalJobs(),
        solarBenchmarks: getOriginalSolarBenchmarks(),
        solarParameters: getOriginalSolarParameters(),
        rpoTrajectory: getOriginalRpoTrajectory(),
        rpoEntities: getOriginalRpoEntities(),
        generationMix: getOriginalGenerationMix(),
        capacityGrowth: getOriginalCapacityGrowth(),
        stationsCount: getOriginalStationGeneration(1000).length,
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: err?.message || "Failed to fetch datasets" },
      { status: 500 }
    );
  }
}
