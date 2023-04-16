import React, { FC, useContext, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import { Button, Spinner } from 'reactstrap';

import { useOrders } from 'hooks/useOrders';
import { api } from 'api';
import ConfirmDelete from '@modals/confirm-delete/confirm-delete';
import OrderHeader from './order-header/order-header';
import OrderBody from './order-body/order-body';
import PaginationBlock from '../../pagination/pagination-block';
import { EAccountUrls } from 'interfaces/account/account.enum';
import { LoadingContext } from 'components/context/loading-context';
import { Status } from 'enums/order';
import { IOrder } from 'interfaces/order';
import { UserContext } from 'components/context/user-context';
import styles from './orders.module.scss';

const Orders: FC = () => {
  const { isLoading, setLoading } = useContext(LoadingContext);
  const { user } = useContext(UserContext);

  const router = useRouter();

  const queryPage = useMemo(() => router.query.page && Number(router.query.page), [router.query.page]);

  const [currentPage, setCurrentPage] = useState<number>(queryPage || 1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [orders, setOrders] = useState<IOrder[]>();
  const [ordersError, setOrdersError] = useState<boolean>(false);

  const ordersHookRes = user?.id && useOrders(user.id, currentPage);
  if (!ordersHookRes) return null;

  const { data: ordersData, mutate, error } = ordersHookRes;

  useEffect(() => {
    if (ordersData) {
      setTotalPages(ordersData.totalPages);
      setOrders(ordersData.data);
      setOrdersError(error);
    }
  }, [ordersData]);

  useEffect(() => {
    queryPage && setCurrentPage(queryPage);
  }, [queryPage]);

  useEffect(() => {
    currentPage === 1
      ? router.push(`/account/${EAccountUrls.orders}`, undefined, { shallow: true })
      : router.push(`/account/${EAccountUrls.orders}?page=${currentPage}`, undefined, {
          shallow: true,
        });

    const getOrders = async () => {
      setLoading(true);
      const response = user && (await api.orders.getUserOrders(user.id, currentPage));
      if (!response) {
        setOrdersError(true);
        return;
      }

      const newData = response.data?.data ? response.data.data : [];
      ordersData && (await mutate({ ...ordersData, data: newData }, false));
      setLoading(false);
    };

    getOrders();

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }, [currentPage]);

  const resetError = () => {
    setCurrentPage(1);
    setOrdersError(false);
  };

  const [expandedOrders, setExpandedOrders] = useState<number[]>([]);

  const toggle = (orderId: number) => {
    expandedOrders.includes(orderId)
      ? setExpandedOrders(expandedOrders.filter((order) => order !== orderId))
      : setExpandedOrders(expandedOrders.concat(orderId));
  };

  const [cancelOrderModal, setCancelOrderModal] = useState<boolean>(false);
  const [orderToCancel, setOrderToCancel] = useState<number | null>(null);

  const onCancelClick = (orderId: number) => {
    setOrderToCancel(orderId);
    setCancelOrderModal(true);
  };

  const handleCancel = async () => {
    const response = orderToCancel && (await api.orders.cancelOrder(orderToCancel));
    if (!response) return;

    const updatedOrders = orders
      ? orders.map((order) => (order.id === orderToCancel ? { ...order, status: Status.CANCELLED } : order))
      : [];

    await mutate({ ...ordersData!, data: updatedOrders }, false);
  };

  useEffect(() => {
    !cancelOrderModal && setOrderToCancel(null);
  }, [cancelOrderModal]);

  return (
    <div className={styles['orders-page']}>
      {cancelOrderModal && (
        <ConfirmDelete
          openModal={cancelOrderModal}
          toggle={() => setCancelOrderModal(!cancelOrderModal)}
          handleDelete={handleCancel}
          title="Скасувати замовлення"
          text="Ви впевнені, що хочете скасувати замовлення?"
          btnTitle="Скасувати"
        />
      )}

      <h2 className={styles['orders-title']}>Мої замовлення</h2>
      {ordersError ? (
        <>
          <div className={styles['error-msg']}>
            <p>Такої сторінки не існує. Перейти на </p>
            <Button color="link" onClick={resetError} className={styles['btn-link']}>
              першу сторінку
            </Button>
          </div>
        </>
      ) : orders?.length && totalPages ? (
        <>
          {isLoading ? (
            <span className={styles['spinner']}>
              <Spinner style={{ width: '5rem', height: '5rem' }} color="success" />
            </span>
          ) : (
            <div>
              {orders.map((order) => (
                <div
                  className={
                    order.status === Status.CANCELLED ? styles['cancelled-order'] : styles['order-item']
                  }
                  key={order.id}
                >
                  <OrderHeader order={order} expandedOrders={expandedOrders} toggle={toggle} />
                  <OrderBody order={order} expandedOrders={expandedOrders} onCancelClick={onCancelClick} />
                </div>
              ))}
              <PaginationBlock
                routerPush={null}
                totalPages={totalPages}
                currentPage={currentPage}
                setCurrentPage={setCurrentPage}
              />
            </div>
          )}
        </>
      ) : (
        <p style={{ fontSize: '1.1rem' }}>У Вас ще немає замовлень</p>
      )}
    </div>
  );
};

export default Orders;
