"use client";
import { useFilterStore } from "@/providers/filter-store-provider";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
const SearchButton = () => {
  const destination = useFilterStore((state) => state.destination);
  const dateRange = useFilterStore((state) => state.dateRange);
  const formattedDateRange = {
    from: dateRange?.from ? format(dateRange.from, "yyyy-MM-dd") : undefined,
    to: dateRange?.to ? format(dateRange.to, "yyyy-MM-dd") : undefined,
  };
  const router = useRouter();

  const handleSearch = () => {
    router.push(
      `hotel/search?destination=${destination}&from=${formattedDateRange.from}&to=${formattedDateRange.to}`,
    );
  };
  return <Button className="grow text-md h-12" onClick={handleSearch}>Search</Button>;
};

export default SearchButton;
