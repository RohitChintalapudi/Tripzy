import Booking from "../models/Booking.js";
import Flight from "../models/Flight.js";
import Ticket from "../models/Ticket.js";
import { generateTicketNumber } from "../utils/generateTicketNumber.js";

export const bookFlight = async (req, res) => {
  let deductedSeats = 0;
  let createdBookingIds = [];
  try {
    const { flightId, seatNumber, travelDate, passengerName, passengerGender, passengerAge, passengers } =
      req.body;

    const flight = await Flight.findById(flightId);

    if (!flight) {
      return res.status(404).json({ message: "Flight not found" });
    }

    const normalizedPassengers =
      Array.isArray(passengers) && passengers.length > 0
        ? passengers
        : [{ seatNumber, passengerName, passengerGender, passengerAge }];

    if (normalizedPassengers.length > flight.seatsAvailable) {
      return res.status(400).json({ message: "No seats available" });
    }

    const seatNumbers = normalizedPassengers.map((item) => String(item?.seatNumber || "").trim());

    if (seatNumbers.some((item) => !item)) {
      return res.status(400).json({ message: "Seat number is required for all passengers" });
    }

    if (new Set(seatNumbers).size !== seatNumbers.length) {
      return res.status(400).json({ message: "Duplicate seat numbers are not allowed" });
    }

    const hasInvalidPassenger = normalizedPassengers.some(
      (item) =>
        !String(item?.passengerName || "").trim() ||
        !["male", "female", "other"].includes(item?.passengerGender) ||
        Number(item?.passengerAge) < 1,
    );

    if (hasInvalidPassenger) {
      return res.status(400).json({ message: "Please provide valid details for all passengers" });
    }

    const existing = await Booking.find({
      flightId,
      seatNumber: { $in: seatNumbers },
      status: "CONFIRMED",
    });

    if (existing.length > 0) {
      return res.status(400).json({ message: "Seat already booked" });
    }

    flight.seatsAvailable -= normalizedPassengers.length;
    deductedSeats = normalizedPassengers.length;
    await flight.save();

    const createdBookings = await Booking.insertMany(
      normalizedPassengers.map((item) => ({
        userId: req.user._id,
        flightId,
        seatNumber: item.seatNumber,
        passengerName: item.passengerName,
        passengerGender: item.passengerGender,
        passengerAge: Number(item.passengerAge),
      })),
    );
    createdBookingIds = createdBookings.map((booking) => booking._id);

    const createdTickets = await Ticket.insertMany(
      createdBookings.map((booking) => ({
        bookingId: booking._id,
        ticketNumber: generateTicketNumber(),
        travelDate,
      })),
    );

    res.status(201).json({
      message: "Booking successful",
      bookings: createdBookings,
      tickets: createdTickets,
    });
  } catch (error) {
    if (createdBookingIds.length > 0) {
      await Booking.deleteMany({ _id: { $in: createdBookingIds } });
    }

    if (deductedSeats > 0 && req.body?.flightId) {
      await Flight.findByIdAndUpdate(req.body.flightId, { $inc: { seatsAvailable: deductedSeats } });
    }

    if (error?.code === 11000) {
      return res.status(409).json({ message: "Ticket generation conflict. Please try again." });
    }

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