import React, { FC, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import style from '../components/Header/Search/Search.module.scss';

import MainLayout from '../components/layout/MainLayout';
import { PageContainer } from '@containers/page-container';
import Products from '../components/products/products';
import { IProduct } from '../interfaces/product/products';
import { IPageProps } from '../interfaces/page';
import { useCategories } from 'hooks/useCategories';
import { IBreadcrumbsData } from '../interfaces/breadcrumbsData';
import PaginationBlock from '../components/pagination/pagination-block';
import { Spinner } from 'reactstrap';
import { api } from '../api';

interface SearchPageProps extends IPageProps {
  products: IProduct[];
}

const SearchPage: FC<SearchPageProps> = () => {
  const router = useRouter();
  const { allCategories } = useCategories();
  const queryPage = Number(router.query.page);
  const searchProduct = router.query.q as string;
  const [currentPage, setCurrentPage] = useState<number>(queryPage | 1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [searchResults, setSearchResult] = useState<IProduct[]>([]);
  const routerPush = true;

  useEffect(() => {
    const getProductsSearch = async () => {
      setLoading(true);
      if (router.isReady) {
        const { data: response } = await api.products.getSearchProducts(searchProduct, queryPage);

        setSearchResult(response.data);
        setTotalPages(response.totalPages);
        setLoading(false);
      }
    };
    getProductsSearch();
  }, [searchProduct, queryPage]);

  useEffect(() => {
    if (!queryPage) return;
    setCurrentPage(queryPage);
  }, [queryPage]);

  const breadcrumbsData: IBreadcrumbsData = {
    isBreadcrumbsShown: true,
    breadcrumbs: [
      { name: 'Головна', key: '/' },
      { name: 'Пошук', key: '' },
    ],
  };

  const pageText = currentPage > 1 ? ` — cторінка № ${currentPage}` : '';

  const metaData = {
    title: `Результат пошуку для "${searchProduct}"${pageText}`,
    description: `Сторінка результатів пошуку для "${searchProduct}"${pageText}`,
    addBrand: true,
  };

  return (
    <MainLayout metaData={metaData}>
      <PageContainer categories={allCategories!} breadcrumbsData={breadcrumbsData}>
        <h1 className={style.searchTitle}>
          Результати пошуку для "{searchProduct}"{pageText}:
        </h1>
        {isLoading ? (
          <div className={style.searchSpinner}>
            <Spinner type="grow" color="success" />
          </div>
        ) : searchResults?.length ? (
          <>
            <Products products={searchResults} isSidebarShowing={false} />
            <PaginationBlock
              routerPush={routerPush}
              totalPages={totalPages}
              setCurrentPage={setCurrentPage}
              currentPage={currentPage}
            />
          </>
        ) : (
          <p>Нажаль, нічого не знайдено.</p>
        )}
      </PageContainer>
    </MainLayout>
  );
};

export default SearchPage;
