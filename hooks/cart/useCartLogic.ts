import React, { useState } from 'react';

import { api } from '../../api';
import { IUser } from '../../interfaces/user/userData';
import { IProduct } from '../../interfaces/product/products';
import { IOrder } from './useProductsInCart';
import {
  getLSCart,
  getSelectedProduct,
  removeSelectedProduct,
  setLsCart,
} from '../../services/local-storage-controller';
import { IAddProductInCart } from '../../interfaces/product/products-in-cart';
import { SelectActionType } from '../../enums/selectActionType';

interface ICurrentParameters {
  isCurrentColor: string;
  isCurrentSize: string;
}

export const useCartLogic = (
  product: IProduct,
  user: IUser | null,
  mutate: any,
  order: IOrder,
  disabledButtonBuy?: React.Dispatch<React.SetStateAction<boolean>>
) => {
  const addProductInCart = async (currentParameters: ICurrentParameters) => {
    // const size = getSelectedProduct(SelectActionType.size);
    // const color = getSelectedProduct(SelectActionType.color);

    const selected: { size?: string; color?: string } = {};

    if (currentParameters?.isCurrentSize) {
      selected.size = currentParameters.isCurrentSize;
    }

    if (currentParameters?.isCurrentColor) {
      selected.color = currentParameters.isCurrentColor;
    }

    // if (size?.selected?.length) {
    //   const findProduct = size.selected.find((item) => item.id === product.id);

    //   if (findProduct) {
    //     selected.size = findProduct!.value;
    //     // removeSelectedProduct(SelectActionType.size, product.id);
    //   }
    // }

    // if (color?.selected?.length) {
    //   const findProduct = color.selected.find((item) => item.id === product.id);

    //   if (findProduct) {
    //     selected.color = findProduct!.value;
    //     // removeSelectedProduct(SelectActionType.color, product.id);
    //   }
    // }
    console.log('size', selected.size);
    console.log('color', selected.color);

    if (!user) {
      if (!getLSCart()) {
        setLsCart([]);
      }

      const storageProduct = {
        quantity: 1,
        ...selected,
        product: {
          ...product,
          ...selected,
        },
        amount: product.discountedPrice || product.price,
      };

      const localStorageCartData = getLSCart();
      const findProductIndex = localStorageCartData.findIndex(
        (item: IAddProductInCart) =>
          item.product.id === storageProduct.product.id &&
          item.product?.size === storageProduct.product?.size &&
          item.product?.color === storageProduct.product?.color
      );

      findProductIndex !== -1
        ? (localStorageCartData[findProductIndex].quantity += 1)
        : localStorageCartData.push(storageProduct);

      setLsCart(localStorageCartData);
      await mutate({ ...order!, productToOrder: localStorageCartData }, false);
    } else {
      if (disabledButtonBuy) disabledButtonBuy(true);
      const { data } = await api.productsInCart.addProductsInCart(
        { id: product.id, ...selected },
        null
      );

      if (data) {
        if (disabledButtonBuy) disabledButtonBuy(false);
      }

      console.log('logged', data?.productToOrder);
      await mutate({ ...order!, productToOrder: data?.productToOrder }, false);
    }
  };

  return {
    addProductInCart,
  };
};
