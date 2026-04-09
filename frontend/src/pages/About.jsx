const features = [
  {
    title: "Seamless Flight Discovery",
    description:
      "Search and compare routes instantly with simple filters and clear pricing details.",
  },
  {
    title: "Smart Booking Experience",
    description:
      "Choose your preferred seat, confirm quickly, and manage trips from one dashboard.",
  },
  {
    title: "Reliable Travel Support",
    description:
      "Get trustworthy status updates and a smooth experience built for modern travelers.",
  },
];

const values = [
  {
    title: "Customer First",
    text: "Every feature at Tripzy is designed to reduce travel stress and improve confidence.",
  },
  {
    title: "Transparent Pricing",
    text: "No hidden surprises - we focus on clear fares and clear booking information.",
  },
  {
    title: "Always Improving",
    text: "Our team continuously upgrades UX, speed and reliability for every booking flow.",
  },
];

const About = () => {
  return (
    <section className="mx-auto max-w-5xl space-y-8">
      <div className="relative overflow-hidden rounded-2xl px-6 py-5 text-white shadow-xl">
        <img
          src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1600&q=80"
          alt="Flight in sky"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-slate-900/55" />
        <div className="relative z-10">
          <h1 className="text-lg">What is Tripzy?</h1>
          <p className="mt-1 text-sm sm:text-base">
            Tripzy is a traveler-first booking platform helping people discover, compare, and manage flights with confidence.
            We provide a smooth, modern, and reliable experience from search to ticket confirmation.
          </p>
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-md transition duration-300 hover:-translate-y-2 hover:shadow-2xl">
          <img
            src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1200&q=80"
            alt="Airplane flying in sky"
            className="h-56 w-full object-cover"
          />
          <div className="p-5">
            <h2 className="text-lg font-semibold text-slate-900">Built for Every Flyer</h2>
            <p className="mt-2 text-sm text-slate-600">
              From weekend trips to business travel, Tripzy keeps booking simple,
              quick, and intuitive for all user types.
            </p>
          </div>
        </article>
        <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-md transition duration-300 hover:-translate-y-2 hover:shadow-2xl">
          <img
            src="https://images.unsplash.com/photo-1542296332-2e4473faf563?auto=format&fit=crop&w=1200&q=80"
            alt="Airport runway and lights"
            className="h-56 w-full object-cover"
          />
          <div className="p-5">
            <h2 className="text-lg font-semibold text-slate-900">Fast and Reliable</h2>
            <p className="mt-2 text-sm text-slate-600">
              We optimize each step of search, booking, and management so you can
              move from planning to confirmation in minutes.
            </p>
          </div>
        </article>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {features.map((item) => (
          <article
            key={item.title}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-md transition duration-300 hover:-translate-y-2 hover:shadow-2xl"
          >
            <h2 className="text-lg font-semibold text-slate-900">{item.title}</h2>
            <p className="mt-2 text-sm text-slate-600">{item.description}</p>
          </article>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {values.map((item) => (
          <article
            key={item.title}
            className="rounded-2xl border border-slate-200 bg-slate-50 p-5 shadow-sm transition duration-300 hover:-translate-y-2 hover:shadow-2xl"
          >
            <h3 className="text-base font-semibold text-slate-900">{item.title}</h3>
            <p className="mt-2 text-sm text-slate-600">{item.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
};

export default About;
