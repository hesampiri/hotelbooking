import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const HotelCardSkeleton = () => {
  return (
    <Card className="border-0 shadow-none bg-transparent p-0">
      <CardContent className="flex flex-col gap-2 p-0 max-h-75">
        <Skeleton className="aspect-square w-full rounded-xl h-50" />
        <div className="flex flex-col gap-2 p-2">
          <div className="flex items-center justify-between">
            <Skeleton className="h-5 w-32" />

            <div className="flex items-center gap-1 shrink-0 ml-2">
              <Skeleton className="h-6 w-14 rounded-md" />
            </div>
          </div>

          <Skeleton className="h-4 w-24" />
        </div>
      </CardContent>
    </Card>
  );
};

export default HotelCardSkeleton;
