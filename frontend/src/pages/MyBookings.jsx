import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import Loader from "../components/Loader.jsx";
import API from "../services/api.js";

const formatDate = (value) => {
  if (!value) return "N/A";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString("en-GB");
};

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const { data } = await API.get("/bookings/my");
      setBookings(Array.isArray(data) ? data : data.bookings || []);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const cancelBooking = async (bookingId) => {
    try {
      await API.patch(`/bookings/${bookingId}/cancel`);
      toast.success("Booking cancelled");
      fetchBookings();
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to cancel booking");
    }
  };

  const downloadTicketPDF = async (bookingId) => {
    const element = document.getElementById(`ticket-${bookingId}`);
    if (!element) return;

    try {
      const canvas = await html2canvas(element, { 
        scale: 2,
        useCORS: true,
        allowTaint: true
      });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Ticket-${bookingId}.pdf`);
      toast.success("Ticket downloaded successfully!");
    } catch (err) {
      console.error("PDF generation error:", err);
      toast.error(`Failed to generate PDF: ${err.message || err.toString()}`);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <section className="space-y-5">
      <div className="relative overflow-hidden rounded-3xl px-4 py-6 text-white shadow-xl sm:px-6 sm:py-8">
        <img
          src="https://images.unsplash.com/photo-1540339832862-474599807836?auto=format&fit=crop&w=1600&q=80"
          alt="Flight boarding gate"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-slate-900/55" />
        <div className="relative z-10">
          <h1 className="text-2xl font-bold sm:text-3xl">My Bookings</h1>
          <p className="mt-1 text-sm font-bold text-blue-100">
            Your confirmed and cancelled trips in ticket view.
          </p>
        </div>
      </div>
      {bookings.length === 0 ? (
        <p className="rounded-lg border border-slate-200 bg-white p-6 text-center text-slate-600 dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-300">
          No bookings found.
        </p>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <article
              key={booking._id}
              id={`ticket-${booking._id}`}
              className="overflow-hidden rounded-2xl border border-slate-200 bg-white font-bold shadow-md dark:border-slate-700 dark:bg-slate-900/80"
            >
              <div className="bg-gradient-to-r from-sky-600 to-blue-700 px-5 py-4 text-white">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h2 className="text-lg font-semibold">
                    {booking.flightId?.source || "N/A"} to{" "}
                    {booking.flightId?.destination || "N/A"}
                  </h2>
                  <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-medium uppercase tracking-wide text-white">
                    {booking.status || "pending"}
                  </span>
                </div>
                <p className="mt-1 text-xs text-blue-100">
                  Ticket ID: BK-{booking._id.slice(-8).toUpperCase()}
                </p>
              </div>

              <div className="grid gap-4 p-5 md:grid-cols-[1fr_auto_1fr] md:items-center">
                <div>
                  <p className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">From</p>
                  <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                    {booking.flightId?.source || "N/A"}
                  </p>
                </div>
                <div className="hidden h-px w-20 border-t border-dashed border-slate-300 dark:border-slate-600 md:block" />
                <div className="md:text-right">
                  <p className="text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400">To</p>
                  <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                    {booking.flightId?.destination || "N/A"}
                  </p>
                </div>
              </div>

              <div className="grid gap-3 border-t border-dashed border-slate-200 px-5 py-4 text-sm text-slate-700 dark:border-slate-700 dark:text-slate-300 sm:grid-cols-2 lg:grid-cols-4">
                <p>
                  <span className="font-medium">Seat:</span> {booking.seatNumber || "N/A"}
                </p>
                <p>
                  <span className="font-medium">Booking Date:</span> {formatDate(booking.bookingDate)}
                </p>
                <p>
                  <span className="font-medium">Flight Number:</span>{" "}
                  {booking.flightId?._id ? `FL-${booking.flightId._id.slice(-6).toUpperCase()}` : "N/A"}
                </p>
                <p>
                  <span className="font-medium">Current Seats:</span>{" "}
                  {booking.flightId?.seatsAvailable ?? "N/A"}
                </p>
                <p>
                  <span className="font-medium">Passenger:</span>{" "}
                  {booking.passengerName || "N/A"}
                </p>
                <p>
                  <span className="font-medium">Gender:</span>{" "}
                  {booking.passengerGender || "N/A"}
                </p>
                <p>
                  <span className="font-medium">Age:</span>{" "}
                  {booking.passengerAge ?? "N/A"}
                </p>
              </div>

              <div className="px-5 pb-5 flex flex-wrap gap-3 pt-2" data-html2canvas-ignore="true">
                {booking.status !== "cancelled" && (
                  <button
                    type="button"
                    onClick={() => cancelBooking(booking._id)}
                    className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700"
                  >
                    Cancel Booking
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => downloadTicketPDF(booking._id)}
                  className="rounded-md bg-sky-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-sky-700"
                >
                  Download PDF Ticket
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
};

export default MyBookings;
