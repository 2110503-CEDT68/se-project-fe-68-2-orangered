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
  const [newCount, setNewCount] = useState(0);
  const [selectedAnn, setSelectedAnn] = useState<Announcement | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
    if (!backendUrl) return;

    const fetchAnnouncements = async () => {
      try {
        const res = await fetch(`${backendUrl}/api/v1/announcements/all`);
        if (!res.ok) return;
        const result = await res.json();
        if (result.success && result.data) {
          const data: Announcement[] = result.data;
          setAnnouncements(data);
          const seen = getSeenIds();
          setNewCount(data.filter((a) => !seen.has(a._id)).length);
        }
      } catch {
        // silently fail — backend might be offline
      }
    };
    fetchAnnouncements();
  }, []);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
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
                  onClick={() => {
                    setSelectedAnn(ann);
                    setIsOpen(false);
                  }}
                  className="group rounded-xl border border-card-border bg-background/40 hover:bg-background/70 hover:border-accent/20 transition-all duration-300 overflow-hidden cursor-pointer"
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
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="px-5 py-3 border-t border-card-border bg-card/50 flex items-center justify-center">
            <p className="text-[8px] uppercase tracking-[0.4em] text-text-sub/30">
              — End of Announcements —
            </p>
          </div>
        </div>
      )}

      {/* Announcement Detail Modal */}
      {mounted && selectedAnn && createPortal(
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-black/20 backdrop-blur-md transition-opacity duration-500"
                onClick={() => setSelectedAnn(null)}
                style={{ animation: 'fadeIn 0.4s ease-out' }}
            />
            
            {/* Modal Content */}
            <div 
                className="relative w-full max-w-2xl bg-card border border-card-border rounded-[2rem] shadow-[0_30px_100px_rgba(0,0,0,0.12)] overflow-hidden flex flex-col max-h-[85vh] z-10"
                style={{ animation: 'modalIn 0.5s cubic-bezier(0.16, 1, 0.3, 1)' }}
            >
                {/* Decorative Top Gradient */}
                <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-accent/40 via-accent to-accent/40 opacity-80" />
                
                {/* Header/Close Button */}
                <div className="absolute top-6 right-6 z-20">
                    <button
                        onClick={() => setSelectedAnn(null)}
                        className="group w-9 h-9 flex items-center justify-center rounded-full bg-background/80 border border-card-border backdrop-blur-md text-text-sub hover:text-accent hover:border-accent/40 hover:bg-card transition-all duration-300 shadow-sm"
                        aria-label="Close modal"
                    >
                        <span className="text-xl leading-none mb-0.5 group-hover:rotate-90 transition-transform duration-300">×</span>
                    </button>
                </div>

                {/* Scrollable Content */}
                <div className="overflow-y-auto overflow-x-hidden scrollbar-thin flex-1 relative w-full">
                    {/* Optional subtle background element */}
                    <div className="absolute -top-40 -right-40 w-80 h-80 bg-accent/5 rounded-full blur-3xl pointer-events-none" />
                    
                    {/* Image */}
                    {selectedAnn.imageUrl && (
                        <div className="w-full h-56 sm:h-80 relative group">
                            <img 
                                src={selectedAnn.imageUrl} 
                                alt={selectedAnn.title}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-card via-card/10 to-transparent" />
                        </div>
                    )}

                    {/* Content Padding */}
                    <div className={`p-8 sm:p-14 relative z-10 ${!selectedAnn.imageUrl ? 'pt-16' : 'pt-0 -mt-10'}`}>
                        {/* Shop Info */}
                        {selectedAnn.shop && (
                            <div className="flex items-center justify-between mb-8 bg-background/80 p-3 pr-6 rounded-full border border-card-border w-fit backdrop-blur-md shadow-sm">
                                <div className="flex items-center gap-4">
                                    {selectedAnn.shop.picture ? (
                                        <img 
                                            src={selectedAnn.shop.picture} 
                                            alt={selectedAnn.shop.name}
                                            className="w-10 h-10 rounded-full object-cover border border-card-border shadow-sm"
                                        />
                                    ) : (
                                        <div className="w-10 h-10 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center text-accent text-xs font-bold shadow-sm">
                                            {selectedAnn.shop.name.charAt(0)}
                                        </div>
                                    )}
                                    <div className="flex flex-col">
                                        <Link 
                                            href={`/shop/${selectedAnn.shop._id}`}
                                            onClick={() => setSelectedAnn(null)}
                                            className="text-[10px] font-bold uppercase tracking-[0.2em] text-text-main hover:text-accent transition-colors"
                                        >
                                            {selectedAnn.shop.name}
                                        </Link>
                                        <div className="flex items-center gap-2 mt-0.5">
                                            <p className="text-[9px] text-text-sub/60 uppercase tracking-widest font-medium">
                                                {new Date(selectedAnn.createdAt).toLocaleDateString('en-US', { 
                                                    day: '2-digit', month: 'short', year: 'numeric' 
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Date fallback if no shop */}
                        {!selectedAnn.shop && (
                            <div className="mb-6 flex items-center gap-3">
                                <div className="h-[1px] w-8 bg-accent/40" />
                                <p className="text-[10px] text-accent uppercase tracking-[0.3em] font-bold">
                                    {new Date(selectedAnn.createdAt).toLocaleDateString('en-US', { 
                                        day: '2-digit', month: 'long', year: 'numeric' 
                                    })}
                                </p>
                            </div>
                        )}

                        {/* Title */}
                        <h2 className="text-3xl sm:text-[2.75rem] font-serif tracking-tight text-text-main leading-[1.1] mb-8">
                            {selectedAnn.title}
                        </h2>

                        {/* Text Content */}
                        <div className="text-[15px] sm:text-[17px] text-text-sub leading-[1.8] font-light whitespace-pre-wrap break-words w-full">
                            {selectedAnn.content}
                        </div>
                    </div>
                </div>
                
                {/* Footer decorative border */}
                <div className="h-2 w-full bg-background/50 border-t border-card-border" />
            </div>
        </div>,
        document.body
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
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.95) translateY(20px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
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
