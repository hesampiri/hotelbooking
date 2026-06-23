import { connectDB } from "@/lib/mongodb";
import { auth } from "@/lib/auth";
import Booking from "@/models/Booking";
import Room from "@/models/Room";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: Object.fromEntries(req.headers.entries()),
    });

    if (!session?.user) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 },
      );
    }

    await connectDB();

    const bookings = await Booking.find({ user: session.user.id })
      .populate("hotel", "name city country images")
      .populate("room", "name images pricePerNight")
      .sort({ createdAt: -1 });

    return NextResponse.json({ success: true, bookings });
  } catch (error) {
    return NextResponse.json(
      { message: "Something went wrong", error: (error as Error).message },
      { status: 500 },
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: Object.fromEntries(req.headers.entries()),
    });

    if (!session?.user) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 },
      );
    }

    await connectDB();

    const body = await req.json();
    const { hotel, room, checkInDate, checkOutDate, guests, totalPrice } = body;

    if (!hotel || !room || !checkInDate || !checkOutDate || !guests || totalPrice == null) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 },
      );
    }

    const fromDate = new Date(checkInDate);
    const toDate = new Date(checkOutDate);

    if (fromDate >= toDate) {
      return NextResponse.json(
        { message: "Check-out must be after check-in" },
        { status: 400 },
      );
    }

    const roomDoc = await Room.findById(room);
    if (!roomDoc) {
      return NextResponse.json(
        { message: "Room not found" },
        { status: 404 },
      );
    }

    if (guests > roomDoc.capacity) {
      return NextResponse.json(
        { message: `Room capacity is ${roomDoc.capacity} guests` },
        { status: 400 },
      );
    }

    const overlapping = await Booking.find({
      room,
      status: { $ne: "cancelled" },
      checkInDate: { $lt: toDate },
      checkOutDate: { $gt: fromDate },
    });

    if (overlapping.length >= roomDoc.quantity) {
      return NextResponse.json(
        { message: "Room is no longer available for the selected dates" },
        { status: 409 },
      );
    }

    const booking = await Booking.create({
      user: session.user.id,
      hotel,
      room,
      checkInDate: fromDate,
      checkOutDate: toDate,
      guests,
      totalPrice,
      status: "confirmed",
    });

    return NextResponse.json(
      { success: true, booking },
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Something went wrong", error: (error as Error).message },
      { status: 500 },
    );
  }
}
