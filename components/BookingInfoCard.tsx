"use client";

import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { CalendarDays, CreditCard, Loader2, MapPin, Users } from "lucide-react";
import Image from "next/image";

import { Card , CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Booking, BookingStatus } from "@/types";

interface PopulatedBooking extends Omit<Booking, "hotel" | "room"> {
  hotel: { name: string; city: string; country: string; images: string[] };
  room: { name: string; images: string[]; pricePerNight: number };
}

const statusStyles: Record<BookingStatus, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  confirmed: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

async function fetchBookings(): Promise<PopulatedBooking[]> {
  const res = await fetch("/api/bookings");
  if (!res.ok) throw new Error("Failed to fetch bookings");
  const data = await res.json();
  return data.bookings;
}

const BookingInfoCard = () => {
  const {
    data: bookings,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["bookings"],
    queryFn: fetchBookings,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-16 text-center text-muted-foreground">
        Failed to load bookings. Please try again.
      </div>
    );
  }

  if (!bookings || bookings.length === 0) {
    return (
      <div className="py-16 text-center text-muted-foreground">
        You have no bookings yet.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {bookings.map((booking) => (
        <Card key={booking._id} className="p-0">
          <div className="flex flex-col md:flex-row">
            {/* Image — top on mobile, left on desktop */}
            {booking.hotel?.images?.[0] && (
              <div className="relative h-48 w-full shrink-0 overflow-hidden rounded-t-lg bg-muted md:h-auto md:w-48 md:rounded-l-lg md:rounded-t-none">
                <Image
                  src={booking.hotel.images[0]}
                  alt={booking.hotel.name}
                  fill
                  className="object-cover"
                />
              </div>
            )}

            {/* Content */}
            <div className="flex flex-1 flex-col justify-between p-4">
              {/* Header */}
              <div className="flex items-start justify-between gap-2">
                <CardTitle className="text-sm sm:text-base">
                  {booking.hotel?.name ?? "Hotel"}
                </CardTitle>
                <Badge
                  className={statusStyles[booking.status]}
                  variant="secondary"
                >
                  {booking.status}
                </Badge>
              </div>

              {/* Details */}
              <div className="mt-3 space-y-2 text-xs sm:text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-4 w-4 shrink-0" />
                  <span>
                    {booking.hotel?.city}, {booking.hotel?.country}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-muted-foreground">
                  <CalendarDays className="h-4 w-4 shrink-0" />
                  <span>
                    {format(new Date(booking.checkInDate), "MMM dd, yyyy")}{" "}
                    &ndash;{" "}
                    {format(new Date(booking.checkOutDate), "MMM dd, yyyy")}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-muted-foreground">
                  <Users className="h-4 w-4 shrink-0" />
                  <span>
                    {booking.guests} guest{booking.guests !== 1 ? "s" : ""}
                  </span>
                </div>
              </div>

              {/* Footer */}
              <div className="mt-3 flex flex-col gap-1 border-t pt-2 sm:flex-row sm:items-center sm:justify-between">
                <span className="text-sm text-muted-foreground">
                  {booking.room?.name}
                </span>
                <span className="flex items-center gap-1 font-semibold">
                  <CreditCard className="h-4 w-4" />$
                  {booking.totalPrice.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default BookingInfoCard;
