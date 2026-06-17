import { connectDB } from "@/lib/mongodb";
import Booking from "@/models/Booking";
import Hotel from "@/models/Hotel";
import "@/models/Room";
import { RoomType } from "@/types";
import { NextRequest, NextResponse } from "next/server";

interface FilterType {
  city?: {
    $regex: string;
    $options: string;
  };
}

export async function GET(req: NextRequest) {
  await connectDB();
  const { searchParams } = new URL(req.url);
  const destination = searchParams.get("destination");
  const from = searchParams.get("from");
  const to = searchParams.get("to");
  const filter: FilterType = {};

  if (destination) {
    filter.city = { $regex: destination, $options: "i" };
  }

  try {
    const allHotels = await Hotel.find(filter).populate("rooms");
    let hotels;

    if (from && to) {
      const fromDate = new Date(from as string);
      const toDate = new Date(to as string);

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
      // 4. Find overlapping bookings for this date range
      const overlappingBookings = await Booking.find({
        status: { $ne: "cancelled" },
        checkInDate: { $lt: toDate },
        checkOutDate: { $gt: fromDate },
      });

      const bookedCountMap: Record<string, number> = {};
      overlappingBookings.forEach((booking) => {
        const roomId = booking.room.toString();
        bookedCountMap[roomId] = (bookedCountMap[roomId] || 0) + 1;
      });

      const availableHotels = allHotels.filter((hotel) => {
        return hotel.rooms.some((room: RoomType) => {
          const bookedCount = bookedCountMap[room._id.toString()] || 0;
          // const guestCount  = guests ? Number(guests) : 1;

          return room.quantity > bookedCount;
        });
      });
      hotels = availableHotels;
      return NextResponse.json({ success: true, hotels }, { status: 200 });
    }
    hotels = allHotels;
    return NextResponse.json({ success: true, hotels }, { status: 200 });
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
