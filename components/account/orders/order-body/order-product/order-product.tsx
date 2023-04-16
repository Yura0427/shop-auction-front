import React, { FC, useEffect, useState } from 'react';
import parse from 'html-react-parser';

import apiUrl from 'api/config';
import { IProductToOrder } from 'interfaces/order';
import styles from './order-product.module.scss';
import Route from '../../../../route/Route';
import { getColorsPictures } from '../../../../../utils/get-colors-pictures';
import { IColororsPictures } from '../../../../../interfaces/colorsPictures.interface';
import { getColorPictureUrl } from '../../../../../utils/get-color-picture-url';

interface OrderProductProps {
  item: IProductToOrder;
}

const OrderProduct: FC<OrderProductProps> = ({ item }) => {
  const [currentColors, setCurrentColors] = useState<IColororsPictures[]>([]);

  useEffect(() => {
    if (item.color) {
      let isLoaded = true;
      getColorsPictures({
        colorsNames: [item.color],
      }).then((data) => {
        if (isLoaded) {
          setCurrentColors(data);
        }
      });
      return () => {
        isLoaded = false;
      };
    }
  }, []);

  return (
    <div className={styles.product} key={item.id}>
      <div className={styles['product-img-title']}>
        <img
          src={
            item?.product?.mainImg
              ? `${apiUrl}/static/uploads/${item?.product?.mainImg?.name}`
              : `${apiUrl}/static/uploads/empty-preview.png`
          }
          className={styles['product-img']}
        />
        <Route href={`${item.product.url}/${item.product.key}`} linkClass={styles['product-name']}>
          <span className={styles['product-text']}>{parse(item.product.name)}</span>
          {item.size && <span className={styles['product-size']}>{item.size}</span>}
          {currentColors && item.color && item.color!=="common" && (
            <span
              style={{
                background: getColorPictureUrl(
                  item.color,
                  currentColors
                ),
              }}
              className={styles['product-color']}
            />
          )}
        </Route>
      </div>

      <div className={styles['order-info']}>
        <div className={styles['info-block']}>
          <span className={styles['small-text']}>Ціна</span>
          <span className={styles['info-text']}>{item.amount / item.quantity} грн.</span>
        </div>
        <div className={styles['info-block']}>
          <span className={styles['small-text']}>Кількість</span>
          <span className={styles['info-text']}>{item.quantity}</span>
        </div>
        <div className={styles['info-block']}>
          <span className={styles['small-text']}>Сума</span>
          <span className={styles['info-text']}>{item.amount} грн.</span>
        </div>
      </div>
    </div>
  );
};

export default OrderProduct;
