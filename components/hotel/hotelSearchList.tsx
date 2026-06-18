"use client";
import { useQuery } from "@tanstack/react-query";
import { getHotels } from "@/features/hotel/queries/hotelApi";
import { HotelType } from "@/types";
import { useSearchParams } from "next/navigation";

const HotelSearchList = () => {
  const searchParams = useSearchParams();
  const params = Object.fromEntries(searchParams.entries());
  const {
    data: hotels,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["hotels", params],
    queryFn: () => getHotels(params),
  });

  if (isLoading) {
    return <div>loading ... </div>;
  }

  return (
    <div>
      <h1>hotel list</h1>
      <div>
        {hotels && hotels.length > 0 ? (
          <div>
            {/* Render the hotel list here */}
            {hotels.map((hotel: HotelType) => (
              <div key={hotel._id}>{hotel.name}</div>
            ))}
          </div>
        ) : (
          <div>No hotels found.</div>
        )}
      </div>
    </div>
  );
};

export default HotelSearchList;
