import React, { FC } from 'react';
import { Card, CardBody, Collapse } from 'reactstrap';

import { IOrder } from 'interfaces/order';
import OrderProduct from 'components/account/orders/order-body/order-product/order-product';

import styles from './order-body.module.scss';

interface OrderBodyProps {
  order: IOrder;
  expandedOrders: number[];
}

const OrderBody: FC<OrderBodyProps> = ({ order, expandedOrders }) => {
  return (
    <>
      {order ? (
        <Collapse
          isOpen={!!(order.id && expandedOrders.includes(order.id))}
          className={styles['collapse-body']}
        >
          <Card>
            <CardBody className={styles['body-wrapper']}>
              <div className={styles['user-block']}>
                <p className={styles.title}>Інформація про замовлення</p>
                <div className={styles['user-order-info']}>
                  <p>Адреса поштового відділення:</p>
                  <p className={styles.bold}>{order?.delivery?.cityFullName}</p>
                  <p className={styles.bold}>{order?.delivery?.streetName}</p>
                  <p>Спосіб доставки:</p>
                  <p className={styles.bold}>{order?.delivery?.deliveryMethod}</p>
                  {order.delivery.courierDeliveryAddress && (
                    <p className={styles.bold}>{order?.delivery?.courierDeliveryAddress}</p>
                  )}
                  {order.comment && (
                    <div>
                      <p>Коментар до замовлення:</p>
                      <span className={styles.bold}>{order.comment}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className={styles['products-block']}>
                <p className={styles.title}>Товари</p>
                {order.productToOrder.map((item) => (
                  <OrderProduct item={item} key={item.id} />
                ))}
              </div>
            </CardBody>
          </Card>
        </Collapse>
      ) : null}
    </>
  );
};

export default OrderBody;
