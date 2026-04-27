"use client";

import Image from "next/image";
import { MassageType, Promotion } from "@/interface";

export default function MassageServiceList({ services }: { services: MassageType[] }) {
  // 1. กรองเฉพาะบริการที่ isActive เท่านั้น
  const activeServices = services?.filter(s => s.isActive) || [];

  // แก้ไขตรงนี้: ถ้าไม่มีบริการที่เปิดใช้งาน ให้แสดง Empty State แทนการคืนค่า null
  if (activeServices.length === 0) {
    return (
      <div className="mt-10 py-20 border border-dashed border-card-border rounded-xl flex flex-col items-center justify-center bg-card/5">
        <div className="text-gold/30 text-3xl mb-4 font-light">✦</div>
        <p className="text-[10px] uppercase tracking-[0.5em] text-text-sub/50 font-bold">
          No services available at this moment
        </p>
        <p className="text-[9px] text-text-sub/30 italic mt-2 tracking-widest">
          Please check back later or contact the shop directly.
        </p>
      </div>
    );
  }

  // Helper สำหรับหา Promotion ที่ใช้งานอยู่
  const getActivePromo = (promotions?: Promotion[]) => {
    if (!promotions || promotions.length === 0) return null;
    return promotions.find((p) => p.isActive) || null;
  };

  const formatDateRange = (start: Date | string, end: Date | string) => {
    const s = new Date(start).toLocaleDateString("en-GB", { day: "numeric", month: "short" });
    const e = new Date(end).toLocaleDateString("en-GB", { day: "numeric", month: "short" });
    return `${s} — ${e}`;
  };

  return (
    <div className="mt-10">
      <p className="text-[11px] uppercase tracking-[0.4em] text-accent dark:text-accent-400 mb-6 font-bold">
        — Available Services —
      </p>

      <div className="grid grid-cols-1 gap-4">
        {activeServices.map((service, index) => {
          const activePromo = getActivePromo(service.promotions);
          const hasDiscount = activePromo && activePromo.discountPrice > 0;
          const finalPrice = hasDiscount ? service.price - activePromo.discountPrice : service.price;

          return (
            <div
              key={service._id || index}
              className="group flex flex-row items-center border border-card-border bg-card/50 rounded-lg hover:border-accent/50 dark:hover:border-accent-500/50 transition-all duration-500 overflow-hidden min-h-[110px]"
            >
              {/* Image Section */}
              {service.picture && (service.picture.startsWith("http") || service.picture.startsWith("/") || service.picture.startsWith("data:")) ? (
                <div className="relative h-32 w-0 opacity-0 group-hover:w-40 group-hover:opacity-100 transition-all duration-500 ease-in-out overflow-hidden shadow-xl">
                  <Image
                    src={service.picture}
                    alt={service.name}
                    fill
                    className="object-cover scale-125 group-hover:scale-100 transition-transform duration-700 ease-out"
                  />
                </div>
              ) : null}

              <div className={`flex-1 p-6 transition-all duration-500 ease-in-out ${service.picture ? 'group-hover:pl-10' : ''}`}>
                <div className="flex justify-between items-start mb-2">
                  <div className="space-y-1">
                    <h3 className="font-serif text-lg tracking-widest text-text-main uppercase transition-colors duration-300 group-hover:text-accent dark:group-hover:text-accent-400">
                      {service.name}
                      {service.isPackage && (
                        <span className="ml-3 text-[8px] px-2 py-0.5 border border-gold/30 text-gold rounded-full italic tracking-tight font-sans uppercase">Package</span>
                      )}
                    </h3>
                    
                    {activePromo && (
                      <div className="flex flex-col gap-0.5">
                        <p className="text-[9px] text-accent dark:text-accent-400 tracking-[0.2em] uppercase font-bold italic">
                          ✦ {activePromo.title}
                        </p>
                        <p className="text-[14px] text-text-sub/60 tracking-[0.1em] uppercase">{activePromo.description}</p>
                        <p className="text-[8px] text-text-sub/60 tracking-[0.1em] uppercase">
                          Period: {formatDateRange(activePromo.startDate, activePromo.endDate)}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col items-end">
                    {hasDiscount && (
                      <span className="font-mono text-[11px] text-red-500/60 line-through tracking-tighter mb-1">
                        {service.price} THB
                      </span>
                    )}
                    <span className="font-mono text-accent dark:text-accent-400 font-bold tracking-tighter text-lg">
                      {finalPrice} <span className="text-[10px] ml-1">THB</span>
                    </span>
                  </div>
                </div>

                <p className="text-sm text-text-sub font-light leading-relaxed max-w-2xl line-clamp-2 group-hover:line-clamp-none transition-all duration-500">
                  {service.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}