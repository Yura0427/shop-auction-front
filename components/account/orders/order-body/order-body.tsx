import React, { FC, useContext } from 'react';
import { Button, Card, CardBody, Collapse } from 'reactstrap';

import { PaymentMethods, Status } from 'enums/order';
import { IOrder } from 'interfaces/order';
import OrderProduct from './order-product/order-product';
import { UserContext } from 'components/context/user-context';
import styles from './order-body.module.scss';

interface OrderBodyProps {
  order: IOrder;
  expandedOrders: number[];
  onCancelClick: (id: number) => void;
}

const OrderBody: FC<OrderBodyProps> = ({ order, expandedOrders, onCancelClick }) => {
  const { user } = useContext(UserContext);

  const parcelNumberArray = order?.productToOrder.reduce((acc: string[], { parcelNumber }) => {
    if (parcelNumber && parcelNumber !== '0' && !acc.includes(parcelNumber)) {
      acc.push(parcelNumber);
    }
    return acc;
  }, []);

  const preparedForRenderParcelNumber =
    parcelNumberArray.length !== 0 ? parcelNumberArray.join('; ') : "Скоро з'явиться";

  return (
    <>
      {order && user ? (
        <Collapse
          isOpen={!!(order.id && expandedOrders.includes(order.id))}
          className={styles['collapse-body']}
        >
          <Card>
            <CardBody className={styles['body-wrapper']}>
              <div className={styles['user-block']}>
                <p className={styles.title}>Інформація про замовлення</p>
                <div className={styles['user-order-info']}>
                  <p className={styles.bold}>{`${order.additionalFirstName || user.firstName} ${
                    order.additionalLastName || user.lastName
                  }`}</p>
                  <p className={styles.bold}>
                    <a href={`mailto:${order.additionalEmail || user.email}`}>
                      {order.additionalEmail || user.email}
                    </a>
                  </p>

                  <p className={styles.bold}>
                    <a href={`tel:${order.additionalNumber || user.phoneNumber}`}>
                      {order.additionalNumber || user.phoneNumber}
                    </a>
                  </p>
                  <p>Адреса поштового відділення:</p>
                  <p className={styles.bold}>{order?.delivery?.cityFullName}</p>
                  <p className={styles.bold}>{order?.delivery?.streetName}</p>
                  <p>Спосіб доставки:</p>
                  <p className={styles.bold}>{order?.delivery?.deliveryMethod}</p>
                  <div>
                    <p>Номер ТТН:</p>
                    <p className={styles.bold}>{preparedForRenderParcelNumber}</p>
                  </div>

                  {order.delivery?.courierDeliveryAddress && (
                    <div>
                      <p>Адреса для кур'єрської доставки:</p>
                      <p className={styles.bold}>{order?.delivery?.courierDeliveryAddress}</p>
                    </div>
                  )}
                  <p>Спосіб оплати:</p>
                  <p className={styles.bold}>
                    {order.liqpayOrderId ? `${PaymentMethods.liqPay}` : `${PaymentMethods.postPay}`}
                  </p>
                  {order.comment && (
                    <div>
                      <p>Коментар до замовлення:</p>
                      <span className={styles.bold}>{order.comment}</span>
                    </div>
                  )}
                  <div>
                    <span className={styles.bold}>{`${
                      order.notcall ? 'Не передзвонювати' : ''
                    }`}</span>
                  </div>
                </div>
              </div>

              <div className={styles['products-block']}>
                <p className={styles.title}>Товари</p>
                {order.productToOrder.map((item) => (
                  <OrderProduct item={item} key={item.id} />
                ))}

                {order.status === Status.PENDING ? (
                  <Button color="primary" onClick={() => order.id && onCancelClick(order.id)}>
                    Скасувати
                  </Button>
                ) : null}
              </div>
            </CardBody>
          </Card>
        </Collapse>
      ) : null}
    </>
  );
};

export default OrderBody;
