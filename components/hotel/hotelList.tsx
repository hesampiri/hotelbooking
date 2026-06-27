"use client";
import { useQuery } from "@tanstack/react-query";
import { getHotels } from "@/features/hotel/queries/hotelApi";
import { HotelType } from "@/types";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import HotelCard from "./hotelCard";
import HotelMapWrapper, {
  type HotelMarker,
} from "@/components/map/HotelMapWrapper";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import HotelCardSkeleton from "../HotelCardSkeleton";
import { useFilterStore } from "@/providers/filter-store-provider";
import { format } from "date-fns";

const HotelList = () => {
  const dateRange = useFilterStore((state) => state.dateRange);
  const formattedDateRange = {
    from: dateRange?.from ? format(dateRange.from, "yyyy-MM-dd") : undefined,
    to: dateRange?.to ? format(dateRange.to, "yyyy-MM-dd") : undefined,
  };

  const {
    data: hotels,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["hotels"],
    queryFn: () => getHotels(),
  });

  const tehranHotels = useMemo(
    () => hotels?.filter((h: HotelType) => h.city === "Tehran") ?? [],
    [hotels],
  );

  const kishHotels = useMemo(
    () => hotels?.filter((h: HotelType) => h.city === "Kish") ?? [],
    [hotels],
  );

  const markers: HotelMarker[] = hotels?.map((h: HotelType) => ({
    id: h._id,
    name: h.name,
    lat: h.location.coordinates[0],
    lng: h.location?.coordinates[1],
    rating: h.rating,
    city: h.city,
    country: h.country,
    pricePerNight: h.rooms[0].pricePerNight,
    imageUrl: h.images?.[0],
  }));

  const router = useRouter();

  function routeHandler(id: string) {
    router.push(
      `/hotel/${id}?from=${formattedDateRange.from}&to=${formattedDateRange.to}`,
    );
  }

  if (isLoading) {
    return (
      <div className="grid md:grid-cols-4 grid-rows-4 gap-6 p-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <HotelCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-sm text-gray-500">
        Something went wrong loading hotels.
      </div>
    );
  }

  if (!hotels || hotels.length === 0) {
    return <div className="text-sm text-gray-500">No hotels found.</div>;
  }

  return (
    <div className="w-full px-2">
      <h1 className="text-2xl font-semibold text-foreground mb-6">Hotels</h1>
      <div>
        <Carousel
          opts={{
            align: "start",
            slidesToScroll: 1,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-4 px-2">
            {hotels.map((hotel: HotelType) => (
              <CarouselItem
                onClick={() => routeHandler(hotel._id)}
                key={hotel._id}
                className="pl-4 basis-full sm:basis-1/3 lg:basis-1/3 xl:basis-1/4"
              >
                <HotelCard hotel={hotel} />
              </CarouselItem>
            ))}
          </CarouselContent>

          <CarouselPrevious className="-left-5 border border-gray-300 bg-white shadow-sm hover:bg-gray-50 size-12 hidden sm:flex" />
          <CarouselNext className="-right-5 border border-gray-300 bg-white shadow-sm hover:bg-gray-50 size-12 hidden sm:flex" />
        </Carousel>
      </div>
      <div className="py-10">
        <h1 className="text-2xl font-semibold text-foreground mb-6">
          Theran Hotels
        </h1>
        <Carousel
          opts={{
            align: "start",
            slidesToScroll: 1,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-4 px-2">
            {tehranHotels.map((hotel: HotelType) => (
              <CarouselItem
                onClick={() => routeHandler(hotel._id)}
                key={hotel._id}
                className="pl-4 basis-full sm:basis-1/3 lg:basis-1/3 xl:basis-1/4"
              >
                <HotelCard hotel={hotel} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="-left-5 border border-gray-300 bg-white shadow-sm hover:bg-gray-50 size-12 hidden sm:flex" />
          <CarouselNext className="-right-5 border border-gray-300 bg-white shadow-sm hover:bg-gray-50 size-12 hidden sm:flex" />
        </Carousel>
      </div>
      <div>
        <h1 className="text-2xl font-semibold text-foreground mb-6">
          Kish Hotels
        </h1>
        <Carousel
          opts={{
            align: "start",
            slidesToScroll: 1,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-4 px-2">
            {kishHotels.map((hotel: HotelType) => (
              <CarouselItem
                onClick={() => routeHandler(hotel._id)}
                key={hotel._id}
                className="pl-4 basis-full sm:basis-1/3 lg:basis-1/3 xl:basis-1/4"
              >
                <HotelCard hotel={hotel} />
              </CarouselItem>
            ))}
          </CarouselContent>

          <CarouselPrevious className="-left-5 border border-gray-300 bg-white shadow-sm hover:bg-gray-50 size-12 hidden sm:flex" />
          <CarouselNext className="-right-5 border border-gray-300 bg-white shadow-sm hover:bg-gray-50 size-12 hidden sm:flex" />
        </Carousel>
      </div>
      <div className="w-full h-75 border my-10 rounded ">
        <HotelMapWrapper
          hotels={markers}
          className="w-full h-full rounded-xl overflow-hidden"
        />
      </div>
    </div>
  );
};

export default HotelList;
