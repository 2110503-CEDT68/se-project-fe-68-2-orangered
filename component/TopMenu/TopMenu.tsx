'use client'

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";

import LogoSection from "./LogoSection";
import TopMenuItem from "./TopMenuItem";
import UserSection from "./UserSection";
import ThemeToggle from "./ThemeToggle";
import GlobalAnnouncement from "./GlobalAnnouncement";
import AnnouncementTicker from "./AnnouncementTicker";

type NavItem = { label: string; href: string };

export default function TopMenu() {
  const { data: session } = useSession();
  const pathname = usePathname();

  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => setMenuOpen(false), [pathname]);

  const role = session?.user?.role;

  // =====================
  // NAV ITEMS
  // =====================
  const navItems = useMemo<NavItem[]>(() => {
    const items: NavItem[] = [
      { label: "Shop", href: "/shop" },
      {
        label: "Reservation",
        href: role === "shopowner"
          ? "/shopowner/reservations"
          : "/reservations",
      },
      { label: "Announcement", href: "/announcements" },
    ];

    if (role === "shopowner") items.push({ label: "Chat", href: "/chat" });
    if (role === "admin") items.push({ label: "AllUser", href: "/admin/user" });

    return items;
  }, [role]);

  const authItem: NavItem = session
    ? { label: "Logout", href: "/api/auth/signout" }
    : { label: "Login", href: "/api/auth/signin" };

  const initials =
    session?.user?.name
      ?.split(" ")
      .map((n: string) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) ?? "?";

  return (
    <div className="sticky top-0 z-50 w-full">

      {/* TOP BORDER */}
      <div className="h-px bg-gradient-to-r from-transparent via-gold/60 to-transparent" />

      {/* ===================== NAV BAR ===================== */}
      <div className="flex items-center h-20 px-4 sm:px-6 border-b border-gold/10 bg-gradient-to-r from-background via-card to-background backdrop-blur-xl">

        {/* LEFT */}
        <div className="flex items-center">
          <LogoSection />
        </div>

        {/* CENTER (desktop only) */}
        <nav className="hidden md:flex flex-1 justify-center items-center gap-4 uppercase text-sm font-light text-text-main">
          {navItems.map((it) => (
            <TopMenuItem key={it.label} item={it.label} pageRef={it.href} />
          ))}
          <TopMenuItem item={authItem.label} pageRef={authItem.href} />
        </nav>

        {/* RIGHT */}
        <div className="flex items-center gap-2 ml-auto">
          <GlobalAnnouncement />
          <ThemeToggle />

          {/* Desktop User */}
          <div className="hidden md:flex border-l border-gold/15 pl-3">
            <UserSection />
          </div>

          {/* Mobile Hamburger */}
          <button
            className="md:hidden w-9 h-9 flex flex-col justify-center items-center gap-[5px] border border-white/10 rounded-lg"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <span className={`w-5 h-[1.5px] ${menuOpen ? "rotate-45 translate-y-[6px]" : ""}`} />
            <span className={`w-5 h-[1.5px] ${menuOpen ? "opacity-0" : ""}`} />
            <span className={`w-5 h-[1.5px] ${menuOpen ? "-rotate-45 -translate-y-[6px]" : ""}`} />
          </button>
        </div>
      </div>

      {/* ===================== ANNOUNCEMENT ===================== */}
      <div className="h-8 flex items-center px-6 border-b border-gold/10 bg-gradient-to-r from-card/60 via-background/80 to-card/60">
        <AnnouncementTicker />
      </div>

      {/* ===================== BACKDROP ===================== */}
      {menuOpen && (
        <div
          className="fixed inset-0"
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/* ===================== MOBILE MENU ===================== */}
      {menuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-background border-b border-gold/10">

          {/* PROFILE */}
          <div className="p-4">
            <Link href="/profile" onClick={() => setMenuOpen(false)} className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full overflow-hidden border border-gold/20">
                {session?.user?.profilePicture ? (
                  <Image
                    src={session.user.profilePicture}
                    alt="user"
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xs bg-gold/20">
                    {initials}
                  </div>
                )}
              </div>

              <div>
                <p className="text-sm">{session?.user?.name ?? "Guest"}</p>
                <p className="text-xs text-gold/50">{role ?? "External"}</p>
              </div>
            </Link>
          </div>

          {/* NAV */}
          <div className="px-4 pb-2">
            {navItems.map((it) => (
              <TopMenuItem key={it.label} item={it.label} pageRef={it.href} />
            ))}
          </div>

          {/* AUTH */}
          <div className="px-4 pb-4">
            <TopMenuItem item={authItem.label} pageRef={authItem.href} />
          </div>
        </div>
      )}
    </div>
  );
}