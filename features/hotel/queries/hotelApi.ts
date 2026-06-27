import { ReviewType } from "@/types";

export async function getLocations() {
  const res = await fetch("/api/hotels/locations");
  const data = await res.json();

  return data.locations;
}
export async function getHotels(params?: Record<string, string>) {
  let url = "/api/hotels";
  if (params && Object.keys(params).length > 0) {
    const query = new URLSearchParams(params).toString();
    url += `?${query}`;
  }
  const res = await fetch(url);
  const data = await res.json();

  return data.hotels;
}

export async function getHotelDetails(id: string) {
  const res = await fetch(`/api/hotels/${id}`);
  const data = await res.json();
  return data.hotel;
}

export async function getRooms(
  hotelId: string,
  params?: Record<string, string>,
) {
  
  let url = `/api/hotels/${hotelId}/rooms`;
  if (params && Object.keys(params).length > 0) {
    const query = new URLSearchParams(params).toString();
    url += `?${query}`;
  }
  const res = await fetch(url);
  const data = await res.json();

  return data.rooms;
}

// ✅ Fixed
export async function getReviews({
  pageParam = 1,
  hotelId,
}: {
  pageParam?: number;
  hotelId: string;
}): Promise<{
  reviews: ReviewType[];
  total: number;
  hasMore: boolean;
  page: number;
}> {
  const res = await fetch(
    `/api/hotels/${hotelId}/reviews?page=${pageParam}&limit=3`,
  );
  if (!res.ok) throw new Error("Failed to fetch reviews");

  const data = await res.json();
  return data;
}

export async function postReview(
  hotelId: string,
  body: { rating: number; comment: string },
): Promise<ReviewType> {
  const res = await fetch(`/api/hotels/${hotelId}/reviews`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!data.success) throw new Error(data.message);
  return data.review;
}
