import { useSearchParams } from "next/navigation";
import { RoomType } from "@/types";
import { Card, CardContent } from "../ui/card";
import { Users, BedDouble, Maximize } from "lucide-react";
import { Badge } from "../ui/badge";
import { useQuery } from "@tanstack/react-query";
import { getRooms } from "@/features/hotel/queries/hotelApi";
import RoomCardSkeleton from "../RoomCardSkeleton";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import Image from "next/image";

const AvailableRooms = ({ hotelId }: { hotelId: string }) => {
  const searchParams = useSearchParams();
  const params = Object.fromEntries(searchParams.entries());
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const {
    data: rooms,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["rooms", params],
    queryFn: () => getRooms(hotelId, params),
    enabled: !!hotelId,
  });

  function getRoomBeds(room: RoomType) {
    const parts: string[] = [];
    if (room.beds) {
      room.beds.forEach((b) => {
        if (b.type && b.count) parts.push(`${b.count} ${b.type}`);
      });
    }
    return parts.length > 0 ? parts.join(" · ") : `${room.capacity} guests`;
  }

  if (isLoading) {
    return <RoomCardSkeleton />;
  }

  function bookingHandler(roomId: string) {
    if (!session?.user) {
      toast.info("Please login first", { position: "top-center" });
      return;
    }
    router.push(
      `/hotel/${hotelId}/booking?roomId=${roomId}&from=${params.from}&to=${params.to}&guests=${params.guests ?? 1}`,
    );
  }

  return (
    <div className="">
      <h2 className="text-lg font-semibold text-foreground mb-3">
        Available Rooms
      </h2>
      {rooms?.length > 0 ? (
        <div className="space-y-3">
          {rooms?.map((room: RoomType) => {
            const r = room as RoomType;
            return (
              <Card key={room._id}>
                <CardContent className="px-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="relative w-full sm:w-32 h-24 shrink-0 rounded-md overflow-hidden">
                    <Image
                      src={room.images[0]}
                      alt={room.name}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="space-y-1 w-full">
                    <h3 className="font-semibold text-foreground">
                      {room.name}
                    </h3>
                    <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Users className="h-3.5 w-3.5" />
                        {room.capacity} guests
                      </span>
                      <span className="flex items-center gap-1">
                        <BedDouble className="h-3.5 w-3.5" />
                        {getRoomBeds(room)}
                      </span>
                      {room.size && (
                        <span className="flex items-center gap-1">
                          <Maximize className="h-3.5 w-3.5" />
                          {room.size} m²
                        </span>
                      )}
                    </div>
                    {room.amenities && room.amenities.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-1">
                        {room.amenities.map((a) => (
                          <Badge key={a} variant="outline" className="text-xs">
                            {a}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-3 sm:text-right shrink-0">
                    <div>
                      <span className="text-lg font-bold text-foreground">
                        ${room.pricePerNight}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {" "}
                        / night
                      </span>
                    </div>
                    <Button size="sm" onClick={() => bookingHandler(room._id)}>
                      Book
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center rounded-xl border border-dashed border-border bg-muted/30">
          <div className="flex items-center justify-center w-14 h-14 rounded-full bg-muted mb-4">
            <BedDouble className="w-7 h-7 text-muted-foreground" />
          </div>
          <h3 className="text-base font-semibold text-foreground mb-1">
            No rooms available
          </h3>
          <p className="text-sm text-muted-foreground max-w-xs">
            No rooms match your selected dates or filters. Try adjusting your
            check-in, check-out, or guest count.
          </p>
        </div>
      )}
    </div>
  );
};

export default AvailableRooms;
