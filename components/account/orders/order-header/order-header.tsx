import React, { FC } from 'react';
import { Card } from 'reactstrap';
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io';
import cx from 'classnames';

import { IOrder } from 'interfaces/order';
import { formatOrderStatus } from '../format-order-status';
import { renderImages } from './renderImages';
import styles from './order-header.module.scss';

interface OrderHeaderProps {
  order: IOrder;
  expandedOrders: number[];
  toggle: (id: number) => void;
}

const OrderHeader: FC<OrderHeaderProps> = ({ order, expandedOrders, toggle }) => {
  return (
    <Card
      onClick={() => order.id && toggle(order.id)}
      className={styles['collapse-header-wrapper']}
    >
      <div className={styles['collapse-header']}>
        <div className={styles['status-header']}>
          <div className={styles.status}>
            <p className={styles['small-text']}>
              <span>№ {order.id}</span>
              <span> від </span>
              <span>{order.updatedAt && new Date(order.updatedAt).toLocaleDateString()}</span>
            </p>
            <p className={cx({ [styles.order_cancelled]: order.status === 'cancelled' })}>
              {order.status === 'pending'
                ? order.notcall
                  ? formatOrderStatus('pendingnotcall')
                  : formatOrderStatus(order.status)
                : formatOrderStatus(order.status)}
            </p>
          </div>
        </div>
        <div className={styles['order-amount']}>
          <p className={styles['small-text']}>Сума замовлення</p>
          <p>{order.amount} грн.</p>
          {order && (
            <p
              className={
                order.paymentStatus ? styles['payment-status-ok'] : styles['payment-status-wait']
              }
            >
              {order.paymentStatus ? 'Оплачено' : 'Очікує оплати'}
            </p>
          )}
        </div>
        <div className={styles['img-block']}>{renderImages(order.productToOrder)}</div>
      </div>

      <div className={styles['expand-btn']}>
        {order.id && expandedOrders.includes(order.id) ? <IoIosArrowUp /> : <IoIosArrowDown />}
      </div>
    </Card>
  );
};

export default OrderHeader;
