import { IProduct } from './product/products';
import { ICategoryTree } from './category/category';
import { IBreadcrumbsData } from './breadcrumbsData';
import React, {Dispatch, ReactNode} from 'react';

export interface IPageProps {
  categories: ICategoryTree[];
  products?: IProduct[];
  isSideBarShown?: boolean;
  breadcrumbsData?: IBreadcrumbsData;
  customClass?: string;
  children?: ReactNode;
}
