import { connectDB } from "@/lib/mongodb";
import Hotel from "@/models/Hotel";
import { NextResponse } from "next/server";

export async function GET() {
  await connectDB();

  try {
    const locations = await Hotel.find(
      {},
      {
        city: 1,
        country: 1,
        _id: 0,
      },
    );
    return NextResponse.json({ success: true, locations }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: "Something went wrong",
        error: (error as Error).message,
      },
      { status: 500 },
    );
  }
}
