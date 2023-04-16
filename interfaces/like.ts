import { BaseEntity } from './baseEntity';
import { IUser } from './order';
import { ICategory } from './category/category';
import { IProduct } from './product/products';

export interface ILike extends BaseEntity {
  product: IProduct;
  user: IUser;
}

export interface ILikePreviewImg {
  id: number;
  name: string;
  url: string;
}

export interface ILikeProduct {
  id: number;
  name: string;
  description: string;
  key: string;
  url: string;
  price: number;
  mainImg: ILikePreviewImg | null;
  category: ICategory;
}

export interface ILikeUserResponse extends ILike {
  data: ILike[];
  userId?: number;
}

export interface ILikeResponse {
  data: ILike[];
  count: number;
  totalPages: number;
}

export interface IGetLikeResponse extends BaseEntity {
  product: {id:number};
}
