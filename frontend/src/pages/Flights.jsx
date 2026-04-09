import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import FlightCard from "../components/FlightCard.jsx";
import Loader from "../components/Loader.jsx";
import API from "../services/api.js";

const formatToDDMMYYYY = (value) => {
  if (!value) return "";
  const [year, month, day] = value.split("-");
  if (!year || !month || !day) return value;
  return `${day}/${month}/${year}`;
};

const Flights = () => {
  const [flights, setFlights] = useState([]);
  const [sortBy, setSortBy] = useState("recommended");
  const [maxPrice, setMaxPrice] = useState(0);
  const [priceLimit, setPriceLimit] = useState(0);
  const [priceBand, setPriceBand] = useState("all");
  const [filters, setFilters] = useState({
    source: "",
    destination: "",
    date: "",
  });
  const [loading, setLoading] = useState(true);

  const fetchFlights = async () => {
    setLoading(true);
    try {
      const { data } = await API.get("/flights");
      const flightList = Array.isArray(data) ? data : data.flights || [];
      setFlights(flightList);
      const highestPrice = flightList.reduce(
        (max, flight) => Math.max(max, Number(flight?.price || 0)),
        0
      );
      setMaxPrice(highestPrice || 1000);
      setPriceLimit(highestPrice || 1000);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load flights");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFlights();
  }, []);

  const onFilterChange = (event) => {
    const { name, value } = event.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const onSearch = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const hasFilters = Object.values(filters).some(Boolean);
      if (!hasFilters) {
        await fetchFlights();
        return;
      }
      const { data } = await API.get("/flights/search", {
        params: filters,
      });
      const flightList = Array.isArray(data) ? data : data.flights || [];
      setFlights(flightList);
      const highestPrice = flightList.reduce(
        (max, flight) => Math.max(max, Number(flight?.price || 0)),
        0
      );
      setMaxPrice(highestPrice || 1000);
      setPriceLimit(highestPrice || 1000);
    } catch (error) {
      toast.error(error.response?.data?.message || "Search failed");
    } finally {
      setLoading(false);
    }
  };

  const filteredFlights = flights
    .filter((flight) => Number(flight?.price ?? 0) <= Number(priceLimit))
    .filter((flight) => {
      const price = Number(flight?.price ?? 0);
      if (priceBand === "under-10000") return price < 10000;
      if (priceBand === "10000-20000") return price >= 10000 && price <= 20000;
      if (priceBand === "20000-plus") return price > 20000;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "price-low") return Number(a.price) - Number(b.price);
      if (sortBy === "price-high") return Number(b.price) - Number(a.price);
      if (sortBy === "seats-high") {
        return Number(b.seatsAvailable ?? 0) - Number(a.seatsAvailable ?? 0);
      }
      return 0;
    });

  return (
    <section className="space-y-5">
      <div className="relative overflow-hidden rounded-3xl px-6 py-8 text-white shadow-xl fx-fade-up">
        <img
          src="https://images.unsplash.com/photo-1569154941061-e231b4725ef1?auto=format&fit=crop&w=1600&q=80"
          alt="Aircraft above clouds"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-slate-900/55" />
        <div className="relative z-10">
          <h1 className="text-2xl font-bold sm:text-3xl">Search Flights</h1>
          <p className="mt-1 text-sm font-bold text-blue-100">
            One way flights with transparent pricing.
          </p>
        </div>
      </div>

      <form
        className="grid gap-3 rounded-3xl border border-slate-200 bg-white p-4 font-bold shadow-lg sm:grid-cols-2 lg:grid-cols-4"
        onSubmit={onSearch}
      >
        <label className="space-y-1">
          <span className="text-xs font-medium text-slate-600">Source</span>
          <input
            type="text"
            name="source"
            placeholder="Source"
            value={filters.source}
            onChange={onFilterChange}
            className="w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-blue-500"
          />
        </label>
        <label className="space-y-1">
          <span className="text-xs font-medium text-slate-600">Destination</span>
          <input
            type="text"
            name="destination"
            placeholder="Destination"
            value={filters.destination}
            onChange={onFilterChange}
            className="w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-blue-500"
          />
        </label>
        <label className="space-y-1">
          <span className="text-xs font-medium text-slate-600">
            Departure Date (optional)
          </span>
          <input
            type="date"
            name="date"
            value={filters.date}
            onChange={onFilterChange}
            className="w-full rounded-md border border-slate-300 px-3 py-2 outline-none focus:border-blue-500"
          />
          <span className="text-xs text-slate-500">
            {filters.date
              ? `Selected: ${formatToDDMMYYYY(filters.date)} (dd/mm/yyyy)`
              : "Format shown to users: dd/mm/yyyy"}
          </span>
        </label>
        <div className="flex items-end">
          <button
            type="submit"
            className="w-full rounded-xl bg-blue-600 px-4 py-3 font-semibold text-white shadow transition hover:bg-blue-700"
          >
            Search
          </button>
        </div>
      </form>

      {loading ? (
        <Loader />
      ) : flights.length === 0 ? (
        <p className="rounded-lg border border-slate-200 bg-white p-6 text-center text-slate-600">
          No flights found.
        </p>
      ) : (
        <div className="grid gap-4 lg:grid-cols-[280px_1fr]">
          <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-4 font-bold shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Sort & Filter</h2>
            <p className="mt-1 text-xs text-slate-500">
              Refine your results for better options.
            </p>

            <div className="mt-4 space-y-4">
              <label className="block">
                <span className="text-xs font-medium text-slate-600">Sort By</span>
                <select
                  value={sortBy}
                  onChange={(event) => setSortBy(event.target.value)}
                  className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
                >
                  <option value="recommended">Recommended</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="seats-high">Seats: High to Low</option>
                </select>
              </label>

              <div>
                <p className="text-xs font-medium text-slate-600">
                  Max Price: ₹{priceLimit}
                </p>
                <input
                  type="range"
                  min="0"
                  max={maxPrice}
                  step="50"
                  value={Math.min(priceLimit, maxPrice)}
                  onChange={(event) => setPriceLimit(Number(event.target.value))}
                  className="mt-2 w-full accent-blue-600"
                />
              </div>

              <div>
                <p className="text-xs font-medium text-slate-600">Quick Price Range</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setPriceBand("all")}
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      priceBand === "all"
                        ? "bg-blue-600 text-white"
                        : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    All
                  </button>
                  <button
                    type="button"
                    onClick={() => setPriceBand("under-300")}
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      priceBand === "under-10000"
                        ? "bg-blue-600 text-white"
                        : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    &lt;10000
                  </button>
                  <button
                    type="button"
                    onClick={() => setPriceBand("10000-20000")}
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      priceBand === "10000-20000"
                        ? "bg-blue-600 text-white"
                        : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    10000-20000
                  </button>
                  <button
                    type="button"
                    onClick={() => setPriceBand("20000-plus")}
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      priceBand === "20000-plus"
                        ? "bg-blue-600 text-white"
                        : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    &gt;20000
                  </button>
                </div>
              </div>
            </div>
          </aside>

          <div className="space-y-3">
            <p className="text-sm font-medium text-slate-600">
              Showing {filteredFlights.length} of {flights.length} flights
            </p>
            {filteredFlights.length === 0 ? (
              <p className="rounded-lg border border-slate-200 bg-white p-6 text-center text-slate-600">
                No flights match your selected filters.
              </p>
            ) : (
              filteredFlights.map((flight) => <FlightCard key={flight._id} flight={flight} />)
            )}
          </div>
        </div>
      )}
    </section>
  );
};

export default Flights;
