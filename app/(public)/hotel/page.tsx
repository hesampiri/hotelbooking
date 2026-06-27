import Footer from "@/components/Footer";
import HotelList from "@/components/hotel/hotelList";
import { DatePickerRange } from "@/components/search/datePickerRange";
import SearchButton from "@/components/search/searchButton";
import SearchInput from "@/components/search/searchInput";

const HotelPage = () => {
  return (
    <div>
      <div className="xl:px-60 md:px-10 sm:px-5 ">
        <div className="flex flex-col sm:flex-row w-full mx-auto items-stretch sm:items-start gap-2 py-6 px-2 ">
          <SearchInput />
          <DatePickerRange />
          <SearchButton />
        </div>
        <HotelList />
      </div>
      <Footer/>
    </div>
  );
};

export default HotelPage;
