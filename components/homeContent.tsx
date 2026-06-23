"use client";

import Image from "next/image";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { getHotels } from "@/features/hotel/queries/hotelApi";
import { HotelType } from "@/types";
import SearchInput from "@/components/search/searchInput";
import SearchButton from "@/components/search/searchButton";
import { DatePickerRange } from "@/components/search/datePickerRange";
import { Star, MapPin, ArrowUpRight, ChevronRight } from "lucide-react";

function HotelSpotlight({ hotel }: { hotel: HotelType }) {
  return (
    <Link
      href={`/hotel/${hotel._id}`}
      className="group relative block h-[420px] sm:h-[480px] overflow-hidden bg-foreground"
    >
      <Image
        src={hotel.images?.[0] || "/images/ChatGPT Image Jun 17, 2026, 08_58_02 AM.png"}
        alt={hotel.name}
        fill
        className="object-cover opacity-80 transition-all duration-700 group-hover:opacity-100 group-hover:scale-[1.03]"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
        <div className="flex items-center gap-2 mb-2">
          {hotel.stars > 0 &&
            Array.from({ length: hotel.stars }).map((_, i) => (
              <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
            ))}
        </div>
        <h3 className="text-2xl sm:text-3xl font-bold text-white mb-1">{hotel.name}</h3>
        <div className="flex items-center gap-1.5 text-white/70">
          <MapPin className="h-4 w-4" />
          <span className="text-sm">{hotel.city}, {hotel.country}</span>
        </div>
        {hotel.rooms?.[0]?.pricePerNight != null && (
          <div className="mt-4 inline-flex items-baseline gap-1.5 bg-white/10 backdrop-blur-sm rounded-lg px-3 py-1.5">
            <span className="text-xl font-bold text-white">${hotel.rooms[0].pricePerNight}</span>
            <span className="text-sm text-white/60">/ night</span>
          </div>
        )}
      </div>
      <div className="absolute top-4 right-4 h-10 w-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
        <ArrowUpRight className="h-5 w-5 text-white" />
      </div>
    </Link>
  );
}

function MiniHotelCard({ hotel }: { hotel: HotelType }) {
  return (
    <Link
      href={`/hotel/${hotel._id}`}
      className="group flex gap-4 p-3 rounded-xl hover:bg-muted/50 transition-colors"
    >
      <div className="relative h-20 w-20 rounded-lg overflow-hidden shrink-0 bg-muted">
        <Image
          src={hotel.images?.[0] || "/images/ChatGPT Image Jun 17, 2026, 08_58_02 AM.png"}
          alt={hotel.name}
          fill
          className="object-cover"
        />
      </div>
      <div className="flex flex-col justify-center min-w-0">
        <h4 className="text-sm font-semibold text-foreground truncate">{hotel.name}</h4>
        <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
          <MapPin className="h-3 w-3 shrink-0" />
          <span className="truncate">{hotel.city}</span>
        </div>
        {hotel.rooms?.[0]?.pricePerNight != null && (
          <span className="text-sm font-bold text-foreground mt-1">
            ${hotel.rooms[0].pricePerNight}
            <span className="font-normal text-muted-foreground"> /night</span>
          </span>
        )}
      </div>
    </Link>
  );
}

export default function HomeContent() {
  const { data: hotels } = useQuery({
    queryKey: ["hotels"],
    queryFn: () => getHotels(),
  });

  const featured = hotels?.slice(0, 1)?.[0];
  const sidebar = hotels?.slice(1, 5) ?? [];

  return (
    <>
      {/* ── Search ── */}
      <section className="border-b bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-col md:flex-row items-stretch gap-3">
            <div className="flex-1 min-w-0">
              <SearchInput />
            </div>
            <div className="flex items-center">
              <DatePickerRange />
            </div>
            <SearchButton />
          </div>
        </div>
      </section>

      {/* ── Featured + Sidebar ── */}
      {featured && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="flex items-baseline justify-between mb-6">
            <div>
              <p className="text-xs font-medium tracking-widest uppercase text-muted-foreground mb-1">
                Featured
              </p>
              <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
                Editor&apos;s Pick
              </h2>
            </div>
            <Link
              href="/hotel"
              className="hidden sm:flex items-center gap-1 text-sm font-medium text-foreground hover:text-muted-foreground transition-colors"
            >
              All hotels <ChevronRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <HotelSpotlight hotel={featured} />
            </div>
            <div className="flex flex-col gap-1">
              {sidebar.map((h: HotelType) => (
                <MiniHotelCard key={h._id} hotel={h} />
              ))}
              <Link
                href="/hotel"
                className="sm:hidden flex items-center justify-center gap-1 mt-2 text-sm font-medium text-foreground py-3 rounded-xl border hover:bg-muted/50 transition-colors"
              >
                View all hotels <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ── Horizontal scroll row ── */}
      {hotels && hotels.length > 0 && (
        <section className="bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
            <p className="text-xs font-medium tracking-widest uppercase text-muted-foreground mb-1">
              Browse
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-8">
              Recently Added
            </h2>

            <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide">
              {hotels.map((hotel: HotelType) => (
                <Link
                  key={hotel._id}
                  href={`/hotel/${hotel._id}`}
                  className="snap-start shrink-0 w-[280px] sm:w-[320px] group"
                >
                  <div className="relative h-48 rounded-xl overflow-hidden bg-muted mb-3">
                    <Image
                      src={hotel.images?.[0] || "/images/ChatGPT Image Jun 17, 2026, 08_58_02 AM.png"}
                      alt={hotel.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    {hotel.rating != null && (
                      <div className="absolute top-3 right-3 flex items-center gap-1 bg-black/50 backdrop-blur-sm text-white text-xs font-medium rounded-md px-2 py-1">
                        <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                        {hotel.rating.toFixed(1)}
                      </div>
                    )}
                  </div>
                  <h3 className="text-sm font-semibold text-foreground truncate">{hotel.name}</h3>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs text-muted-foreground">{hotel.city}</span>
                    {hotel.rooms?.[0]?.pricePerNight != null && (
                      <span className="text-sm font-bold text-foreground">
                        ${hotel.rooms[0].pricePerNight}
                        <span className="font-normal text-xs text-muted-foreground">/n</span>
                      </span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
