import React, { FC, useEffect, useState } from 'react';
import { GetServerSideProps } from 'next';

import Products from '../components/products/products';
import { PageContainer } from '@containers/page-container';
import { api } from '../api';
import MainLayout from '../components/layout/MainLayout';
import SlideGallery from '../components/slide/slide-gallery';
import { IPageProps } from '../interfaces/page';
import { IProductsSlide } from '../interfaces/product/products';
import { ParametersNameEnum } from '../interfaces/settings';
import NewArrivals from '../components/sliders/NewArrivals/NewArrivals';
import styles from '../components/dynamic-pages/CategoryPage.module.scss';
import commonStyles from './common-page.module.scss';
import { IBreadcrumbsData } from '../interfaces/breadcrumbsData';
import { useAllProducts } from '../hooks/products/useAllProducts';
import Loader from '../components/loader/loader';
import { useDispatch } from 'react-redux';
import { getParametersByNameRequest } from '../store/actions/parameters.action';

interface IndexPageProps extends IPageProps {
  newArrivalProducts: IProductsSlide;
}

const IndexPage: FC<IndexPageProps> = ({ categories, newArrivalProducts, products }) => {
  const {
    products: productsList,
    mutate,
    data: initialProducts,
    totalPages,
  } = useAllProducts(1, 20, products);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getParametersByNameRequest('size-priority'));
  }, []);

  const [page, setPage] = useState(1);
  const [isLoading, setLoading] = useState(false);
  const loadMore = async () => {
    setLoading(true);
    const nextPage = page + 1;
    const {
      data: { data },
    } = await api.products.getAll(nextPage, 20);
    setPage(nextPage);
    // setIsLoadMoreDisable(nextPage >= totalPages - 1);
    setLoading(false);

    await mutate({ ...initialProducts!, data: [...initialProducts!.data, ...data] }, false);
  };

  const breadcrumbsData: IBreadcrumbsData = {
    isBreadcrumbsShown: false,
    breadcrumbs: [{ name: '', key: '' }],
  };
  const metaData = {
    title: 'Інтернет-магазин Buy All',
    description: 'Інтернет-магазин Buy All Shop: одяг, взуття, аксесуари та декор.',
    addBrand: false,
  };
  return (
    <MainLayout metaData={metaData}>
      <PageContainer
        categories={categories}
        isSideBarShown={false}
        breadcrumbsData={breadcrumbsData}
      >
        <h1 className={`${commonStyles.title} ${commonStyles['index-page-main-title']}`}>
          Інтернет-магазин одягу і аксесуарів Buy All
        </h1>

        <SlideGallery />
        <NewArrivals
          products={newArrivalProducts.data}
          isWidgetActive={newArrivalProducts.isWidgetActive}
        />
        <section className={styles.container}>
          <span className={commonStyles.title}>Усі товари</span>
          {/*TODO optimize logic for main page*/}
          {/*<CatalogSettings />*/}
          <Products products={productsList!} isSidebarShowing={false} />
          <Loader isLoading={isLoading} loadMore={loadMore} disableBtn={page >= totalPages} />
        </section>
      </PageContainer>
    </MainLayout>
  );
};

export default IndexPage;

export const getServerSideProps: GetServerSideProps = async () => {
  const {
    data: { isWidgetActive, newArrivalProducts },
  } = await api.products.getNewArrivalProductsWithParameter(ParametersNameEnum.widgets);

  const products = await api.products.getAll(1, 20);
  const categories = await api.categories.getTree();

  return {
    props: {
      categories: categories.data,
      newArrivalProducts: { data: newArrivalProducts, isWidgetActive },
      products: products.data.data,
    },
  };
};
