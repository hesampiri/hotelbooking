const HotelSearchCardSkeleton = () => {
  return (
    <div className="flex flex-row-reverse gap-6">
      <div className="hidden lg:block w-64 shrink-0">
        <div className="sticky top-24 rounded-xl border bg-card p-4 h-96 animate-pulse" />
      </div>
      <div className="flex-1 space-y-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-44 rounded-xl bg-muted animate-pulse" />
        ))}
      </div>
    </div>
  );
};

export default HotelSearchCardSkeleton;
