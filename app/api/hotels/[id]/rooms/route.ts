import { connectDB } from "@/lib/mongodb";
import Booking from "@/models/Booking";
import Room from "@/models/Room";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  await connectDB();

  const { id: hotelId } = await params;
  const { searchParams } = new URL(req.url);
  const guests = searchParams.get("guests");
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  const allRooms = await Room.find({ hotel: hotelId });

  if (from && to) {
    const fromDate = new Date(from);
    const toDate = new Date(to);

    if (isNaN(fromDate.getTime()) || isNaN(toDate.getTime())) {
      return NextResponse.json(
        { message: "Invalid date format. Use YYYY-MM-DD" },
        { status: 400 },
      );
    }

    if (fromDate >= toDate) {
      return NextResponse.json(
        { message: "Check-out must be after check-in" },
        { status: 400 },
      );
    }

    const overlappingBookings = await Booking.find({
      room: { $in: allRooms.map((r) => r._id) },
      status: { $ne: "cancelled" },
      checkInDate: { $lt: toDate },
      checkOutDate: { $gt: fromDate },
    });

    const bookedCountMap: Record<string, number> = {};
    overlappingBookings.forEach((booking) => {
      const roomId = booking.room.toString();
      bookedCountMap[roomId] = (bookedCountMap[roomId] || 0) + 1;
    });

    const availableRooms = allRooms.filter((room) => {
      const bookedCount = bookedCountMap[room._id.toString()] || 0;
      const guestCheck = guests ? room.capacity >= Number(guests) : true;
      return room.quantity > bookedCount && guestCheck;
    });

    return NextResponse.json(
      { success: true, rooms: availableRooms },
      { status: 200 },
    );
  }

  // No date filter — apply only guest filter if provided
  const rooms = guests
    ? allRooms.filter((room) => room.capacity >= Number(guests))
    : allRooms;

  return NextResponse.json({ success: true, rooms }, { status: 200 });
}
