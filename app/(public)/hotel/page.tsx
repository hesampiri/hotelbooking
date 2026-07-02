import Footer from "@/components/Footer";
import HotelList from "@/components/hotel/hotelList";
import { DatePickerRange } from "@/components/search/datePickerRange";
import SearchButton from "@/components/search/searchButton";
import SearchInput from "@/components/search/searchInput";
import { getHotels } from "@/features/hotel/queries/hotelApi";
import {
  QueryClient,
  HydrationBoundary,
  dehydrate,
} from "@tanstack/react-query";

export default async function HotelPage() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["hotels"],
    queryFn: ()=> getHotels(),
  });

  return (
    <div>
      <div className="xl:px-60 md:px-10 sm:px-5">
        <div className="flex flex-col sm:flex-row w-full mx-auto items-stretch sm:items-start gap-2 py-6 px-2">
          <SearchInput />
          <DatePickerRange />
          <SearchButton />
        </div>

        <HydrationBoundary state={dehydrate(queryClient)}>
          <HotelList />
        </HydrationBoundary>
      </div>

      <Footer />
    </div>
  );
}