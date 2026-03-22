interface ShopItem {
  _id: string;
  id?: string;
  name: string;

  address: {
    street: string;
    district: string;
    province: string;
    postalcode: string;
  };

  tel: string;

  openClose: {
    open: string;
    close: string;
  };

  __v?: number;
}
  
  interface ShopJson {
    success: boolean,
    count: number,
    pagination: Object,
    data: ShopItem[]
  }