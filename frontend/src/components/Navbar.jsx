import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth.jsx";
import ThemeToggle from "./ThemeToggle.jsx";
import logo from "../assets/logo.png";

const navLinkClass =
  "rounded-full px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800";

const Navbar = () => {
  const { isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate("/login");
  };

  const closeMenu = () => setMenuOpen(false);

  const authLinks = (
    <>
      <Link to="/flights" className={navLinkClass} onClick={closeMenu}>
        Flights
      </Link>
      <Link to="/my-bookings" className={navLinkClass} onClick={closeMenu}>
        My Bookings
      </Link>
      <Link to="/profile" className={navLinkClass} onClick={closeMenu}>
        Profile
      </Link>
      {isAdmin && (
        <Link
          to="/admin"
          className="rounded-full bg-green-600 px-4 py-2 text-sm font-medium text-white shadow transition hover:bg-green-700"
          onClick={closeMenu}
        >
          Admin
        </Link>
      )}
      <Link to="/about" className={navLinkClass} onClick={closeMenu}>
        About Us
      </Link>
      <button
        type="button"
        onClick={handleLogout}
        className="rounded-full bg-red-600 px-4 py-2 text-sm font-medium text-white shadow transition hover:bg-red-700"
      >
        Logout
      </button>
    </>
  );

  const guestLinks = (
    <>
      <Link to="/login" className={navLinkClass} onClick={closeMenu}>
        Login
      </Link>
      <Link
        to="/register"
        className="rounded-full bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow transition hover:bg-blue-700"
        onClick={closeMenu}
      >
        Register
      </Link>
      <Link to="/about" className={navLinkClass} onClick={closeMenu}>
        About Us
      </Link>
    </>
  );

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/95 shadow-sm backdrop-blur dark:border-slate-700/80 dark:bg-slate-900/95">
      <nav className="mx-auto flex w-full max-w-8xl items-center justify-between gap-3 px-3 py-2 sm:px-6 lg:px-8">
        <Link
          to="/"
          onClick={closeMenu}
          className="flex min-w-0 items-center gap-2 text-lg font-extrabold tracking-tight text-blue-700 dark:text-blue-400 sm:text-xl"
        >
          <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center sm:h-16 sm:w-16">
            <img src={logo} alt="Tripzy logo" className="h-11 w-11 object-contain sm:h-14 sm:w-14" />
          </span>
          <span className="truncate">Tripzy</span>
        </Link>

        <div className="hidden flex-wrap items-center justify-end gap-1.5 lg:gap-2 md:flex">
          {isAuthenticated ? authLinks : guestLinks}
        </div>

        <div className="flex items-center gap-2 md:gap-3">
          <ThemeToggle />
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm md:hidden dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200"
            aria-expanded={menuOpen}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMenuOpen((o) => !o)}
          >
            {menuOpen ? (
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </nav>

      {menuOpen && (
        <div className="border-t border-slate-200 px-3 py-3 dark:border-slate-700 md:hidden">
          <div className="flex flex-col gap-1">
            {isAuthenticated ? authLinks : guestLinks}
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
