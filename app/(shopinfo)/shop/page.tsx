import ShopPanel from "@/component/Shop/ShopManagement/ShopPanel";
import ShopFilterBar from "@/component/Shop/ShopFilterBar";
import Link from "next/link";
import getAllShops from "@/libs/shops/getAllShops";
import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/auth/authOption";
import { ShopItem } from "@/interface";

const SHOPS_PER_PAGE = 6;
const FILTER_FETCH_LIMIT = 500;

function timeToMinutes(t: string): number {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + (m ?? 0);
}

const sortOptions = [
  { label: "Recommended", value: "-averageRating,_id" },
  { label: "Newest", value: "-_id" },
  { label: "Most Reviewed", value: "-ratingCount" },
  { label: "On Sale ✦", value: "promo" },
];

export default async function ShopPage({
  searchParams,
}: {
  searchParams?: Promise<{
    page?: string;
    sort?: string;
    name?: string;
    minRating?: string;
    openBefore?: string;
    closeAfter?: string;
    view?: string; // เพิ่ม view param สำหรับ Shop Owner
  }>;
}) {
  const params = searchParams ? await searchParams : {};
  const session = await getServerSession(authOptions);

  const currentPage = Math.max(Number(params.page) || 1, 1);
  const currentSort = params.sort || "-averageRating,_id";
  const currentView = params.view || (session?.user?.role === "shopowner" ? "mine" : "all");

  const filterName = params.name?.trim() ?? "";
  const filterMinRating = Number(params.minRating ?? "0");
  const filterOpenBefore = params.openBefore ?? "";
  const filterCloseAfter = params.closeAfter ?? "";

  const hasFilters = !!filterName || filterMinRating > 0 || !!filterOpenBefore || !!filterCloseAfter;

  const fetchOptions: any = {
    page: hasFilters ? 1 : currentPage,
    limit: hasFilters ? FILTER_FETCH_LIMIT : SHOPS_PER_PAGE,
    sort: currentSort,
    ...(filterName && { name: filterName }),
  };

  // ถ้าเป็น Shop Owner และเลือกดูแค่ของตัวเอง
  if (session?.user?.role === "shopowner" && currentView === "mine") {
    fetchOptions.ownerId = session.user._id;
  }

  const shops = await getAllShops(fetchOptions);
  const isShopOwner = session?.user?.role === "shopowner";
  const noShopsOwned = isShopOwner && currentView === "mine" && shops.data.length === 0;

  // Filter Logic
  let filteredData: ShopItem[] = shops.data;
  if (hasFilters) {
    if (filterName) {
      const lower = filterName.toLowerCase();
      filteredData = filteredData.filter((s) => s.name.toLowerCase().includes(lower));
    }
    if (filterMinRating > 0) {
      filteredData = filteredData.filter((s) => (s.averageRating ?? 0) >= filterMinRating);
    }
    if (filterOpenBefore) {
      const limit = timeToMinutes(filterOpenBefore);
      filteredData = filteredData.filter((s) => timeToMinutes(s.openClose.open) <= limit);
    }
    if (filterCloseAfter) {
      const limit = timeToMinutes(filterCloseAfter);
      filteredData = filteredData.filter((s) => timeToMinutes(s.openClose.close) >= limit);
    }
  }

  const totalFiltered = filteredData.length;
  const totalPages = hasFilters ? Math.max(1, Math.ceil(totalFiltered / SHOPS_PER_PAGE)) : shops.pagination.totalPages;
  const pageData = hasFilters ? filteredData.slice((currentPage - 1) * SHOPS_PER_PAGE, currentPage * SHOPS_PER_PAGE) : filteredData;

  const shopJson = {
    ...shops,
    data: pageData,
    count: totalFiltered,
    pagination: { ...shops.pagination, totalPages, total: totalFiltered },
  };

  return (
    <main className="min-h-screen bg-background text-text-main pb-24 px-6 pt-8 selection:bg-accent/30">
      {/* Top Navigation & Actions */}
      <div className="max-w-7xl mx-auto flex justify-between items-center mb-16">
        <Link href="/" className="group inline-flex items-center text-[10px] uppercase tracking-[0.3em] text-text-sub hover:text-accent transition-all duration-500">
          <span className="mr-3 group-hover:-translate-x-2 transition-transform duration-500 text-accent">←</span>
          Return to Sanctuary
        </Link>

        {isShopOwner && (
          <Link 
            href="/shopowner/create" 
            className="px-6 py-2 bg-accent text-background text-[10px] uppercase tracking-[0.2em] font-bold rounded-full hover:scale-105 hover:shadow-[0_0_20px_rgba(197,163,87,0.3)] transition-all duration-500"
          >
            + Establish New Shop
          </Link>
        )}
      </div>

      {/* Header Section */}
      <div className="max-w-4xl mx-auto text-center mb-16 space-y-4">
        <p className="text-accent text-[10px] uppercase tracking-[0.6em] animate-in fade-in slide-in-from-bottom-4 duration-1000">
          ✦ Curated Wellness ✦
        </p>
        <h1 className="text-5xl md:text-6xl font-serif tracking-tight text-text-main animate-in fade-in slide-in-from-bottom-6 duration-1000 delay-100">
          {isShopOwner && currentView === "mine" ? "Your Domain" : "The Collection"}
        </h1>
        <div className="h-[1px] w-24 bg-gradient-to-r from-transparent via-accent to-transparent mx-auto mt-8 opacity-50" />
      </div>

      {/* Shop Owner View Switcher */}
      {isShopOwner && (
        <div className="max-w-md mx-auto mb-10 flex p-1 bg-card-bg/50 rounded-full border border-card-border/30 backdrop-blur-sm">
          <Link 
            href="/shop?view=mine" 
            className={`flex-1 text-center py-2 rounded-full text-[10px] uppercase tracking-widest transition-all duration-500 ${currentView === "mine" ? "bg-accent text-background shadow-lg" : "text-text-sub hover:text-text-main"}`}
          >
            My Shops
          </Link>
          <Link 
            href="/shop?view=all" 
            className={`flex-1 text-center py-2 rounded-full text-[10px] uppercase tracking-widest transition-all duration-500 ${currentView === "all" ? "bg-accent text-background shadow-lg" : "text-text-sub hover:text-text-main"}`}
          >
            Explore All
          </Link>
        </div>
      )}

      {/* Filter & Search Bar */}
      <div className="max-w-7xl mx-auto mb-12">
        <ShopFilterBar />
      </div>

      {/* Sorting Tabs */}
      <div className="max-w-5xl mx-auto mb-16">
        <div className="flex flex-wrap justify-center gap-4 border-b border-card-border/20 pb-8">
          {sortOptions.map((option) => {
            const isActive = currentSort === option.value;
            const targetHref = `/shop?page=1&sort=${option.value}${isShopOwner ? `&view=${currentView}` : ""}`;

            return (
              <Link
                key={option.value}
                href={targetHref}
                className={`relative px-4 py-2 text-[9px] uppercase tracking-[0.2em] transition-all duration-500 ${
                  isActive ? "text-accent font-bold" : "text-text-sub hover:text-text-main"
                }`}
              >
                {option.label}
                {isActive && (
                  <div className="absolute bottom-0 left-0 w-full h-[1px] bg-accent shadow-[0_0_10px_rgba(197,163,87,0.5)] animate-in fade-in duration-700" />
                )}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-6xl mx-auto">
        {noShopsOwned ? (
          <div className="text-center py-32 space-y-6">
            <div className="text-accent/20 text-6xl">✦</div>
            <p className="italic text-text-sub text-sm tracking-widest uppercase">You have not established any sanctuaries yet.</p>
            <Link href="/shopowner/create" className="inline-block border-b border-accent text-accent text-[10px] uppercase tracking-[0.3em] pb-1 hover:opacity-70 transition">
              Begin your journey
            </Link>
          </div>
        ) : pageData.length === 0 ? (
          <div className="text-center py-32">
            <p className="italic text-text-sub text-[10px] tracking-[0.5em] uppercase">— No sanctuaries match your current criteria —</p>
          </div>
        ) : (
          <div className="animate-in fade-in duration-1000">
            <ShopPanel shopJson={shopJson} currentPage={currentPage} />
          </div>
        )}
      </div>

      {/* Decorative End */}
      <div className="mt-32 flex flex-col items-center gap-6 opacity-30">
        <div className="h-px w-20 bg-gradient-to-r from-transparent via-card-border to-transparent" />
        <p className="text-[8px] uppercase tracking-[1em] text-text-sub">End of Catalog</p>
      </div>
    </main>
  );
}