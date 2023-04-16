import React, { FC } from 'react';
import { AiOutlineShoppingCart, AiOutlineShopping } from 'react-icons/ai';
import classNames from 'classnames';

import styles from './product-btn.module.scss';
import { Spinner } from 'reactstrap';

interface ProductBtnProps {
  addProductInCart: () => void;
  loading?: boolean;
  text?: string;
  inCart?: boolean;
}

const ProductBtn: FC<ProductBtnProps> = ({ addProductInCart, loading, inCart = false }) => {
  return (
    <button
      className={classNames(styles.btn, {
        [styles.inCart]: inCart || loading,
      })}
      onClick={addProductInCart}
      disabled={loading}
    >
      {!inCart ? (
        <>
          {loading ? (
            <Spinner type="grow" color="success" />
          ) : (
            <>
              <AiOutlineShoppingCart size={22} /> Купити
            </>
          )}
        </>
      ) : (
        <>
          <AiOutlineShopping size={22} /> В&nbsp;кошику
        </>
      )}
    </button>
  );
};

export default ProductBtn;
