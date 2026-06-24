"use client";
import { Star, MapPin } from "lucide-react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { HotelType } from "@/types";

const HotelSearchCard = ({
  hotel,
  onClick,
}: {
  hotel: HotelType;
  onClick?: () => void;
}) => {
  const pricePerNight = hotel.rooms?.[0]?.pricePerNight;

  return (
    <Card
      className="group border-0 shadow-md hover:shadow-lg transition-shadow bg-card p-0"
    >
      <CardContent className="flex flex-col sm:flex-row gap-0 sm:gap-4 p-0">
        <div className="relative w-full h-48 sm:w-56 sm:h-44 shrink-0 overflow-hidden sm:rounded-l-xl rounded-t-xl bg-muted">
          {hotel.images?.[0] ? (
            <Image
              src={hotel.images[0]}
              alt={hotel.name}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="h-full w-full bg-muted" />
          )}
        </div>

        <div className="flex flex-col justify-between py-3 px-4 sm:pr-4 flex-1 min-w-0">
          <div className="space-y-1">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-base font-semibold text-foreground truncate">
                {hotel.name}
              </h3>
              <Badge
                variant="secondary"
                className="flex items-center gap-0.5 shrink-0 px-1.5 py-0.5"
              >
                <Star className="h-3.5 w-3.5 fill-foreground text-foreground" />
                <span className="text-sm">
                  {hotel.rating?.toFixed(1) ?? "New"}
                </span>
              </Badge>
            </div>

            {hotel.location && (
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <MapPin className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate">
                  {hotel.city}, {hotel.country}
                </span>
              </div>
            )}

            {hotel.stars > 0 && (
              <div className="flex items-center gap-0.5">
                {Array.from({ length: hotel.stars }).map((_, i) => (
                  <Star
                    key={i}
                    className="h-3.5 w-3.5 fill-amber-400 text-amber-400"
                  />
                ))}
              </div>
            )}
          </div>

          {hotel.amenities?.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {hotel.amenities.slice(0, 2).map((amenity) => (
                <Badge
                  key={amenity}
                  variant="outline"
                  className="text-xs px-1.5 py-0"
                >
                  {amenity}
                </Badge>
              ))}
              {hotel.amenities.length > 2 && (
                <Badge variant="outline" className="text-xs px-1.5 py-0">
                  +{hotel.amenities.length - 2} more
                </Badge>
              )}
            </div>
          )}

          <div className="flex items-center justify-between gap-3 mt-3">
            <div>
              {pricePerNight != null ? (
                <p className="text-lg font-bold text-foreground">
                  ${pricePerNight}
                  <span className="text-sm font-normal text-muted-foreground ml-1">
                    / night
                  </span>
                </p>
              ) : (
                <p className="text-sm text-muted-foreground">Price on request</p>
              )}
            </div>
            <Button size="sm" onClick={onClick} className="shrink-0">
              View Rooms & Details
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default HotelSearchCard;
