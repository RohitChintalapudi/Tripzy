import Booking from "../models/Booking.js";
import Flight from "../models/Flight.js";
import Ticket from "../models/Ticket.js";
import { generateTicketNumber } from "../utils/generateTicketNumber.js";

export const bookFlight = async (req, res) => {
  try {
    const { flightId, seatNumber, travelDate } = req.body;

    const flight = await Flight.findById(flightId);

    if (!flight) {
      return res.status(404).json({ message: "Flight not found" });
    }

    if (flight.seatsAvailable <= 0) {
      return res.status(400).json({ message: "No seats available" });
    }

    const existing = await Booking.findOne({
      flightId,
      seatNumber,
      status: "CONFIRMED",
    });

    if (existing) {
      return res.status(400).json({ message: "Seat already booked" });
    }

    flight.seatsAvailable -= 1;
    await flight.save();

    const booking = await Booking.create({
      userId: req.user._id,
      flightId,
      seatNumber,
    });

    const ticketNumber = generateTicketNumber();

    const ticket = await Ticket.create({
      bookingId: booking._id,
      ticketNumber,
      travelDate,
    });

    res.status(201).json({
      message: "Booking successful",
      booking,
      ticket,
    });
  } catch (error) {
    res.status(500).json({ message: "Booking failed" });
  }
};

export const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user._id })
      .populate("flightId")
      .populate("userId", "name email");

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Error fetching bookings" });
  }
};

export const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (booking.status === "CANCELLED") {
      return res.status(400).json({ message: "Already cancelled" });
    }

    booking.status = "CANCELLED";
    await booking.save();

    const flight = await Flight.findById(booking.flightId);
    flight.seatsAvailable += 1;
    await flight.save();

    res.json({ message: "Booking cancelled" });
  } catch (error) {
    res.status(500).json({ message: "Cancel failed" });
  }
};