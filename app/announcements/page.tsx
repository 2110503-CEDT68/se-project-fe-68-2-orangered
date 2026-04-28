"use client";

import React, { useEffect, useState, useRef } from "react";
import { useSession } from "next-auth/react";
import { getBackendBaseUrl } from "@/libs/api/baseUrl";

function FcShop(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      stroke="currentColor"
      fill="currentColor"
      strokeWidth={0}
      viewBox="0 0 48 48"
      enableBackground="new 0 0 48 48"
      height="1em"
      width="1em"
      {...props}
    >
      <rect x={5} y={19} fill="#CFD8DC" width={38} height={19} />
      <rect x={5} y={38} fill="#B0BEC5" width={38} height={4} />
      <rect x={27} y={24} fill="#455A64" width={12} height={18} />
      <rect x={9} y={24} fill="#E3F2FD" width={14} height={11} />
      <rect x={10} y={25} fill="#1E88E5" width={12} height={9} />
      <path
        fill="#90A4AE"
        d="M36.5,33.5c-0.3,0-0.5,0.2-0.5,0.5v2c0,0.3,0.2,0.5,0.5,0.5S37,36.3,37,36v-2C37,33.7,36.8,33.5,36.5,33.5z"
      />
      <g fill="#558B2F">
        <circle cx={24} cy={19} r={3} />
        <circle cx={36} cy={19} r={3} />
        <circle cx={12} cy={19} r={3} />
      </g>
      <path
        fill="#7CB342"
        d="M40,6H8C6.9,6,6,6.9,6,8v3h36V8C42,6.9,41.1,6,40,6z"
      />
      <rect x={21} y={11} fill="#7CB342" width={6} height={8} />
      <polygon fill="#7CB342" points="37,11 32,11 33,19 39,19" />
      <polygon fill="#7CB342" points="11,11 16,11 15,19 9,19" />
      <g fill="#FFA000">
        <circle cx={30} cy={19} r={3} />
        <path d="M45,19c0,1.7-1.3,3-3,3s-3-1.3-3-3s1.3-3,3-3L45,19z" />
        <circle cx={18} cy={19} r={3} />
        <path d="M3,19c0,1.7,1.3,3,3,3s3-1.3,3-3s-1.3-3-3-3L3,19z" />
      </g>
      <g fill="#FFC107">
        <polygon points="32,11 27,11 27,19 33,19" />
        <polygon points="42,11 37,11 39,19 45,19" />
        <polygon points="16,11 21,11 21,19 15,19" />
        <polygon points="6,11 11,11 9,19 3,19" />
      </g>
    </svg>
  );
}

function GrAnnounce(props: React.SVGProps<SVGSVGElement>) {
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
      <path
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        d="M11,15 C14,15 19,19 19,19 L19,3 C19,3 14,7 11,7 C11,7 11,15 11,15 Z M5,15 L8,23 L12,23 L9,15 M19,14 C20.657,14 22,12.657 22,11 C22,9.343 20.657,8 19,8 M11,19 C11.9999997,18.9999994 14,18 14,16 M2,11 C2,7.88888889 3.7912,7 6,7 L11,7 L11,15 L6,15 C3.7912,15 2,14.1111111 2,11 Z"
      />
    </svg>
  );
}

function AiOutlineEdit(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      stroke="currentColor"
      fill="currentColor"
      strokeWidth={0}
      viewBox="0 0 1024 1024"
      height="1em"
      width="1em"
      {...props}
    >
      <path d="M257.7 752c2 0 4-.2 6-.5L431.9 722c2-.4 3.9-1.3 5.3-2.8l423.9-423.9a9.96 9.96 0 0 0 0-14.1L694.9 114.9c-1.9-1.9-4.4-2.9-7.1-2.9s-5.2 1-7.1 2.9L256.8 538.8c-1.5 1.5-2.4 3.3-2.8 5.3l-29.5 168.2a33.5 33.5 0 0 0 9.4 29.8c6.6 6.4 14.9 9.9 23.8 9.9zm67.4-174.4L687.8 215l73.3 73.3-362.7 362.6-88.9 15.7 15.6-89zM880 836H144c-17.7 0-32 14.3-32 32v36c0 4.4 3.6 8 8 8h784c4.4 0 8-3.6 8-8v-36c0-17.7-14.3-32-32-32z" />
    </svg>
  );
}

function MdDeleteForever(props: React.SVGProps<SVGSVGElement>) {
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
      <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zm2.46-7.12l1.41-1.41L12 12.59l2.12-2.12 1.41 1.41L13.41 14l2.12 2.12-1.41 1.41L12 15.41l-2.12 2.12-1.41-1.41L10.59 14l-2.13-2.12zM15.5 4l-1-1h-5l-1 1H5v2h14V4z" />
    </svg>
  );
}

interface Announcement {
  _id: string;
  title: string;
  content: string;
  imageUrl?: string;
  imagePosition?: string;
  createdAt: string;
  shop?: { _id: string; name: string; picture?: string };
}

interface Shop {
  _id: string;
  name: string;
  picture?: string;
}

// ---------------------------------------------------------
// CUSTOM SELECT COMPONENT
// ---------------------------------------------------------
interface CustomSelectProps {
  value: string;
  onChange: (val: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
  className?: string;
  triggerClassName?: string;
  dropdownClassName?: string;
}

const CustomSelect: React.FC<CustomSelectProps> = ({
  value,
  onChange,
  options,
  placeholder = "Select an option",
  className = "",
  triggerClassName = "bg-background/50 border border-card-border rounded-2xl px-5 py-4 text-sm text-text-main hover:border-accent/40",
  dropdownClassName = "bg-card border border-card-border rounded-2xl mt-2",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      <div
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex justify-between items-center cursor-pointer transition-all focus-within:border-accent/60 focus-within:ring-1 focus-within:ring-accent/20 ${triggerClassName}`}
      >
        <span className={selectedOption ? "text-text-main" : "text-text-sub/50"}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`text-text-sub/50 transition-transform duration-300 ${
            isOpen ? "rotate-180 text-accent" : ""
          }`}
        >
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </div>

      {isOpen && (
        <div
          className={`absolute z-50 w-full shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200 ${dropdownClassName}`}
        >
          <div className="max-h-60 overflow-y-auto custom-scrollbar">
            {options.map((opt) => (
              <div
                key={opt.value}
                onClick={() => {
                  onChange(opt.value);
                  setIsOpen(false);
                }}
                className={`px-5 py-3 text-sm cursor-pointer transition-colors ${
                  value === opt.value
                    ? "bg-accent/10 text-accent font-medium border-l-2 border-accent"
                    : "text-text-main hover:bg-background border-l-2 border-transparent"
                }`}
              >
                {opt.label}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// ---------------------------------------------------------
// SMART LAZY IMAGE COMPONENT (GIF Optmization)
// ---------------------------------------------------------
const LazyImage = ({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className: string;
}) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);
  const imgRef = useRef<HTMLDivElement>(null);

  // เช็คว่าเป็น GIF หรือไม่
  const isGif = typeof src === "string" && src.toLowerCase().includes(".gif");

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsIntersecting(true);
          setHasLoadedOnce(true);
          // ถ้าไม่ใช่ GIF โหลดครั้งแรกแล้วปล่อยไว้เลย ไม่ต้องตรวจจับต่อให้เปลืองทรัพยากร
          if (!isGif) {
            observer.disconnect();
          }
        } else {
          // ถ้าเป็น GIF และเลื่อนหลุดจอไปแล้ว ให้ปรับสถานะเพื่อหยุดเล่น
          if (isGif) {
            setIsIntersecting(false);
          }
        }
      },
      // rootMargin: โหลดภาพรอล่วงหน้า 200px ก่อนที่ผู้ใช้จะเลื่อนมาถึง
      { rootMargin: "200px 0px", threshold: 0.01 }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [isGif]);

  // ภาพทั่วไปใช้ hasLoadedOnce (โหลดแล้วโชว์ยาวๆ), ภาพ GIF ใช้ isIntersecting (โชว์และเล่นเฉพาะตอนเห็น)
  const shouldRenderImg = isGif ? isIntersecting : hasLoadedOnce;

  return (
    <div ref={imgRef} className="w-full h-full relative overflow-hidden">
      {!shouldRenderImg && !hasLoadedOnce && (
        <div className="absolute inset-0 bg-card-border/10 animate-pulse" />
      )}

      {shouldRenderImg ? (
        <img
          src={src}
          alt={alt}
          className={className}
          loading="lazy"
          onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
            if (e.currentTarget.parentElement?.parentElement) {
              e.currentTarget.parentElement.parentElement.style.display = "none";
            }
          }}
        />
      ) : (
        // UI แสดงว่า GIF หยุดเล่นตอนเลื่อนผ่าน (ลดอาการกระตุก)
        isGif && hasLoadedOnce && (
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center transition-all duration-300">
            <div className="flex flex-col items-center gap-2">
              <span className="text-3xl drop-shadow-md">⏸️</span>
              <span className="text-[10px] uppercase tracking-widest font-bold text-text-sub">GIF Paused</span>
            </div>
          </div>
        )
      )}
    </div>
  );
};

// ---------------------------------------------------------
// MEDIA LOGIC
// ---------------------------------------------------------
function getMediaDetails(url: string | undefined) {
  if (!url) return { type: "none", url: "", embedUrl: "", thumbnail: "" };

  if (url.includes("youtube.com/watch") || url.includes("youtu.be/")) {
    let videoId = "";
    try {
      if (url.includes("youtu.be/"))
        videoId = url.split("youtu.be/")[1]?.split("?")[0];
      else videoId = new URLSearchParams(new URL(url).search).get("v") || "";
    } catch (e) {}
    return {
      type: "youtube",
      url,
      embedUrl: `https://www.youtube.com/embed/${videoId}?autoplay=0`,
      thumbnail: `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`,
    };
  }

  if (url.includes("drive.google.com/file/d/")) {
    const match = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
    const fileId = match ? match[1] : null;
    return {
      type: "gdrive",
      url,
      embedUrl: fileId
        ? `https://drive.google.com/file/d/${fileId}/preview`
        : url,
      thumbnail: "",
    };
  }

  return { type: "image", url, embedUrl: "", thumbnail: "" };
}

// ---------------------------------------------------------
// URL PREVIEW COMPONENT
// ---------------------------------------------------------
const LinkPreview = ({ url }: { url: string }) => {
  const [meta, setMeta] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const media = getMediaDetails(url);

  useEffect(() => {
    if (media.type === "youtube" || media.type === "gdrive") {
      setLoading(false);
      return;
    }

    fetch(`https://api.microlink.io?url=${encodeURIComponent(url)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success") setMeta(data.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [url, media.type]);

  if (media.type === "youtube") {
    return (
      <div className="mt-4 w-full aspect-video rounded-xl overflow-hidden border border-card-border/50 shadow-sm bg-black/5 hover:border-accent/30 transition-all cursor-pointer">
        <iframe
          src={media.embedUrl}
          className="w-full h-full"
          allowFullScreen
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        />
      </div>
    );
  }

  if (media.type === "gdrive") {
    return (
      <div className="mt-4 w-full aspect-video rounded-xl overflow-hidden border border-card-border/50 shadow-sm bg-card-border/10">
        <iframe src={media.embedUrl} className="w-full h-full" frameBorder="0" />
      </div>
    );
  }

  if (loading)
    return (
      <div className="mt-3 h-24 w-full bg-card-border/10 animate-pulse rounded-xl" />
    );
  if (!meta || (!meta.title && !meta.description)) return null;

  let domain = "";
  try {
    domain = new URL(url).hostname.replace("www.", "");
  } catch (e) {}

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        window.open(url, "_blank");
      }}
      className="mt-4 flex border border-card-border/50 rounded-xl overflow-hidden hover:bg-card-border/20 hover:border-accent/30 transition-all cursor-pointer group h-24 sm:h-28 bg-card/30 shadow-sm"
    >
      {meta.image?.url && (
        <div className="w-24 sm:w-32 shrink-0 overflow-hidden bg-background/50 border-r border-card-border/50">
          <LazyImage
            src={meta.image.url}
            alt={meta.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        </div>
      )}
      <div className="p-3 sm:p-4 flex flex-col justify-center min-w-0 flex-1">
        <h4 className="text-text-main text-sm font-semibold truncate mb-1 group-hover:text-accent transition-colors">
          {meta.title || domain}
        </h4>
        <p className="text-text-sub text-xs line-clamp-2 leading-relaxed font-light">
          {meta.description}
        </p>
        <div className="flex items-center gap-2 mt-auto pt-2">
          {meta.logo?.url && (
            <img src={meta.logo.url} className="w-3 h-3 rounded-sm" alt="logo" />
          )}
          <span className="text-[9px] text-text-sub/60 uppercase tracking-widest truncate">
            {meta.publisher || domain}
          </span>
        </div>
      </div>
    </div>
  );
};

// ---------------------------------------------------------
// TEXT PARSER
// ---------------------------------------------------------
const renderTextWithLinks = (text: string, hiddenUrls: string[] = []) => {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const parts = text.split(urlRegex);

  return parts.map((part, index) => {
    if (part.match(urlRegex)) {
      if (hiddenUrls.includes(part)) {
        return null;
      }
      return (
        <a
          key={index}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          className="text-accent hover:underline break-all"
          onClick={(e) => e.stopPropagation()}
        >
          {part}
        </a>
      );
    }
    return part;
  });
};

const extractUrls = (text: string) => {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const matches = text.match(urlRegex) || [];
  return Array.from(new Set(matches)).slice(0, 2);
};

// ---------------------------------------------------------
// MEDIA RENDERER
// ---------------------------------------------------------
interface MediaRendererProps {
  url: string;
  alt?: string;
  isInteractive?: boolean;
  className?: string;
  positionClass?: string;
}

const MediaRenderer: React.FC<MediaRendererProps> = ({
  url,
  alt = "media preview",
  isInteractive = false,
  className = "",
  positionClass = "",
}) => {
  const media = getMediaDetails(url);

  if (media.type === "youtube") {
    if (isInteractive) {
      return (
        <iframe
          src={media.embedUrl}
          className={className}
          allowFullScreen
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        />
      );
    }
    return (
      <LazyImage
        src={media.thumbnail}
        alt={alt}
        className={`${className} ${positionClass}`}
      />
    );
  }

  if (media.type === "gdrive") {
    if (isInteractive) {
      return (
        <iframe src={media.embedUrl} className={className} frameBorder="0" />
      );
    }
    return (
      <div
        className={`flex items-center justify-center bg-card-border/20 text-text-sub/50 ${className}`}
      >
        <div className="flex flex-col items-center gap-2">
          <span className="text-3xl">📁</span>
          <span className="text-[10px] uppercase tracking-widest font-bold">
            Drive File
          </span>
        </div>
      </div>
    );
  }

  return (
    <LazyImage src={url} alt={alt} className={`${className} ${positionClass}`} />
  );
};

export default function AnnouncementPage() {
  const { data: session } = useSession();

  // Core States
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [shops, setShops] = useState<Shop[]>([]);

  // Form States
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imagePosition, setImagePosition] = useState("center");
  const [selectedShopId, setSelectedShopId] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // UI States
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<"newest" | "oldest">("newest");
  const [layout, setLayout] = useState<"grid" | "list">("grid"); 
  const [viewingPost, setViewingPost] = useState<Announcement | null>(null);

  const isAuthorized =
    session?.user?.role === "admin" || session?.user?.role === "shopowner";
  const isShopOwner = session?.user?.role === "shopowner";
  const API_BASE_URL = `${getBackendBaseUrl()}/api/v1/announcements`;
  const SHOPS_URL = `${getBackendBaseUrl()}/api/v1/shops`;

  const canManage = (item: Announcement) => {
    if (session?.user?.role === "admin") return true;
    if (session?.user?.role === "shopowner") {
      return item.shop && shops.some((s) => s._id === item.shop?._id);
    }
    return false;
  };

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/all`);
      const result = await res.json();
      setAnnouncements(result.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMyShops = async () => {
    if (!session?.user?.token) return;
    try {
      const url = isShopOwner ? `${SHOPS_URL}/mine` : `${SHOPS_URL}?limit=1000`;
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${session.user.token}` },
      });
      const result = await res.json();
      if (result.success && result.data) {
        setShops(result.data);
        if (result.data.length > 0) setSelectedShopId(result.data[0]._id);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
    if (session?.user?.token) {
      fetchMyShops();
    }
  }, [session?.user?.token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session?.user?.token) return alert("Unauthorized");

    setIsProcessing(true);
    const method = editingId ? "PUT" : "POST";
    const url = editingId ? `${API_BASE_URL}/${editingId}` : API_BASE_URL;

    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.user.token}`,
        },
        body: JSON.stringify({
          title,
          content,
          imageUrl,
          imagePosition,
          ...(isShopOwner && selectedShopId ? { shop: selectedShopId } : {}),
        }),
      });

      if (res.ok) {
        resetForm();
        fetchAnnouncements();
      }
    } catch (err) {
      alert("เกิดข้อผิดพลาด");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!session?.user?.token) return;
    try {
      const res = await fetch(`${API_BASE_URL}/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${session.user.token}` },
      });
      if (res.ok) {
        setDeleteConfirmId(null);
        setViewingPost(null);
        fetchAnnouncements();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const startEdit = (item: Announcement) => {
    setEditingId(item._id);
    setTitle(item.title);
    setContent(item.content);
    setImageUrl(item.imageUrl || "");
    setImagePosition(item.imagePosition || "center");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const resetForm = () => {
    setEditingId(null);
    setTitle("");
    setContent("");
    setImageUrl("");
    setImagePosition("center");
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getPositionClass = (pos?: string) => {
    if (pos === "top") return "object-top";
    if (pos === "bottom") return "object-bottom";
    return "object-center";
  };

  const sortedAnnouncements = [...announcements].sort((a, b) => {
    const dateA = new Date(a.createdAt).getTime();
    const dateB = new Date(b.createdAt).getTime();
    return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
  });

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-500 overflow-x-hidden">
      <div className="relative overflow-hidden border-b border-card-border">
        <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-transparent to-gold/5 pointer-events-none" />
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-accent/50 to-transparent" />
        <div className="max-w-5xl mx-auto px-6 md:px-12 py-16 md:py-20">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-accent/20 to-accent/5 border border-accent/20 flex items-center justify-center text-xl shadow-lg shadow-accent/5">
              ✨
            </div>
            <span className="text-[11px] uppercase tracking-[0.5em] text-accent font-bold">
              Registry Center
            </span>
          </div>
          <h1 className="text-5xl md:text-6xl font-serif tracking-tight text-text-main mb-4 leading-tight">
            Official Broadcasts
          </h1>
          <p className="text-text-sub text-base tracking-wide max-w-lg font-light">
            Manage and broadcast your official communications and updates with uncompromising elegance.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 md:px-12 py-12 md:py-16">
        {isAuthorized && (
          <div className="mb-20">
            <form
              onSubmit={handleSubmit}
              className="relative bg-card/60 backdrop-blur-xl border border-card-border rounded-3xl overflow-hidden shadow-2xl transition-all duration-500 hover:border-accent/30"
            >
              <div
                className={`h-1 w-full bg-gradient-to-r ${
                  editingId
                    ? "from-gold/80 via-gold/40 to-transparent"
                    : "from-accent/80 via-accent/40 to-transparent"
                }`}
              />

              <div className="p-6 md:p-10">
                <div className="flex items-center gap-4 mb-10 pb-6 border-b border-card-border/50">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg shadow-inner ${
                      editingId
                        ? "bg-gold/15 border border-gold/30 text-gold"
                        : "bg-accent/15 border border-accent/30 text-accent"
                    }`}
                  >
                    {editingId ? "✏️" : "✨"}
                  </div>
                  <div>
                    <h2
                      className={`text-xs uppercase tracking-[0.3em] font-bold ${
                        editingId ? "text-gold" : "text-accent"
                      }`}
                    >
                      {editingId ? "Modify Record" : "Draft New Entry"}
                    </h2>
                    <p className="text-[10px] uppercase tracking-widest text-text-sub/50 mt-1">
                      {editingId
                        ? "Update your existing registry publication"
                        : "Create and publish a new broadcast message"}
                    </p>
                  </div>
                </div>

                <div className="space-y-6">
                  {isShopOwner && shops.length > 1 && !editingId && (
                    <div className="group">
                      <label className="block text-[10px] uppercase tracking-[0.25em] text-text-sub group-focus-within:text-accent transition-colors mb-2 font-semibold">
                        Target Shop *
                      </label>
                      <CustomSelect
                        value={selectedShopId}
                        onChange={setSelectedShopId}
                        options={shops.map((shop) => ({
                          value: shop._id,
                          label: shop.name,
                        }))}
                        placeholder="Select a Shop..."
                      />
                    </div>
                  )}

                  <div className="group">
                    <label className="block text-[10px] uppercase tracking-[0.3em] text-text-sub group-focus-within:text-accent transition-colors mb-3 font-semibold">
                      Headline *
                    </label>
                    <input
                      type="text"
                      placeholder="Enter announcement headline..."
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full bg-background/50 border border-card-border rounded-2xl px-5 py-4 text-base text-text-main placeholder:text-text-sub/30 focus:outline-none focus:border-accent/60 focus:ring-1 focus:ring-accent/20 focus:bg-background transition-all font-serif"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                    <div className="col-span-1 md:col-span-8 group">
                      <label className="block text-[10px] uppercase tracking-[0.3em] text-text-sub group-focus-within:text-accent transition-colors mb-3 font-semibold">
                        Visual Asset (URL){" "}
                        <span className="text-text-sub/40 tracking-normal capitalize font-normal">
                          — Image, GIF, YouTube, Google Drive
                        </span>
                      </label>
                      <div className="flex gap-4">
                        <input
                          type="url"
                          placeholder="https://example.com/image.gif"
                          value={imageUrl}
                          onChange={(e) => setImageUrl(e.target.value)}
                          className="flex-1 bg-background/50 border border-card-border rounded-2xl px-5 py-4 text-sm text-text-main placeholder:text-text-sub/30 focus:outline-none focus:border-accent/60 focus:ring-1 focus:ring-accent/20 transition-all font-mono"
                        />
                        {imageUrl && (
                          <div className="w-14 h-14 rounded-xl border border-card-border overflow-hidden flex-shrink-0 shadow-inner relative bg-background/50">
                            <MediaRenderer
                              url={imageUrl}
                              alt="preview"
                              className={`absolute inset-0 w-full h-full object-cover ${getPositionClass(
                                imagePosition
                              )}`}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="col-span-1 md:col-span-4 group">
                      <label className="block text-[10px] uppercase tracking-[0.3em] text-text-sub group-focus-within:text-accent transition-colors mb-3 font-semibold">
                        Focus Point
                      </label>
                      <CustomSelect
                        value={imagePosition}
                        onChange={setImagePosition}
                        options={[
                          { value: "top", label: "Top Aligned" },
                          { value: "center", label: "Center Centered" },
                          { value: "bottom", label: "Bottom Aligned" },
                        ]}
                      />
                    </div>
                  </div>

                  <div className="group">
                    <label className="block text-[10px] uppercase tracking-[0.3em] text-text-sub group-focus-within:text-accent transition-colors mb-3 font-semibold">
                      Detailed Brief *
                    </label>
                    <textarea
                      placeholder="Compose your message here... You can paste website links directly and they will generate previews."
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      className="w-full bg-background/50 border border-card-border rounded-2xl px-5 py-4 h-48 text-sm text-text-main placeholder:text-text-sub/30 focus:outline-none focus:border-accent/60 focus:ring-1 focus:ring-accent/20 focus:bg-background transition-all resize-none leading-relaxed font-light custom-scrollbar"
                      required
                    />
                    <div className="flex justify-end mt-2">
                      <span className="text-[10px] text-text-sub/40 font-mono tracking-widest">
                        {content.length} CHARS
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4 mt-10 pt-8 border-t border-card-border/50">
                  <button
                    type="submit"
                    disabled={isProcessing}
                    className={`flex items-center gap-2 px-8 py-3 rounded-xl text-[10px] uppercase tracking-[0.3em] font-bold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm hover:shadow-md ${
                      editingId
                        ? "bg-gold/20 border border-gold/40 text-gold hover:bg-gold hover:text-white"
                        : "bg-accent/20 border border-accent/40 text-accent hover:bg-accent hover:text-white"
                    }`}
                  >
                    {isProcessing ? (
                      <>
                        <span className="inline-block w-3 h-3 border border-current border-t-transparent rounded-full animate-spin" />
                        Processing...
                      </>
                    ) : editingId ? (
                      "✓ Save Changes"
                    ) : (
                      "+ Publish Post"
                    )}
                  </button>

                  {editingId && (
                    <button
                      type="button"
                      onClick={resetForm}
                      className="px-8 py-3 rounded-xl text-xs uppercase tracking-[0.3em] font-bold text-text-sub border border-transparent hover:border-card-border hover:bg-card-border/10 hover:text-text-main transition-all duration-300"
                    >
                      Discard
                    </button>
                  )}
                </div>
              </div>
            </form>
          </div>
        )}

        {/* Toolbar */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6 border-b border-card-border pb-6">
          <div>
            <h3 className="text-2xl font-serif text-text-main mb-1">
              Publications
            </h3>
            <p className="text-[10px] uppercase tracking-[0.4em] text-text-sub/60">
              {announcements.length} Official Records
            </p>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <span className="text-[9px] uppercase tracking-[0.2em] text-text-sub/50">
                Order By:
              </span>
              <div className="w-44">
                <CustomSelect
                  value={sortOrder}
                  onChange={(val) =>
                    setSortOrder(val as "newest" | "oldest")
                  }
                  options={[
                    { value: "newest", label: "Lastest" },
                    { value: "oldest", label: "Oldest" },
                  ]}
                  triggerClassName="bg-card border border-card-border rounded-full px-5 py-2.5 text-xs text-text-main font-semibold tracking-wide shadow-sm hover:border-accent/30"
                  dropdownClassName="bg-card border border-card-border rounded-2xl mt-2 w-48 right-0"
                />
              </div>
            </div>

            <div className="w-[1px] h-6 bg-card-border"></div>

            <div className="flex items-center bg-card border border-card-border rounded-full p-1 shadow-sm overflow-hidden">
              <button
                onClick={() => setLayout("grid")}
                className={`p-2 rounded-full transition-all duration-300 flex items-center justify-center ${
                  layout === "grid"
                    ? "bg-background shadow-sm text-text-main"
                    : "text-text-sub/40 hover:text-text-sub"
                }`}
                title="Grid View"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="3" width="7" height="7"></rect>
                  <rect x="14" y="3" width="7" height="7"></rect>
                  <rect x="14" y="14" width="7" height="7"></rect>
                  <rect x="3" y="14" width="7" height="7"></rect>
                </svg>
              </button>
              <button
                onClick={() => setLayout("list")}
                className={`p-2 rounded-full transition-all duration-300 flex items-center justify-center ${
                  layout === "list"
                    ? "bg-background shadow-sm text-text-main"
                    : "text-text-sub/40 hover:text-text-sub"
                }`}
                title="List View"
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="8" y1="6" x2="21" y2="6"></line>
                  <line x1="8" y1="12" x2="21" y2="12"></line>
                  <line x1="8" y1="18" x2="21" y2="18"></line>
                  <line x1="3" y1="6" x2="3.01" y2="6"></line>
                  <line x1="3" y1="12" x2="3.01" y2="12"></line>
                  <line x1="3" y1="18" x2="3.01" y2="18"></line>
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Announcements Feed */}
        <div>
          {loading ? (
            <div
              className={`grid gap-6 ${
                layout === "grid" ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1"
              }`}
            >
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="bg-card/40 border border-card-border rounded-3xl overflow-hidden animate-pulse"
                >
                  <div className="h-56 bg-card-border/20" />
                  <div className="p-8 space-y-4">
                    <div className="h-5 bg-card-border/40 rounded-full w-2/3" />
                    <div className="h-3 bg-card-border/20 rounded-full w-full" />
                    <div className="h-3 bg-card-border/20 rounded-full w-4/5" />
                  </div>
                </div>
              ))}
            </div>
          ) : sortedAnnouncements.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-32 border border-dashed border-card-border/50 rounded-3xl bg-card/20">
              <div className="w-16 h-16 mb-6 rounded-full bg-card-border/20 flex items-center justify-center text-2xl">
                📭
              </div>
              <p className="text-xs uppercase tracking-[0.4em] text-text-sub/60 font-semibold">
                Registry is empty
              </p>
              {isAuthorized && (
                <p className="text-[10px] uppercase tracking-widest text-text-sub/30 mt-3">
                  Draft your first entry above
                </p>
              )}
            </div>
          ) : (
            <div
              className={`grid gap-8 ${
                layout === "grid" ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1"
              }`}
            >
              {sortedAnnouncements.map((item, index) => {
                const urls = extractUrls(item.content);
                return (
                  <article
                    key={item._id}
                    onClick={() => setViewingPost(item)}
                    className={`group relative overflow-hidden transition-all duration-500 cursor-pointer flex
                      ${layout === 'grid' ? 'bg-card/50 border border-card-border rounded-2xl flex-col hover:shadow-2xl shadow-lg hover:border-accent/20' : ''}
                      ${layout === 'list' ? 'bg-card/50 border border-card-border rounded-2xl flex-col md:flex-row hover:shadow-2xl shadow-lg hover:border-accent/20 items-stretch' : ''}
                    `}
                    style={{ animationDelay: `${index * 60}ms` }}
                  >
                    {item.imageUrl && (
                      <div
                        className={`relative overflow-hidden flex-shrink-0
                          ${layout === "list" ? "w-full md:w-2/5 min-h-[240px] self-stretch flex items-stretch" : ""}
                          ${layout === "grid" ? "w-full h-60" : ""}
                        `}
                      >
                        <LazyImage
                          src={item.imageUrl}
                          alt={item.title}
                          className={`w-full h-full object-cover transition-all duration-700 grayscale-[20%] group-hover:grayscale-0 group-hover:scale-105 ${getPositionClass(item.imagePosition)}`}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-card/80 to-transparent opacity-80 group-hover:opacity-40 transition-opacity duration-500 pointer-events-none" />
                      </div>
                    )}

                    {/* Content */}
                    <div className={`relative flex flex-col flex-grow ${layout === 'list' ? 'p-8 md:w-3/5 justify-center' : 'p-8'}`}>
                      <div className="flex-grow">
                        <div className="flex items-center gap-3 mb-4 flex-wrap">
                          <span className="inline-flex items-center uppercase tracking-[0.3em] font-mono text-[9px] text-text-sub/60">
                            {formatDate(item.createdAt)}
                          </span>
                          {item.shop && (
                            <>
                              <span className="w-1 h-1 rounded-full bg-card-border" />
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border bg-background/50 uppercase tracking-widest font-bold text-[9px] text-text-sub border-card-border">
                                {item.shop.picture && (
                                  <img
                                    src={item.shop.picture}
                                    alt=""
                                    className="w-3.5 h-3.5 rounded-full object-cover"
                                    onError={(
                                      e: React.SyntheticEvent<HTMLImageElement>
                                    ) => {
                                      e.currentTarget.style.display = "none";
                                    }}
                                  />
                                )}
                                {item.shop.name}
                              </span>
                            </>
                          )}
                        </div>

                        <div className="flex items-start justify-between gap-4 mb-3">
                          <h2 className="font-serif text-text-main group-hover:text-accent transition-colors duration-300 leading-snug text-xl line-clamp-2">
                            {item.title}
                          </h2>
                        </div>

                        <p className="leading-relaxed whitespace-pre-wrap line-clamp-3 text-sm text-text-sub">
                          {renderTextWithLinks(item.content, urls)}
                        </p>

                        {urls.map((url, i) => (
                          <LinkPreview key={i} url={url} />
                        ))}
                      </div>

                      <div className="mt-6 pt-4 border-t flex items-center justify-between border-card-border/50">
                        <span className="uppercase tracking-[0.4em] font-mono text-[8px] text-text-sub/30">
                          ID: {item._id.slice(-8)}
                        </span>

                        {isAuthorized && canManage(item) ? (
                          <div className="flex gap-2 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                startEdit(item);
                              }}
                              className="text-[9px] uppercase tracking-widest bg-gold/10 text-gold hover:bg-gold/25 px-4 py-2 rounded-lg border border-gold/20 transition-all font-bold flex items-center gap-1"
                            >
                              <AiOutlineEdit className="w-3.5 h-3.5" /> Edit
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setDeleteConfirmId(item._id);
                              }}
                              className="text-[9px] uppercase tracking-widest bg-red-500/10 text-red-400 hover:bg-red-500/20 px-4 py-2 rounded-lg border border-red-500/20 transition-all font-bold flex items-center gap-1"
                            >
                              <MdDeleteForever className="w-3.5 h-3.5" /> Delete
                            </button>
                          </div>
                        ) : (
                          <span className="text-[10px] uppercase tracking-widest font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-1 text-accent">
                            Read Full <span className="text-lg leading-none">→</span>
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Delete confirm overlay */}
                    {deleteConfirmId === item._id && (
                      <div className="absolute inset-0 bg-background/95 backdrop-blur-sm flex flex-col items-center justify-center gap-4 z-10 rounded-2xl">
                        <div className="text-3xl">🗑️</div>
                        <p className="text-sm text-text-main font-serif">
                          Delete this announcement?
                        </p>
                        <p className="text-[10px] uppercase tracking-widest text-text-sub/60">
                          This action cannot be undone
                        </p>
                        <div className="flex gap-3 mt-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(item._id);
                            }}
                            className="px-6 py-3 bg-red-500 text-white text-[10px] uppercase tracking-[0.3em] rounded-full font-bold shadow-lg shadow-red-500/20 hover:shadow-red-500/40 hover:-translate-y-0.5 transition-all"
                          >
                            Confirm
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setDeleteConfirmId(null);
                            }}
                            className="px-6 py-3 border border-card-border text-text-sub text-[10px] uppercase tracking-[0.3em] rounded-full hover:text-text-main hover:bg-card-border/30 transition-all"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* FULL PAGE MODAL */}
      {viewingPost && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 backdrop-blur-xl bg-background/60 transition-opacity"
          onClick={() => setViewingPost(null)}
        >
          <div
            className="bg-card w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl shadow-2xl shadow-black/50 border border-card-border relative animate-in fade-in zoom-in-95 duration-300 custom-scrollbar"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setViewingPost(null)}
              className="absolute top-6 right-6 bg-background/80 hover:bg-background hover:scale-110 border border-card-border text-text-main w-10 h-10 flex items-center justify-center rounded-full transition-all z-20 backdrop-blur-md shadow-lg"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            {viewingPost.imageUrl && (
              <div className="w-full h-80 sm:h-[450px] bg-background relative">
                <MediaRenderer
                  url={viewingPost.imageUrl}
                  alt={viewingPost.title}
                  isInteractive={true}
                  className={`w-full h-full object-cover ${getPositionClass(
                    viewingPost.imagePosition
                  )}`}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card via-card/40 to-transparent h-full w-full pointer-events-none opacity-90"></div>
              </div>
            )}

            <div
              className={`px-8 md:px-16 pb-16 relative z-10 ${
                viewingPost.imageUrl ? "-mt-32" : "pt-16"
              }`}
            >
              <div className="mb-10 text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-3 mb-6 flex-wrap">
                  <p className="text-[10px] text-accent uppercase tracking-[0.4em] font-bold">
                    Record • {viewingPost._id.slice(-6)}
                  </p>
                  {viewingPost.shop && (
                    <>
                      <span className="w-1 h-1 rounded-full bg-card-border hidden md:block" />
                      <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-card-border bg-background/50 text-[10px] uppercase tracking-widest text-text-sub font-bold">
                        {viewingPost.shop.picture && (
                          <img
                            src={viewingPost.shop.picture}
                            alt=""
                            className="w-4 h-4 rounded-full object-cover"
                            onError={(
                              e: React.SyntheticEvent<HTMLImageElement>
                            ) => {
                              e.currentTarget.style.display = "none";
                            }}
                          />
                        )}
                        {viewingPost.shop.name}
                      </span>
                    </>
                  )}
                </div>

                <h2 className="text-4xl md:text-6xl font-serif font-medium text-text-main mb-6 leading-[1.1]">
                  {viewingPost.title}
                </h2>
                <p className="text-[10px] text-text-sub/60 font-mono uppercase tracking-[0.3em] border-b border-card-border/50 pb-8 inline-block md:block">
                  Published on {formatDate(viewingPost.createdAt)}
                </p>
              </div>

              <div className="max-w-none">
                <p className="text-text-main whitespace-pre-wrap leading-[2] text-lg font-light">
                  {renderTextWithLinks(viewingPost.content)}
                </p>
                {extractUrls(viewingPost.content).map((url, i) => (
                  <LinkPreview key={`modal-${i}`} url={url} />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}