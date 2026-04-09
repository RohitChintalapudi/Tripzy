import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import API from "../services/api.js";
import Loader from "../components/Loader.jsx";

const toDateTimeLocal = (value) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const pad = (num) => String(num).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(
    date.getHours()
  )}:${pad(date.getMinutes())}`;
};

const EditFlight = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    airlineName: "",
    source: "",
    destination: "",
    departureTime: "",
    arrivalTime: "",
    price: "",
    seatsAvailable: "",
  });

  useEffect(() => {
    const fetchFlight = async () => {
      setLoading(true);
      try {
        const { data } = await API.get(`/flights/${id}`);
        const flight = data?.flight || data;
        setFormData({
          airlineName: flight.airlineName || "",
          source: flight.source || "",
          destination: flight.destination || "",
          departureTime: toDateTimeLocal(flight.departureTime),
          arrivalTime: toDateTimeLocal(flight.arrivalTime),
          price: flight.price ?? "",
          seatsAvailable: flight.seatsAvailable ?? "",
        });
      } catch (error) {
        toast.error(error.response?.data?.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchFlight();
  }, [id]);

  const onChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    try {
      await API.put(`/flights/${id}`, {
        ...formData,
        price: Number(formData.price),
        seatsAvailable: Number(formData.seatsAvailable),
      });
      toast.success("Flight updated");
      navigate("/admin");
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <section className="mx-auto max-w-3xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <h1 className="text-2xl font-semibold text-slate-900">Edit Flight</h1>
      <form className="mt-6 grid gap-4 md:grid-cols-2" onSubmit={onSubmit}>
        <input
          type="text"
          name="airlineName"
          placeholder="Airline Name"
          value={formData.airlineName}
          onChange={onChange}
          required
          className="rounded-md border border-slate-300 px-4 py-2 outline-none focus:border-blue-500"
        />
        <input
          type="text"
          name="source"
          placeholder="Source"
          value={formData.source}
          onChange={onChange}
          required
          className="rounded-md border border-slate-300 px-4 py-2 outline-none focus:border-blue-500"
        />
        <input
          type="text"
          name="destination"
          placeholder="Destination"
          value={formData.destination}
          onChange={onChange}
          required
          className="rounded-md border border-slate-300 px-4 py-2 outline-none focus:border-blue-500"
        />
        <input
          type="datetime-local"
          name="departureTime"
          value={formData.departureTime}
          onChange={onChange}
          required
          className="rounded-md border border-slate-300 px-4 py-2 outline-none focus:border-blue-500"
        />
        <input
          type="datetime-local"
          name="arrivalTime"
          value={formData.arrivalTime}
          onChange={onChange}
          required
          className="rounded-md border border-slate-300 px-4 py-2 outline-none focus:border-blue-500"
        />
        <input
          type="number"
          min="0"
          name="price"
          placeholder="Price"
          value={formData.price}
          onChange={onChange}
          required
          className="rounded-md border border-slate-300 px-4 py-2 outline-none focus:border-blue-500"
        />
        <input
          type="number"
          min="0"
          name="seatsAvailable"
          placeholder="Seats Available"
          value={formData.seatsAvailable}
          onChange={onChange}
          required
          className="rounded-md border border-slate-300 px-4 py-2 outline-none focus:border-blue-500"
        />
        <div className="md:col-span-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-md bg-blue-600 px-4 py-2 font-medium text-white transition hover:bg-blue-700 disabled:opacity-70"
          >
            {isSubmitting ? "Updating..." : "Update Flight"}
          </button>
        </div>
      </form>
    </section>
  );
};

export default EditFlight;
