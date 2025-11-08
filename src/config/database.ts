import mongoose from "mongoose";

let isConnected = false;

export const connectToDatabase = async () => {
  if (isConnected) {
    return;
  }

  if (mongoose.connections[0].readyState) {
    isConnected = true;
    return;
  }

  try {
    const MONGO_URL = process.env.MONGO_URL;

    if (!MONGO_URL) {
      throw new Error("Mongo not defined in environment variables");
    }

    await mongoose.connect(MONGO_URL);
    isConnected = true;
  } catch (error) {
    isConnected = false;
    throw error;
  }
};
