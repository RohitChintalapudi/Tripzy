import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    flightId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Flight",
      required: true,
    },
    bookingDate: {
      type: Date,
      default: Date.now,
    },
    seatNumber: {
      type: String,
      required: true,
    },
    passengerName: {
      type: String,
      required: true,
      trim: true,
    },
    passengerGender: {
      type: String,
      enum: ["male", "female", "other"],
      required: true,
    },
    passengerAge: {
      type: Number,
      required: true,
      min: 1,
    },
    status: {
      type: String,
      enum: ["CONFIRMED", "CANCELLED"],
      default: "CONFIRMED",
    },
  },
  { timestamps: true },
);

export default mongoose.model("Booking", bookingSchema);
