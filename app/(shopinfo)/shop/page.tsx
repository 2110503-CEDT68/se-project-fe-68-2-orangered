import ShopPanel from "@/component/Shop/ShopManagement/ShopPanel";
import Link from "next/link";
import getAllShops from "@/libs/shops/getAllShops";
import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/auth/authOption";
import dayjs from "dayjs";

const SHOPS_PER_PAGE = 6;

const sortOptions = [
  { label: "Recommended", value: "-averageRating,_id" },
  { label: "Newest", value: "-_id" },
  { label: "Most Reviewed", value: "-ratingCount" },
  { label: "On Sale ✦", value: "promo" }, 
];

export default async function ShopPage({
  searchParams,
}: {
  searchParams?: Promise<{ page?: string; sort?: string }>;
}) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const parsedPage = Number(resolvedSearchParams?.page ?? "1");
  const currentPage = Number.isFinite(parsedPage) && parsedPage > 0 ? parsedPage : 1;
  const currentSort = resolvedSearchParams?.sort || sortOptions[0].value;

  const session = await getServerSession(authOptions);
  
const fetchOptions: { page: number; limit: number; ownerId?: string; sort: string } = {
  page: currentPage,
  limit: SHOPS_PER_PAGE,
  sort: currentSort, 
};

  if (session?.user?.role === "shopowner" && session?.user?._id) {
    fetchOptions.ownerId = session.user._id;
  }

  const shops = await getAllShops(fetchOptions);

  // --- LOGIC: ON SALE SORTING ---


  const isShopOwnerWithNoShops = session?.user?.role === "shopowner" && shops.data.length === 0;

  return (
    <main className="min-h-screen bg-background text-text-main pb-24 px-8 pt-6">
      
      {/* Back Button */}
      <div className="max-w-7xl mx-auto mb-10">
        <Link
          href="/"
          className="group inline-flex items-center text-[11px] uppercase tracking-[0.2em] text-text-sub hover:text-accent transition-all duration-300"
        >
          <span className="mr-2 transition-transform duration-300 group-hover:-translate-x-1">←</span>
          <span>Back to Home</span>
        </Link>
      </div>

      {/* Header Section */}
      <div className="max-w-4xl mx-auto text-center mb-6">
        <div className="flex flex-col items-center gap-5 md:flex-row md:justify-center md:items-end md:gap-8 mb-4">
          <h1 className="text-4xl md:text-5xl font-serif font-medium tracking-tight">
            {isShopOwnerWithNoShops ? "Create Your Sanctuary" : "The Collection"}
          </h1>
          {session?.user?.role === "shopowner" && (
            <Link
              href="/shopowner/create"
              className="inline-flex items-center justify-center rounded-full border border-accent px-6 py-3 text-[10px] uppercase tracking-[0.35em] text-accent transition-all duration-300 hover:bg-accent hover:text-background"
            >
              Establish Shop
            </Link>
          )}
        </div>
        <p className="text-text-sub uppercase tracking-[0.2em] text-[10px] italic">
          {isShopOwnerWithNoShops
            ? "Your journey as a curator begins here."
            : "Curated wellness experiences for the discerning guest."}
        </p>
      </div>

      {/* Sorting Tabs UI */}
      {!isShopOwnerWithNoShops && (
  <div className="max-w-5xl mx-auto mb-12">
    <div className="flex flex-wrap justify-center gap-3">
      {sortOptions.map((option) => {
        const isActive = currentSort === option.value;
        
        // ถ้า Active อยู่ (กดซ้ำ) ให้ส่งไปแค่ /shop?page=1 (กลับเป็น Default)
        // ถ้าไม่ Active ให้ส่งไปแบบระบุ Sort ปกติ
        const targetHref = isActive 
          ? `/shop?page=1` 
          : `/shop?page=1&sort=${option.value}`;

        return (
          <Link
            key={option.value}
            href={targetHref}
            className={`px-5 py-2 rounded-full text-[10px] uppercase tracking-[0.2em] transition-all duration-300 border ${
              isActive
                ? "bg-accent text-background border-accent shadow-[0_0_15px_rgba(197,163,87,0.3)]"
                : "border-card-border text-text-sub hover:border-accent/50 hover:text-accent"
            }`}
          >
            {option.label}
          </Link>
        );
      })}
    </div>
    <div className="h-[1px] w-16 bg-gradient-to-r from-transparent via-accent/40 to-transparent mx-auto mt-8" />
  </div>
)}

      {/* Main Content */}
      <div className="max-w-5xl mx-auto">
        {isShopOwnerWithNoShops ? (
          <div className="mx-auto max-w-2xl rounded-3xl border border-card-border bg-card/40 backdrop-blur-sm px-8 py-14 text-center shadow-xl">
            <p className="text-[10px] uppercase tracking-[0.4em] text-accent mb-4 font-bold">Registry Empty</p>
            <h2 className="text-3xl font-serif tracking-tight mb-4 italic">No shop found under your care</h2>
            <p className="max-w-xl mx-auto text-sm text-text-sub leading-7 mb-8 opacity-70">
              Please initialize your shop profile to begin receiving guests and managing your signature treatments.
            </p>
          </div>
        ) : (
          <ShopPanel shopJson={shops} currentPage={currentPage} />
        )}
      </div>
      
    </main>
  );
}