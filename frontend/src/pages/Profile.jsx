import { useAuth } from "../context/useAuth.jsx";

const Profile = () => {
  const { user } = useAuth();
  const profile = user?.user || {};

  const displayProfile = {
    name: profile.name || "Aarav Sharma",
    email: profile.email || "aarav.sharma@example.com",
    role: profile.role || "traveler",
    phone: "+91 98765 43210",
    city: "Bengaluru",
    loyaltyTier: "Gold Explorer",
    tripsCompleted: 18,
    memberSince: "2023",
    preferredSeat: "Window",
    favoriteRoute: "Bengaluru -> Delhi",
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
          <p className="mt-1 text-sm font-medium text-slate-900 dark:text-slate-100">{displayProfile.phone}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-600 dark:bg-slate-800/50">
          <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">City</p>
          <p className="mt-1 text-sm font-medium text-slate-900 dark:text-slate-100">{displayProfile.city}</p>
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
      </div>
    </section>
  );
};

export default Profile;
