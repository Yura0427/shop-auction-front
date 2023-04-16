import React, { FC } from 'react';
import { GetServerSideProps } from 'next';

import { api } from '../api';
import MainLayout from '../components/layout/MainLayout';
import { PageContainer } from '@containers/page-container';
import { useCategories } from '../hooks/useCategories';
import { useNewArrivalProducts } from '../hooks/useNewArrivalProducts';
import { IPageProps } from '../interfaces/page';
import { IProduct, ISortedProducts } from '../interfaces/product/products';
import { IBreadcrumbsData } from '../interfaces/breadcrumbsData';
import styles from './common-page.module.scss';
import NewProducts from 'components/products/new-arrival-products/new-arrival-products';

interface SortedData {
  [key: string]: {
    categoryName: string;
    products: IProduct[];
  };
}

interface NewArrivals extends IPageProps {
  sortedProducts: ISortedProducts[];
  newArrivalProducts: IProduct[];
}

const NewArrivalsPage: FC<NewArrivals> = ({ categories, newArrivalProducts, sortedProducts }) => {
  const { allCategories } = useCategories(categories);
  const allNewArrivalProducts = useNewArrivalProducts(20, newArrivalProducts);

  const breadcrumbsData: IBreadcrumbsData = {
    isBreadcrumbsShown: true,
    breadcrumbs: [
      { name: 'Головна', key: '/' },
      { name: 'Новинки', key: '' },
    ],
  };

  const metaData = {
    title: 'Нові надходження товару',
    description: 'Останні надходження товару',
    addBrand: true,
  };

  return (
    <MainLayout metaData={metaData}>
      <PageContainer categories={allCategories!} breadcrumbsData={breadcrumbsData}>
        <h1 className={styles.heading}>Новинки</h1>
        <NewProducts
          products={allNewArrivalProducts}
          isSidebarShowing={false}
          sortedProducts={sortedProducts}
        />
      </PageContainer>
    </MainLayout>
  );
};

export default NewArrivalsPage;

export const getServerSideProps: GetServerSideProps = async () => {
  const { data: categories } = await api.categories.getTree();
  const { data: newArrivalProducts } = await api.products.getNewArrivals(20);

  const sortedProducts = () => {
    const sortProductsByCategory = (products: IProduct[]) => {
      let sortedData: SortedData = {};
      for (const product of products) {
        if (!sortedData[product.category!.key]) {
          sortedData[product.category!.key] = {
            categoryName: product.category!.name,
            products: [],
          };
        }
        sortedData[product!.category!.key].products.push(product);
      }

      return Object.values<{ categoryName: string; products: IProduct[] }>(sortedData);
    };
    return sortProductsByCategory(newArrivalProducts);
  };

  return {
    props: { categories, newArrivalProducts, sortedProducts: sortedProducts() },
  };
};
