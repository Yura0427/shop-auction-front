import React, { FC, useEffect, useState } from 'react';
import { Button, Container, Modal, Spinner } from 'reactstrap';

import { LoadingContext } from '../context/loading-context';
import { PageContainer } from '@containers/page-container';
import styles from './product-page.module.scss';
import CatalogSettings from '../catalog-settings/CatalogSettings';
import Products from '../products/products';
import paginClasses from '../pagination/pagination.module.scss';
import MainLayout from '../layout/MainLayout';
import { IProduct } from '../../interfaces/product/products';
import { useRouter } from 'next/router';
import { useFilters } from '../../hooks/filters/useFilters';
import { useProducts } from '../../hooks/products/useProducts';
import { useCategory } from '../../hooks/useCategory';
import { useFiltersData } from '../../hooks/filters/useFiltersData';
import { api } from '../../api';
import { CtWithoutChildrenProps } from '../../interfaces/pages/dynamic-pages';
import classes from './category-without-children.module.scss';
import { useMedia } from '../../hooks/useMedia';

const CategoryWithoutChildren: FC<CtWithoutChildrenProps> = ({
  productsData,
  category,
  allCategories,
  metaData,
  breadcrumbsData,
}) => {
  let initialProductsData: { products: IProduct[]; count: number } = productsData!;

  const router = useRouter();
  const routerQuery = router.query;
  const pageQuery = routerQuery.page;
  const quantityQuery = routerQuery.quantity;

  const [pageIndex, setPageIndex] = useState(1);

  const { pathModifier, shouldFilterApplyChecker } = useFilters();

  const paginationHandler = (
    evt: React.MouseEvent<HTMLButtonElement> & { target: HTMLButtonElement }
  ) => {
    let modifiedPath = '';
    const index = pageQuery ? +pageQuery : 1;

    if (evt.target.classList.contains('prev')) {
      let active = true;

      +pageQuery === 2 ? (active = false) : true;

      modifiedPath = pathModifier!(
        { param: 'page', value: `${index - 1}`, active, type: 'pagination' },
        router
      );
    } else {
      modifiedPath = pathModifier!(
        { param: 'page', value: `${index + 1}`, active: true, type: 'pagination' },
        router
      );
    }

    router.push(modifiedPath, undefined, { scroll: true });
  };

  if (pageIndex > 1 || +quantityQuery > 40) initialProductsData.products = [];

  const itemPerPage = +quantityQuery || 40;

  const takeSkipCalculator = (itemPerPage: number, pageIndex: number) => {
    const take = itemPerPage;
    let skip = 0;

    if (pageIndex > 1) {
      skip = (pageIndex - 1) * take;
    }

    return { take, skip };
  };

  const { take, skip } = takeSkipCalculator(itemPerPage, pageIndex);

  const { products, mutate, data } = useProducts(category!.key, take, skip, initialProductsData);
  const totalProduct = data?.count;

  const [isLoading, setLoading] = useState(false);

  const [loadedPage, setLoadedPage] = useState(2);
  const [isLastPage, setLastPage] = useState(false);

  const { category: currentCategory } = useCategory(category!.key);
  const filteredGroups = category!.characteristicGroup?.filter(
    (group) => group.characteristic.length
  );

  const checkLastPage = (
    currentPage: number,
    currentQuantity: number,
    itemLoaded: number,
    totalItem: number
  ): void => {
    let quantityLoadedProducts = 0;

    if ((!currentPage && !currentQuantity) || (!currentPage && currentQuantity)) {
      quantityLoadedProducts = itemLoaded;
    }

    if (currentPage && currentQuantity) {
      quantityLoadedProducts = (currentPage - 1) * currentQuantity + itemLoaded;
    }

    if (currentPage && !currentQuantity) {
      quantityLoadedProducts = (currentPage - 1) * 40 + itemLoaded;
    }

    if (totalItem === quantityLoadedProducts) {
      setLastPage(true);
    } else {
      setLastPage(false);
    }
  };

  const { filteredCharacteristics, filtersReqDataBuilder } = useFiltersData(
    filteredGroups,
    currentCategory?.priceRange
  );

  const itemsNumber = +quantityQuery || 40;
  const offset = itemsNumber * (loadedPage - 1);
  const filtersReq = filtersReqDataBuilder(filteredCharacteristics!, itemsNumber, offset);

  const loadMoreHandler = async () => {
    setLastPage(false);
    if (shouldFilterApplyChecker(router)) {
      const loadedProducts = await api.filters.getProducts(filtersReq);
      !loadedProducts.data.product.length ? setLastPage(true) : null;
      await mutate({ ...data!, products: [...products!, ...loadedProducts.data.product] }, false);
    } else {
      const loadedProducts = await api.products.getByCategoryKey(category.key, itemsNumber, offset);
      !loadedProducts.data.products.length ? setLastPage(true) : null;
      await mutate({ ...data!, products: [...products!, ...loadedProducts.data.products] }, false);
    }

    setLoadedPage((prevState) => prevState + 1);
  };

  const isMobile = useMedia(`(max-width: 992px)`);

  useEffect(() => {
    setLastPage(false);

    if (pageQuery) {
      setLoadedPage(+pageQuery + 1);
    } else setLoadedPage(2);

    if (+pageQuery > 1) {
      setPageIndex(+pageQuery!);
    } else {
      setPageIndex(1);
    }

    //#sidebar height
    if (!isMobile) {
      const windowHeight = document.documentElement.clientHeight;
      const checkedBtn = document.getElementById('checkedBtn');
      const sidebar = document.querySelector('.globalSideBar');
      const cords = checkedBtn?.getBoundingClientRect();

      if (cords?.top! <= windowHeight || !cords) {
        sidebar?.classList.add('shortSideBar');
      } else {
        sidebar?.classList.remove('shortSideBar');
      }
    }
  }, [routerQuery]);

  useEffect(() => {
    if (products) {
      checkLastPage(+pageQuery, +quantityQuery, products.length, +totalProduct!);
    }
  }, [products]);

  const dynamicClasses = {
    pageContainer: !isMobile ? classes.scroll : undefined,
    lowContainer: !isMobile ? classes.scrollProduct : undefined,
    products: !isMobile ? undefined : classes.scrollProduct,
  };

  useEffect(() => {
    if (!isMobile) {
      const windowHeight = document.documentElement.clientHeight;

      window.addEventListener('scroll', () => {
        const checkedBtn = document.getElementById('checkedBtn');
        const sidebar = document.querySelector('.globalSideBar');

        if (checkedBtn && sidebar) {
          const cords = checkedBtn?.getBoundingClientRect();

          if (cords?.top <= windowHeight || !cords) {
            sidebar.classList.add('shortSideBar');
          } else {
            sidebar.classList.remove('shortSideBar');
          }
        }
      });
    }
  }, []);

  const [isVisible, setVisible] = useState(true);

  const handleVisibility = (event: any) => {
    if (event.target.documentElement.scrollTop > 0) {
      setVisible(!isVisible);
    }
    if (event.target.documentElement.scrollTop === 0) {
      setVisible(isVisible);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleVisibility);
    return function () {
      window.removeEventListener('scroll', handleVisibility);
    };
  }, []);

  return (
    <MainLayout metaData={metaData}>
      <LoadingContext.Provider value={{ isLoading, setLoading }}>
        <PageContainer
          categories={allCategories}
          isSideBarShown={true}
          breadcrumbsData={breadcrumbsData}
          customClass={dynamicClasses.pageContainer}
        >
          <Container className={dynamicClasses.lowContainer}>
            <div className={classes.mainFilter}>
              {isVisible && <h1>{category?.name}</h1>}
              <CatalogSettings />
            </div>
            {isLoading ? (
              <div className={styles.spinnerContainer}>
                <Spinner color="success" />
                <Modal isOpen={true} className="backdrop-loader"></Modal>
              </div>
            ) : (
              <>
                <Products
                  products={products!}
                  isSidebarShowing={true}
                  customClass={dynamicClasses.products}
                />
              </>
            )}
            {products?.length ? (
              <div className={paginClasses.pagination}>
                <div className={paginClasses.PrevNext}>
                  <Button className={'prev'} onClick={paginationHandler} disabled={!pageQuery}>
                    Попередня сторінка
                  </Button>
                  <Button className={'next'} onClick={paginationHandler} disabled={isLastPage}>
                    Наступна сторінка
                  </Button>
                </div>
                <div>
                  <Button
                    id="checkedBtn"
                    className={paginClasses.downloadMore}
                    disabled={isLastPage}
                    onClick={loadMoreHandler}
                  >
                    Завантажити ще
                  </Button>
                </div>
              </div>
            ) : null}
          </Container>
        </PageContainer>
      </LoadingContext.Provider>
    </MainLayout>
  );
};

export default CategoryWithoutChildren;
