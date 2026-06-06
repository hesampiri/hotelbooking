import { MongoClient } from "mongodb";

const uri = process.env.DATABASE_URI!;

if (!uri) {
  throw new Error("DATABASE_URI is not defined");
}

const client = new MongoClient(uri);

await client.connect();

export const db = client.db("hotel_booking");