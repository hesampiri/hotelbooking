"use client";

import { useMemo, useState } from "react";
import { useSearchParams, useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { format, differenceInCalendarDays } from "date-fns";
import { useQuery } from "@tanstack/react-query";
import { Loader2, CalendarIcon, Users, CreditCard } from "lucide-react";

import { getHotelDetails, getRooms } from "@/features/hotel/queries/hotelApi";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import type { RoomType } from "@/types";

const bookingSchema = z
  .object({
    checkInDate: z.date({ error: "Check-in date is required" }),
    checkOutDate: z.date({ error: "Check-out date is required" }),
    guests: z
      .number({ error: "Number of guests is required" })
      .min(1, "At least 1 guest")
      .max(10, "Maximum 10 guests"),
  })
  .refine((data) => data.checkOutDate > data.checkInDate, {
    message: "Check-out must be after check-in",
    path: ["checkOutDate"],
  });

type BookingValues = z.infer<typeof bookingSchema>;

const BookingForm = () => {
  const { id: hotelId } = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const router = useRouter();

  const roomId = searchParams.get("roomId") ?? "";
  const fromParam = searchParams.get("from") ?? "";
  const toParam = searchParams.get("to") ?? "";
  const guestParam = searchParams.get("guests") ?? "";

  const defaultCheckIn = fromParam ? new Date(fromParam) : new Date();
  const defaultCheckOut = toParam ? new Date(toParam) : new Date();

  const [status, setStatus] = useState("");
  const [checkInOpen, setCheckInOpen] = useState(false);
  const [checkOutOpen, setCheckOutOpen] = useState(false);

  const form = useForm<BookingValues>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      checkInDate: defaultCheckIn,
      checkOutDate: defaultCheckOut,
      guests: Number(guestParam),
    },
  });

  const { data: hotel, isLoading: hotelLoading } = useQuery({
    queryKey: ["hotelDetails", hotelId],
    queryFn: () => getHotelDetails(hotelId),
    enabled: !!hotelId,
  });

  const { data: rooms, isLoading: roomsLoading } = useQuery({
    queryKey: ["rooms", hotelId, fromParam, toParam],
    queryFn: () => getRooms(hotelId, { from: fromParam, to: toParam }),
    enabled: !!hotelId && !!fromParam && !!toParam,
  });

  const selectedRoom = useMemo(() => {
    if (!rooms || !roomId) return null;
    return rooms.find((r: RoomType) => r._id === roomId) ?? null;
  }, [rooms, roomId]);

  const watchCheckIn = form.watch("checkInDate");
  const watchCheckOut = form.watch("checkOutDate");
  const watchGuests = form.watch("guests");

  const nights = useMemo(() => {
    if (!watchCheckIn || !watchCheckOut) return 0;
    const diff = differenceInCalendarDays(watchCheckOut, watchCheckIn);
    return diff > 0 ? diff : 0;
  }, [watchCheckIn, watchCheckOut]);

  const totalPrice = useMemo(() => {
    if (!selectedRoom || nights <= 0) return 0;
    return selectedRoom.pricePerNight * nights;
  }, [selectedRoom, nights]);

  const onSubmit = async (data: BookingValues) => {
    setStatus("loading");
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          hotel: hotelId,
          room: roomId,
          checkInDate: data.checkInDate.toISOString(),
          checkOutDate: data.checkOutDate.toISOString(),
          guests: data.guests,
          totalPrice,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || "Failed to create booking");
      }

      setStatus("success");
      router.push("/booking");
    } catch (err: unknown) {
      setStatus("");
      const message =
        err instanceof Error ? err.message : "Something went wrong";
      alert(message);
    }
  };

  if (hotelLoading || roomsLoading) {
    return (
      <Card className="mx-auto max-w-lg">
        <CardContent className="flex items-center justify-center py-16">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  if (!selectedRoom) {
    return (
      <Card className="mx-auto max-w-lg">
        <CardContent className="py-16 text-center text-muted-foreground">
          Room not found. Please go back and select a room.
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mx-auto max-w-lg mt-10">
      <CardHeader>
        <CardTitle>Book Your Stay</CardTitle>
        <CardDescription>
          {hotel?.name} &middot; {selectedRoom.name}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FieldGroup>
            <Field>
              <FieldLabel>Check-in Date</FieldLabel>
              <Popover open={checkInOpen} onOpenChange={setCheckInOpen}>
                <PopoverTrigger asChild>
                  <div className="relative">
                    <Input
                      readOnly
                      value={
                        watchCheckIn
                          ? format(watchCheckIn, "MMM dd, yyyy")
                          : "Select date"
                      }
                      className="cursor-pointer pr-10"
                    />
                    <CalendarIcon className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  </div>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={watchCheckIn}
                    onSelect={(date) => {
                      if (date) {
                        form.setValue("checkInDate", date, {
                          shouldValidate: true,
                        });
                        setCheckInOpen(false);
                      }
                    }}
                    disabled={(date) =>
                      date < new Date(new Date().setHours(0, 0, 0, 0))
                    }
                  />
                </PopoverContent>
              </Popover>
              <FieldError>
                {form.formState.errors.checkInDate?.message}
              </FieldError>
            </Field>

            <Field>
              <FieldLabel>Check-out Date</FieldLabel>
              <Popover open={checkOutOpen} onOpenChange={setCheckOutOpen}>
                <PopoverTrigger asChild>
                  <div className="relative">
                    <Input
                      readOnly
                      value={
                        watchCheckOut
                          ? format(watchCheckOut, "MMM dd, yyyy")
                          : "Select date"
                      }
                      className="cursor-pointer pr-10"
                    />
                    <CalendarIcon className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  </div>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={watchCheckOut}
                    onSelect={(date) => {
                      if (date) {
                        form.setValue("checkOutDate", date, {
                          shouldValidate: true,
                        });
                        setCheckOutOpen(false);
                      }
                    }}
                    disabled={(date) =>
                      date <= watchCheckIn ||
                      date < new Date(new Date().setHours(0, 0, 0, 0))
                    }
                  />
                </PopoverContent>
              </Popover>
              <FieldError>
                {form.formState.errors.checkOutDate?.message}
              </FieldError>
            </Field>

            <Field>
              <FieldLabel>Guests</FieldLabel>
              <div className="relative">
                <Input
                  type="number"
                  min={1}
                  max={selectedRoom.capacity}
                  {...form.register("guests", { valueAsNumber: true })}
                  className="pl-10"
                />
                <Users className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              </div>
              <FieldError>{form.formState.errors.guests?.message}</FieldError>
            </Field>
          </FieldGroup>

          <Separator />

          <div className="space-y-2">
            <h3 className="text-sm font-medium text-foreground">
              Booking Summary
            </h3>
            <div className="rounded-lg border p-3 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Room</span>
                <span className="font-medium">{selectedRoom.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Dates</span>
                <span className="font-medium">
                  {format(watchCheckIn, "MMM dd")} &ndash;{" "}
                  {format(watchCheckOut, "MMM dd, yyyy")}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Nights</span>
                <span className="font-medium">{nights}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Guests</span>
                <span className="font-medium">{watchGuests}</span>
              </div>
              <Separator />
              <div className="flex justify-between text-base">
                <span className="font-semibold">Total</span>
                <span className="font-bold flex items-center gap-1">
                  <CreditCard className="h-4 w-4" />$
                  {totalPrice.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={nights <= 0}>
            {status === "loading" && (
              <Loader2 className="h-5 w-5 animate-spin" />
            )}
            {status === "success" && "Booked!"}
            {status === "" && "Confirm Booking"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default BookingForm;
