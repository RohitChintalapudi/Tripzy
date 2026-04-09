import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth.jsx";
import logo from "../assets/logo.png";

const Navbar = () => {
  const { isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/95 shadow-sm backdrop-blur">
      <nav className="mx-auto flex w-full max-w-8xl items-center justify-between px-4 py-2 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2 text-xl font-extrabold tracking-tight text-blue-700">
          <span className="inline-flex h-16 w-20 -ml-8 items-center justify-center">
            <img
              src={logo}
              alt="Tripzy logo"
              className="h-16 w-16 ml-10 object-contain scale-130"
            />
          </span>
          Tripzy
        </Link>

        {isAuthenticated ? (
          <div className="flex items-center gap-3">
            <Link
              to="/flights"
              className="rounded-full px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
            >
              Flights
            </Link>
            <Link
              to="/my-bookings"
              className="rounded-full px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
            >
              My Bookings
            </Link>
            <Link
              to="/profile"
              className="rounded-full px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
            >
              Profile
            </Link>
            {isAdmin && (
              <Link
                to="/admin"
                className="rounded-full bg-green-600 px-4 py-2 text-sm font-medium text-white shadow transition hover:bg-green-700"
              >
                Admin
              </Link>
            )}
            <Link
              to="/about"
              className="rounded-full px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
            >
              About Us
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-full bg-red-600 px-4 py-2 text-sm font-medium text-white shadow transition hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="rounded-full px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="rounded-full bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow transition hover:bg-blue-700"
            >
              Register
            </Link>
            <Link
              to="/about"
              className="rounded-full px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
            >
              About Us
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
