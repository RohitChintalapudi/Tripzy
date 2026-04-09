import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;

    if (!mongoUri) {
      throw new Error("MONGO_URI is missing in environment variables");
    }

    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 15000,
      family: 4,
    });
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    console.error("MongoDB error details:", {
      name: error.name,
      code: error.code,
      reason: error.reason?.message,
    });
    process.exit(1);
  }
};

export default connectDB;
