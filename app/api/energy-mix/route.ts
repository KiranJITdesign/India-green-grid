import { NextResponse } from "next/server";
import {
  GENERATION_MIX_DATA,
  ENERGY_MIX_HIGHLIGHTS,
  GEC_III_DATA,
  RPO_TRAJECTORY_DATA,
  DATA_CITATIONS,
} from "@/data/energyData";

export async function GET() {
  return NextResponse.json({
    success: true,
    dataAsOf: ENERGY_MIX_HIGHLIGHTS.dataAsOf,
    generationMix: GENERATION_MIX_DATA,
    highlights: ENERGY_MIX_HIGHLIGHTS,
    gecIII: GEC_III_DATA,
    rpoTrajectory: RPO_TRAJECTORY_DATA,
    citations: DATA_CITATIONS,
  });
}
