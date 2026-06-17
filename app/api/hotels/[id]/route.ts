import { connectDB } from "@/lib/mongodb";
import Hotel from "@/models/Hotel";
import "@/models/Room";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  await connectDB();

  try {
    // Try to find the hotel and populate its rooms info
    const hotel = await Hotel.findById(id).populate("rooms");
    if (!hotel) {
      return NextResponse.json(
        { success: false, message: "Hotel not found" },
        { status: 404 },
      );
    }
    return NextResponse.json({ success: true, hotel }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Something went wrong", error: (error as Error).message },
      { status: 500 },
    );
  }
}
