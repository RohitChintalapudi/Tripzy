import { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { useAuth } from "../context/useAuth.jsx";
import API from "../services/api.js";

const getMostFrequentValue = (values) => {
  const counts = values.reduce((acc, value) => {
    if (!value) return acc;
    acc[value] = (acc[value] || 0) + 1;
    return acc;
  }, {});

  const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  return sorted.length > 0 ? sorted[0][0] : "N/A";
};

const getSeatType = (seatNumber) => {
  const suffix = String(seatNumber || "").trim().slice(-1).toUpperCase();
  if (!suffix) return null;
  if (["A", "F"].includes(suffix)) return "Window";
  if (["C", "D"].includes(suffix)) return "Aisle";
  if (["B", "E"].includes(suffix)) return "Middle";
  return null;
};

const Profile = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [profileData, setProfileData] = useState(user?.user || {});
  const [isEditingContact, setIsEditingContact] = useState(false);
  const [contactForm, setContactForm] = useState({ phone: "", city: "" });
  const [isSavingContact, setIsSavingContact] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await API.get("/users/profile");
        setProfileData(data || {});
        setContactForm({
          phone: data?.phone || "",
          city: data?.city || "",
        });
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to load profile");
      }
    };

    fetchProfile();
  }, []);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const { data } = await API.get("/bookings/my");
        setBookings(Array.isArray(data) ? data : data.bookings || []);
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to load profile stats");
      }
    };

    fetchBookings();
  }, []);

  const bookingStats = useMemo(() => {
    const confirmedBookings = bookings.filter(
      (booking) => String(booking?.status || "").toUpperCase() !== "CANCELLED",
    );
    const completedTrips = confirmedBookings.length;
    const preferredSeat =
      getMostFrequentValue(confirmedBookings.map((booking) => getSeatType(booking?.seatNumber))) || "N/A";

    const routes = confirmedBookings.map((booking) => {
      const source = booking?.flightId?.source;
      const destination = booking?.flightId?.destination;
      return source && destination ? `${source} -> ${destination}` : null;
    });

    return {
      tripsCompleted: completedTrips,
      preferredSeat,
      favoriteRoute: getMostFrequentValue(routes),
    };
  }, [bookings]);

  const displayProfile = {
    name: profileData.name || "N/A",
    email: profileData.email || "N/A",
    role: profileData.role || "traveler",
    phone: profileData.phone || "N/A",
    city: profileData.city || "N/A",
    loyaltyTier: profileData.loyaltyTier || "Standard",
    tripsCompleted: bookingStats.tripsCompleted,
    memberSince: profileData.createdAt ? new Date(profileData.createdAt).getFullYear() : "N/A",
    preferredSeat: bookingStats.preferredSeat,
    favoriteRoute: bookingStats.favoriteRoute,
  };

  const saveContactDetails = async () => {
    try {
      setIsSavingContact(true);
      const payload = {
        phone: contactForm.phone.trim(),
        city: contactForm.city.trim(),
      };

      const { data } = await API.put("/users/profile", payload);
      setProfileData(data || {});
      setContactForm({
        phone: data?.phone || "",
        city: data?.city || "",
      });
      setIsEditingContact(false);
      toast.success("Profile updated");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setIsSavingContact(false);
    }
  };

  return (
    <section className="mx-auto max-w-4xl space-y-5">
      <div className="relative overflow-hidden rounded-3xl p-5 text-white shadow-xl sm:p-6">
        <img
          src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1600&q=80"
          alt="Flight view from window"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-slate-900/55" />
        <div className="relative z-10">
          <h1 className="text-3xl font-semibold">My Profile</h1>
          <p className="mt-1 text-sm text-blue-100">
            Welcome back, {displayProfile.name}. Here is your travel snapshot.
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-700 dark:bg-slate-900/80 sm:p-6">
        <p className="text-sm text-slate-500 dark:text-slate-400">
        Account details linked to your booking account.
        </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-600 dark:bg-slate-800/50">
          <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Full Name</p>
          <p className="mt-1 text-sm font-medium text-slate-900 dark:text-slate-100">
            {displayProfile.name}
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-600 dark:bg-slate-800/50">
          <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Email</p>
          <p className="mt-1 text-sm font-medium text-slate-900 dark:text-slate-100">
            {displayProfile.email}
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-600 dark:bg-slate-800/50">
          <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Role</p>
          <p className="mt-1 text-sm font-medium capitalize text-slate-900 dark:text-slate-100">{displayProfile.role}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-600 dark:bg-slate-800/50">
          <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Phone</p>
          {isEditingContact ? (
            <input
              type="tel"
              value={contactForm.phone}
              onChange={(event) =>
                setContactForm((prev) => ({
                  ...prev,
                  phone: event.target.value,
                }))
              }
              placeholder="Enter mobile number"
              className="mt-2 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none ring-sky-500 focus:ring-2 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
            />
          ) : (
            <div className="mt-1 flex items-center justify-between gap-3">
              <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{displayProfile.phone}</p>
              <button
                type="button"
                onClick={() => setIsEditingContact(true)}
                className="rounded-md p-1 text-slate-500 transition hover:bg-slate-200 hover:text-slate-700 dark:hover:bg-slate-700 dark:hover:text-slate-200"
                aria-label="Edit phone and city"
              >
                ✏
              </button>
            </div>
          )}
        </div>
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-600 dark:bg-slate-800/50">
          <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">City</p>
          {isEditingContact ? (
            <input
              type="text"
              value={contactForm.city}
              onChange={(event) =>
                setContactForm((prev) => ({
                  ...prev,
                  city: event.target.value,
                }))
              }
              placeholder="Enter city"
              className="mt-2 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none ring-sky-500 focus:ring-2 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
            />
          ) : (
            <p className="mt-1 text-sm font-medium text-slate-900 dark:text-slate-100">{displayProfile.city}</p>
          )}
        </div>
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-600 dark:bg-slate-800/50">
          <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Loyalty Tier</p>
          <p className="mt-1 text-sm font-medium text-slate-900 dark:text-slate-100">{displayProfile.loyaltyTier}</p>
        </div>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl bg-blue-50 p-4 dark:bg-blue-950/40">
          <p className="text-xs uppercase tracking-wide text-blue-600 dark:text-blue-300">Trips Completed</p>
          <p className="mt-2 text-2xl font-bold text-blue-800 dark:text-blue-200">{displayProfile.tripsCompleted}</p>
        </div>
        <div className="rounded-xl bg-indigo-50 p-4 dark:bg-indigo-950/40">
          <p className="text-xs uppercase tracking-wide text-indigo-600 dark:text-indigo-300">Member Since</p>
          <p className="mt-2 text-2xl font-bold text-indigo-800 dark:text-indigo-200">{displayProfile.memberSince}</p>
        </div>
        <div className="rounded-xl bg-emerald-50 p-4 dark:bg-emerald-950/40">
          <p className="text-xs uppercase tracking-wide text-emerald-600 dark:text-emerald-300">Preferred Seat</p>
          <p className="mt-2 text-2xl font-bold text-emerald-800 dark:text-emerald-200">{displayProfile.preferredSeat}</p>
        </div>
      </div>

      <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-600 dark:bg-slate-800/50">
        <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Favorite Route</p>
        <p className="mt-1 text-base font-semibold text-slate-900 dark:text-slate-100">
          {displayProfile.favoriteRoute}
        </p>
      </div>
      {isEditingContact && (
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={saveContactDetails}
            disabled={isSavingContact}
            className="rounded-md bg-sky-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSavingContact ? "Saving..." : "Save"}
          </button>
          <button
            type="button"
            onClick={() => {
              setIsEditingContact(false);
              setContactForm({
                phone: profileData.phone || "",
                city: profileData.city || "",
              });
            }}
            disabled={isSavingContact}
            className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            Cancel
          </button>
        </div>
      )}
      </div>
    </section>
  );
};

export default Profile;
