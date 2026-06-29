import mongoose from "mongoose";

const MONGODB_URI = process.env.DATABASE_URI;

if (!MONGODB_URI) {
  throw new Error("Please define MONGODB_URI in your environment variables");
}

export async function connectDB() {
  if (mongoose.connection.readyState >= 1) {
    return;
  }

  try {
    await mongoose.connect(MONGODB_URI!);
    console.log("Database connected ✅");
    console.log("Database:", mongoose.connection.db?.databaseName);
  } catch {
    console.log("There is somthing wrong with the database connection");
  }
}
