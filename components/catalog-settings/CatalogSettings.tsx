import React, { FC, useEffect } from 'react';
import { Button, Input } from 'reactstrap';
// import cx from 'classnames';
// import { BsGrid3X3Gap, BsGridFill } from 'react-icons/bs';
import { FiFilter } from 'react-icons/fi';
import { ImEqualizer2 } from 'react-icons/im';

import styles from './CatalogSettings.module.scss';
import { useMedia } from '../../hooks/useMedia';
import SidebarMobile from '../Sidebar/SidebarMobile';
import { useRouter } from 'next/router';
import { useFilters } from '../../hooks/filters/useFilters';
import { useProducts } from '../../hooks/products/useProducts';
import { useCatalogSettings } from '../../hooks/filters/useCatalogSettings';
import { getLastUrlSegment } from '../../utils/urlValidation';

const CatalogSettings: FC = () => {
  const isBreakpointsMoreXS = useMedia(`(min-width: ${styles.xs}px)`);
  const isBreakpointsLessMd = useMedia(`(max-width: ${styles.md}px)`);

  const router = useRouter();
  const categoryQuery = getLastUrlSegment(router.query.slug as string[]);
  const { products } = useProducts(categoryQuery);
  const { pathModifier } = useFilters();

  const {
    initialSortingSetUp,
    optionChange,
    sortingState,
    // catalogView,
    mobileSidebar,
    closeMobileFilters,
    openMobileFilters,
    // changeCatalogView,
    setCatalogView,
  } = useCatalogSettings(pathModifier!);

  useEffect(() => {
    initialSortingSetUp();
  }, [products, router.query]);

  useEffect(() => {
    const getViewFromStorage = localStorage.getItem('catalog-view');
    getViewFromStorage && setCatalogView(getViewFromStorage);
  }, []);

  return (
    <div className={styles.containerSettings}>
      <Input
        type="select"
        className={styles.sorting}
        value={sortingState.value}
        onChange={optionChange}
        name="sorting"
      >
        <option value="popular">По популярності</option>
        <option value="price_asc">Від дешевих до дорогих</option>
        <option value="price_desc">Від дорогих до дешевих</option>
        <option value="new_arrivals">Новинки</option>
      </Input>

      <div className={styles.quantityBlock}>
        <label>Кількість товарів</label>
        <Input
          type="select"
          className={styles.quantity}
          value={sortingState.quantity}
          onChange={optionChange}
          name="quantity"
        >
          <option value="40">40</option>
          <option value="60">60</option>
          <option value="80">80</option>
          <option value="100">100</option>
        </Input>
      </div>

      <div className={styles.grow} />

      {/*<div className={styles.catalogView}>*/}
      {/*  <Button*/}
      {/*    title="Крупна плитка"*/}
      {/*    className={cx({ [styles.selected]: catalogView === 'large' })}*/}
      {/*    onClick={changeCatalogView}*/}
      {/*  >*/}
      {/*    <BsGridFill size={20} />*/}
      {/*  </Button>*/}
      {/*  <Button*/}
      {/*    title="Мала плитка"*/}
      {/*    className={cx({ [styles.selected]: catalogView === 'small' })}*/}
      {/*    onClick={changeCatalogView}*/}
      {/*  >*/}
      {/*    <BsGrid3X3Gap size={20} />*/}
      {/*  </Button>*/}
      {/*</div>*/}
      <Button className={styles.filterButton} onClick={openMobileFilters}>
        {isBreakpointsMoreXS ? (
          <>
            <FiFilter size={20} />
            <span>Фільтри</span>
          </>
        ) : (
          <ImEqualizer2 size={28} />
        )}
      </Button>
      {isBreakpointsLessMd ? (
        <SidebarMobile mobileSidebar={mobileSidebar} closeMobileFilters={closeMobileFilters} />
      ) : null}
    </div>
  );
};

export default CatalogSettings;
