import React, { FC, useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import { PageContainer } from '@containers/page-container';
import MainLayout from '../layout/MainLayout';
import { CtWithChildrenProps } from '../../interfaces/pages/dynamic-pages';
import CategoryList from '../category-list/CategoryList';
import Products from '../products/products';
import { api } from '../../api';
import { useProductsInListCategory } from '../../hooks/useProductsInListCategory';
import Loader from '../loader/loader';
import styles from './category-with-children.module.scss';

const CtWithChildren: FC<CtWithChildrenProps> = ({
  metaData,
  breadcrumbsData,
  allCategories,
  category,
  validUrl,
  productsData,
}) => {
  const take = 20;
  const { query } = useRouter();

  const {
    products,
    mutate,
    data: initialProducts,
  } = useProductsInListCategory(category.key, 1, take, productsData);
  const [page, setPage] = useState(1);
  const [isLoading, setLoading] = useState(false);
  const [disableBtn, setDisable] = useState(false);

  const loadMore = async () => {
    setLoading(true);

    const nextPage = page + 1;
    const skip = page * take;
    const newProducts = await api.products.getInListCategory(category.key, take, skip);
    setPage(nextPage);
    setLoading(false);

    await mutate(
      {
        ...initialProducts!,
        products: [...initialProducts!.products, ...newProducts.data.products],
      },
      false
    );
  };

  useEffect(() => {
    mutate({ ...initialProducts!, products: productsData.products }, false);

    const disable = productsData.count < take;
    disable && setDisable(disable);
    setPage(1);
  }, [query]);

  useEffect(() => {
    if (page === Math.ceil(productsData.count / take)) {
      setDisable(true);
    }
  }, [page]);

  return (
    <MainLayout metaData={metaData}>
      <PageContainer
        categories={allCategories}
        isSideBarShown={false}
        breadcrumbsData={breadcrumbsData}
      >
        <h1 className={styles.header}>{category?.name}</h1>
        <article className={styles.article}>
          <CategoryList category={category} validUrl={validUrl} />
          <h2 className={styles.h2}>Лідери продажу</h2>
          <Products isSidebarShowing={false} products={products!} />
          <Loader isLoading={isLoading} loadMore={loadMore} disableBtn={disableBtn} />
        </article>
      </PageContainer>
    </MainLayout>
  );
};

export default CtWithChildren;
