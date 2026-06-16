// User, Hotel, Room, and Booking model types

export interface User {
  _id: string;
  name: string;
  email: string;
  password: string;
  // Add more fields as needed
}

export interface RoomType {
  _id: string;
  hotel: string; // Hotel _id
  name: string;
  price: number;
  guests: number;
  quantity: number;
  // Add amenities and other fields as needed
}

export interface HotelType {
  _id: string;
  name: string;
  description: string;
  stars: number;
  address: string;
  city: string;
  country: string;
  location: {
    type: string;
    coordinates: number[];
  };
  images: string[];
  amenities: string[];
  rating: number;
  rooms: RoomType[]; // or string[] if just IDs
}

export type BookingStatus = "pending" | "confirmed" | "cancelled";

export interface Booking {
  _id: string;
  user: string; // User _id
  hotel: string; // Hotel _id
  room: string; // Room _id
  checkInDate: string | Date;
  checkOutDate: string | Date;
  guests: number;
  totalPrice: number;
  status: BookingStatus;
  createdAt?: string;
  updatedAt?: string;
}
