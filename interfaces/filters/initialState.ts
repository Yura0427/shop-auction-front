import { IPriceRange } from './filtersData';

export interface initialState {
  [key: string]: Array<{ index: number; active: boolean }> | IPriceRange;
}

export interface FilterItemState {
  index: number;
  active: boolean;
}

export enum SortingValuesEnum {
  price_asc = 'price_asc',
  price_desc = 'price_desc',
  new_arrivals = 'new_arrivals',
}

export interface initialSortingState {
  value: string;
  quantity: number;
}
