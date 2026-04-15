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
    <article className="group rounded-2xl border border-slate-200 bg-white p-4 font-bold shadow-md transition duration-200 hover:shadow-xl dark:border-slate-700 dark:bg-slate-900/80 sm:p-5">
      <div className="grid gap-3 md:grid-cols-4 md:items-center">
        <div className="md:col-span-1">
          <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
            {flight?.airlineName || "Tripzy Air"}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400">{flightCode}</p>
        </div>

        <div className="md:col-span-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <p className="text-lg font-bold text-slate-900 dark:text-slate-100">{flight?.source}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{formatDate(departureDate)}</p>
            </div>
            <div className="mx-2 min-w-[2rem] flex-1 border-t border-dashed border-slate-300 dark:border-slate-600" />
            <div className="text-right">
              <p className="text-lg font-bold text-slate-900 dark:text-slate-100">{flight?.destination}</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">{formatDate(arrivalDate)}</p>
            </div>
          </div>
        </div>

        <div className="md:col-span-1 md:text-right">
          <p className="text-2xl font-extrabold text-blue-600 dark:text-sky-400">₹{flight?.price ?? "N/A"}</p>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
            Seats left: {flight?.seatsAvailable ?? "N/A"}
          </p>
        </div>
      </div>
      <div className="mt-4 flex flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between dark:border-slate-700">
        <p className="text-xs text-slate-500 dark:text-slate-400">Free meal + cabin baggage</p>
        <Link
          to={`/book?flightId=${flight?._id}&travelDate=${departureDateForBooking}`}
          className="inline-flex justify-center rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white transition group-hover:bg-blue-700 dark:bg-sky-600 dark:hover:bg-sky-500"
        >
          View Fares
        </Link>
      </div>
    </article>
  );
};

export default FlightCard;
