import React, { FC, useContext, useEffect, useMemo, useState } from 'react';
import Router from 'next/router';
import { useRouter } from 'next/router';
import { Spinner } from 'reactstrap';

import MainLayout from '../../components/layout/MainLayout';
import { PageContainer } from '@containers/page-container';
import { IBreadcrumbsData } from '../../interfaces/breadcrumbsData';
import { UserContext } from '../../components/context/user-context';
import { useOrder } from '../../hooks/useOrder';
import { IOrder } from '../../interfaces/order';
import { Status } from '../../enums/order';
import OrderHeader from '../../components/account/orders/order-header/order-header';
import OrderBody from './order-body/order-body';
import ReviewAuth from '../../components/products/products-tabs/review-tab/review-auth/review-auth';
import { useCategories } from '../../hooks/useCategories';

import styles from './order-without-auth.module.scss';

const OrderPage: FC = () => {
  const { user } = useContext(UserContext);
  const { allCategories } = useCategories();
  const router = useRouter();

  const [order, setOrder] = useState<IOrder>();
  const [orderError, setOrderError] = useState<boolean>(false);

  const queryId = useMemo(() => router.query.id && Number(router.query.id), [router.query.id]);

  const orderHookRes = queryId !== '' && useOrder(queryId);
  if (!orderHookRes) return null;

  const { data: orderData, error } = orderHookRes;

  useEffect(() => {
    if (orderData !== undefined) {
      setOrder(orderData);
      setOrderError(error);
    }
  }, [orderData]);

  const [expandedOrders, setExpandedOrders] = useState<number[]>([]);

  const toggle = (orderId: number) => {
    expandedOrders.includes(orderId)
      ? setExpandedOrders(expandedOrders.filter((order) => order !== orderId))
      : setExpandedOrders(expandedOrders.concat(orderId));
  };

  const breadcrumbsData: IBreadcrumbsData = {
    isBreadcrumbsShown: true,
    breadcrumbs: [],
  };

  const metaData = {
    title: 'Мої замовлення',
    description: 'Останнє замовлення',
    addBrand: true,
  };

  if (user) {
    Router.push('/account/orders');
    return (
      <MainLayout metaData={metaData}>
        <PageContainer categories={allCategories!} breadcrumbsData={breadcrumbsData}>
          <div className={styles['spinner']}>
            <Spinner />
          </div>
        </PageContainer>
      </MainLayout>
    );
  } else
    return (
      <MainLayout metaData={metaData}>
        <PageContainer categories={allCategories!} breadcrumbsData={breadcrumbsData}>
          <h2 className={styles['orders-title']}>Мої замовлення</h2>
          {orderError ? (
            <>
              <div className={styles['error-msg']}>
                <p>Такого замовлення не їснує </p>
              </div>
            </>
          ) : order ? (
            <>
              <div
                className={
                  order.status === Status.CANCELLED
                    ? styles['cancelled-order']
                    : styles['order-item']
                }
              >
                <OrderHeader order={order} expandedOrders={expandedOrders} toggle={toggle} />
                <OrderBody order={order} expandedOrders={expandedOrders} />
              </div>
              <div className={styles['review-auth']}>
                <ReviewAuth
                  beginningOfPhrase={'Щоб переглянути повну інформацію по замовленню '}
                  endOfPhrase={'.'}
                />
              </div>
            </>
          ) : null}
        </PageContainer>
      </MainLayout>
    );
};

export default OrderPage;
