import Flight from "../models/Flight.js";

export const createFlight = async (req, res) => {
  try {
    const flight = await Flight.create(req.body);
    res.status(201).json(flight);
  } catch (error) {
    res.status(500).json({ message: "Error creating flight" });
  }
};

export const getFlights = async (req, res) => {
  try {
    const flights = await Flight.find();
    res.json(flights);
  } catch (error) {
    res.status(500).json({ message: "Error fetching flights" });
  }
};

export const searchFlights = async (req, res) => {
  try {
    const { source, destination, date } = req.query;

    let query = {};

    if (source) query.source = source;
    if (destination) query.destination = destination;

    if (date) {
      const start = new Date(date);
      const end = new Date(date);
      end.setHours(23, 59, 59, 999);

      query.departureTime = { $gte: start, $lte: end };
    }

    const flights = await Flight.find(query);

    res.json(flights);
  } catch (error) {
    res.status(500).json({ message: "Error searching flights" });
  }
};

export const getFlightById = async (req, res) => {
  try {
    const flight = await Flight.findById(req.params.id);

    if (!flight) {
      return res.status(404).json({ message: "Flight not found" });
    }

    res.json(flight);
  } catch (error) {
    res.status(500).json({ message: "Error fetching flight" });
  }
};

export const updateFlight = async (req, res) => {
  try {
    const flight = await Flight.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    res.json(flight);
  } catch (error) {
    res.status(500).json({ message: "Error updating flight" });
  }
};

export const deleteFlight = async (req, res) => {
  try {
    await Flight.findByIdAndDelete(req.params.id);
    res.json({ message: "Flight deleted" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting flight" });
  }
};
