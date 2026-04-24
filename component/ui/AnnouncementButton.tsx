'use client'
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function AnnouncementButton({ shopId, canManage }: { shopId: string; canManage?: boolean }){
  const { data: session } = useSession();
  const router = useRouter();

  if (!canManage && session?.user?.role !== "admin") return null;

  return(
    <div className="fixed bottom-20 left-10 flex flex-col gap-4 z-40">
      <button
        onClick={() => router.push(`/announcements/${shopId}`)}
        className="group flex flex-col items-start gap-1"
      >
        <div className="px-6 py-2 bg-card/80 backdrop-blur-md border border-cyan-500/30 rounded-xl transition-all duration-500 group-hover:border-cyan-500 group-hover:bg-cyan-500/10 group-hover:shadow-[0_0_20px_rgba(6,182,212,0.1)]">
          <span className="text-[10px] uppercase tracking-[0.4em] text-cyan-500 group-hover:text-cyan-400 transition-colors font-medium">
            Announcements
          </span>
        </div>

        <span className="text-[8px] italic text-text-sub tracking-[0.3em] uppercase opacity-0 group-hover:opacity-100 transition-all duration-500 pl-2">
          — Manage Posts —
        </span>
      </button>
    </div>
  )
}