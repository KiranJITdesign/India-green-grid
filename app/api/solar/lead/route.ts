import { NextRequest, NextResponse } from "next/server";
import { getSolarLeads, createSolarLead } from "@/lib/db";
import { calculateSolarROI } from "@/lib/calculators";

export async function GET() {
  try {
    const leads = await getSolarLeads();
    return NextResponse.json({
      success: true,
      count: leads.length,
      leads,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to retrieve solar leads" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      consumerName,
      phone,
      email,
      city,
      state,
      monthlyBill,
      roofSqFt,
    } = body;

    if (!consumerName || typeof consumerName !== "string") {
      return NextResponse.json(
        { success: false, error: "Applicant name is required" },
        { status: 400 }
      );
    }

    if (!phone || typeof phone !== "string") {
      return NextResponse.json(
        { success: false, error: "Valid 10-digit mobile number is required" },
        { status: 400 }
      );
    }

    const bill = Math.max(0, Number(monthlyBill) || 0);
    const roof = Math.max(0, Number(roofSqFt) || 0);

    // Run official statutory calculation
    const calc = calculateSolarROI({
      monthlyBill: bill,
      roofSqFt: roof,
      location: city || state || "India",
    });

    const newLead = await createSolarLead({
      consumerName: consumerName.trim(),
      phone: phone.trim(),
      email: (email || "").trim(),
      city: city || "City",
      state: state || "State",
      monthlyBill: bill,
      roofSqFt: roof,
      recommendedKw: calc.recommendedKw,
      estimatedCost: calc.estimatedCost,
      subsidy: calc.subsidy,
      netCost: calc.netCost,
      monthlySavings: calc.monthlySavings,
      paybackYears: calc.paybackYears,
    });

    return NextResponse.json(
      {
        success: true,
        message: "PM Surya Ghar subsidy registration submitted successfully",
        lead: newLead,
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to submit solar application" },
      { status: 500 }
    );
  }
}
