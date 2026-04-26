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

export default async function shop({
  searchParams,
}: {
  searchParams?: Promise<{ page?: string; name?: string; minRating?: string; openBefore?: string; closeAfter?: string }>;
}) {
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const parsedPage = Number(resolvedSearchParams?.page ?? "1");
  const currentPage = Number.isFinite(parsedPage) && parsedPage > 0 ? parsedPage : 1;

  const filterName = resolvedSearchParams?.name?.trim() ?? "";
  const filterMinRating = Number(resolvedSearchParams?.minRating ?? "0");
  const filterOpenBefore = resolvedSearchParams?.openBefore ?? "";
  const filterCloseAfter = resolvedSearchParams?.closeAfter ?? "";

  const hasFilters = !!(filterName || filterMinRating > 0 || filterOpenBefore || filterCloseAfter);

  const session = await getServerSession(authOptions);
  const fetchOptions: { page: number; limit: number; ownerId?: string; sort: string; name?: string } = {
    page: hasFilters ? 1 : currentPage,
    limit: hasFilters ? FILTER_FETCH_LIMIT : SHOPS_PER_PAGE,
    sort: "-averageRating,_id",
    ...(filterName && { name: filterName }),
  };

  if (session?.user?.role === "shopowner" && session?.user?._id) {
    fetchOptions.ownerId = session.user._id;
  }

  const shops = await getAllShops(fetchOptions);
  const isShopOwnerWithNoShops = session?.user?.role === "shopowner" && shops.data.length === 0;

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
  const totalPages = hasFilters
    ? Math.max(1, Math.ceil(totalFiltered / SHOPS_PER_PAGE))
    : shops.pagination.totalPages;

  const pageData = hasFilters
    ? filteredData.slice((currentPage - 1) * SHOPS_PER_PAGE, currentPage * SHOPS_PER_PAGE)
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

  return (
    <main className="min-h-screen bg-background text-text-main pb-24 px-4 sm:px-8 pt-6 transition-colors duration-300">

      <div className="max-w-7xl mx-auto mb-10">
        <Link
          href="/"
          className="group inline-flex items-center text-[11px] uppercase tracking-[0.2em] text-text-sub hover:text-accent transition-all duration-300"
        >
          <span className="mr-2 transition-transform duration-300 group-hover:-translate-x-1">←</span>
          <span>Back to Home</span>
        </Link>
      </div>

      <div className="max-w-4xl mx-auto text-center mb-6">
        <div className="flex flex-col items-center gap-5 md:flex-row md:justify-center md:items-end md:gap-8 mb-4">
          <h1 className="text-4xl md:text-5xl font-serif font-medium tracking-tight">
            {isShopOwnerWithNoShops ? "Create Your Shop" : "Browse Our Shops"}
          </h1>
          {session?.user?.role === "shopowner" && (
            <Link
              href="/shopowner/create"
              className="inline-flex items-center justify-center rounded-full border border-accent px-6 py-3 text-[10px] uppercase tracking-[0.35em] text-accent transition-all duration-300 hover:bg-accent hover:text-background"
            >
              Create Shop
            </Link>
          )}
        </div>
        <p className="text-text-sub uppercase tracking-[0.2em] text-[10px]">
          {isShopOwnerWithNoShops
            ? "Please create your first shop to start managing bookings and shop details"
            : "Select your preferred shop for a premium experience"}
        </p>

        <div className="h-[1px] w-16 bg-accent/30 mx-auto mt-8" />
      </div>

      {!isShopOwnerWithNoShops && <ShopFilterBar />}

      <div className="max-w-5xl mx-auto">
        {isShopOwnerWithNoShops ? (
          <div className="mx-auto max-w-2xl rounded-3xl border border-card-border bg-card/80 px-8 py-14 text-center shadow-[0_30px_80px_rgba(0,0,0,0.08)]">
            <p className="text-[10px] uppercase tracking-[0.4em] text-accent mb-4 font-bold">No Shop Yet</p>
            <h2 className="text-3xl md:text-4xl font-serif tracking-tight mb-4">Please create a shop first</h2>
            <p className="max-w-xl mx-auto text-sm text-text-sub leading-7 mb-8">
              You are signed in as a shopowner, but there is no shop linked to your account yet. Create one to start
              managing reservations, opening hours, and shop information.
            </p>
          </div>
        ) : hasFilters && pageData.length === 0 ? (
          <div className="text-center py-24 space-y-4">
            <p className="text-[10px] uppercase tracking-[0.4em] text-accent/60">No Results</p>
            <p className="text-text-sub text-sm">No shops match your current filters.</p>
          </div>
        ) : (
          <ShopPanel shopJson={shopJson} currentPage={currentPage} />
        )}
      </div>
    </main>
  );
}
