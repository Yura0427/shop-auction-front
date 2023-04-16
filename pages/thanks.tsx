import React, { FC, useContext, useEffect, useState } from 'react';
import { PageContainer } from '@containers/page-container';
import { Button } from 'reactstrap';
import { useRouter } from 'next/router';

import { IPageProps } from '../interfaces/page';
import { useCategories } from '../hooks/useCategories';
import MainLayout from '../components/layout/MainLayout';
import { IBreadcrumbsData } from '../interfaces/breadcrumbsData';
import { CartThanksSvg } from '../components/svgs/CartThanks.svg';
import { CartMiniThanksSvg } from '../components/svgs/CartMiniThanks.svg';
import { CartArrowThanksSvg } from '../components/svgs/CartArrowThanks.svg';
import style from './thanks.module.scss';
import { UserContext } from '../components/context/user-context';
import { IOrderDataAnalictics, IOrderProduct } from '../interfaces/ecomerceData.interface';
import { api } from '../api';

const TanksPage: FC<IPageProps> = ({ categories }) => {
  const deliveryValuesLS = typeof window !== 'undefined' && localStorage.getItem('deliveryValues');
  const { allCategories } = useCategories(categories);
  const router = useRouter();
  const { user } = useContext(UserContext);
  const [ecomerceData, setEcomerceData] = useState<IOrderDataAnalictics | null>(null);
  const [ordersData, setOrdersData] = useState<any>(null);

  const breadcrumbsData: IBreadcrumbsData = {
    isBreadcrumbsShown: false,
    breadcrumbs: [],
  };

  const metaData = {
    title: 'Дякуємо за замовлення!',
    description: 'Замовлення успішно оформлене',
    addBrand: true,
  };

  useEffect(() => {
    deliveryValuesLS && localStorage.removeItem('deliveryValues');
  }, []);

  useEffect(() => {
    let isLoaded = true;
    if (user?.id && process.env.NEXT_PUBLIC_REACT_APP_FRONT_DOMAIN === 'buy-all.store')
      api.orders.getUserOrders(user.id, 1).then(({ data }) => {
        if (isLoaded) {
          setOrdersData(data.data[0]);
        }
      });
    return () => {
      isLoaded = false;
    };
  }, [user?.id]);

  useEffect(() => {
    if (ordersData?.liqpayPaymentStatus === 'success') {
      const orderDataAnalictics = {
        transactionId: ordersData.orderIdForLiqpay,
        transactionAffiliation: 'Buy All Shop',
        transactionTotal: ordersData.amount,
        transactionProducts: [],
      };
      orderDataAnalictics.transactionProducts = ordersData.productToOrder.map(
        (prod: IOrderProduct) => {
          return {
            item_id: prod.product.id,
            item_name: prod.product.name,
            item_category: prod.product.category.name,
            price: prod.product.price,
            quantity: prod.quantity,
          };
        }
      );
      setEcomerceData(orderDataAnalictics);
    }
  }, [ordersData]);

  useEffect(() => {
    if (ecomerceData) {
      const ecommerceDataGA4 = {
        event: 'purchase',
        ecommerce: {
          transaction_id: ecomerceData.transactionId,
          affiliation: ecomerceData.transactionAffiliation,
          value: ecomerceData?.transactionTotal,
          currency: 'UAH',
          items: ecomerceData?.transactionProducts,
        },
      };

      // @ts-ignore
      window.dataLayer?.push(ecommerceDataGA4);
    }
  }, [ecomerceData]);

  return (
    <MainLayout metaData={metaData}>
      <PageContainer categories={allCategories!} breadcrumbsData={breadcrumbsData}>
        <div className={style.container}>
          <div className={style.section}>
            <CartThanksSvg />
            <div className={style.action}>
              <div className={style.textarea}>
                <span className={style.text}>Дякуємо за замовлення</span>
                <CartMiniThanksSvg />
              </div>
              <Button className={style.btn} onClick={() => router.push('account/orders')}>
                Мої замовлення
              </Button>
              <div className={style.arrow}>
                <CartArrowThanksSvg />
              </div>
            </div>
          </div>
          <div className={style.tip}>
            <div>
              <span>Деталі замовлення можна</span>
              <br /> <span>дізнатися тут</span>
            </div>
          </div>
        </div>
      </PageContainer>
    </MainLayout>
  );
};

export default TanksPage;
