import React, { FC } from 'react';
import style from './cart.module.scss';
import { UseProductsInCart } from '../../../hooks/cart/useProductsInCart';
import { declension } from '../../../utils/wordDeclension';

export const CartHeaderIcon: FC = () => {
  const { productsInCart } = UseProductsInCart();

  const totalSum = productsInCart?.reduce(
    (result, cartItem) =>
      result + cartItem.quantity * (cartItem.product.discountedPrice || cartItem.product.price),
    0
  );
  const totalQantity = productsInCart?.reduce((result, cartItem) => result + cartItem.quantity, 0);

  return (
    <>
      {productsInCart?.length ? (
        <span className={style.header__iconProductCart}>
          <div>
            <div>{totalQantity && declension(totalQantity, ['товар', 'товара', 'товарів'])}</div>
            <div>{totalSum} грн.</div>
          </div>
        </span>
      ) : null}
    </>
  );
};
