'use client'
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import LogoSection from "./LogoSection";
import TopMenuItem from "./TopMenuItem";
import UserSection from "./UserSection";
import ThemeToggle from "./ThemeToggle";
import GlobalAnnouncement from "./GlobalAnnouncement";
import { useSession } from "next-auth/react";

export default function TopMenu(){
  const { data: session } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);

  return(
    <div className="w-full sticky top-0 z-50">
      <div className="w-full h-20 border-b border-card-border flex justify-between items-center relative px-6 bg-background/80 backdrop-blur-md transition-colors duration-300">
        <LogoSection/>

        {/* Desktop nav */}
        <div className="hidden xl:flex absolute left-1/2 -translate-x-1/2 justify-center items-center gap-12 tracking-wide uppercase text-sm font-light text-text-main">
          <TopMenuItem item="Shop" pageRef="/shop"/>
          <TopMenuItem
            item="Reservation"
            pageRef={session?.user?.role === "shopowner" ? "/shopowner/reservations" : "/reservations"}
          />
          <TopMenuItem
            item="Announcement"
            pageRef="/announcements"
          />
          {session?.user?.role === "shopowner" && (
            <TopMenuItem item="Chat" pageRef="/chat" />
          )}
          {session?.user?.role === "admin" && <TopMenuItem item="AllUser" pageRef="/admin/user"/>}
          {session ? (
            <TopMenuItem item="Logout" pageRef="/api/auth/signout"/>
          ) : (
            <TopMenuItem item="Login" pageRef="/api/auth/signin"/>
          )}
        </div>

        <div className="flex items-center gap-4">
          <GlobalAnnouncement />
          <ThemeToggle />
          {/* Desktop user section */}
          <div className="hidden xl:flex">
            <UserSection/>
          </div>
          {/* Hamburger button */}
          <button
            className="xl:hidden flex flex-col justify-center items-center w-9 h-9 gap-1.5 rounded-md hover:bg-accent/10 transition-colors duration-200"
            onClick={() => setMenuOpen(prev => !prev)}
            aria-label="Toggle menu"
          >
            <span className={`block w-5 h-px bg-foreground/70 transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-[7px]" : ""}`} />
            <span className={`block w-5 h-px bg-foreground/70 transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`} />
            <span className={`block w-5 h-px bg-foreground/70 transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-[7px]" : ""}`} />
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="xl:hidden w-full border-b border-card-border bg-background/95 backdrop-blur-md flex flex-col px-6 py-4 gap-1">

          {/* Profile block */}
          <Link
            href="/profile"
            onClick={() => setMenuOpen(false)}
            className="flex items-center gap-3 px-2 py-3 mb-1 rounded-lg hover:bg-accent/5 transition-colors"
          >
            <div className="relative w-9 h-9 rounded-full overflow-hidden border border-gray-700 shrink-0">
              {session?.user?.profilePicture && /^https?:\/\//i.test(session.user.profilePicture) ? (
                <Image src={session.user.profilePicture} alt={session.user.name ?? "User"} fill className="object-cover" />
              ) : (
                <div className={`w-full h-full flex items-center justify-center text-[11px] font-bold ${session?.user?.role === "admin" ? "bg-red-900/40 text-red-300" : "bg-accent/40 text-accent"}`}>
                  {session
                    ? (session.user.name?.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2) ?? "?")
                    : "?"}
                </div>
              )}
            </div>
            <div className="flex flex-col gap-0.5">
              <p className="text-[11px] font-mono uppercase tracking-[0.2em] text-text-main">
                {session?.user?.name ?? "Guest Access"}
              </p>
              <p className={`text-[9px] font-mono uppercase tracking-[0.3em] ${session?.user?.role === "admin" ? "text-red-400/80" : "text-text-sub"}`}>
                {session?.user?.role ?? "External"}
              </p>
            </div>
          </Link>

          <div className="h-px bg-card-border mb-1" />

          {/* Nav items */}
          <TopMenuItem item="Shop" pageRef="/shop"/>
          <TopMenuItem
            item="Reservation"
            pageRef={session?.user?.role === "shopowner" ? "/shopowner/reservations" : "/reservations"}
          />
          <TopMenuItem item="Announcement" pageRef="/announcements"/>
          {session?.user?.role === "shopowner" && (
            <TopMenuItem item="Chat" pageRef="/chat" />
          )}
          {session?.user?.role === "admin" && <TopMenuItem item="AllUser" pageRef="/admin/user"/>}

          <div className="h-px bg-card-border mt-1 mb-1" />

          {session ? (
            <TopMenuItem item="Logout" pageRef="/api/auth/signout"/>
          ) : (
            <TopMenuItem item="Login" pageRef="/api/auth/signin"/>
          )}
        </div>
      )}
    </div>
  )
}
