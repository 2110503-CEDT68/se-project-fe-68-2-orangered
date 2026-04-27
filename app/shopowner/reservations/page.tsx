"use client";
import ReservationCard from "@/component/ReservationManagement/ReservationCard";
import deleteReservation from "@/libs/reservation/deleteReservation";
import getAllReservations from "@/libs/reservation/getAllReservation";
import { useSession } from "next-auth/react";
import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Reservations } from "@/interface";
import ReservationLoading from "@/component/ReservationManagement/ReservationLoading";
import ReservationNoSession from "@/component/ReservationManagement/ReservationNoSession";
import PaginationLinkNav from "@/component/ui/PaginationLinkNav";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import NoReservationShopOwner from "@/component/ReservationManagement/NoReservationShop";
import dayjs from "dayjs";

const RESERVATIONS_PER_PAGE = 6;

export default function ShopOwnerReservationsPage() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [reservations, setReservations] = useState<Reservations | null>(null);
  const [loading, setLoading] = useState(true);
  
  // 1. Tab State (Sync กับ Backend Status)
  const [currentTab, setCurrentTab] = useState<"upcoming" | "past" | "all">("upcoming");

  const parsedPage = Number(searchParams.get("page") ?? "1");
  const currentPage = Number.isFinite(parsedPage) && parsedPage > 0 ? parsedPage : 1;

  // 2. Fetch Function ที่ส่ง Status ไปที่ Backend
  const fetchReservations = useCallback(async (page: number, tab: string) => {
    if (!session?.user?.token) return;
    setLoading(true);

    // Map Frontend Tab เป็น Backend Status
    const apiStatus = tab === "upcoming" ? "active" : tab === "past" ? "past" : "all";

    try {
      const data = await getAllReservations(session.user.token, {
        page,
        limit: RESERVATIONS_PER_PAGE,
        status: apiStatus, // ส่ง Filter ไปให้ Backend
      });
      setReservations(data);
    } catch {
      console.error("Cannot fetch data");
    } finally {
      setLoading(false);
    }
  }, [session?.user?.token]);

  // 3. Handle Tab Change (Reset หน้า 1 เสมอเมื่อเปลี่ยน Tab)
  const handleTabChange = (newTab: "upcoming" | "past" | "all") => {
    setCurrentTab(newTab);
    const params = new URLSearchParams(searchParams.toString());
    params.delete("page"); // กลับไปหน้าแรกของ Tab นั้น
    router.push(`${pathname}?${params.toString()}`);
  };

  useEffect(() => {
    void fetchReservations(currentPage, currentTab);
  }, [currentPage, currentTab, fetchReservations]);

  async function handleDelete(rid: string) {
    if (!session) return;
    try {
      await deleteReservation({ token: session.user.token, rid: rid });
      // ถ้าลบตัวสุดท้ายของหน้านั้น ให้ถอยกลับไป 1 หน้า
      const nextPage = reservations && reservations.data.length === 1 && currentPage > 1
          ? currentPage - 1
          : currentPage;
      
      if (nextPage !== currentPage) {
        const params = new URLSearchParams(searchParams.toString());
        nextPage === 1 ? params.delete("page") : params.set("page", String(nextPage));
        router.push(`${pathname}?${params.toString()}`);
      } else {
        await fetchReservations(currentPage, currentTab);
      }
    } catch (err) {
      console.error("Delete failed", err);
    }
  }

  if (!session) return <ReservationNoSession />;

  if (session.user.role !== "shopowner") {
    return (
      <div className="min-h-screen bg-background text-text-main flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-serif text-text-main mb-4 italic">Access Denied</h1>
          <p className="text-text-sub text-[10px] uppercase tracking-widest mb-8">Only authorized shop owners may enter this registry.</p>
          <Link href="/" className="text-accent hover:text-accent/80 underline text-[10px] uppercase tracking-[0.2em]">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  if (loading) return <ReservationLoading />;
  
  // ถ้าไม่มีข้อมูลเลยในทุก Tab
  if (!reservations || (reservations.pagination.total === 0 && currentTab === "all")) {
    return <NoReservationShopOwner/>;
  }

  return (
    <div className="min-h-screen bg-background text-text-main pb-32 px-8 pt-8 selection:bg-accent/30">
      {/* Navigation Header */}
      <div className="max-w-6xl mx-auto mb-16">
        <Link
          href="/shop"
          className="group inline-flex items-center text-[10px] uppercase tracking-[0.3em] text-text-sub hover:text-accent transition-all duration-500"
        >
          <span className="mr-3 transition-transform duration-500 group-hover:-translate-x-2 text-accent">
            <svg width="18" height="8" viewBox="0 0 18 8" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0.646447 3.64645C0.451184 3.84171 0.451184 4.15829 0.646447 4.35355L3.82843 7.53553C4.02369 7.7308 4.34027 7.7308 4.53553 7.53553C4.7308 7.34027 4.7308 7.02369 4.53553 6.82843L1.70711 4L4.53553 1.17157C4.7308 0.976311 4.7308 0.659728 4.53553 0.464466C4.34027 0.269204 4.02369 0.269204 3.82843 0.464466L0.646447 3.64645ZM18 3.5L1 3.5V4.5L18 4.5V3.5Z" fill="currentColor" />
            </svg>
          </span>
          <span>Return to Sanctuary</span>
        </Link>
      </div>

      <div className="max-w-6xl mx-auto">
        {/* Title Section */}
        <div className="mb-12">
          <p className="text-[10px] uppercase tracking-[0.5em] text-accent font-bold mb-3">
            ✦ Shop Owner Console
          </p>
          <h1 className="text-4xl font-serif tracking-tight text-text-main">
            Shop Appointments
          </h1>
          <div className="h-[1px] w-20 bg-gradient-to-r from-accent/60 to-transparent mt-6" />
        </div>

        {/* 3. Luxury Tabs Navigation */}
        <div className="flex gap-10 mb-10 border-b border-card-border/30 relative">
          {[
            { id: "upcoming", label: "Scheduled" },
            { id: "past", label: "Completed" },
            { id: "all", label: "All Sessions" }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id as any)}
              className={`pb-4 text-[10px] uppercase tracking-[0.3em] transition-all duration-500 relative flex items-center gap-2 ${
                currentTab === tab.id ? "text-accent font-bold" : "text-text-sub/40 hover:text-text-sub"
              }`}
            >
              {tab.label}
              {/* แสดงเลขรวมจาก API เฉพาะ Tab ที่เลือกอยู่เพื่อให้แม่นยำ */}
              {currentTab === tab.id && (
                <>
                  <span className="text-[8px] text-accent">({reservations.pagination.total})</span>
                  <div className="absolute bottom-0 left-0 w-full h-[1px] bg-accent shadow-[0_0_10px_rgba(197,163,87,0.4)] animate-in fade-in slide-in-from-left-2" />
                </>
              )}
            </button>
          ))}
        </div>

        {/* 4. Reservations List */}
        <div className="grid grid-cols-1 gap-6 min-h-[300px]">
          {reservations.data.length > 0 ? (
            reservations.data.map((item: any, index: number) => (
              <div key={item._id} className="transition-all duration-500 hover:translate-y-[-2px]">
                <ReservationCard
                  item={item}
                  index={index}
                  onDelete={handleDelete}
                />
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-32 opacity-30">
              <p className="italic text-[10px] tracking-[0.5em] uppercase text-center">
                — No {currentTab} sessions recorded —
              </p>
            </div>
          )}
        </div>

        {/* Pagination */}
        <div className="mt-12">
           <PaginationLinkNav
              currentPage={currentPage}
              totalPages={reservations.pagination.totalPages}
            />
        </div>

        <div className="pt-32 flex flex-col items-center gap-4 opacity-40">
          <div className="h-px w-12 bg-card-border" />
          <div className="italic text-text-sub text-[9px] tracking-[0.6em] uppercase">
            — End of Shop Owner Registry —
          </div>
        </div>
      </div>
    </div>
  );
}