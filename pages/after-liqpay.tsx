import React, { FC, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import { PageContainer } from '@containers/page-container';
import { useCategories } from '../hooks/useCategories';
import MainLayout from '../components/layout/MainLayout';
import { IBreadcrumbsData } from '../interfaces/breadcrumbsData';
import { UserContext } from '../components/context/user-context';
import { api } from '../api';
import { Col, Spinner } from 'reactstrap';
import styles from '../styles/style.module.scss';

const AfterLiqpayPage: FC = () => {
  const { allCategories } = useCategories();
  const { user } = useContext(UserContext);
  const router = useRouter();

  const [redirectTo, setRedirectTo] = useState<string>('/');
  const [loading, setLoading] = useState<boolean>(true);

  const breadcrumbsData: IBreadcrumbsData = {
    isBreadcrumbsShown: false,
    breadcrumbs: [],
  };

  const metaData = {
    title: 'Перевірка статусу оплати',
    description: 'Перевірка статусу оплати',
    addBrand: true,
  };

  useEffect(() => {
    if (user?.id) {
      api.productsInCart
        .getProductsFromCart()
        .then(({ data }) => {
          data ? setRedirectTo('/delivery') : setRedirectTo('/thanks');
        })
        .finally(() => {
          setLoading(false);
        });
    } else setLoading(false);
  }, []);

  useEffect(() => {
    !loading && router.push(`${redirectTo}`);
  }, [loading]);

  return (
    <MainLayout metaData={metaData}>
      <PageContainer categories={allCategories!} breadcrumbsData={breadcrumbsData}>
        <Col className={'text-center'} style={{ marginTop: '8vh', color: styles.primaryColor }}>
          <Spinner className="m-2" type="grow" />
          <Spinner className="m-2" type="grow" />
          <Spinner className="m-2" type="grow" />
        </Col>
      </PageContainer>
    </MainLayout>
  );
};

export default AfterLiqpayPage;
