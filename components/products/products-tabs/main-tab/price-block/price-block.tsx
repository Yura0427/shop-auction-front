import React, { FC, useContext, useEffect, useState } from 'react';
import { AiOutlineCheck } from 'react-icons/ai';
import { MdRemoveShoppingCart } from 'react-icons/md';
import classNames from 'classnames';

import { IProduct } from '../../../../../interfaces/product/products';
import styles from './price-block.module.scss';
import ProductBtn from '../../../product-item/product-btn';
import FavoriteIcon from '../../../../account/favorite/favorite-icon';
import { UserContext } from '../../../../context/user-context';
import { UseProductsInCart } from '../../../../../hooks/cart/useProductsInCart';
import { useCartLogic } from '../../../../../hooks/cart/useCartLogic';
import { UtilsContext } from '../../../../context/utils-context';
import { useProductLike } from 'hooks/products/useProductLike';
import OpenOrderModal from '@modals/openOrder/OpenOrderModal';
import { SnackBarContext } from '../../../../context/snackBar-context';
import { SizeContext } from '../../../../context/sizes-context';

interface PriceBlockProps {
  relatedProduct: IProduct;
  compact?: boolean;
  customClass?: string;
  isCurrentColor?: string;
  isCurrentSize?: string;
}

const PriceBlock: FC<PriceBlockProps> = ({ relatedProduct, compact = false, customClass }) => {
  const { user } = useContext(UserContext);
  const { setCartOpen } = useContext(UtilsContext);
  const { availability } = relatedProduct;
  const [confirmedModal, setConfirmedModal] = useState(false);
  const toggleConfirmed = () => setConfirmedModal(!confirmedModal);
  const { isCurrentColor, isCurrentSize } = useContext(SizeContext);

  const { mutate, productsInCart, data: order } = UseProductsInCart();

  const [buttonBuy, disabledButtonBuy] = useState(false);
  const [loading, setLoading] = useState(false);
  const { showSnackBar } = useContext(SnackBarContext);

  const { addProductInCart } = useCartLogic(relatedProduct, user, mutate, order!, setLoading);

  const addProduct = () => {
    if (order?.liqpayPaymentStatus === 'success' && user) {
      setConfirmedModal(!confirmedModal);
    } else {
      showSnackBar('Товар доданий до корзини', true);
      addProductInCart({ isCurrentColor, isCurrentSize });
    }
  };

  useEffect(() => {
    if (!isCurrentColor && !isCurrentSize) {
      const findProductInCart = productsInCart?.find(
        (product) => product.product.id === relatedProduct.id
      );
      findProductInCart ? disabledButtonBuy(true) : disabledButtonBuy(false);
    }

    if (isCurrentColor && isCurrentSize) {
      const findProductInCart = productsInCart?.find(
        (product) =>
          product.product.id === relatedProduct.id &&
          product.color === isCurrentColor &&
          product.size === isCurrentSize
      );
      findProductInCart ? disabledButtonBuy(true) : disabledButtonBuy(false);
    }

    if (!isCurrentColor && isCurrentSize) {
      const findProductInCart = productsInCart?.find(
        (product) => product.product.id === relatedProduct.id && product.size === isCurrentSize
      );
      findProductInCart ? disabledButtonBuy(true) : disabledButtonBuy(false);
    }

    if (isCurrentColor && !isCurrentSize) {
      const findProductInCart = productsInCart?.find(
        (product) => product.product.id === relatedProduct.id && product.color === isCurrentColor
      );
      findProductInCart ? disabledButtonBuy(true) : disabledButtonBuy(false);
    }
  }, [productsInCart, isCurrentColor, isCurrentSize]);

  const openCartModal = () => setCartOpen(true);
  const likedProduct = useProductLike(undefined, relatedProduct.id);

  return (
    <div
      className={classNames(styles.wrapper, customClass, {
        [styles.compact]: compact,
      })}
    >
      <OpenOrderModal confirmedModal={confirmedModal} toggleConfirmed={toggleConfirmed} />
      <div
        className={classNames(styles.priceBlock, {
          [styles.notAvailable]: !availability,
        })}
      >
        {relatedProduct.discountedPrice ? (
          <div>
            <p className={styles.oldPrice}>{relatedProduct.price} грн</p>
            <p className={styles.discountedPrice}>{relatedProduct.discountedPrice} грн</p>
          </div>
        ) : (
          <span className={styles.price}>{relatedProduct.price} грн</span>
        )}

        <span className={styles.availability}>
          {availability ? (
            <>
              <AiOutlineCheck size={14} /> в наявності
            </>
          ) : (
            <>
              <MdRemoveShoppingCart size={14} />
              немає в наявності
            </>
          )}
        </span>
      </div>

      {availability ? (
        <>
          <ProductBtn
            addProductInCart={buttonBuy ? openCartModal : addProduct}
            inCart={buttonBuy}
            loading={loading}
          />
          {user && !compact ? (
            <div className={styles.like}>
              <FavoriteIcon productId={relatedProduct.id} likedProduct={likedProduct} />
            </div>
          ) : null}
        </>
      ) : null}
    </div>
  );
};

export default PriceBlock;
