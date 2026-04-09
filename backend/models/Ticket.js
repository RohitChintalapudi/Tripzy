import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema(
  {
    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
    },
    ticketNumber: {
      type: String,
      required: true,
      unique: true,
    },
    travelDate: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true },
);

export default mongoose.model("Ticket", ticketSchema);
