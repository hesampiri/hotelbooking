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

const HotelList = () => {
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
  [hotels]
);

const kishHotels = useMemo(
  () => hotels?.filter((h: HotelType) => h.city === "Kish") ?? [],
  [hotels]
);

  const markers: HotelMarker[] = hotels?.map((h: HotelType) => ({
    id: h._id,
    name: h.name,
    lat: h.location.coordinates[0],
    lng: h.location?.coordinates[1],
    rating: h.rating,
    city: h.city,
    country: h.country,
    // pricePerNight: h.pricePerNight,
    imageUrl: h.images?.[0],
  }));

  const router = useRouter();

  function routeHandler(id: string) {
    router.push(`/hotel/${id}`);
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex flex-col gap-2 animate-pulse">
            <div className="aspect-square w-full rounded-xl bg-gray-200" />
            <div className="h-4 w-3/4 rounded bg-gray-200" />
            <div className="h-3 w-1/2 rounded bg-gray-200" />
            <div className="h-3 w-1/3 rounded bg-gray-200" />
          </div>
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
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Hotels</h1>
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

          <CarouselPrevious className="-left-5 border border-gray-300 bg-white shadow-sm hover:bg-gray-50 size-12" />
          <CarouselNext className="-right-5 border border-gray-300 bg-white shadow-sm hover:bg-gray-50 size-12" />
        </Carousel>
      </div>
      <div className="py-10">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">
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

          <CarouselPrevious className="-left-5 border border-gray-300 bg-white shadow-sm hover:bg-gray-50 size-12" />
          <CarouselNext className="-right-5 border border-gray-300 bg-white shadow-sm hover:bg-gray-50 size-12" />
        </Carousel>
      </div>
      <div>
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">
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

          <CarouselPrevious className="-left-5 border border-gray-300 bg-white shadow-sm hover:bg-gray-50 size-12" />
          <CarouselNext className="-right-5 border border-gray-300 bg-white shadow-sm hover:bg-gray-50 size-12" />
        </Carousel>
      </div>
      <div className="w-full h-[300px] border mt-5 rounded ">
        <HotelMapWrapper
          hotels={markers}
          className="w-full h-full rounded-xl overflow-hidden"
        />
      </div>
    </div>
  );
};

export default HotelList;
