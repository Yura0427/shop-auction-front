import React from 'react';

import Image from 'next/image';

import apiUrl from 'api/config';
import { IProductToOrder } from 'interfaces/order';
import styles from './order-header.module.scss';

export const renderImages = (items: IProductToOrder[]) => {
  if (!items) return null;

  if (items.length <= 4) {
    return items.map((item) =>
      item.product.mainImg ? (
        <Image
          src={
            !item.product.mainImg
              ? `${apiUrl}/static/uploads/empty-preview.png`
              : `${apiUrl}/static/uploads/${item.product.mainImg.name}`
          }
          className={item.product.mainImg ? styles['product-img'] : styles['empty']}
          key={item?.product?.mainImg?.name}
          width={70}
          height={70}
        />
      ) : null
    );
  } else {
    const firstImages = items.slice(0, 3);
    const itemsLeft = items.length - firstImages.length;

    return (
      <>
        {firstImages.map((item) =>
          item?.product?.mainImg?.name ? (
            <Image
              src={`${apiUrl}/static/uploads/${item.product.mainImg.name}`}
              className={styles['product-img']}
              key={item?.product?.mainImg?.name}
              height={70}
              width={70}
            />
          ) : null
        )}
        <span className={styles['images-more']}>+{itemsLeft}</span>
      </>
    );
  }
};
