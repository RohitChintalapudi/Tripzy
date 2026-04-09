import { Link } from "react-router-dom";

const formatDate = (value) => {
  if (!value) return "N/A";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleDateString("en-GB").replace(/\//g, "/");
};

const formatInputDate = (value) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const pad = (num) => String(num).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
};

const FlightCard = ({ flight }) => {
  const departureDate = flight?.departureTime || flight?.date;
  const arrivalDate = flight?.arrivalTime;
  const flightCode = flight?._id ? `FL-${flight._id.slice(-6).toUpperCase()}` : "N/A";
  const departureDateForBooking = formatInputDate(departureDate);

  return (
    <article className="group rounded-2xl border border-slate-200 bg-white p-5 font-bold shadow-md transition duration-200 hover:shadow-xl">
      <div className="grid gap-3 md:grid-cols-4 md:items-center">
        <div className="md:col-span-1">
          <p className="text-sm font-semibold text-slate-900">{flight?.airlineName || "Tripzy Air"}</p>
          <p className="text-xs text-slate-500">{flightCode}</p>
        </div>

        <div className="md:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-lg font-bold text-slate-900">{flight?.source}</p>
              <p className="text-xs text-slate-500">{formatDate(departureDate)}</p>
            </div>
            <div className="mx-4 flex-1 border-t border-dashed border-slate-300" />
            <div className="text-right">
              <p className="text-lg font-bold text-slate-900">{flight?.destination}</p>
              <p className="text-xs text-slate-500">{formatDate(arrivalDate)}</p>
            </div>
          </div>
        </div>

        <div className="md:col-span-1 md:text-right">
          <p className="text-2xl font-extrabold text-blue-600">₹{flight?.price ?? "N/A"}</p>
          <p className="mt-1 text-xs text-slate-500">Seats left: {flight?.seatsAvailable ?? "N/A"}</p>
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
        <p className="text-xs text-slate-500">Free meal + cabin baggage</p>
        <Link
          to={`/book?flightId=${flight?._id}&travelDate=${departureDateForBooking}`}
          className="inline-flex rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white transition group-hover:bg-blue-700"
        >
          View Fares
        </Link>
      </div>
    </article>
  );
};

export default FlightCard;
