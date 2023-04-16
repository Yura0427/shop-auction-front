import React, { useContext, useEffect, useState } from 'react';
import {
  getLSCart,
  getSelectedProduct,
  removeSelectedProduct,
  setLsCart,
  setSelectedProduct,
} from '../../services/local-storage-controller';
import { api } from '../../api';

import { UserContext } from '../../components/context/user-context';
import { UseProductsInCart } from '../cart/useProductsInCart';
import { SelectActionType } from '../../enums/selectActionType';
import { CharacteristicTypes } from '../../interfaces/product/characteristicType.enum';
import { ICharacteristicValue } from '../../interfaces/product/characteristicValue';
import { SizeContext } from '../../components/context/sizes-context';

interface ColorSizeHookResult {
  init: boolean;
  onChangeHandler: ((e: React.ChangeEvent<HTMLInputElement> | any) => Promise<void> | void) | null;
  selectState: { selected: string | null } | null;
  existChar: ICharacteristicValue | null;
}

export const useColorSize = (
  action: keyof typeof SelectActionType,
  characteristicsValue: ICharacteristicValue[] | undefined,
  productId: number
): ColorSizeHookResult => {
  let init = true;
  const existChar = characteristicsValue?.length
    ? characteristicsValue.find((item) => !!item.jsonValue)
    : null;

  if (existChar?.type !== CharacteristicTypes.JSON) {
    init = false;
    return { init, onChangeHandler: null, existChar: null, selectState: null };
  }

  const { isCurrentColor, isCurrentSize } = useContext(SizeContext);

  const [selectState, setSelectState] = useState<ColorSizeHookResult['selectState']>({
    selected: null,
  });
  const { user } = useContext(UserContext);
  const { mutate, productsInCart, data: order } = UseProductsInCart();
  const findProductInCart = productsInCart?.find(
    (pr) =>
      pr.product.id === productId &&
      pr.color === isCurrentColor &&
      isCurrentSize &&
      pr.size == isCurrentSize
  );

  const onChangeHandler = async (e: React.ChangeEvent<HTMLInputElement> | any) => {
    const value = e.target ? e.target.value : e.value;

    setSelectedProduct(action, {
      selected: { id: productId, value },
    });

    setSelectState({ selected: value });

    // if (!findProductInCart) {
    // setSelectedProduct(action, {
    //   selected: { id: productId, value },
    // });
    // }

    // if (findProductInCart) {
    //   setSelectedProduct(action, {
    //     selected: { id: productId, value },
    //   });

    // const productsInCart = [...order!.productToOrder];
    // const findItemIndex = productsInCart.findIndex(({ product }) => product.id === productId);

    // if (!user) {
    //   productsInCart[findItemIndex].product[action] = value;
    //   await mutate({ ...order!, productToOrder: productsInCart }, false);

    //   const cartLS = getLSCart();
    //   const findInCart = cartLS.findIndex(({ product }: any) => product.id === productId);
    //   cartLS[findInCart!].product[action] = value;
    //   setLsCart(cartLS);
    // }

    // if (user) {
    //   productsInCart[findItemIndex][action] = value;
    //   await mutate({ ...order!, productToOrder: productsInCart }, false);
    //   await api.productsInCart.updateProductFromCart(productId, { [action]: value });
    // }
    // }
  };

  useEffect(() => {
    let chosenItem = '';

    const lsData = getSelectedProduct(action);

    const findInLS = lsData && lsData.selected.find((item) => item.id === productId);

    if (findProductInCart) {
      chosenItem = user ? findProductInCart[action]! : findProductInCart.product[action]!;
      // findInLS && removeSelectedProduct(action, productId);
    }

    if (!findProductInCart) {
      let firstValue = [];
      if (action === 'color') {
        firstValue = Object.keys(existChar.jsonValue!);
      }

      if (action === 'size') {
        firstValue = Object.values(existChar.jsonValue!).length
          ? Object.values(existChar.jsonValue!)[0]
          : undefined;
      }
      chosenItem = findInLS ? findInLS.value : firstValue ? firstValue[0] : undefined;

      setSelectedProduct(action, {
        selected: {
          id: productId,
          value: findInLS ? findInLS.value : firstValue ? firstValue[0] : undefined,
        },
      });
    }

    setSelectState({ selected: chosenItem! });
  }, [productsInCart, productId]);

  return {
    init,
    onChangeHandler,
    selectState,
    existChar,
  };
};
