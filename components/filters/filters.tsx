import React, { FC, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';

import { ICharacteristicGroup } from '../../interfaces/category/characteristicGroup';
import FilterGroup from './filter-group';
import styles from './filters.module.scss';
import { ICharacteristic } from '../../interfaces/category/characteristic';
import PriceRangeFilter from './price-range';
import { useFilters } from '../../hooks/filters/useFilters';
import { IPriceRange } from '../../interfaces/filters/filtersData';
import { useFiltersData } from '../../hooks/filters/useFiltersData';
import { api } from '../../api';
import { LoadingContext } from '../context/loading-context';
import FailedFilteringModal from '@modals/filter/failed-filtering';
import { useProducts } from '../../hooks/products/useProducts';
import { getLastUrlSegment } from '../../utils/urlValidation';

interface FiltersProps {
  filteredGroups: ICharacteristicGroup<ICharacteristic>[];
  priceRange: IPriceRange;
}

const Filters: FC<FiltersProps> = ({ filteredGroups, priceRange }) => {
  const router = useRouter();
  const pageQuery = router.query.page;
  const categoryQuery = getLastUrlSegment(router.query.slug as string[]);
  const quantityQuery = router.query.quantity;
  const itemPerPage = +quantityQuery || 40;
  const skip = pageQuery ? itemPerPage * (+pageQuery - 1) : 0;

  const { initialFiltersState, filteredCharacteristics, filtersReqDataBuilder } = useFiltersData(
    filteredGroups,
    priceRange
  );

  const {
    filters,
    clearFilters,
    filterChange,
    priceRangeChange,
    initialFiltersSetUp,
    priceRangeChangeFinished,
    shouldFilterApplyChecker,
    filterStringValue,
  } = useFilters(initialFiltersState);

  const filtersReq = filtersReqDataBuilder(filteredCharacteristics!, itemPerPage, skip);

  const { mutate, data } = useProducts(categoryQuery, itemPerPage, skip);

  const clearHandler = async () => {
    setLoading(true);

    await clearFilters!();
    await mutate();

    setLoading(false);
  };

  const { setLoading } = useContext(LoadingContext);

  const [isFailedModalOpen, setFailedModal] = useState(false);
  const toggleFailedModal = () => {
    setFailedModal(!isFailedModalOpen);
  };

  let initialization = true;

  useEffect(() => {
    initialization = initialFiltersSetUp!(initialFiltersState!);
    if (!initialization) {
      mutate({ ...data!, products: [] }, false);
      setFailedModal(true);
    }
  }, [filteredGroups]);

  useEffect(() => {
    const fetchFilteredProducts = async () => {
      if (shouldFilterApplyChecker(router) && initialization) {
        setLoading(true);

        const newProducts = await api.filters.getProducts(filtersReq);
        await mutate(
          { ...data!, products: newProducts.data.product, count: newProducts.data.count },
          false
        );

        setLoading(false);
      }
      // else if (
      //   Object.keys(router.query).length === 1 &&
      //   Object.keys(router.query)[0] === 'slug'
      // ) {
      //   setLoading(true);
      //   const category = getLastUrlSegment(router.query.slug as []);
      //   const newProducts = await api.products.getByCategoryKey(category, 40, 0);
      //   await mutate({ ...data!, products: newProducts.data.products }, false);
      //   setLoading(false);
      // }
    };

    fetchFilteredProducts();
  }, [router.query]);

  const filtersData = filteredCharacteristics?.map((characteristic) => {
    return (
      <FilterGroup
        filtersReq={filtersReq}
        key={characteristic.id}
        characteristic={characteristic}
        filters={filters!}
        filterChange={filterChange!}
        filterStringValue={filterStringValue!}
      />
    );
  });

  return (
    <div className={styles.filters}>
      <FailedFilteringModal isOpen={isFailedModalOpen} toggle={toggleFailedModal} mutate={mutate} />
      <div className={styles.filtersHead}>
        <p>Фільтри</p>
        <button
          className={styles.headBtn}
          onClick={clearHandler}
          disabled={!shouldFilterApplyChecker(router)}
        >
          Скинути всі
        </button>
      </div>
      <PriceRangeFilter
        priceRange={priceRange}
        filters={filters!}
        priceRangeChange={priceRangeChange!}
        priceRangeChangeFinished={priceRangeChangeFinished!}
      />
      {filtersData}
    </div>
  );
};

export default Filters;
