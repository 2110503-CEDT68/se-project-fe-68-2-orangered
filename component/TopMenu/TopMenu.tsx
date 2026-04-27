'use client'
import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import LogoSection from "./LogoSection";
import TopMenuItem from "./TopMenuItem";
import UserSection from "./UserSection";
import ThemeToggle from "./ThemeToggle";
import GlobalAnnouncement from "./GlobalAnnouncement";
import AnnouncementTicker from "./AnnouncementTicker";
import { useSession } from "next-auth/react";

type NavItem = { label: string; href: string };

export default function TopMenu(){
  const { data: session } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => { setMenuOpen(false); }, [pathname]);

  const role = session?.user?.role;

  const navItems = useMemo<NavItem[]>(() => {
    const items: NavItem[] = [
      { label: "Shop", href: "/shop" },
      { label: "Reservation", href: role === "shopowner" ? "/shopowner/reservations" : "/reservations" },
      { label: "Announcement", href: "/announcements" },
    ];
    if (role === "shopowner") items.push({ label: "Chat", href: "/chat" });
    if (role === "admin") items.push({ label: "AllUser", href: "/admin/user" });
    return items;
  }, [role]);

  const authItem: NavItem = session
    ? { label: "Logout", href: "/api/auth/signout" }
    : { label: "Login", href: "/api/auth/signin" };

  const initials = session?.user?.name
    ?.split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) ?? "?";

  return(
    <div className="relative w-full sticky top-0 z-50">
      {/* Gold top line */}
      <div className="h-px bg-gradient-to-r from-transparent via-gold/60 to-transparent" />

      <div className="relative z-10 w-full h-20 border-b border-gold/10 flex items-center px-4 sm:px-6 gap-2 bg-gradient-to-r from-background via-card to-background backdrop-blur-xl transition-colors duration-300">
        {/* Left: logo */}
        <div className="shrink-0 h-full">
          <LogoSection/>
        </div>

        {/* Center: desktop nav (md+) — flex-1 lets it absorb available space */}
        <nav className="hidden md:flex flex-1 justify-center items-center min-w-0 gap-0 lg:gap-2 xl:gap-5 2xl:gap-12 tracking-wide uppercase text-sm font-light text-text-main">
          {navItems.map(it => (
            <TopMenuItem key={it.label} item={it.label} pageRef={it.href} />
          ))}
          <TopMenuItem item={authItem.label} pageRef={authItem.href} />
        </nav>

        {/* Spacer when desktop nav is hidden so right cluster stays right */}
        <div className="md:hidden flex-1" />

        {/* Right: icons + UserSection (desktop) + hamburger (below md) */}
        <div className="shrink-0 flex items-center gap-1">
          <GlobalAnnouncement />
          <ThemeToggle />
          <div className="hidden md:flex border-l border-gold/15 pl-1">
            <UserSection/>
          </div>
          <div className="md:hidden border-l border-gold/15 pl-3 ml-1">
            <button
              type="button"
              className={`relative flex flex-col justify-center items-center w-9 h-9 gap-[5px] rounded-lg border transition-all duration-200 ${
                menuOpen
                  ? "border-gold/50 bg-gold/10 shadow-[0_0_12px_rgba(212,175,55,0.15)]"
                  : "border-white/10 hover:border-gold/30 hover:bg-gold/5"
              }`}
              onClick={() => setMenuOpen(prev => !prev)}
              aria-label="Toggle menu"
            >
              <span className={`block w-[18px] h-[1.5px] rounded-full transition-all duration-300 origin-center ${menuOpen ? "rotate-45 translate-y-[6px] bg-gold" : "bg-foreground/80"}`} />
              <span className={`block w-[18px] h-[1.5px] rounded-full transition-all duration-300 origin-center ${menuOpen ? "opacity-0 scale-x-0 bg-gold" : "bg-foreground/80"}`} />
              <span className={`block w-[18px] h-[1.5px] rounded-full transition-all duration-300 origin-center ${menuOpen ? "-rotate-45 -translate-y-[6px] bg-gold" : "bg-foreground/80"}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Announcement ticker bar */}
      <div className="relative w-full h-8 border-b border-gold/10 flex items-center px-6 overflow-hidden bg-gradient-to-r from-card/60 via-background/80 to-card/60 backdrop-blur-md">
        <AnnouncementTicker />
      </div>

      {/* Backdrop — closes menu when clicking outside */}
      {menuOpen && (
        <div className="fixed inset-0 z-0" onClick={() => setMenuOpen(false)} />
      )}

      {/* Mobile/tablet dropdown */}
      {menuOpen && (
        <div
          className="md:hidden absolute top-full left-0 right-0 z-10 border-b border-gold/10 bg-gradient-to-b from-background to-card backdrop-blur-xl flex flex-col"
          style={{ animation: 'menuSlideDown 0.2s cubic-bezier(0.16, 1, 0.3, 1)' }}
        >
          <div className="h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />

          {/* Profile block */}
          <div className="px-6 pt-4 pb-3">
            <Link
              href="/profile"
              onClick={() => setMenuOpen(false)}
              className="group flex items-center gap-4 p-3 rounded-xl border border-gold/10 hover:border-gold/30 hover:bg-gold/5 transition-all duration-200"
            >
              <div className="relative w-10 h-10 rounded-full overflow-hidden border border-gold/20 group-hover:border-gold/50 transition-colors shrink-0">
                {session?.user?.profilePicture && /^https?:\/\//i.test(session.user.profilePicture) ? (
                  <Image src={session.user.profilePicture} alt={session.user.name ?? "User"} fill className="object-cover" />
                ) : (
                  <div className={`w-full h-full flex items-center justify-center text-[11px] font-bold ${role === "admin" ? "bg-red-900/40 text-red-300" : "bg-gold/15 text-gold"}`}>
                    {session ? initials : "?"}
                  </div>
                )}
              </div>
              <div className="flex flex-col gap-1 min-w-0">
                <p className="text-[12px] font-mono uppercase tracking-[0.2em] text-text-main truncate">
                  {session?.user?.name ?? "Guest Access"}
                </p>
                <div className="flex items-center gap-1.5">
                  <span className={`w-1.5 h-1.5 rounded-full ${role === "admin" ? "bg-red-400" : "bg-gold/80"}`} />
                  <p className={`text-[9px] font-mono uppercase tracking-[0.35em] ${role === "admin" ? "text-red-400/70" : "text-gold/50"}`}>
                    {role ?? "External"}
                  </p>
                </div>
              </div>
              <svg className="ml-auto shrink-0 w-3.5 h-3.5 text-gold/20 group-hover:text-gold/60 transition-colors" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          {/* Nav items */}
          <div className="px-4 pb-2">
            <p className="px-3 mb-1 text-[8px] font-mono uppercase tracking-[0.5em] text-gold/30">Navigation</p>
            {navItems.map(it => (
              <TopMenuItem key={it.label} item={it.label} pageRef={it.href} />
            ))}
          </div>

          <div className="mx-6 h-px bg-gold/8" />

          {/* Auth */}
          <div className="px-4 py-2">
            <TopMenuItem item={authItem.label} pageRef={authItem.href} />
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes menuSlideDown {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}
