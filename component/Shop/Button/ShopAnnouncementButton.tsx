export default function ShopAnnouncementButton({
  onOpen,
  length
}:{
  onOpen: ()=>void;
  length: number;
}){
  return(
    <button
      onClick={() => onOpen()}
      className="fixed top-24 right-6 z-40 group flex items-center gap-2.5 bg-accent text-white pl-4 pr-5 py-2.5 rounded-full shadow-lg shadow-accent/30 text-[10px] uppercase tracking-widest font-bold transition-all duration-300 hover:shadow-accent/50 hover:shadow-xl hover:scale-105 active:scale-95"
    >
      <span className="relative flex h-3.5 w-3.5">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-40" />
        <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-white/90 items-center justify-center text-[8px] text-accent font-black">
          {length}
        </span>
      </span>
      Announcements
    </button>
  )
}