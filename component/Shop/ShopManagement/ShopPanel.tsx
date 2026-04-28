import Link from "next/link";
import ShopCard from "./ShopCard";
import { ShopJson } from "@/interface";
import PaginationLinkNav from "@/component/ui/PaginationLinkNav";
import dayjs from "dayjs";

export default async function ShopPanel({
  shopJson,
  currentPage,
}: {
  shopJson: ShopJson;
  currentPage: number;
}) {
  const now = dayjs();

 return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
        {shopJson.data.map((shopItem) => {
          
          const hasValidPromotion = shopItem.massageType?.some((m: any) => 
            m.promotions?.some((p: any) => {
              const startDate = dayjs(p.startDate).startOf('day');
              const endDate = dayjs(p.endDate).endOf('day');
              
              return (
                p.isActive === true &&          
                (now.isAfter(startDate) || now.isSame(startDate, 'day')) &&
                (now.isBefore(endDate) || now.isSame(endDate, 'day'))       
              );
            })
          );

          return (
            <div key={shopItem._id} className="w-full">
              <Link href={`/shop/${shopItem._id}`} className="block group">
                <ShopCard
                  shopId={shopItem._id}
                  shopName={shopItem.name}
                  imgSrc={shopItem.picture || "https://i.pinimg.com/..."}
                  address={shopItem.address}
                  openClose={shopItem.openClose}
                  avgRating={shopItem.averageRating ?? 0}
                  ratingCount={shopItem.ratingCount ?? 0}
                  hasPromotion={hasValidPromotion} 
                />
              </Link>
            </div>
          );
        })}
      </div>
      <PaginationLinkNav
        currentPage={currentPage}
        totalPages={shopJson.pagination.totalPages}
      />
    </div>
  );
}
