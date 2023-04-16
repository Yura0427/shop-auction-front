import { IProduct } from '../../interfaces/product/products';
import { GET_PRODUCTS } from '../types/products.type';
import { IAction } from '../../interfaces/action';

export const loadProducts = (products: IProduct[]): IAction => {
  return {
    type: GET_PRODUCTS,
    payload: products
  }
}
