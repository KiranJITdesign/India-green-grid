import { NextRequest, NextResponse } from "next/server";
import { getRpoAudits, createRpoAudit } from "@/lib/db";
import { calculateRPO } from "@/lib/calculators";

export async function GET() {
  try {
    const audits = await getRpoAudits();
    return NextResponse.json({
      success: true,
      count: audits.length,
      audits,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to retrieve RPO audits" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      discomName,
      state,
      totalProcuredMWh,
      renewableProcuredMWh,
      targetYear = "2025",
      submittedBy = "Authorized Compliance Officer",
    } = body;

    if (!discomName || typeof discomName !== "string") {
      return NextResponse.json(
        { success: false, error: "Valid discomName is required" },
        { status: 400 }
      );
    }

    const total = Math.max(0, Number(totalProcuredMWh) || 0);
    const renewable = Math.max(0, Number(renewableProcuredMWh) || 0);

    if (total <= 0) {
      return NextResponse.json(
        { success: false, error: "Total procured electricity must be greater than 0 MWh" },
        { status: 400 }
      );
    }

    if (renewable > total) {
      return NextResponse.json(
        { success: false, error: "Renewable procured cannot exceed total electricity procured" },
        { status: 400 }
      );
    }

    // Run official statutory calculation engine
    const result = calculateRPO({
      totalProcuredMWh: total,
      renewableProcuredMWh: renewable,
      targetYear: targetYear === "2030" ? "2030" : "2025",
    });

    const storedAudit = await createRpoAudit({
      discomName: discomName.trim(),
      state: state || "India",
      totalProcuredMWh: total,
      renewableProcuredMWh: renewable,
      targetYear: result.targetYear,
      targetPercent: result.targetPercent,
      compliancePercent: result.compliancePercent,
      isCompliant: result.isCompliant,
      shortfallUnitsMWh: result.shortfallUnitsMWh,
      surplusUnitsMWh: result.surplusUnitsMWh,
      estimatedPenaltyINR: result.estimatedPenaltyINR,
      statusLabel: result.statusLabel,
      submittedBy: submittedBy.trim(),
    });

    return NextResponse.json(
      {
        success: true,
        message: "DISCOM statutory RPO compliance audit filed successfully",
        audit: storedAudit,
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to submit RPO audit" },
      { status: 500 }
    );
  }
}
