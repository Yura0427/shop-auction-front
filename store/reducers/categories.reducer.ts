import { IAction } from '../../interfaces/action';
import { ICategoryData } from '../../interfaces/category/category';
import { GET_CATEGORIES } from '../types/categories.type';

export const initialState: ICategoryData = {
  categories: [],
};

export const categoriesReducer = (state = initialState, action: IAction): ICategoryData => {
  switch (action.type) {
    case GET_CATEGORIES:
      return { ...state, categories: action.payload };
    default:
      return state;
  }
};
