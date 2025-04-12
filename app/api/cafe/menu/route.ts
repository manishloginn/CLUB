// pages/api/cafe/menu.ts
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Cafe from "@/app/schema/cafe-schema";

export async function GET(req: NextRequest) {
  await dbConnect();
  const cafeId = req.nextUrl.searchParams.get("cafeId");

  if (!cafeId) {
    return NextResponse.json({ message: "Cafe ID required" }, { status: 400 });
  }

  try {
    const cafe = await Cafe.findById(cafeId).populate("menuItems"); // Assuming 'menuItems' is a ref
    return NextResponse.json({ menu: cafe.menuItems });
  } catch (err) {
    return NextResponse.json({ message: (err as Error).message }, { status: 500 });
  }
}
