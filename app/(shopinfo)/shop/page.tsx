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
  }>;
}) {
  const params = searchParams ? await searchParams : {};

  const currentPage = Math.max(Number(params.page) || 1, 1);
  const currentSort = params.sort || "-averageRating,_id";

  const filterName = params.name?.trim() ?? "";
  const filterMinRating = Number(params.minRating ?? "0");
  const filterOpenBefore = params.openBefore ?? "";
  const filterCloseAfter = params.closeAfter ?? "";

  const hasFilters =
    !!filterName ||
    filterMinRating > 0 ||
    !!filterOpenBefore ||
    !!filterCloseAfter;

  const session = await getServerSession(authOptions);

  // ✅ fetch options
  const fetchOptions: any = {
    page: hasFilters ? 1 : currentPage,
    limit: hasFilters ? FILTER_FETCH_LIMIT : SHOPS_PER_PAGE,
    sort: currentSort, // 🔥 สำคัญ: ส่ง promo ไป backend
    ...(filterName && { name: filterName }),
  };

  if (session?.user?.role === "shopowner" && session.user?._id) {
    fetchOptions.ownerId = session.user._id;
  }

  const shops = await getAllShops(fetchOptions);

  const isShopOwnerWithNoShops =
    session?.user?.role === "shopowner" && shops.data.length === 0;

  // =====================
  // ✅ FILTER (frontend)
  // =====================
  let filteredData: ShopItem[] = shops.data;

  if (hasFilters) {
    if (filterName) {
      const lower = filterName.toLowerCase();
      filteredData = filteredData.filter((s) =>
        s.name.toLowerCase().includes(lower)
      );
    }

    if (filterMinRating > 0) {
      filteredData = filteredData.filter(
        (s) => (s.averageRating ?? 0) >= filterMinRating
      );
    }

    if (filterOpenBefore) {
      const limit = timeToMinutes(filterOpenBefore);
      filteredData = filteredData.filter(
        (s) => timeToMinutes(s.openClose.open) <= limit
      );
    }

    if (filterCloseAfter) {
      const limit = timeToMinutes(filterCloseAfter);
      filteredData = filteredData.filter(
        (s) => timeToMinutes(s.openClose.close) >= limit
      );
    }
  }

  // =====================
  // ✅ PAGINATION (frontend when filtering)
  // =====================
  const totalFiltered = filteredData.length;

  const totalPages = hasFilters
    ? Math.max(1, Math.ceil(totalFiltered / SHOPS_PER_PAGE))
    : shops.pagination.totalPages;

  const pageData = hasFilters
    ? filteredData.slice(
        (currentPage - 1) * SHOPS_PER_PAGE,
        currentPage * SHOPS_PER_PAGE
      )
    : filteredData;

  const shopJson = {
    ...shops,
    data: pageData,
    count: totalFiltered,
    pagination: {
      ...shops.pagination,
      totalPages,
      total: totalFiltered,
    },
  };

  // =====================
  // UI
  // =====================
  return (
    <main className="min-h-screen bg-background text-text-main pb-24 px-6 pt-6">
      {/* Back */}
      <div className="max-w-7xl mx-auto mb-10">
        <Link href="/" className="group inline-flex items-center text-[11px] uppercase text-text-sub hover:text-accent">
          <span className="mr-2 group-hover:-translate-x-1 transition">←</span>
          Back to Home
        </Link>
      </div>

      {/* Header */}
      <div className="max-w-4xl mx-auto text-center mb-6">
        <h1 className="text-4xl font-serif">
          {isShopOwnerWithNoShops ? "Create Your Sanctuary" : "The Collection"}
        </h1>
      </div>

      {!isShopOwnerWithNoShops && <ShopFilterBar />}

      {/* SORT */}
      {!isShopOwnerWithNoShops && (
        <div className="max-w-5xl mx-auto mb-12">
          <div className="flex flex-wrap justify-center gap-3">
            {sortOptions.map((option) => {
              const isActive = currentSort === option.value;

              const targetHref = isActive
                ? `/shop?page=1`
                : `/shop?page=1&sort=${option.value}`;

              return (
                <Link
                  key={option.value}
                  href={targetHref}
                  className={`px-5 py-2 rounded-full text-[10px] uppercase border ${
                    isActive
                      ? "bg-accent text-background border-accent"
                      : "border-card-border text-text-sub hover:text-accent"
                  }`}
                >
                  {option.label}
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* CONTENT */}
      <div className="max-w-5xl mx-auto">
        {isShopOwnerWithNoShops ? (
          <div className="text-center py-20">No shop yet</div>
        ) : hasFilters && pageData.length === 0 ? (
          <div className="text-center py-20">
            No shops match your filters
          </div>
        ) : (
          <ShopPanel shopJson={shopJson} currentPage={currentPage} />
        )}
      </div>
    </main>
  );
}