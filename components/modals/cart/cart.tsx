import React, { FC, useContext, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Button, Modal } from 'reactstrap';
import cx from 'classnames';
import { IoMdClose } from 'react-icons/io';
import { Scrollbars } from 'react-custom-scrollbars';

import { api } from '../../../api';
import { UserContext } from '../../context/user-context';
import { UtilsContext } from '../../context/utils-context';
import ProductInCartItem from '@modals/cart/products-in-cart-item/product-in-cart-item';
import { UseProductsInCart } from '../../../hooks/cart/useProductsInCart';
import { clearLsCart, getLSCart } from '../../../services/local-storage-controller';

import style from './cart.module.scss';

interface ICart {
  isOpen: boolean;
}

const CartModal: FC<ICart> = ({ isOpen }) => {
  const { user } = useContext(UserContext);
  const { setCartOpen } = useContext(UtilsContext);
  const router = useRouter();

  const { productsInCart, mutate, data: order, isLoading } = UseProductsInCart();

  useEffect(() => {
    if (user) mutate();
  }, [user]);

  const closeCartModal = () => {
    setCartOpen(false);
    if (user) mutate();
    if (router.pathname === '/delivery' && !productsInCart?.length && user) {
      localStorage.removeItem('deliveryValues');
      router.push('/');
    }
  };

  const createDelivery = async () => {
    setCartOpen(false);
    await router.push('/delivery');
  };

  useEffect(() => {
    if (order?.liqpayPaymentStatus === 'success' && isOpen && user) {
      setCartOpen(false);
      router.push('/delivery');
    }
  }, [isOpen]);

  const setLocalDataToSWR = async () => {
    const cartStorage = getLSCart();

    if (cartStorage) {
      await mutate({ ...order!, productToOrder: cartStorage }, false);
      return;
    }

    if (!user) await mutate({ ...order!, productToOrder: [] }, false);
  };

  useEffect(() => {
    setLocalDataToSWR();
  }, [user]);

  const productsInCartData = productsInCart?.length
    ? productsInCart?.map((productInCart, i) => (
        <ProductInCartItem key={i} orderProduct={productInCart} />
      ))
    : null;

  const totalSum = productsInCart?.reduce(
    (result, cartItem) =>
      result + cartItem.quantity * (cartItem.product.discountedPrice || cartItem.product.price),
    0
  );

  const emptyCart = async () => {
    if (user) {
      await api.productsInCart.emptyCart();
    }

    clearLsCart();
    await mutate({ ...order!, productToOrder: [] }, false);

    if (user && !isLoading && !order) {
      localStorage.removeItem('deliveryValues');
      router.push('/');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      toggle={closeCartModal}
      centered={true}
      modalClassName={style.modal}
      className={style.modalCart}
      contentClassName={style.modalBorder}
    >
      <div className={style.modalCartHeader}>
        {productsInCart?.length ? (
          <div className={style.modalCartHeader__name}>
            <div>
              <h1 className={style.positionHeaderLeft}>Корзина товарів</h1>
              <div onClick={emptyCart} className={style.clearButton}>
                <span className={style.clearCart}></span>
                Очистити корзину
              </div>
            </div>
          </div>
        ) : (
          <div className={cx(style.modalCartHeader__name, style.emptyBucket)}>
            <h1 className={style.positionHeaderCenter}>В Корзині немає товарів</h1>
            <div>
              <Button onClick={closeCartModal} className={style.cartButton}>
                Продовжити покупки
              </Button>
            </div>
          </div>
        )}
      </div>
      {productsInCartData ? (
        <div className={style.modalFooterContainer}>
          <div className={style.cartBlockPrice}>
            <div className={style.cartBlockPrice__left}>
              <Button onClick={closeCartModal} className={style.cartButton}>
                Продовжити покупки
              </Button>
            </div>
            <div className={style.cartPrice}>
              <Button onClick={createDelivery} className={`${style.cartButton} ${style.buyBtn}`}>
                {productsInCart?.length ? (
                  <b className={style.cartPriceTitle}>{totalSum} грн.</b>
                ) : null}
                Перейти до оплати
              </Button>
            </div>
          </div>
        </div>
      ) : null}
      <div className={style.content}>
        <Button className={style.close} onClick={closeCartModal}>
          <IoMdClose size={25} color={style.fontColor} />
        </Button>
        <Scrollbars className={style.wrapper} style={{ height: productsInCartData ? 700 : 100 }}>
          <div className={style.productsBox}>{productsInCartData}</div>
        </Scrollbars>
      </div>
    </Modal>
  );
};
export default CartModal;
