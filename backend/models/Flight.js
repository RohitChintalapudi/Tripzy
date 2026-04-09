import mongoose from "mongoose";

const flightSchema = new mongoose.Schema(
  {
    airlineName: {
      type: String,
      required: true,
    },
    source: {
      type: String,
      required: true,
    },
    destination: {
      type: String,
      required: true,
    },
    departureTime: {
      type: Date,
      required: true,
    },
    arrivalTime: {
      type: Date,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    seatsAvailable: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { timestamps: true },
);

export default mongoose.model("Flight", flightSchema);
