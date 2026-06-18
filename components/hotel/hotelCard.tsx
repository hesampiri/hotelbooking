"use client"
import { Star } from "lucide-react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { HotelType } from "@/types";

const HotelCard = ({ hotel }: { hotel: HotelType }) => {
  return (
    <Card className="group cursor-pointer border-0 shadow-none bg-transparent p-0 ">
      <CardContent className="flex flex-col gap-2 p-0 max-h-75">
        {/* Image */}
        <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-muted">
          {hotel.images ? (
            <Image
              src={"/images/ChatGPT Image Jun 17, 2026, 08_58_02 AM.png"}
              alt={hotel.name}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="h-full w-full bg-muted" />
          )}
        </div>

        {/* Info */}
        <div className="flex flex-col gap-0.5 p-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-foreground truncate">
              {hotel.name}
            </span>
            <Badge
              variant="secondary"
              className="flex items-center gap-0.5 shrink-0 ml-2 px-1.5 py-0.5"
            >
              <Star className="h-3.5 w-3.5 fill-foreground text-foreground" />
              <span className="text-sm">
                {hotel.rating?.toFixed(1) ?? "New"}
              </span>
            </Badge>
          </div>

          {hotel.location && (
            <p className="text-sm text-muted-foreground">
              {hotel.country}, {hotel.city}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
export default HotelCard