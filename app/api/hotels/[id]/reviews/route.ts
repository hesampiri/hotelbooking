import { connectDB } from "@/lib/mongodb";
import Review from "@/models/Review";
import "@/models/User";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const { searchParams } = new URL(request.url);
  const page = Number(searchParams.get("page") ?? 1);
  const limit = Number(searchParams.get("limit") ?? 5);
  const skip = (page - 1) * limit;

  try {
    await connectDB();

    const [reviews, total] = await Promise.all([   
      Review.find({ hotel: id })
        .populate("user", "name")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Review.countDocuments({ hotel: id }),        
    ]);

    return NextResponse.json({
      success: true,
      reviews,
      total,
      hasMore: skip + limit < total,   
      page,                            
    }, { status: 200 });

  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch reviews" },
      { status: 500 },
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return NextResponse.json(
      { success: false, message: "Unauthorized" },
      { status: 401 },
    );
  }

  try {
    await connectDB();

    const body = await request.json();
    const { rating, comment } = body;

    if (!rating || !comment) {
      return NextResponse.json(
        { success: false, message: "Rating and comment are required" },
        { status: 400 },
      );
    }

    const review = await Review.create({
      user: session.user.id,
      hotel: id,
      rating,
      comment,
    });

    const populated = await review.populate("user", "name");

    return NextResponse.json(
      { success: true, review: populated },
      { status: 201 },
    );
  } catch (error) {
    console.error(error); 
    return NextResponse.json(
      { success: false, message: "Failed to create review" },
      { status: 500 },
    );
  }
}