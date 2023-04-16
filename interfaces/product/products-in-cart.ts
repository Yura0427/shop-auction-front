import { IProduct } from './products';

export interface IAddProductInCart extends SelectedProductInfo {
  quantity: number;
  product: CustomProductInCart;
}

export interface CustomProductInCart extends IProduct, SelectedProductInfo {
  shopKey: string;
}

export interface SelectedProductInfo {
  size?: string;
  color?: string;
}

export interface UpdateOrder extends SelectedProductInfo {
  quantity?: number;
  orderProductId?: number;
}

export interface ProductToOrder extends SelectedProductInfo {
  id: number;
  quantity: number;
  product: CustomProductInCart;
  amount: number;
  updatedAt?: string;
  createdAt?: string;
}

export interface IProductInCart {
  productToOrder(arg0: string, productToOrder: any): unknown;
  id: number;
  quantity: number;
  amount: number;
  productId: number;
  color: string;
  size: string;
  product: IProduct;
}

export interface ISingleProductToCart extends SelectedProductInfo {
  id: number;
}

export interface IProductsInCartData {
  productToOrder: Array<IProductInCart>;
  additionalEmail?: string;
  additionalFirstName?: string;
  additionalLastName?: string;
  additionalNumber?: string;
  amount: number;
  comment?: string;
  orderIdForLiqpay: string;
  liqpayOrderId?: string;
  liqpayPaymentStatus?: string;
  status: string;
  notcall?: boolean;
  id: string;
}

export interface IProductData {
  product: Array<IProduct>;
}
