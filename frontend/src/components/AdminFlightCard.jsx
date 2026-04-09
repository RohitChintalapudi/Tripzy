const formatDateTime = (value) => {
  if (!value) return "N/A";
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleString("en-GB", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
};

const AdminFlightCard = ({ flight, onEdit, onDelete }) => {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">{flight.airlineName}</h3>
          <p className="text-sm text-slate-600">
            {flight.source} to {flight.destination}
          </p>
        </div>
        <span className="rounded-full bg-blue-50 px-3 py-1 text-sm font-semibold text-blue-700">
          ₹{flight.price}
        </span>
      </div>

      <div className="mt-4 space-y-1 text-sm text-slate-700">
        <p>
          <span className="font-medium">Departure:</span> {formatDateTime(flight.departureTime)}
        </p>
        <p>
          <span className="font-medium">Arrival:</span> {formatDateTime(flight.arrivalTime)}
        </p>
        <p>
          <span className="font-medium">Seats Available:</span> {flight.seatsAvailable}
        </p>
      </div>

      <div className="mt-4 flex items-center gap-3">
        <button
          type="button"
          onClick={() => onEdit(flight._id)}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700"
        >
          Edit
        </button>
        <button
          type="button"
          onClick={() => onDelete(flight._id)}
          className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700"
        >
          Delete
        </button>
      </div>
    </article>
  );
};

export default AdminFlightCard;
