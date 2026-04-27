"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import getAnnouncements from "@/libs/announcement/getAnnouncement";
import deleteAnnouncement from "@/libs/announcement/deleteAnnouncement";
import AnnouncementModal from "./Modal/AnnouncementModal";
import AnnouncementButton from "./Button/AnnouncementButton";
import ShopAnnouncementButton from "./Button/ShopAnnouncementButton";

export interface Announcement {
  _id: string;
  title: string;
  content: string;
  imageUrl?: string;
  createdAt: string;
}

export default function ShopAnnouncement({
  shopId,
  isOwner = false,
  token,
}: {
  shopId: string;
  isOwner?: boolean;
  token?: string;
}) {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const result = await getAnnouncements(shopId);
        if (result.success && result.data && result.data.length > 0) {
          setAnnouncements(result.data);
        }
      } catch (err) {
        console.error("Failed to fetch announcements", err);
      }
    };
    fetchAnnouncements();
  }, [shopId, isOwner]);

  const handleDelete = async (id: string) => {
    if (!confirm("คุณแน่ใจหรือไม่ที่จะลบประกาศนี้?")) return;
    if (!token) return;
    try {
      await deleteAnnouncement(id, token);

      const updated = announcements.filter((a) => a._id !== id);
      setAnnouncements(updated);
      if (updated.length === 0) setIsOpen(false);
      else setActiveIndex(Math.min(activeIndex, updated.length - 1));
    } catch (err) {
      console.error(err);
    }
  };

  if (announcements.length === 0)
    return (
      <>
        <ShopAnnouncementButton onOpen={() => setIsOpen(true)} length={0} />
        {isOpen && (
          <AnnouncementModal
            onClose={() => setIsOpen(false)}
            announcements={announcements}
          >
            <div className="relative z-10 flex flex-col items-center max-w-md w-full px-8 py-12 text-center">
              {/* Symbol */}
              <div className="mb-10 relative">
                <div className="text-2xl text-gold opacity-40 animate-pulse">
                  ✦
                </div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 border border-gold/10 rounded-full scale-150" />
              </div>

              <div className="space-y-4">
                <h2 className="text-[11px] uppercase tracking-[0.6em] text-gold font-bold">
                  No announcement yet
                </h2>

                <div className="h-px w-8 bg-gold/20 mx-auto" />

                <p className="text-[10px] uppercase tracking-[0.2em] text-text-sub leading-loose opacity-70">
                  The herald rests in silence. No proclamations have been issued
                  — check back when the scrolls have been updated.
                </p>
              </div>
            </div>

            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex gap-12 opacity-20">
              <p className="text-[8px] font-mono tracking-widest uppercase">
                Null_State // 000
              </p>
              <p className="text-[8px] font-mono tracking-widest uppercase">
                Announcement_Board_v1
              </p>
            </div>
          </AnnouncementModal>
        )}
      </>
    );

  const ann = announcements[activeIndex];

  return (
    <>
      {/* Floating trigger button */}
      <ShopAnnouncementButton
        onOpen={() => setIsOpen(true)}
        length={announcements.length}
      />

      {/* Modal Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/70 backdrop-blur-md"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="relative bg-card w-full max-w-xl rounded-2xl border border-card-border shadow-[0_25px_80px_rgba(0,0,0,0.5)] overflow-hidden"
            style={{
              animation: "modalIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top gradient bar */}
            <div className="h-[3px] bg-gradient-to-r from-accent/80 via-gold/50 to-accent/20" />

            {/* Header */}
            <div className="flex justify-between items-center px-6 py-4 border-b border-card-border bg-card/95 backdrop-blur-md">
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-lg bg-accent/15 border border-accent/30 flex items-center justify-center text-sm">
                  📢
                </div>
                <div>
                  <h2 className="text-[11px] uppercase tracking-[0.35em] font-bold text-accent">
                    Shop Announcements
                  </h2>
                  <p className="text-[9px] text-text-sub/50 uppercase tracking-widest mt-0.5">
                    {announcements.length}{" "}
                    {announcements.length === 1 ? "post" : "posts"}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="w-7 h-7 flex items-center justify-center rounded-lg border border-card-border text-text-sub hover:text-red-400 hover:border-red-400/30 hover:bg-red-400/10 transition-all text-sm"
              >
                ×
              </button>
            </div>

            {/* Image */}
            {ann.imageUrl && (
              <div className="w-full h-52 overflow-hidden relative">
                <img
                  src={ann.imageUrl}
                  alt={ann.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (
                      e.target as HTMLImageElement
                    ).parentElement!.style.display = "none";
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card/80 via-card/10 to-transparent" />
              </div>
            )}

            {/* Content */}
            <div className="p-6">
              <div className="flex justify-between items-start gap-4 mb-4">
                <h3 className="text-xl font-serif font-bold text-text-main leading-snug">
                  {ann.title}
                </h3>
                {isOwner && (
                  <div className="flex gap-2 flex-shrink-0">
                    <button
                      onClick={() => router.push("/announcements")}
                      className="text-[9px] uppercase tracking-widest bg-gold/10 text-gold hover:bg-gold/25 px-3 py-1.5 rounded-lg border border-gold/20 transition-all font-bold"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(ann._id)}
                      className="text-[9px] uppercase tracking-widest bg-red-500/10 text-red-400 hover:bg-red-500/25 px-3 py-1.5 rounded-lg border border-red-500/20 transition-all font-bold"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>

              <p className="text-text-sub text-sm leading-relaxed whitespace-pre-wrap">
                {ann.content}
              </p>

              <div className="flex items-center justify-between mt-6 pt-4 border-t border-card-border/50">
                <span className="text-[9px] uppercase tracking-widest text-text-sub/40 font-mono">
                  {new Date(ann.createdAt).toLocaleDateString("th-TH", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </span>

                {/* Pagination dots */}
                {announcements.length > 1 && (
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setActiveIndex((i) => Math.max(0, i - 1))}
                      disabled={activeIndex === 0}
                      className="w-6 h-6 rounded-full border border-card-border text-text-sub text-xs flex items-center justify-center hover:border-accent hover:text-accent transition-all disabled:opacity-25"
                    >
                      ‹
                    </button>
                    <div className="flex gap-1.5">
                      {announcements.map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setActiveIndex(i)}
                          className={`h-1.5 rounded-full transition-all duration-300 ${i === activeIndex ? "w-5 bg-accent" : "w-1.5 bg-card-border hover:bg-accent/40"}`}
                        />
                      ))}
                    </div>
                    <button
                      onClick={() =>
                        setActiveIndex((i) =>
                          Math.min(announcements.length - 1, i + 1),
                        )
                      }
                      disabled={activeIndex === announcements.length - 1}
                      className="w-6 h-6 rounded-full border border-card-border text-text-sub text-xs flex items-center justify-center hover:border-accent hover:text-accent transition-all disabled:opacity-25"
                    >
                      ›
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        @keyframes modalIn {
          from {
            opacity: 0;
            transform: scale(0.92) translateY(16px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
      `}</style>
    </>
  );
}
