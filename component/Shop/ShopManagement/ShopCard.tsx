import Image from "next/image";
import AvgRatingBadge from "@/component/Rating/AvgRatingBadge";

export default function Card({
  shopName,
  imgSrc,
  address,
  openClose,
  avgRating = 0,
  ratingCount = 0,
  hasPromotion = false,
}: {
  shopId: string;
  shopName: string;
  imgSrc: string;
  address: {
    street: string;
    district: string;
    province: string;
    postalcode: string;
  };
  openClose: {
    open: string;
    close: string;
  };
  avgRating?: number;
  ratingCount?: number;
  hasPromotion?: boolean;
}) {
  const isValidUrl = imgSrc && (imgSrc.startsWith("http") || imgSrc.startsWith("/") || imgSrc.startsWith("data:"));
  const displayImage = isValidUrl ? imgSrc : "https://i.pinimg.com/1200x/4b/35/23/4b352395a4843dd059b7eb96444433ff.jpg";

  return (
    <div 
      className={`group relative w-full bg-card rounded-xl overflow-hidden border transition-all duration-500 
      ${hasPromotion 
        ? "border-accent/40 shadow-[0_0_20px_rgba(197,163,87,0.1)] hover:border-accent hover:shadow-[0_0_25px_rgba(197,163,87,0.15)]" 
        : "border-card-border hover:border-accent/50 shadow-sm"}`}
    >
      {/* ── Image Section ── */}
      <div className="relative w-full h-56 overflow-hidden">
        <Image 
          src={displayImage} 
          alt={shopName} 
          fill 
          className="object-cover transition-transform duration-700 group-hover:scale-110" 
        />
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />

        {/* ── ✦ Special Offer Badge (Enhanced) ── */}
        {hasPromotion && (
          <div className="absolute top-4 right-4 z-20">
            <div className="relative overflow-hidden backdrop-blur-md bg-accent/90 text-background px-4 py-1.5 rounded-full shadow-[0_4px_15px_rgba(197,163,87,0.4)] border border-white/20 animate-in fade-in zoom-in duration-500">
              {/* Shine Effect: แสงวิ่งผ่านป้ายเวลา Hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out" />
              
              <p className="relative text-[9px] font-bold uppercase tracking-[0.25em] flex items-center gap-2">
                <span className="text-[12px] animate-pulse">✦</span> Special Offer
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="p-6 text-center relative">
        {/* ── Luxury Signature Line ── */}
        {hasPromotion && (
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-2/3 h-[1px] bg-gradient-to-r from-transparent via-accent to-transparent opacity-70 shadow-[0_0_10px_rgba(197,163,87,0.8)]" />
        )}

        <div className="h-[56px] flex items-center justify-center mb-1">
          <h3 className="text-lg font-serif tracking-widest uppercase text-text-main line-clamp-2">
            {shopName}
          </h3>
        </div>

        {/* ── Rating Badge ── */}
        <div className="flex justify-center mb-4">
          <AvgRatingBadge avgRating={avgRating} ratingCount={ratingCount} />
        </div>

        {/* ── Info ── */}
        <div className="flex flex-col items-center justify-between min-h-[60px]"> 
          <div className="flex flex-wrap justify-center gap-x-4 text-[11px] font-mono tracking-tighter text-text-sub uppercase">
            <span>OPEN: {openClose.open}</span>
            <span>CLOSE: {openClose.close}</span>
            <div className="text-text-sub opacity-70 mt-2 w-full text-center line-clamp-1">
              {address.street}, {address.district}
            </div>
          </div>
        </div>

        <p className="mt-6 text-[10px] uppercase tracking-[0.3em] text-accent font-bold group-hover:tracking-[0.4em] transition-all duration-500 cursor-pointer">
          — View Detail —
        </p>
      </div>

      {/* Hover Subtle Glow: แสงทองจางๆ มุมล่างของการ์ด */}
      {hasPromotion && (
        <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-accent/5 rounded-full blur-3xl group-hover:bg-accent/10 transition-colors duration-500" />
      )}
    </div>
  );
}