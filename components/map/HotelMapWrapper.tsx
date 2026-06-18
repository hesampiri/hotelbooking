import dynamic from "next/dynamic";
import type { HotelMarker } from "./HotelMap";

const HotelMap = dynamic(() => import("./HotelMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[500px] rounded-xl bg-muted animate-pulse" />
  ),
});

export type { HotelMarker };
export default HotelMap;