import Footer from "@/components/Footer";
import HotelDetails from "@/components/hotel/hotelDetails";

const HotelDetailsPage = () => {
  return (
    <div>
      <div className="xl:px-60 md:px-10 sm:px-5">
        <HotelDetails />
      </div>
      <Footer />
    </div>
  );
};

export default HotelDetailsPage;
