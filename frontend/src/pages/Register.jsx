import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import API from "../services/api.js";
import { useAuth } from "../context/useAuth.jsx";

const Register = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    try {
      await API.post("/auth/register", formData);
      toast.success("Registration successful. Please login.");
      navigate("/login");
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isAuthenticated) {
    return <Navigate to="/flights" replace />;
  }

  return (
    <section className="mx-auto mt-10 max-w-5xl">
      <div className="grid overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl lg:grid-cols-2">
        <aside className="relative p-8 text-white">
          <img
            src="https://images.unsplash.com/photo-1504196606672-aef5c9cefc92?auto=format&fit=crop&w=1200&q=80"
            alt="Airplane on runway"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-slate-900/55" />
          <div className="relative z-10">
          <p className="inline-block rounded-full bg-white/20 px-3 py-1 text-xs tracking-wide">
            Join Tripzy
          </p>
          <h1 className="mt-4 text-3xl leading-tight">Create your account in seconds</h1>
          <p className="mt-3 text-sm text-blue-100">
            Start planning smarter with modern booking tools and personalized experiences.
          </p>
          <div className="mt-8 space-y-3 text-sm text-blue-100">
            <p>- Manage bookings from one dashboard</p>
            <p>- Faster search and booking flow</p>
            <p>- Better travel tracking for each trip</p>
          </div>
          </div>
        </aside>

        <div className="p-8">
          <h2 className="text-2xl text-slate-900">Create Account</h2>
          <p className="mt-1 text-sm text-slate-500">Fill in your details to get started.</p>
          <form className="mt-6 space-y-4" onSubmit={onSubmit}>
            <label className="block space-y-1">
              <span className="text-xs text-slate-600">Full Name</span>
              <input
                type="text"
                name="name"
                placeholder="Your name"
                value={formData.name}
                onChange={onChange}
                required
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </label>
            <label className="block space-y-1">
              <span className="text-xs text-slate-600">Email Address</span>
              <input
                type="email"
                name="email"
                placeholder="you@example.com"
                value={formData.email}
                onChange={onChange}
                required
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </label>
            <label className="block space-y-1">
              <span className="text-xs text-slate-600">Password</span>
              <input
                type="password"
                name="password"
                placeholder="Create password"
                value={formData.password}
                onChange={onChange}
                required
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              />
            </label>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-xl bg-blue-600 px-4 py-3 text-white shadow transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting ? "Creating account..." : "Register"}
            </button>
          </form>
          <p className="mt-5 text-center text-sm text-slate-600">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600 hover:underline">
              Login
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
};

export default Register;
