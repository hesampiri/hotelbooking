import { Skeleton } from "./ui/skeleton";

const HotelDetailSkeleton = () => {
  return (
    <div className="">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-2 h-100 overflow-hidden rounded-2xl mt-5">
        {/* Main image */}
        <Skeleton className="lg:col-span-3 h-full w-full rounded-xl" />

        {/* Side images */}
        <div className="hidden lg:grid grid-rows-3 gap-2">
          <Skeleton className="h-full w-full rounded-xl" />
          <Skeleton className="h-full w-full rounded-xl" />
          <Skeleton className="h-full w-full rounded-xl" />
        </div>
      </div>
      <div className="w-full h-30 grid grid-rows-3 gap-5 mt-5">
        <Skeleton className="w-1/4 h-10 rounded-xl" />
        <Skeleton className="w-2/4 h-10 rounded-xl" />
        <Skeleton className="w-3/4 h-10 rounded-xl" />
      </div>
    </div>
  );
};

export default HotelDetailSkeleton;
