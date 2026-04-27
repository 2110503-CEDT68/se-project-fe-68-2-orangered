"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";

function MdAnnouncement(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      stroke="currentColor"
      fill="currentColor"
      strokeWidth={0}
      viewBox="0 0 24 24"
      height="1em"
      width="1em"
      {...props}
    >
      <path d="M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-7 9h-2V5h2v6zm0 4h-2v-2h2v2z" />
    </svg>
  );
}

interface Announcement {
  _id: string;
  title: string;
  content: string;
  imageUrl?: string;
  createdAt: string;
  shop?: {
    _id: string;
    name: string;
    picture: string;
  };
}

const STORAGE_KEY = "orangered_seen_announcements";

function getSeenIds(): Set<string> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return new Set(raw ? JSON.parse(raw) : []);
  } catch {
    return new Set();
  }
}

function markAllSeen(ids: string[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  } catch {}
}

export default function GlobalAnnouncement() {
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [hasNew, setHasNew] = useState(true);
    const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);
    const [mounted, setMounted] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        setMounted(true);
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
        if (!backendUrl) return; // backend URL not configured

        const fetchAnnouncements = async () => {
            try {
                const res = await fetch(`${backendUrl}/api/v1/announcements/all`);
                if (!res.ok) return;
                const result = await res.json();
                if (result.success && result.data) {
                    setAnnouncements(result.data);
                }
            } catch (err) {
                // silently fail — backend might be offline
            }
        };
        fetchAnnouncements();
    }, []);

    // Close when clicking outside
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        if (isOpen) document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isOpen]);

    const handleOpen = () => {
        setIsOpen(prev => !prev);
        setHasNew(false);
    };
    if (isOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const handleOpen = () => {
    setIsOpen((prev) => !prev);
    if (newCount > 0) {
      markAllSeen(announcements.map((a) => a._id));
      setNewCount(0);
    }
  };

  if (announcements.length === 0) return null;

  return (
    <div ref={dropdownRef} className="relative">
      {/* Bell button */}
      <button
        onClick={handleOpen}
        className="relative p-2 text-text-sub hover:text-accent transition-all duration-200 flex items-center justify-center group"
        title="Global Announcements"
        aria-label="Announcements"
      >
        <MdAnnouncement
          className={`text-xl transition-transform duration-300 ${isOpen ? "scale-90" : "group-hover:scale-110"}`}
          style={{ display: "inline-block" }}
        />
        {/* Badge — only shown when there are unseen announcements */}
        {newCount > 0 && (
          <>
            <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 flex items-center justify-center rounded-full text-[9px] font-black shadow-lg bg-red-500 text-white shadow-red-500/40">
              {newCount > 99 ? "99+" : newCount}
            </span>
            <span className="absolute -top-0.5 -right-0.5 w-[18px] h-[18px] rounded-full bg-red-500 opacity-50 animate-ping pointer-events-none" />
          </>
        )}
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div
          className="absolute right-0 top-full mt-3 w-[400px] bg-card border border-card-border rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.5)] z-50 overflow-hidden"
          style={{
            animation: "dropdownIn 0.2s cubic-bezier(0.34, 1.2, 0.64, 1)",
          }}
        >
          {/* Accent top bar */}
          <div className="h-[2px] bg-gradient-to-r from-accent/70 via-gold/40 to-transparent" />

          {/* Header */}
          <div className="flex justify-between items-center px-5 py-4 border-b border-card-border bg-card/95 backdrop-blur-md">
            <div className="flex items-center gap-2.5">
              <div className="w-6 h-6 rounded-md bg-accent/15 border border-accent/30 flex items-center justify-center">
                <MdAnnouncement className="text-accent text-sm" />
              </div>
              <div>
                <h2 className="text-[10px] font-bold uppercase tracking-[0.35em] text-accent">
                  Announcements
                </h2>
                <p className="text-[8px] uppercase tracking-widest text-text-sub/40 mt-0.5">
                  {announcements.length} active{" "}
                  {announcements.length === 1 ? "post" : "posts"}
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="w-6 h-6 flex items-center justify-center rounded-md border border-card-border text-text-sub hover:text-red-400 hover:border-red-400/30 hover:bg-red-400/10 transition-all text-xs"
            >
              ×
            </button>
          </div>

          {/* Feed */}
          <div className="max-h-[60vh] overflow-y-auto scrollbar-thin">
            <div className="p-3 space-y-2">
              {announcements.map((ann, index) => (
                <div
                  key={ann._id}
                  className="group rounded-xl border border-card-border bg-background/40 hover:bg-background/70 hover:border-accent/20 transition-all duration-300 overflow-hidden"
                  style={{ animationDelay: `${index * 40}ms` }}
                >
                  {/* Image */}
                  {ann.imageUrl && (
                    <div className="w-full h-28 overflow-hidden relative">
                      <img
                        src={ann.imageUrl}
                        alt={ann.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-card/70 to-transparent" />
                    </div>
                  )}

                    {/* Feed */}
                    <div className="max-h-[60vh] overflow-y-auto scrollbar-thin">
                        <div className="p-3 space-y-2">
                            {announcements.map((ann, index) => (
                                <div
                                    key={ann._id}
                                    onClick={() => {
                                        setSelectedAnnouncement(ann);
                                        setIsOpen(false);
                                    }}
                                    className="group rounded-xl border border-card-border bg-background/40 hover:bg-background/70 hover:border-accent/20 transition-all duration-300 overflow-hidden cursor-pointer relative"
                                    style={{ animationDelay: `${index * 40}ms` }}
                                >
                                    {/* Image */}
                                    {ann.imageUrl && (
                                        <div className="w-full h-28 overflow-hidden relative">
                                            <img
                                                src={ann.imageUrl}
                                                alt={ann.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-card/70 to-transparent" />
                                        </div>
                                    )}

                                    <div className="p-3.5">
                                        {/* Shop info */}
                                        {ann.shop && (
                                            <Link
                                                href={`/shop/${ann.shop._id}`}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setIsOpen(false);
                                                }}
                                                className="flex items-center gap-1.5 mb-2 w-fit group/shop relative z-10"
                                            >
                                                {ann.shop.picture && (
                                                    <img
                                                        src={ann.shop.picture}
                                                        alt={ann.shop.name}
                                                        className="w-4 h-4 rounded-full object-cover border border-card-border group-hover/shop:border-accent transition-colors"
                                                    />
                                                )}
                                                <span className="text-[8px] uppercase tracking-[0.25em] text-accent/70 group-hover/shop:text-accent transition-colors font-bold">
                                                    {ann.shop.name}
                                                </span>
                                                <span className="text-[8px] text-text-sub/30">›</span>
                                            </Link>
                                        )}

                                        {/* Title */}
                                        <h3 className="text-[13px] font-semibold text-text-main leading-snug mb-1.5 group-hover:text-accent transition-colors duration-300">
                                            {ann.title}
                                        </h3>

                                        {/* Content preview */}
                                        <div className="mt-1.5 opacity-80">
                                            <p className="text-[11px] text-text-sub leading-relaxed line-clamp-2">
                                                {ann.content}
                                            </p>
                                        </div>

                                        {/* Date */}
                                        <div className="flex items-center gap-1.5 mt-2.5">
                                            <span className="w-1 h-1 rounded-full bg-accent/30 inline-block" />
                                            <p className="text-[8px] text-text-sub/40 uppercase tracking-widest font-mono">
                                                {new Date(ann.createdAt).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' })}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Title */}
                    <h3 className="text-[13px] font-semibold text-text-main leading-snug mb-1.5 group-hover:text-accent transition-colors duration-300">
                      {ann.title}
                    </h3>

                    {/* Content preview */}
                    <p className="text-[11px] text-text-sub leading-relaxed line-clamp-2">
                      {ann.content}
                    </p>

                    {/* Date */}
                    <div className="flex items-center gap-1.5 mt-2.5">
                      <span className="w-1 h-1 rounded-full bg-accent/30 inline-block" />
                      <p className="text-[8px] text-text-sub/40 uppercase tracking-widest font-mono">
                        {new Date(ann.createdAt).toLocaleDateString("th-TH", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                </div>
            )}

            {/* Beautiful Modal for Selected Announcement */}
            {mounted && selectedAnnouncement && createPortal(
                <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 pointer-events-auto">
                    {/* Backdrop */}
                    <div 
                        className="absolute inset-0 bg-black/50 backdrop-blur-md transition-opacity"
                        style={{ animation: 'backdropIn 0.6s cubic-bezier(0.16, 1, 0.3, 1)' }}
                        onClick={() => setSelectedAnnouncement(null)}
                    />
                    
                    {/* Magical Glow Behind Modal */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-accent/20 blur-[120px] rounded-full pointer-events-none opacity-50 animate-pulse" style={{ animationDuration: '4s' }} />
                    
                    {/* Modal Content */}
                    <div 
                        className="relative w-full max-w-2xl bg-card border border-card-border/50 rounded-[2rem] shadow-[0_20px_100px_-20px_rgba(var(--accent-rgb),0.3)] overflow-hidden flex flex-col max-h-[90vh] backdrop-blur-2xl"
                        style={{ animation: 'modalFloatUp 0.8s cubic-bezier(0.16, 1, 0.3, 1)' }}
                    >
                        {/* Elegant top accent line with shimmer */}
                        <div className="relative h-1.5 w-full bg-card-border overflow-hidden">
                            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-accent/80 to-transparent opacity-80" style={{ animation: 'shimmer 2.5s infinite linear' }} />
                        </div>

                        {/* Close button */}
                        <button 
                            onClick={() => setSelectedAnnouncement(null)}
                            className="absolute top-5 right-5 w-10 h-10 flex items-center justify-center rounded-full bg-background/50 hover:bg-background border border-transparent hover:border-card-border text-text-sub hover:text-red-500 z-10 transition-all duration-500 hover:rotate-90 hover:scale-110 shadow-sm backdrop-blur-sm group"
                        >
                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="group-hover:stroke-2 transition-all">
                                <path d="M13 1L1 13M1 1l12 12" />
                            </svg>
                        </button>

                        {/* Image Header */}
                        {selectedAnnouncement.imageUrl && (
                            <div className="w-full h-48 sm:h-72 relative shrink-0 border-b border-card-border/50 overflow-hidden">
                                <img 
                                    src={selectedAnnouncement.imageUrl} 
                                    alt={selectedAnnouncement.title}
                                    className="w-full h-full object-cover"
                                    style={{ animation: 'imageZoomOut 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards' }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent opacity-90" />
                            </div>
                        )}

                        {/* Content Area */}
                        <div className="p-8 sm:p-12 overflow-y-auto scrollbar-thin flex-1 relative bg-card/90">
                            <div className="relative max-w-lg mx-auto">
                                {/* Shop Info */}
                                {selectedAnnouncement.shop && (
                                    <div className="flex flex-col items-center text-center gap-4 mb-10" style={{ animation: 'contentSlideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.1s both' }}>
                                        {selectedAnnouncement.shop.picture && (
                                            <div className="relative group/avatar cursor-pointer">
                                                <div className="absolute inset-0 bg-accent rounded-full blur-md opacity-20 group-hover/avatar:opacity-60 transition-opacity duration-700 animate-pulse" />
                                                <img 
                                                    src={selectedAnnouncement.shop.picture} 
                                                    alt={selectedAnnouncement.shop.name}
                                                    className="relative w-16 h-16 rounded-full object-cover shadow-xl ring-4 ring-background transform group-hover/avatar:scale-105 transition-all duration-500"
                                                />
                                            </div>
                                        )}
                                        <div className="mt-2">
                                            <p className="text-[9px] uppercase tracking-[0.4em] text-text-sub/50 mb-2 font-medium">Announcement From</p>
                                            <Link 
                                                href={`/shop/${selectedAnnouncement.shop._id}`}
                                                onClick={() => setSelectedAnnouncement(null)}
                                                className="text-base font-serif italic text-text-main hover:text-accent transition-colors"
                                            >
                                                {selectedAnnouncement.shop.name}
                                            </Link>
                                        </div>
                                    </div>
                                )}

                                {/* Title */}
                                <h2 className="text-3xl sm:text-4xl font-serif text-center text-text-main mb-8 leading-[1.3] tracking-wide" style={{ animation: 'contentSlideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.2s both' }}>
                                    {selectedAnnouncement.title}
                                </h2>

                                {/* Small Divider */}
                                <div className="flex justify-center mb-8" style={{ animation: 'contentSlideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.25s both' }}>
                                    <div className="h-[1px] w-16 bg-gradient-to-r from-transparent via-accent/50 to-transparent" />
                                </div>

                                {/* Body */}
                                <div className="text-sm sm:text-base text-text-sub leading-loose space-y-4 font-light text-center" style={{ animation: 'contentSlideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.3s both' }}>
                                    <p className="whitespace-pre-wrap">
                                        {selectedAnnouncement.content}
                                    </p>
                                </div>

                                {/* Date Footer */}
                                <div className="mt-14 pt-8 border-t border-card-border/50 text-center" style={{ animation: 'contentSlideUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.4s both' }}>
                                    <p className="text-[9px] uppercase tracking-[0.4em] text-text-sub/50 font-mono">
                                        {new Date(selectedAnnouncement.createdAt).toLocaleDateString('th-TH', { day: 'numeric', month: 'long', year: 'numeric' })}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>,
                document.body
            )}

            <style jsx global>{`
                @keyframes dropdownIn {
                    from { opacity: 0; transform: translateY(-8px) scale(0.97); }
                    to   { opacity: 1; transform: translateY(0) scale(1); }
                }
                @keyframes backdropIn {
                    from { opacity: 0; backdrop-filter: blur(0px); }
                    to   { opacity: 1; backdrop-filter: blur(12px); }
                }
                @keyframes modalFloatUp {
                    from { opacity: 0; transform: scale(0.95) translateY(30px) rotateX(-5deg); }
                    to   { opacity: 1; transform: scale(1) translateY(0) rotateX(0deg); }
                }
                @keyframes contentSlideUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                @keyframes imageZoomOut {
                    from { opacity: 0; transform: scale(1.1); filter: blur(4px); }
                    to   { opacity: 1; transform: scale(1); filter: blur(0px); }
                }
                @keyframes shimmer {
                    0%   { transform: translateX(-100%); }
                    100% { transform: translateX(200%); }
                }
                .scrollbar-thin::-webkit-scrollbar { width: 4px; }
                .scrollbar-thin::-webkit-scrollbar-track { background: transparent; }
                .scrollbar-thin::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 99px; }
                .scrollbar-thin::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.15); }
            `}</style>
        </div>
      )}

      <style jsx global>{`
        @keyframes dropdownIn {
          from {
            opacity: 0;
            transform: translateY(-8px) scale(0.97);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .scrollbar-thin::-webkit-scrollbar {
          width: 4px;
        }
        .scrollbar-thin::-webkit-scrollbar-track {
          background: transparent;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.08);
          border-radius: 99px;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.15);
        }
      `}</style>
    </div>
  );
}
