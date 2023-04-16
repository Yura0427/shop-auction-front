import { IAction } from '../../interfaces/action';
import { ICategory } from '../../interfaces/category/category';
import { GET_CATEGORIES } from '../types/categories.type';

export const loadCategories = (categories: ICategory[]): IAction => {
  return {
    type: GET_CATEGORIES,
    payload: categories
  }
}
