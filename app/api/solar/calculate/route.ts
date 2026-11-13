import { NextRequest, NextResponse } from "next/server";
import { calculateSolarROI } from "@/lib/calculators";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { monthlyBill, roofSqFt, location } = body;

    const bill = Math.max(0, Number(monthlyBill) || 0);
    const roof = Math.max(0, Number(roofSqFt) || 0);

    if (bill <= 0) {
      return NextResponse.json(
        { success: false, error: "Monthly electricity bill must be greater than 0" },
        { status: 400 }
      );
    }

    const result = calculateSolarROI({
      monthlyBill: bill,
      roofSqFt: roof,
      location: location || "All-India Average",
    });

    return NextResponse.json({
      success: true,
      result,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || "Failed to calculate solar ROI" },
      { status: 500 }
    );
  }
}
