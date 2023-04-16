import { IProductsData } from '../../interfaces/product/products';
import { IAction } from '../../interfaces/action';
import { GET_PRODUCTS } from '../types/products.type';

export const initialState: IProductsData = {
  products: []
};

export const productsReducer = (state = initialState, action: IAction): IProductsData => {
  switch (action.type) {
    case GET_PRODUCTS:
      return { ...state, products: action.payload };
    default:
      return state;
  }
}
