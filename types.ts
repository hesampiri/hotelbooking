// User, Hotel, Room, and Booking model types

import { Types } from "mongoose";

export interface User {
  _id: string;
  name: string;
  email: string;
  password: string;
  // Add more fields as needed
}

export type BedType = "King" | "Queen" | "Twin" | "Sofa Bed";

export interface IBed {
  type: BedType;
  count: number;
}

export interface RoomType {
  _id: string;
  hotel: string;
  name: string;
  description?: string;
  capacity: number;
  quantity: number;
  size?: number;
  beds: IBed[];
  pricePerNight: number;
  images: string[];
  amenities: string[];
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
