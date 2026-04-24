import Link from "next/link";

export default function NoReservationShopOwner() {
  return (
    <main className="min-h-[80vh] bg-background text-text-main flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background Decorative Element */}
      <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none">
        <div className="text-[20rem] font-serif italic">Open</div>
      </div>

      {/* Subtle animated ring */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 border border-gold/5 rounded-full animate-ping pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 border border-gold/[0.03] rounded-full animate-ping [animation-delay:0.8s] pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center max-w-md w-full px-8 text-center">
        {/* Symbol */}
        <div className="mb-10 relative">
          <div className="text-2xl text-gold opacity-40 animate-pulse">◈</div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 border border-gold/10 rounded-full scale-150" />
        </div>

        <div className="space-y-4">
          <h2 className="text-[11px] uppercase tracking-[0.6em] text-gold font-bold">
            No Bookings Yet
          </h2>

          <div className="h-px w-8 bg-gold/20 mx-auto" />

          <p className="text-[10px] uppercase tracking-[0.2em] text-text-sub leading-loose opacity-70">
            Your shop is open, but your calendar stands empty.
            <br />
            Time to bring the guests in.
          </p>
        </div>

        {/* Action Cards */}
        <div className="mt-12 w-full flex flex-col gap-3">
          {/* Primary CTA */}
          <Link
            href="/owner/promote"
            className="group relative w-full px-8 py-5 overflow-hidden rounded-full border border-gold/30 transition-all duration-500 hover:border-gold/60 flex items-center justify-between"
          >
            <div className="absolute inset-0 bg-gold/5 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
            <span className="relative text-[9px] uppercase tracking-[0.4em] text-gold group-hover:text-text-main transition-colors">
              Promote Your Shop
            </span>
            <span className="relative text-gold/40 group-hover:text-gold group-hover:translate-x-1 transition-all duration-300 text-xs">
              →
            </span>
          </Link>

          {/* Secondary CTA */}
          <Link
            href="/owner/offers"
            className="group relative w-full px-8 py-5 overflow-hidden rounded-full border border-gold/15 transition-all duration-500 hover:border-gold/40 flex items-center justify-between"
          >
            <div className="absolute inset-0 bg-gold/[0.03] translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
            <span className="relative text-[9px] uppercase tracking-[0.4em] text-text-sub group-hover:text-gold transition-colors">
              Create a Special Offer
            </span>
            <span className="relative text-text-sub/30 group-hover:text-gold group-hover:translate-x-1 transition-all duration-300 text-xs">
              →
            </span>
          </Link>

          {/* Tertiary CTA */}
          <Link
            href="/owner/settings"
            className="group relative w-full px-8 py-5 overflow-hidden rounded-full border border-gold/10 transition-all duration-500 hover:border-gold/30 flex items-center justify-between"
          >
            <div className="absolute inset-0 bg-gold/[0.02] translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
            <span className="relative text-[9px] uppercase tracking-[0.4em] text-text-sub/60 group-hover:text-text-sub transition-colors">
              Update Shop Availability
            </span>
            <span className="relative text-text-sub/20 group-hover:text-text-sub group-hover:translate-x-1 transition-all duration-300 text-xs">
              →
            </span>
          </Link>
        </div>

        {/* Home link */}
        <div className="mt-10">
          <Link
            href="/"
            className="text-[9px] uppercase tracking-[0.3em] text-text-sub hover:text-gold transition-colors duration-300 py-2 border-b border-transparent hover:border-gold/30"
          >
            Return to Home
          </Link>
        </div>
      </div>

      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex gap-12 opacity-20">
        <p className="text-[8px] font-mono tracking-widest uppercase">
          Bookings_State // 000
        </p>
        <p className="text-[8px] font-mono tracking-widest uppercase">
          Shop_Dashboard_v3
        </p>
      </div>
    </main>
  );
}
