import HotelSearchList from "@/components/hotel/hotelSearchList";
import HotelSearchCardSkeleton from "@/components/hotelSearchCardSkeleton";
import { Suspense } from "react";

const hotelSearchPage = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <Suspense fallback={<HotelSearchCardSkeleton />}>
        <HotelSearchList />
      </Suspense>
    </div>
  );
};

export default hotelSearchPage;
