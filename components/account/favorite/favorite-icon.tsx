import React, { Dispatch, FC, SetStateAction, useContext, useEffect, useState } from 'react';
import cx from 'classnames';

import { LoveSvg } from '../../svgs/Love.svg';
import styles from '../../products/product-item/product-item.module.scss';
import style from './favorite-icon.module.scss';
import { api } from '../../../api';
import { UserContext } from '../../context/user-context';
import { IGetLikeResponse } from '../../../interfaces/like';
import { SnackBarContext } from 'components/context/snackBar-context';
import { getLSLikedProduct, setLsLikedProduct } from 'services/local-storage-controller';

interface FavoriteIconProps {
  productId: number;
  likedProduct: [IGetLikeResponse[], Dispatch<SetStateAction<IGetLikeResponse[]>>];
}

const FavoriteIcon: FC<FavoriteIconProps> = ({ productId, likedProduct }) => {
  const { user } = useContext(UserContext);
  const [addNewLikeProduct, setAddNewLikeProduct] = useState(false);
  let findLikeProduct = likedProduct[0].find((likeId) => likeId.product.id === productId);
  const [isLike, setIsLike] = useState(Boolean(findLikeProduct));
  const { showSnackBar } = useContext(SnackBarContext);

  const addFavorite = async () => {
    setIsLike(!isLike);
    if (user) {
      const { data: newProducts } = await api.likes.addLikeProduct(productId);
      if (newProducts) {
        setLsLikedProduct(newProducts);
        likedProduct[1](newProducts);
        setIsLike(true);
        showSnackBar('Товар доданий до списку побажань', true);
        return;
      } else {
        const likedProduct = getLSLikedProduct() ? getLSLikedProduct() : [];
        setLsLikedProduct(likedProduct.filter(({ product }) => product.id !== productId));
        setIsLike(false);
        showSnackBar('Товар видаленний із списку побажань', false);
      }
      setAddNewLikeProduct(!addNewLikeProduct);
    }
  };

  useEffect(() => {
    setIsLike(Boolean(findLikeProduct));
  }, [findLikeProduct]);

  return (
    <>
      <button className={cx(styles.love_btn, style.love_btn)} onClick={addFavorite}>
        <LoveSvg
          className={style.love_icon}
          width={25}
          height={25}
          color={isLike ? styles.love_btn : '#fff'}
        />
      </button>
    </>
  );
};

export default FavoriteIcon;
