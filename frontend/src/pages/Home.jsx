import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import API from "../services/api.js";
import { useAuth } from "../context/useAuth.jsx";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const Home = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [activeTab, setActiveTab] = useState("login");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [searchData, setSearchData] = useState({
    source: "",
    destination: "",
    date: "",
  });

  const openModal = (tab) => {
    setActiveTab(tab);
    setShowAuthModal(true);
  };

  const closeModal = () => {
    setShowAuthModal(false);
  };

  const handleLoginChange = (event) => {
    const { name, value } = event.target;
    setLoginData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegisterChange = (event) => {
    const { name, value } = event.target;
    setRegisterData((prev) => ({ ...prev, [name]: value }));
  };

  const handleLoginSubmit = async (event) => {
    event.preventDefault();
    const email = loginData.email.trim().toLowerCase();
    const password = loginData.password;

    if (!email || !password) {
      toast.error("Email and password are required");
      return;
    }
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setIsSubmitting(true);
    try {
      const { data } = await API.post("/auth/login", { email, password });
      login({
        token: data.token,
        user: data.user || {
          _id: data._id,
          email: loginData.email,
          name: data.name || "User",
          role: data.role || "user",
        },
      });
      toast.success("Welcome to Tripzy");
      closeModal();
      navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegisterSubmit = async (event) => {
    event.preventDefault();
    const name = registerData.name.trim();
    const email = registerData.email.trim().toLowerCase();
    const password = registerData.password;

    if (!name || !email || !password) {
      toast.error("Name, email and password are required");
      return;
    }
    if (name.length < 2 || name.length > 50) {
      toast.error("Name must be between 2 and 50 characters");
      return;
    }
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setIsSubmitting(true);
    try {
      await API.post("/auth/register", { name, email, password });
      toast.success("Account created. Please login.");
      setActiveTab("login");
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSearchFieldChange = (event) => {
    const { name, value } = event.target;
    setSearchData((prev) => ({ ...prev, [name]: value }));
  };

  const handleHomepageSearch = () => {
    if (!isAuthenticated) {
      openModal("login");
      return;
    }

    const params = new URLSearchParams();
    if (searchData.source) params.set("source", searchData.source);
    if (searchData.destination) params.set("destination", searchData.destination);
    if (searchData.date) params.set("date", searchData.date);
    navigate(`/flights${params.toString() ? `?${params.toString()}` : ""}`);
  };

  return (
    <section className="space-y-6">
      <div className="relative overflow-hidden rounded-3xl px-4 py-6 text-white shadow-xl sm:px-6 sm:py-8">
        <img
          src="https://images.unsplash.com/photo-1521727857535-28d2047314ac?auto=format&fit=crop&w=1600&q=80"
          alt="Flight in sky"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-slate-900/55" />
        <div className="relative z-10">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-100">
            India&apos;s New Trip Planner
          </p>
          <h1 className="mt-2 text-3xl font-bold sm:text-4xl">
            Plan, Book and Travel with Tripzy
          </h1>
          <p className="mt-2 text-sm font-bold text-blue-100 sm:text-base">
            Search flights, pick your seat and manage bookings in one place.
          </p>
        </div>
      </div>

      <div className="glass-card rounded-3xl border border-slate-200 p-4 font-bold shadow-xl fx-fade-up dark:border-slate-700 sm:p-6">
        <div className="mb-4 flex flex-wrap gap-2 text-sm">
          <span className="rounded-full bg-blue-600 px-4 py-2 font-semibold text-white">Flights</span>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-slate-200 p-4 dark:border-slate-600">
            <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">From</p>
            <input
              type="text"
              name="source"
              placeholder="Enter Source City"
              value={searchData.source}
              onChange={handleSearchFieldChange}
              className="mt-1 w-full min-w-0 bg-transparent text-base font-semibold text-slate-900 outline-none sm:text-lg dark:text-slate-100"
            />
          </div>
          <div className="rounded-2xl border border-slate-200 p-4 dark:border-slate-600">
            <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">To</p>
            <input
              type="text"
              name="destination"
              placeholder="Enter Destination"
              value={searchData.destination}
              onChange={handleSearchFieldChange}
              className="mt-1 w-full min-w-0 bg-transparent text-base font-semibold text-slate-900 outline-none sm:text-lg dark:text-slate-100"
            />
          </div>
          <div className="rounded-2xl border border-slate-200 p-4 dark:border-slate-600">
            <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Departure</p>
            <input
              type="date"
              name="date"
              value={searchData.date}
              onChange={handleSearchFieldChange}
              className="mt-1 w-full min-w-0 bg-transparent text-base font-semibold text-slate-900 outline-none sm:text-lg dark:text-slate-100"
            />
          </div>
          <div className="flex items-center">
            <button
              type="button"
              onClick={handleHomepageSearch}
              className="w-full rounded-xl bg-blue-600 px-5 py-4 text-center text-sm font-semibold text-white shadow transition hover:bg-blue-700 sm:text-base dark:bg-sky-600 dark:hover:bg-sky-500"
            >
              Search Flights
            </button>
          </div>
        </div>

        {!isAuthenticated && (
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => openModal("login")}
              className="rounded-full border border-blue-200 bg-white px-5 py-2.5 text-sm font-semibold text-blue-700 transition hover:bg-blue-50 dark:border-slate-600 dark:bg-slate-800 dark:text-sky-300 dark:hover:bg-slate-700"
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => openModal("register")}
              className="rounded-full bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow transition hover:bg-blue-700 dark:bg-sky-600 dark:hover:bg-sky-500"
            >
              Register
            </button>
            <p className="text-sm text-slate-500 dark:text-slate-400">Unlock personalized deals after login.</p>
          </div>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <article className="rounded-2xl border border-slate-200 bg-white p-4 font-bold shadow-sm dark:border-slate-700 dark:bg-slate-900/80">
          <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Special Fare Deals</p>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">Save more with daily route-based offers.</p>
        </article>
        <article className="rounded-2xl border border-slate-200 bg-white p-4 font-bold shadow-sm dark:border-slate-700 dark:bg-slate-900/80">
          <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Seat Selection</p>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">Choose your preferred seat while booking.</p>
        </article>
        <article className="rounded-2xl border border-slate-200 bg-white p-4 font-bold shadow-sm dark:border-slate-700 dark:bg-slate-900/80">
          <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Instant Booking</p>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">Fast checkout and booking confirmation.</p>
        </article>
      </div>

      {showAuthModal && (
        <div className="fixed inset-0 z-[60] flex items-end justify-center bg-slate-900/50 p-0 sm:items-center sm:p-4">
          <div className="glass-card fx-fade-up max-h-[90vh] w-full max-w-md overflow-y-auto rounded-t-2xl border border-slate-200 p-5 shadow-2xl sm:rounded-2xl sm:p-6 dark:border-slate-700">
            <div className="mb-4 flex items-center justify-between gap-2">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100 sm:text-xl">
                {activeTab === "login" ? "Login to Tripzy" : "Create Tripzy Account"}
              </h2>
              <button
                type="button"
                onClick={closeModal}
                className="rounded-md px-2 py-1 text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
              >
                X
              </button>
            </div>

            <div className="mb-4 flex rounded-lg bg-slate-100 p-1 text-sm dark:bg-slate-800">
              <button
                type="button"
                onClick={() => setActiveTab("login")}
                className={`w-1/2 rounded-md px-3 py-2 font-medium ${
                  activeTab === "login"
                    ? "bg-white text-blue-700 shadow dark:bg-slate-700 dark:text-sky-300"
                    : "text-slate-600 dark:text-slate-400"
                }`}
              >
                Login
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("register")}
                className={`w-1/2 rounded-md px-3 py-2 font-medium ${
                  activeTab === "register"
                    ? "bg-white text-blue-700 shadow dark:bg-slate-700 dark:text-sky-300"
                    : "text-slate-600 dark:text-slate-400"
                }`}
              >
                Register
              </button>
            </div>

            {activeTab === "login" ? (
              <form className="space-y-3" onSubmit={handleLoginSubmit}>
                <input
                  type="email"
                  name="email"
                  value={loginData.email}
                  onChange={handleLoginChange}
                  placeholder="Email"
                  required
                  className="input-tripzy"
                />
                <input
                  type="password"
                  name="password"
                  value={loginData.password}
                  onChange={handleLoginChange}
                  placeholder="Password"
                  required
                  className="input-tripzy"
                />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full rounded-md bg-blue-600 px-4 py-2 font-medium text-white transition hover:bg-blue-700 disabled:opacity-70 dark:bg-sky-600 dark:hover:bg-sky-500"
                >
                  {isSubmitting ? "Signing in..." : "Login"}
                </button>
              </form>
            ) : (
              <form className="space-y-3" onSubmit={handleRegisterSubmit}>
                <input
                  type="text"
                  name="name"
                  value={registerData.name}
                  onChange={handleRegisterChange}
                  placeholder="Full Name"
                  required
                  className="input-tripzy"
                />
                <input
                  type="email"
                  name="email"
                  value={registerData.email}
                  onChange={handleRegisterChange}
                  placeholder="Email"
                  required
                  className="input-tripzy"
                />
                <input
                  type="password"
                  name="password"
                  value={registerData.password}
                  onChange={handleRegisterChange}
                  placeholder="Password"
                  required
                  className="input-tripzy"
                />
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full rounded-md bg-blue-600 px-4 py-2 font-medium text-white transition hover:bg-blue-700 disabled:opacity-70 dark:bg-sky-600 dark:hover:bg-sky-500"
                >
                  {isSubmitting ? "Creating..." : "Register"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
};

export default Home;
