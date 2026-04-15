import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import API from "../services/api.js";
import { useAuth } from "../context/useAuth.jsx";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const Login = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    const email = formData.email.trim().toLowerCase();
    const password = formData.password;

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
      const authUser = {
        token: data.token,
        user: data.user || {
          _id: data._id,
          name: data.name,
          email: formData.email,
          role: data.role || "user",
        },
      };
      login(authUser);
      toast.success("Login successful");
      navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <section className="mx-auto mt-4 max-w-5xl sm:mt-10">
      <div className="grid overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl dark:border-slate-700 dark:bg-slate-900/80 lg:grid-cols-2">
        <aside className="relative min-h-[200px] p-6 text-white sm:p-8 lg:min-h-0">
          <img
            src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1200&q=80"
            alt="Airplane wing view"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-slate-900/55" />
          <div className="relative z-10">
          <p className="inline-block rounded-full bg-white/20 px-3 py-1 text-xs tracking-wide">
            Welcome Back
          </p>
          <h1 className="mt-4 text-3xl leading-tight">Login to your Tripzy account</h1>
          <p className="mt-3 text-sm text-blue-100">
            Access bookings, manage your trips, and unlock exclusive offers.
          </p>
          <div className="mt-8 space-y-3 text-sm text-blue-100">
            <p>- View and manage all your flight tickets</p>
            <p>- Faster checkout with saved preferences</p>
            <p>- Real-time booking updates and alerts</p>
          </div>
          </div>
        </aside>

        <div className="p-5 sm:p-8">
          <h2 className="text-2xl text-slate-900 dark:text-slate-100">Sign In</h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Use your registered email and password.</p>
          <form className="mt-6 space-y-4" onSubmit={onSubmit}>
            <label className="block space-y-1">
              <span className="text-xs text-slate-600 dark:text-slate-400">Email Address</span>
              <input
                type="email"
                name="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={onChange}
                required
                className="input-tripzy-xl"
              />
            </label>
            <label className="block space-y-1">
              <span className="text-xs text-slate-600 dark:text-slate-400">Password</span>
              <input
                type="password"
                name="password"
                placeholder="Enter password"
                value={formData.password}
                onChange={onChange}
                required
                className="input-tripzy-xl"
              />
            </label>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-xl bg-blue-600 px-4 py-3 text-white shadow transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70 dark:bg-sky-600 dark:hover:bg-sky-500"
            >
              {isSubmitting ? "Signing in..." : "Login"}
            </button>
          </form>
          <p className="mt-5 text-center text-sm text-slate-600 dark:text-slate-400">
            New to Tripzy?{" "}
            <Link to="/register" className="text-blue-600 hover:underline dark:text-sky-400">
              Create account
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
};

export default Login;
