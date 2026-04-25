import { Announcement } from "../ShopAnnouncement";

export default function AnnouncementModal({
  children,
  onClose,
  announcements
}:{
  children: React.ReactNode;
  onClose: () => void;
  announcements: Announcement[];
}){
  return(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/70 backdrop-blur-md"
      onClick={() => onClose()}
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
            onClick={() => onClose()}
            className="w-7 h-7 flex items-center justify-center rounded-lg border border-card-border text-text-sub hover:text-red-400 hover:border-red-400/30 hover:bg-red-400/10 transition-all text-sm"
          >
            ×
          </button>
        </div>
        <div className="p-6">
          <div className="flex justify-center items-start gap-4 mb-4">
            {children}
          </div>
        </div>
      </div>
      
    </div>
  )
}