import { ICategory } from '../category/category';
import { ICharacteristicValue } from './characteristicValue';
import { BaseEntity } from '../baseEntity';
import { IComment } from 'interfaces/comment/comment';

export interface IProduct {
  id: number;
  name: string;
  key: string | undefined;
  price: number;
  discountedPrice: number | null;
  availability?: boolean;
  quantity?: number;
  description?: string;
  avgRating: string;
  numRates?: number;
  createdAt?: string;
  updatedAt?: string;
  mainImg: IProductPreviewImg | undefined;
  category?: ICategory;
  files?: IFile[];
  url: string;
  characteristicValue?: ICharacteristicValue[];
  comments?: IComment[];
  shopKey: string;
  color?: string;
}

export interface PaginatedProducts {
  data: IProduct[];
  count: number;
  totalPages: number;
}

export interface IProductRating {
  avgRating: string;
}

export interface IFile {
  id: number;
  name: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface IProductComment extends BaseEntity {
  name: string;
  description: string;
  key: string;
  price: number;
}

export interface IProductPreviewImg {
  id?: number;
  name: string;
}

export interface IProductsData {
  products: Array<IProduct>;
}

export interface IProductData {
  product: IProduct | null;
}

export interface IProductsSlide {
  data: IProduct[];
  isWidgetActive: boolean;
}

export interface INewArrivalProducts {
  isWidgetActive: boolean;
  newArrivalProducts: IProduct[];
}

export interface IProductsSearchResponse {
  data: IProduct[];
  count: number;
  totalPages: number;
}

export interface ISortedProducts {
  categoryName: string;
  products: IProduct[];
}

export interface ChosenProduct {
  id: number;
  value: string;
}

export interface ChosenSize {
  selected: ChosenProduct[];
}

export interface ChosenColor {
  selected: ChosenProduct[];
}

export interface SelectBlockProps {
  characteristicsValue?: ICharacteristicValue[];
  productId: number;
  sizeFetcher?: (size: string) => void;
}

export interface ProductInListCategory {
  products: IProduct[];
  count: number;
}

export interface ISizeColorSelect {
  value: string;
  label: string;
}
