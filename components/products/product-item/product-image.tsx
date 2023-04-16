import React, { FC } from 'react';

import styles from './product-image.module.scss';
import Image from 'next/image';
import apiUrl from '../../../api/config';
import { IProduct } from '../../../interfaces/product/products';

interface ImageProps {
  relatedProduct: IProduct;
  isTitleShown: boolean;
}

const myLoader = ({ src, width, quality, height }) => {
  return `${apiUrl}/static/uploads/${src}?w=${width}&q=${quality || 95}`
}

const ProductImage: FC<ImageProps> = ({ relatedProduct, isTitleShown }) => {
  // const previewImg = relatedProduct.mainImg
  //   ? `${apiUrl}/static/uploads/${relatedProduct.mainImg.name}`
  //   : `${apiUrl}/static/uploads/empty-preview.png`;
  const previewImg = relatedProduct.mainImg
    ? relatedProduct.mainImg.name
    : 'empty-preview.png';


  const alt = !relatedProduct.mainImg
    ? `Фото товару ${relatedProduct.name} відсутнє`
    : `Фото товару ${relatedProduct.name}`;

  return (
    <div className={relatedProduct.mainImg ? styles.img : styles.img + ' ' + styles.empty}>
      <Image
        loader={myLoader}
        src={previewImg}
        alt={alt}
        width={!relatedProduct.mainImg ? 97 : 250}
        height={!relatedProduct.mainImg ? 74 : 220}
        quality={100}
      />
      {isTitleShown && !relatedProduct.mainImg ? (
        <span className={styles.info}>Вибачте фото цього товару тимчасово відсутнє</span>
      ) : null}
    </div>
  );
};

export default ProductImage;
