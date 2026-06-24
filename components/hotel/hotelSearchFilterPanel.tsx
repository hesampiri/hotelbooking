"use client";

import { useState } from "react";
import { Star, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export interface SearchFilters {
  stars: number[];
  amenities: string[];
  sortBy: "rating" | "name" | "stars";
}

interface HotelSearchFilterPanelProps {
  filters: SearchFilters;
  onChange: (filters: SearchFilters) => void;
  allAmenities: string[];
  resultCount: number;
  mobileOpen: boolean;
  onMobileClose: () => void;
}

const HotelSearchFilterPanel = ({
  filters,
  onChange,
  allAmenities,
  resultCount,
  mobileOpen,
  onMobileClose,
}: HotelSearchFilterPanelProps) => {
  const [expandedAmenities, setExpandedAmenities] = useState(false);

  function toggleStar(star: number) {
    const stars = filters.stars.includes(star)
      ? filters.stars.filter((s) => s !== star)
      : [...filters.stars, star];
    onChange({ ...filters, stars });
  }

  function toggleAmenity(amenity: string) {
    const amenities = filters.amenities.includes(amenity)
      ? filters.amenities.filter((a) => a !== amenity)
      : [...filters.amenities, amenity];
    onChange({ ...filters, amenities });
  }

  function clearAll() {
    onChange({ stars: [], amenities: [], sortBy: "rating" });
  }

  const displayedAmenities = expandedAmenities
    ? allAmenities
    : allAmenities.slice(0, 6);

  const hasActiveFilters =
    filters.stars.length > 0 || filters.amenities.length > 0;

  const panel = (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-foreground">Filters</h2>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAll}
            className="text-xs h-7 px-2"
          >
            Clear all
          </Button>
        )}
      </div>

      <p className="text-sm text-muted-foreground">{resultCount} hotels found</p>

      <Separator />

      <div className="space-y-3">
        <h3 className="text-sm font-medium text-foreground">Star Rating</h3>
        <div className="flex flex-col gap-2">
          {[5, 4, 3, 2, 1].map((star) => (
            <label
              key={star}
              className="flex items-center gap-2 cursor-pointer group"
            >
              <input
                type="checkbox"
                checked={filters.stars.includes(star)}
                onChange={() => toggleStar(star)}
                className="rounded border-gray-300 text-primary focus:ring-primary"
              />
              <div className="flex items-center gap-0.5">
                {Array.from({ length: star }).map((_, i) => (
                  <Star
                    key={i}
                    className="h-3.5 w-3.5 fill-amber-400 text-amber-400"
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">& up</span>
            </label>
          ))}
        </div>
      </div>

      <Separator />

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-foreground">Amenities</h3>
          {filters.amenities.length > 0 && (
            <Badge variant="secondary" className="text-xs px-1.5 py-0">
              {filters.amenities.length}
            </Badge>
          )}
        </div>
        <div className="flex flex-wrap gap-1.5">
          {displayedAmenities.map((amenity) => (
            <Badge
              key={amenity}
              variant={
                filters.amenities.includes(amenity) ? "default" : "outline"
              }
              className="cursor-pointer text-xs transition-colors"
              onClick={() => toggleAmenity(amenity)}
            >
              {amenity}
            </Badge>
          ))}
        </div>
        {allAmenities.length > 6 && (
          <Button
            variant="ghost"
            size="sm"
            className="text-xs h-7 px-2"
            onClick={() => setExpandedAmenities(!expandedAmenities)}
          >
            {expandedAmenities
              ? "Show less"
              : `Show all (${allAmenities.length})`}
          </Button>
        )}
      </div>

      <Separator />

      <div className="space-y-3">
        <h3 className="text-sm font-medium text-foreground">Sort by</h3>
        <div className="flex flex-col gap-2">
          {[
            { value: "rating", label: "Highest rating" },
            { value: "stars", label: "Star rating" },
            { value: "name", label: "Name (A-Z)" },
          ].map((option) => (
            <label
              key={option.value}
              className="flex items-center gap-2 cursor-pointer"
            >
              <input
                type="radio"
                name="sortBy"
                value={option.value}
                checked={filters.sortBy === option.value}
                onChange={() =>
                  onChange({ ...filters, sortBy: option.value as SearchFilters["sortBy"] })
                }
                className="border-gray-300 text-primary focus:ring-primary"
              />
              <span className="text-sm text-foreground">{option.label}</span>
            </label>
          ))}
        </div>
      </div>

      {hasActiveFilters && (
        <>
          <Separator />
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-foreground">
              Active filters
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {filters.stars.map((star) => (
                <Badge
                  key={`star-${star}`}
                  variant="secondary"
                  className="text-xs cursor-pointer gap-1"
                  onClick={() => toggleStar(star)}
                >
                  {star}★ <X className="h-3 w-3" />
                </Badge>
              ))}
              {filters.amenities.map((amenity) => (
                <Badge
                  key={`amenity-${amenity}`}
                  variant="secondary"
                  className="text-xs cursor-pointer gap-1"
                  onClick={() => toggleAmenity(amenity)}
                >
                  {amenity} <X className="h-3 w-3" />
                </Badge>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop panel */}
      <div className="hidden lg:block w-64 shrink-0">
        <div className="sticky top-24 rounded-xl border bg-card p-4">{panel}</div>
      </div>

      {/* Mobile panel */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={onMobileClose}
          />
          <div className="absolute right-0 top-0 bottom-0 w-80 max-w-full bg-card p-4 overflow-y-auto shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Filters</h2>
              <Button variant="ghost" size="sm" onClick={onMobileClose}>
                <X className="h-5 w-5" />
              </Button>
            </div>
            {panel}
          </div>
        </div>
      )}
    </>
  );
};

export default HotelSearchFilterPanel;
