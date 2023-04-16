import { api } from '../../api';
import { clearLsCart, getLSCart } from '../../services/local-storage-controller';
import { IOrder } from './useProductsInCart';
import { SelectedProductInfo } from '../../interfaces/product/products-in-cart';

export const useCartReplace = async (mutate: any, data: IOrder) => {
  const cartStorage = getLSCart();

  const mappedCart = cartStorage.map((cartItem: any) => {
    const selected: SelectedProductInfo = {};
    if (cartItem.product.size) {
      selected.size = cartItem.product.size;
      delete cartItem.product.size;
    }

    if (cartItem.product.color) {
      selected.color = cartItem.product.color;
      delete cartItem.product.color;
    }

    return { ...cartItem, ...selected };
  });

  if (cartStorage.length) {
    const { data: newCart } = await api.productsInCart.addProductsInCart(null, mappedCart);
    clearLsCart();
    await mutate({ ...data!, productToOrder: newCart.productToOrder }, false);
  }
};
