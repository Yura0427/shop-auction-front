export interface IOrderProduct {
  product: { id: number; name: string; category: { name: string }; price: number };
  quantity: number;
}

interface IProductDataAnalictics {
  sku: number;
  name: string;
  category: string;
  price: number;
  quantity: number;
}

export interface IOrderDataAnalictics {
  transactionId: string;
  transactionAffiliation: string;
  transactionTotal: number;
  transactionProducts: IProductDataAnalictics[];
}
