import { da } from "date-fns/locale";

export async function getLocations() {
  const res = await fetch("/api/hotels/locations");
  const data = await res.json();

  return data.locations;
}
export async function getHotels(params?: Record<string, string>) {
  // Construct query string if params are provided
  let url = "/api/hotels";
  if (params && Object.keys(params).length > 0) {
    const query = new URLSearchParams(params).toString();
    url += `?${query}`;
  }
  const res = await fetch(url);
  const data = await res.json();

  return data.hotels;
}

export async function getHotelDetails(id:string){
  const res = await fetch(`/api/hotels/${id}`)
  const data = await res.json()
  return data.hotel
}

export async function getRooms(hotelId:string ,params?: Record<string, string> ){
  let url = `/api/hotels/${hotelId}/rooms`;
  if (params && Object.keys(params).length > 0) {
    const query = new URLSearchParams(params).toString();
    url += `?${query}`;
  }
  const res = await fetch(url);
  const data = await res.json();

  return data.rooms;
}
