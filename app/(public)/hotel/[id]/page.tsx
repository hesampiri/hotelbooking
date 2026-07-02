import Footer from "@/components/Footer";
import HotelDetails from "@/components/hotel/hotelDetails";
import { getHotelDetails } from "@/features/hotel/queries/hotelApi";
import {
  QueryClient,
  HydrationBoundary,
  dehydrate,
} from "@tanstack/react-query";

const HotelDetailsPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["hotelDetails", id],
    queryFn: () => getHotelDetails(id),
  });
  return (
    <div>
      <div className="xl:px-60 md:px-10 sm:px-5">
        <HydrationBoundary state={dehydrate(queryClient)}>
          <HotelDetails />
        </HydrationBoundary>
      </div>
      <Footer />
    </div>
  );
};

export default HotelDetailsPage;
