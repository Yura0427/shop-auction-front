import { IProduct } from '../product/products';
import { ICharacteristicGroup } from './characteristicGroup';
import { ICharacteristic } from './characteristic';
import { BaseEntity } from '../baseEntity';

export interface ICategory {
  name: string;
  id: number;
  key: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
  products?: IProduct[];
  mpath?: string;
  characteristicGroup?: ICharacteristicGroup<ICharacteristic>[];
  priceRange?: { min: number; max: number };
  ascCategories?: Partial<ICategory>[];
  children?: ICategory[];
  mainCategory?: {
    id: number;
    key: string;
  };
}

export interface ICategoryData {
  categories: ICategoryTree[];
}

export interface IMainCategory extends BaseEntity {
  key: string;
  name: string;
  description: string;
  category: ICategory[];
}

export interface ICategoryTree {
  id: number;
  createdAt: string;
  updatedAt: string;
  name: string;
  key: string;
  description: string;
  mpath: string;
  parent: null | { id: number };
  children: ICategoryTree[];
  disabled: boolean;
  disabledByAdmin: boolean;
}

export interface ICategoryMobile {
  step: number;
  data: Array<ICategoryTree[]>;
  currentMpath: string;
}
