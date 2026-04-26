"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";

export default function ShopFilterBar() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [name, setName] = useState(searchParams.get("name") ?? "");
  const [minRating, setMinRating] = useState(searchParams.get("minRating") ?? "");
  const [openBefore, setOpenBefore] = useState(searchParams.get("openBefore") ?? "");
  const [closeAfter, setCloseAfter] = useState(searchParams.get("closeAfter") ?? "");

  const applyFilters = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("page");
    name.trim() ? params.set("name", name.trim()) : params.delete("name");
    minRating ? params.set("minRating", minRating) : params.delete("minRating");
    openBefore ? params.set("openBefore", openBefore) : params.delete("openBefore");
    closeAfter ? params.set("closeAfter", closeAfter) : params.delete("closeAfter");
    startTransition(() => router.push(`${pathname}?${params.toString()}`));
  };

  const clearFilters = () => {
    setName(""); setMinRating(""); setOpenBefore(""); setCloseAfter("");
    startTransition(() => router.push(pathname));
  };

  const hasActiveFilters = !!(
    searchParams.get("name") || searchParams.get("minRating") ||
    searchParams.get("openBefore") || searchParams.get("closeAfter")
  );

  const cls = "bg-background border border-card-border rounded-lg px-3 py-1.5 text-[11px] text-text-main outline-none focus:border-accent transition placeholder:text-text-sub/40";

  return (
    <div className="max-w-4xl mx-auto mb-8 flex flex-wrap items-end gap-3">
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && applyFilters()}
        placeholder="Shop name…"
        className={`${cls} flex-1 min-w-[140px]`}
      />
      <select value={minRating} onChange={(e) => setMinRating(e.target.value)} className={`${cls} min-w-[100px]`}>
        <option value="">Any ★</option>
        <option value="1">1+ ★</option>
        <option value="2">2+ ★</option>
        <option value="3">3+ ★</option>
        <option value="4">4+ ★</option>
        <option value="5">5 ★</option>
      </select>
      <input type="time" value={openBefore} onChange={(e) => setOpenBefore(e.target.value)} className={cls} title="Opens by" />
      <input type="time" value={closeAfter} onChange={(e) => setCloseAfter(e.target.value)} className={cls} title="Closes after" />
      {hasActiveFilters && (
        <button onClick={clearFilters} disabled={isPending} className="px-3 py-1.5 text-[11px] text-text-sub hover:text-text-main transition disabled:opacity-40">
          ✕
        </button>
      )}
      <button onClick={applyFilters} disabled={isPending} className="px-4 py-1.5 text-[11px] uppercase tracking-[0.2em] text-background bg-accent rounded-lg hover:opacity-90 transition disabled:opacity-50">
        {isPending ? "…" : "Search"}
      </button>
    </div>
  );
}
