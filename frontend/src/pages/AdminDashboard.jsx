import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import API from "../services/api.js";
import Loader from "../components/Loader.jsx";
import AdminFlightCard from "../components/AdminFlightCard.jsx";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFlights = async () => {
    setLoading(true);
    try {
      const { data } = await API.get("/flights");
      setFlights(Array.isArray(data) ? data : data.flights || []);
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFlights();
  }, []);

  const handleDelete = async (id) => {
    try {
      await API.delete(`/flights/${id}`);
      toast.success("Flight deleted");
      setFlights((prev) => prev.filter((item) => item._id !== id));
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <section className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Admin Dashboard</h1>
          <p className="text-sm text-slate-600">Manage flights and schedule updates.</p>
        </div>
        <button
          type="button"
          onClick={() => navigate("/admin/add-flight")}
          className="rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-green-700"
        >
          Add Flight
        </button>
      </div>

      {loading ? (
        <Loader />
      ) : flights.length === 0 ? (
        <p className="rounded-xl border border-slate-200 bg-white p-6 text-center text-slate-600">
          No flights available.
        </p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {flights.map((flight) => (
            <AdminFlightCard
              key={flight._id}
              flight={flight}
              onEdit={(id) => navigate(`/admin/edit-flight/${id}`)}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </section>
  );
};

export default AdminDashboard;
