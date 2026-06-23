import  { useState } from "react";
import { DatePickerRange } from "./search/datePickerRange";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { useFilterStore } from "@/providers/filter-store-provider";
import { format } from "date-fns";

const RoomFilterSection = ({ hotelId }: { hotelId: string }) => {
  const router = useRouter();
  const dateRange = useFilterStore((state) => state.dateRange);
  const formattedDateRange = {
    from: dateRange?.from ? format(dateRange.from, "yyyy-MM-dd") : undefined,
    to: dateRange?.to ? format(dateRange.to, "yyyy-MM-dd") : undefined,
  };
  const [guests, setguests] = useState("1");

  function handleDateCheck() {
    router.push(
      `?from=${formattedDateRange.from}&to=${formattedDateRange.to}&guests=${guests}`,
      { scroll: false },
    );
  }


  return (
    <div className="flex flex-col md:flex-row items-stretch md:items-end gap-3 my-10 w-full">
      <DatePickerRange />

      <div className="relative flex-1 sm:flex-0 min-w-[150px]">
        <span className="absolute w-auto -top-2 left-3 bg-background px-1 text-xs text-muted-foreground">
          Guests
        </span>
        <Input
          type="number"
          className="h-12 w-full"
          onChange={(e) => setguests(e.target.value)}
          value={guests}
        />
      </div>

      <Button className="h-12 w-full md:w-32" onClick={handleDateCheck}>
        Check
      </Button>
    </div>
  );
};

export default RoomFilterSection;
