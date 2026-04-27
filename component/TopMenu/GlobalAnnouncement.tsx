"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";

function MdAnnouncement(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg stroke="currentColor" fill="currentColor" strokeWidth={0} viewBox="0 0 24 24" height="1em" width="1em" {...props}>
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
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
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
                    setNewCount(data.filter(a => !seen.has(a._id)).length);
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
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        if (isOpen) document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isOpen]);

    const handleOpen = () => {
        setIsOpen(prev => !prev);
        if (newCount > 0) {
            markAllSeen(announcements.map(a => a._id));
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
                    className={`text-xl transition-transform duration-300 ${isOpen ? 'scale-90' : 'group-hover:scale-110'}`}
                    style={{ display: 'inline-block' }}
                />
                {/* Badge — only shown when there are unseen announcements */}
                {newCount > 0 && (
                    <>
                        <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 flex items-center justify-center rounded-full text-[9px] font-black shadow-lg bg-red-500 text-white shadow-red-500/40">
                            {newCount > 99 ? '99+' : newCount}
                        </span>
                        <span className="absolute -top-0.5 -right-0.5 w-[18px] h-[18px] rounded-full bg-red-500 opacity-50 animate-ping pointer-events-none" />
                    </>
                )}
            </button>

            {/* Dropdown Panel */}
            {isOpen && (
                <div
                    className="absolute right-0 top-full mt-3 w-[400px] bg-card border border-card-border rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.5)] z-50 overflow-hidden"
                    style={{ animation: 'dropdownIn 0.2s cubic-bezier(0.34, 1.2, 0.64, 1)' }}
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
                                    {announcements.length} active {announcements.length === 1 ? 'post' : 'posts'}
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

                                    <div className="p-3.5">
                                        {/* Shop info */}
                                        {ann.shop && (
                                            <Link
                                                href={`/shop/${ann.shop._id}`}
                                                onClick={() => setIsOpen(false)}
                                                className="flex items-center gap-1.5 mb-2 w-fit group/shop"
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
                                                {new Date(ann.createdAt).toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' })}
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

            <style jsx global>{`
                @keyframes dropdownIn {
                    from { opacity: 0; transform: translateY(-8px) scale(0.97); }
                    to   { opacity: 1; transform: translateY(0) scale(1); }
                }
                .scrollbar-thin::-webkit-scrollbar { width: 4px; }
                .scrollbar-thin::-webkit-scrollbar-track { background: transparent; }
                .scrollbar-thin::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 99px; }
                .scrollbar-thin::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.15); }
            `}</style>
        </div>
    );
}
