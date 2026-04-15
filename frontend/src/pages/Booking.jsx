import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import API from "../services/api.js";
import Loader from "../components/Loader.jsx";

const seatColumns = ["A", "B", "C", "D", "E", "F"];

const formatDate = (value) => {
  if (!value) return "N/A";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString("en-GB");
};

const Booking = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const flightId = searchParams.get("flightId");
  const prefilledTravelDate = searchParams.get("travelDate") || "";

  const [flight, setFlight] = useState(null);
  const [loadingFlight, setLoadingFlight] = useState(false);
  const [formData, setFormData] = useState({
    seatNumber: "",
    travelDate: prefilledTravelDate,
    passengerName: "",
    passengerGender: "male",
    passengerAge: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const seatRows = useMemo(() => {
    const available = Number(flight?.seatsAvailable ?? 0);
    const normalizedSeats = Number.isFinite(available) && available > 0 ? available : 6;
    return Array.from({ length: Math.ceil(normalizedSeats / seatColumns.length) }, (_, i) => i + 1);
  }, [flight?.seatsAvailable]);

  const availableSeats = useMemo(() => {
    const total = Number(flight?.seatsAvailable ?? 0);
    const normalizedTotal = Number.isFinite(total) && total > 0 ? total : 6;
    const seats = [];
    for (let i = 0; i < normalizedTotal; i += 1) {
      const row = Math.floor(i / seatColumns.length) + 1;
      const col = seatColumns[i % seatColumns.length];
      seats.push(`${row}${col}`);
    }
    return new Set(seats);
  }, [flight?.seatsAvailable]);

  useEffect(() => {
    const fetchFlight = async () => {
      if (!flightId) return;
      setLoadingFlight(true);
      try {
        const { data } = await API.get(`/flights/${flightId}`);
        setFlight(data?.flight || data);
      } catch (error) {
        toast.error(error.response?.data?.message || "Unable to fetch flight");
      } finally {
        setLoadingFlight(false);
      }
    };

    fetchFlight();
  }, [flightId]);

  const onChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const onSeatSelect = (seatNumber) => {
    setFormData((prev) => ({ ...prev, seatNumber }));
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    if (!flightId) {
      toast.error("Please choose a flight first");
      return;
    }

    setIsSubmitting(true);
    try {
      await API.post("/bookings", {
        flightId,
        seatNumber: formData.seatNumber,
        travelDate: formData.travelDate,
        passengerName: formData.passengerName,
        passengerGender: formData.passengerGender,
        passengerAge: Number(formData.passengerAge),
      });
      toast.success("Booking created successfully");
      navigate("/my-bookings");
    } catch (error) {
      toast.error(error.response?.data?.message || "Booking failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-3">
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900/80 sm:p-6 lg:col-span-2">
        <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-100 sm:text-2xl">Book Your Flight</h1>

        {!flightId && (
          <p className="mt-3 rounded-md bg-amber-50 p-3 text-sm text-amber-800 dark:bg-amber-950/50 dark:text-amber-200">
            No flight selected. Please go to flights and select one to continue.
          </p>
        )}

        {loadingFlight ? (
          <Loader />
        ) : flight ? (
          <div className="mt-4 rounded-xl border border-blue-100 bg-blue-50 p-4 text-sm text-slate-700 dark:border-sky-900/60 dark:bg-sky-950/40 dark:text-slate-300">
            <p className="font-semibold text-slate-900 dark:text-slate-100">
              {flight.source} to {flight.destination}
            </p>
            <p>
              Flight Number: {flight?._id ? `FL-${flight._id.slice(-6).toUpperCase()}` : "N/A"}
            </p>
            <p>Departure: {formatDate(flight.departureTime)}</p>
            <p>Price: ₹{flight.price ?? "N/A"}</p>
            <p>Seats Left: {flight.seatsAvailable ?? "N/A"}</p>
          </div>
        ) : null}

        <form className="mt-6 space-y-4" onSubmit={onSubmit}>
          <input
            type="text"
            name="seatNumber"
            placeholder="Seat Number (e.g. 3C)"
            value={formData.seatNumber}
            onChange={onChange}
            required
            className="input-tripzy"
          />
          <input
            type="date"
            name="travelDate"
            value={formData.travelDate}
            onChange={onChange}
            required
            className="input-tripzy"
          />
          <input
            type="text"
            name="passengerName"
            placeholder="Passenger Name"
            value={formData.passengerName}
            onChange={onChange}
            required
            className="input-tripzy"
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <select
              name="passengerGender"
              value={formData.passengerGender}
              onChange={onChange}
              className="input-tripzy"
              required
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
            <input
              type="number"
              min="1"
              name="passengerAge"
              placeholder="Passenger Age"
              value={formData.passengerAge}
              onChange={onChange}
              required
              className="input-tripzy"
            />
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-md bg-blue-600 px-4 py-2 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70 dark:bg-sky-600 dark:hover:bg-sky-500"
          >
            {isSubmitting ? "Booking..." : "Confirm Booking"}
          </button>
        </form>
      </div>

      <aside className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900/80 sm:p-5">
        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Aircraft Seat Map</h2>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
          Click a seat to auto-fill. Left and right blocks are separated by aisle.
        </p>
        <div className="mt-4 overflow-x-auto rounded-2xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-600 dark:bg-slate-800/50">
          <div className="mx-auto mb-3 min-w-[11rem] w-44 rounded-full bg-slate-200 py-1 text-center text-xs font-semibold text-slate-600 dark:bg-slate-600 dark:text-slate-200">
            Cockpit
          </div>
          {seatRows.map((row) => (
            <div key={row} className="mb-2 grid grid-cols-[auto_1fr_auto_1fr] items-center gap-2">
              <span className="w-6 text-center text-[11px] font-semibold text-slate-500">{row}</span>
              <div className="grid grid-cols-3 gap-1">
                {seatColumns.slice(0, 3).map((column) => {
                  const seatCode = `${row}${column}`;
                  if (!availableSeats.has(seatCode)) {
                    return <div key={seatCode} className="h-6 rounded-md bg-transparent" />;
                  }
                  const isSelected = formData.seatNumber === seatCode;
                  const isWindow = column === "A";
                  return (
                    <button
                      key={seatCode}
                      type="button"
                      onClick={() => onSeatSelect(seatCode)}
                      className={`rounded-md border px-1 py-1 text-[10px] font-semibold transition ${
                        isSelected
                          ? "border-blue-600 bg-blue-600 text-white dark:border-sky-500 dark:bg-sky-600"
                          : "border-slate-300 bg-white text-slate-700 hover:border-blue-400 hover:bg-blue-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:border-sky-500 dark:hover:bg-slate-700"
                      } ${isWindow ? "ring-1 ring-sky-200 dark:ring-sky-700" : ""}`}
                    >
                      {seatCode}
                    </button>
                  );
                })}
              </div>
              <span className="text-[10px] font-medium text-slate-400">Aisle</span>
              <div className="grid grid-cols-3 gap-1">
              {seatColumns.slice(3).map((column) => {
                const seatCode = `${row}${column}`;
                if (!availableSeats.has(seatCode)) {
                  return <div key={seatCode} className="h-6 rounded-md bg-transparent" />;
                }
                const isSelected = formData.seatNumber === seatCode;
                const isWindow = column === "F";
                return (
                  <button
                    key={seatCode}
                    type="button"
                    onClick={() => onSeatSelect(seatCode)}
                    className={`rounded-md border px-1 py-1 text-[10px] font-semibold transition ${
                      isSelected
                        ? "border-blue-600 bg-blue-600 text-white dark:border-sky-500 dark:bg-sky-600"
                        : "border-slate-300 bg-white text-slate-700 hover:border-blue-400 hover:bg-blue-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:border-sky-500 dark:hover:bg-slate-700"
                    } ${isWindow ? "ring-1 ring-sky-200 dark:ring-sky-700" : ""}`}
                  >
                    {seatCode}
                  </button>
                );
              })}
              </div>
            </div>
          ))}
          <div className="mt-3 grid min-w-[min(100%,18rem)] grid-cols-3 gap-2 text-[11px]">
            <div className="rounded-md bg-white p-2 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
              <span className="inline-block h-2 w-2 rounded-full bg-blue-600" /> Selected
            </div>
            <div className="rounded-md bg-white p-2 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
              <span className="inline-block h-2 w-2 rounded-full bg-slate-300" /> Standard
            </div>
            <div className="rounded-md bg-white p-2 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
              <span className="inline-block h-2 w-2 rounded-full bg-sky-300" /> Window edge
            </div>
          </div>
        </div>
      </aside>
    </section>
  );
};

export default Booking;
