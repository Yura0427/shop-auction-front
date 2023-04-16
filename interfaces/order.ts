import { BaseEntity } from './baseEntity';
import { IAddDelivery } from './delivery/delivery';
import { SelectedProductInfo } from './product/products-in-cart';

export interface ICategory {
  id: number;
  name: string;
  key: string;
  mainCategory: {
    key: string;
  };
}

export interface IImg {
  name: string;
}

export interface ICartProduct {
  id: number;
  name: string;
  key: string;
  price: number;
  url: string;
  mainImg: IImg | null;
  category: ICategory;
}

export interface IProductToOrder extends BaseEntity, SelectedProductInfo {
  quantity: number;
  parcelNumber: string;
  amount: number;
  product: ICartProduct;

}

export interface IUser extends BaseEntity {
  dateOfBirth: null | Date;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  googleId: string | null;
  facebookId: string | null;
  notcall: boolean | null;
}

export interface IDelivery {
  cityFullName: string;
  streetName: string;
  deliveryMethod: string;
  courierDeliveryAddress: string;
}

export interface IAdditionalOrderFields {
  additionalFirstName?: string;
  additionalLastName?: string;
  additionalEmail?: string;
  additionalNumber?: string;
  deliveryMethod?: string;
  comment?: string;
  notcall?: boolean;
  paymentMethod?: string;
}

export interface ICreateOrder extends IAddDelivery, IAdditionalOrderFields {}

export interface IOrder extends BaseEntity {
  status: string;
  amount: number;
  productToOrder: IProductToOrder[];
  user: IUser;
  delivery: IDelivery;
  additionalFirstName: string;
  additionalLastName: string;
  additionalEmail: string;
  additionalNumber: string;
  comment: string;
  notcall: boolean;
  orderIdForLiqpay: string;
  liqpayOrderId: string;
  liqpayPaymentStatus: string;
  paymentStatus: boolean;
}

export interface IOrdersResponse {
  data: IOrder[];
  count: number;
  totalPages: number;
}
