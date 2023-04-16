import { ICategory, ICategoryTree } from '../category/category';
import { IBreadcrumbsData } from '../breadcrumbsData';
import { IProduct, ProductInListCategory } from '../product/products';
import { ICommentResponse } from '../comment/comment';

export interface MetaData {
  title: string;
  description: string;
  addBrand: boolean;
  noIndex?: boolean;
}

export interface BasicDynamicPageProps {
  allCategories: ICategoryTree[];
  metaData: MetaData;
  breadcrumbsData: IBreadcrumbsData;
}

export interface CtWithoutChildrenProps extends BasicDynamicPageProps {
  category: ICategory;
  productsData: { products: IProduct[]; count: number };
}

export interface ProductPageProps extends BasicDynamicPageProps {
  product: IProduct;
  comments: ICommentResponse;
}

export interface CtWithChildrenProps extends BasicDynamicPageProps {
  category: ICategory;
  validUrl: string;
  productsData: ProductInListCategory;
}
