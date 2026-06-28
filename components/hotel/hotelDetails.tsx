"use client";

import { getHotelDetails } from "@/features/hotel/queries/hotelApi";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import HotelGallery from "./hotelGallery";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import AvailableRooms from "./availableRooms";
import { Check, MapPin, Star } from "lucide-react";
import HotelDetailSkeleton from "../HotelDetailSkeleton";
import RoomFilterSection from "../RoomFilterSection";
import HotelMap from "../map/HotelMapWrapper";
import ReviewSection from "./reviewSection";

const HotelDetails = () => {
  const { id } = useParams<{ id: string }>();

  const {
    data: hotel,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["hotelDetails", id],
    queryFn: () => getHotelDetails(id),
    enabled: !!id,
  });

  const markers = {
    id: hotel?._id,
    name: hotel?.name,
    lat: hotel?.location.coordinates[0],
    lng: hotel?.location?.coordinates[1],
    rating: hotel?.rating,
    city: hotel?.city,
    country: hotel?.country,
    imageUrl: hotel?.images?.[0],
  };

  if (error) {
    return (
      <div className="text-sm text-gray-500">
        Something went wrong loading hotels.
      </div>
    );
  }
  if (isLoading) {
    return <HotelDetailSkeleton />;
  }

  if (!hotel) {
    return <div className="text-sm text-gray-500">Hotel not found.</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-8 ">
      <HotelGallery images={hotel.images} />

      <div className="space-y-6">
        <div className="space-y-2">
          <div className="flex items-start justify-between gap-4">
            <h1 className="text-2xl font-bold text-foreground">{hotel.name}</h1>
            <Badge
              variant="secondary"
              className="flex items-center gap-1 shrink-0 px-2 py-1"
            >
              <Star className="h-4 w-4 fill-foreground text-foreground" />
              <span className="text-sm font-medium">
                {hotel.rating?.toFixed(1) ?? "New"}
              </span>
            </Badge>
          </div>

          <div className="flex items-center gap-1 text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span className="text-sm">
              {hotel.address}, {hotel.city}, {hotel.country}
            </span>
          </div>

          {hotel.stars > 0 && (
            <div className="flex items-center gap-1">
              {Array.from({ length: hotel.stars }).map((_, i) => (
                <Star
                  key={i}
                  className="h-4 w-4 fill-amber-400 text-amber-400"
                />
              ))}
            </div>
          )}
        </div>

        <Separator />

        <div>
          <h2 className="text-lg font-semibold text-foreground mb-2">
            About this hotel
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {hotel.description}
          </p>
        </div>

        {hotel.amenities.length > 0 && (
          <>
            <Separator />
            <div>
              <h2 className="text-lg font-semibold text-foreground mb-3">
                Amenities
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {hotel.amenities.map((amenity: string) => (
                  <div
                    key={amenity}
                    className="flex items-center gap-2 text-sm text-foreground"
                  >
                    <Check className="h-4 w-4 text-green-600 shrink-0" />
                    {amenity}
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {hotel.rooms && hotel.rooms.length > 0 && (
          <>
            <Separator />
            <RoomFilterSection hotelId={hotel._id} />
            <AvailableRooms hotelId={id} />
          </>
        )}
        <Separator />
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-4">
            Hotel&apos;s Location
          </h2>
          <div className="w-full h-75">
            <HotelMap
              hotels={[markers]}
              className="w-full h-full rounded-xl overflow-hidden z-10"
            />
          </div>
        </div>
      </div>
      <div>
        <ReviewSection/>
      </div>
    </div>
  );
};

export default HotelDetails;
