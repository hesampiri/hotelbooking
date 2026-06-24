"use client";
import { useQuery } from "@tanstack/react-query";
import { getHotels } from "@/features/hotel/queries/hotelApi";
import { HotelType } from "@/types";
import { useSearchParams, useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import HotelSearchCard from "./hotelSearchCard";
import HotelSearchFilterPanel, {
  type SearchFilters,
} from "./hotelSearchFilterPanel";
import { Button } from "@/components/ui/button";
import { SlidersHorizontal } from "lucide-react";

const HotelSearchList = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const params = Object.fromEntries(searchParams.entries());

  const [filters, setFilters] = useState<SearchFilters>({
    stars: [],
    amenities: [],
    sortBy: "rating",
  });
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const {
    data: hotels,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["hotels", params],
    queryFn: () => getHotels(params),
  });

  const allAmenities = useMemo(() => {
    if (!hotels) return [];
    const set = new Set<string>();
    hotels.forEach((h: HotelType) =>
      h.amenities?.forEach((a) => set.add(a)),
    );
    return Array.from(set).sort();
  }, [hotels]);

  const filteredHotels = useMemo(() => {
    if (!hotels) return [];

    let result = [...hotels];

    if (filters.stars.length > 0) {
      result = result.filter((h: HotelType) =>
        filters.stars.some((s) => h.stars >= s),
      );
    }

    if (filters.amenities.length > 0) {
      result = result.filter((h: HotelType) =>
        filters.amenities.every((a) => h.amenities?.includes(a)),
      );
    }

    result.sort((a: HotelType, b: HotelType) => {
      switch (filters.sortBy) {
        case "rating":
          return (b.rating ?? 0) - (a.rating ?? 0);
        case "stars":
          return (b.stars ?? 0) - (a.stars ?? 0);
        case "name":
          return a.name.localeCompare(b.name);
        default:
          return 0;
      }
    });

    return result;
  }, [hotels, filters]);

  function handleHotelClick(id: string) {
    const from = params.from;
    const to = params.to;
    const query = new URLSearchParams();
    if (from) query.set("from", from);
    if (to) query.set("to", to);
    const qs = query.toString();
    router.push(`/hotel/${id}${qs ? `?${qs}` : ""}`);
  }

  if (isLoading) {
    return (
      <div className="flex gap-6">
        <div className="hidden lg:block w-64 shrink-0">
          <div className="sticky top-24 rounded-xl border bg-card p-4 h-96 animate-pulse" />
        </div>
        <div className="flex-1 space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-44 rounded-xl bg-muted animate-pulse"
            />
          ))}
        </div>
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

  return (
    <div className="flex flex-row-reverse gap-6">
      <HotelSearchFilterPanel
        filters={filters}
        onChange={setFilters}
        allAmenities={allAmenities}
        resultCount={filteredHotels.length}
        mobileOpen={mobileFiltersOpen}
        onMobileClose={() => setMobileFiltersOpen(false)}
      />

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-semibold text-foreground">
            Search Results
          </h1>
          <Button
            variant="outline"
            size="sm"
            className="lg:hidden gap-1.5"
            onClick={() => setMobileFiltersOpen(true)}
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filters
          </Button>
        </div>

        {filteredHotels.length > 0 ? (
          <div className="space-y-3">
            {filteredHotels.map((hotel: HotelType) => (
              <HotelSearchCard
                key={hotel._id}
                hotel={hotel}
                onClick={() => handleHotelClick(hotel._id)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-muted-foreground">
            No hotels match your filters.
          </div>
        )}
      </div>
    </div>
  );
};

export default HotelSearchList;
