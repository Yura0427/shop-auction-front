import React, { useContext, useState } from 'react';
import { Range } from 'react-input-range';
import { NextRouter, useRouter } from 'next/router';

import { FilterItemState, initialState } from '../../interfaces/filters/initialState';
import { IPriceRange } from '../../interfaces/filters/filtersData';
import { LoadingContext } from '../../components/context/loading-context';
import { enumCharacteristics } from './enumStringCharacteristics';

interface IQuery {
  param: string;
  value: string;
  active: boolean;
  type: string;
}

export const useFilters = (initialFiltersState?: initialState) => {
  const getPath = (query: { [key: string]: string | string[] }): string => {
    let baseUrl = '/' + (query.slug as string[]).join('/');

    if (Object.keys(query).length > 1) baseUrl += '?';

    const queryKeys = Object.keys(query);

    queryKeys.forEach((key) => {
      if (key === 'slug') return;
      baseUrl += `${key}=${query[key]}&`;
    });

    if (baseUrl.charAt(baseUrl.length - 1) === '&') {
      baseUrl = baseUrl.slice(0, baseUrl.length - 1);
    }

    return baseUrl;
  };

  const pathModifier = (
    currentQuery: IQuery,
    router: NextRouter,
    shouldDeletePagination?: boolean
  ): string => {
    const routerQuery = router.query;
    const keys = Object.entries(routerQuery);

    const existParamIndex = keys.findIndex((param) => param[0] === currentQuery.param);

    if (existParamIndex === -1) {
      keys.push([currentQuery.param, currentQuery.value]);
    } else {
      let filterValueIndexMap = (keys[existParamIndex][1] as string).split(',');
      if (currentQuery.active) {
        filterValueIndexMap.push(currentQuery.value);

        if (['boolean', 'range', 'sorting', 'pagination', 'quantity'].includes(currentQuery.type)) {
          filterValueIndexMap = [currentQuery.value];
        }
      } else {
        const deleteIndex = filterValueIndexMap.findIndex((item) => item === currentQuery.value);
        filterValueIndexMap.splice(deleteIndex, 1);
      }

      if (filterValueIndexMap.length) {
        keys[existParamIndex][1] = filterValueIndexMap.join(',');
      } else {
        keys.splice(existParamIndex, 1);
      }
    }

    const mappedQuery = Object.fromEntries(keys);

    if (shouldDeletePagination) {
      delete mappedQuery.page;
    }

    return getPath(mappedQuery);
  };

  const shouldFilterApplyChecker = (router: NextRouter) => {
    const routerKeys = Object.keys(router.query);
    const notFilteredQuery = ['page', 'slug'];

    const filtersQuery = routerKeys.filter((key) => !notFilteredQuery.includes(key));

    return filtersQuery.length > 0;
  };

  if (!initialFiltersState)
    return {
      getPath,
      pathModifier,
      shouldFilterApplyChecker,
    };

  const [filters, setFilter] = useState<initialState>(initialFiltersState);

  const router = useRouter();

  const initialFiltersSetUp = (state: initialState) => {
    let initialization: boolean = true;

    if (Object.keys(router.query).length === 1) {
      setFilter(() => state);
    }

    if (Object.keys(router.query).length > 1) {
      setFilter(() => state);
      const routerQuery = router.query;
      const categoryQuery = router.query.slug;

      const entries = Object.entries(routerQuery);

      const mainCategoryItemIndex = entries.findIndex((item) => item[1] === categoryQuery);
      entries.splice(mainCategoryItemIndex, 1);

      const filtersQuery = Object.fromEntries(entries);

      Object.keys(filtersQuery).forEach((key) => {
        const stateKeys = Object.keys(filters);
        const activeFilterIndexes = (filtersQuery[key] as String).split(',');

        const filterName = stateKeys.find((stateItem) => stateItem.includes(key));

        if (!filterName) {
          initialization = false;
          return;
        }
        if (filterName === 'sorting') {
          if (
            !['price_asc', 'price_desc', 'new_arrivals', 'popular'].includes(activeFilterIndexes[0])
          ) {
            initialization = false;
            return;
          }
        }

        if (filterName === 'quantity') {
          if (!['40', '60', '80', '100'].includes(activeFilterIndexes[0])) {
            initialization = false;
            return;
          }
        }

        if (filterName!.includes('price')) {
          if (
            +activeFilterIndexes[0] < (state[filterName!] as IPriceRange).min ||
            +activeFilterIndexes[1] > (state[filterName!] as IPriceRange).max
          ) {
            initialization = false;
            return;
          }

          setFilter((prevState) => ({
            ...prevState,
            [filterName!]: { min: +activeFilterIndexes[0], max: +activeFilterIndexes[1] },
          }));
        }
        if ([
          ...new Set(
            enumCharacteristics
              .map((el) => el.enumStringCharacteristics.map((characteristic) => characteristic))
              .flat()
          ),
        ].includes(filterName!)) {
          activeFilterIndexes.forEach((filter) => {
            setFilter((prevState) => ({
              ...prevState,
              [filterName!]: [...(prevState as any)[filterName!], filter],
            }));
          });
          return;
        }

        activeFilterIndexes.forEach((filter) => {
          if (['priceRange', 'sorting', 'page', 'quantity'].includes(filterName!)) return;
          setFilter((prevState) => ({
            ...prevState,
            [filterName!]: [
              ...(prevState[filterName!] as Array<FilterItemState>)?.map((item: any) => {
                return item.index === +filter ? { index: +filter, active: true } : item;
              }),
            ],
          }));
        });
      });
    }

    return initialization;
  };

  const clearFilters = async () => {
    const baseUrl = '/' + (router.query.slug as string[]).join('/');
    await router.push(baseUrl, undefined, {
      scroll: true,
    });
  };

  const { setLoading } = useContext(LoadingContext);

  const filterChange = async (evt: React.ChangeEvent<HTMLInputElement>) => {
    const target = evt.target;
    const targetValue = target.checked;
    const itemRegexGroups = target.id.match(/(\w+)_(\d+)_(\d+)/);
    const characteristicId = itemRegexGroups![2];
    const itemIndex = +itemRegexGroups![3];

    const itemType = itemRegexGroups![1];

    const modifiedPath = pathModifier(
      { param: characteristicId, value: String(itemIndex), active: targetValue, type: itemType },
      router,
      true
    );

    setLoading(true);
    await router.push(modifiedPath, undefined, { scroll: true });
  };

  const priceRangeChangeFinished = async (value: Range | number) => {
    const { min, max } = value as Range;

    const modifiedPath = pathModifier(
      { param: 'priceRange', value: `${min},${max}`, active: true, type: 'range' },
      router,
      true
    );

    setLoading(true);
    priceRangeChange(value);
    await router.push(modifiedPath, undefined, { scroll: true });
  };

  const priceRangeChange = (value: Range | number) => {
    setFilter((prevState) => ({ ...prevState, priceRange: value as Range }));
  };

  const filterStringValue: React.ChangeEventHandler<HTMLInputElement> = async (event) => {
    const target = event.target;
    const targetValue = target.checked;
    const itemSplit = target.id.split('__');

    const characteristicName = itemSplit[0];
    const characteristicValue = itemSplit[1];

    const modifiedPath = pathModifier(
      {
        param: `${characteristicName}`,
        value: `${characteristicValue}`,
        active: targetValue,
        type: 'string',
      },
      router,
      true
    );

    await router.push(modifiedPath, undefined, { scroll: true });
  };

  return {
    filters,
    clearFilters,
    filterChange,
    priceRangeChange,
    priceRangeChangeFinished,
    initialFiltersSetUp,
    shouldFilterApplyChecker,
    filterStringValue,
  };
};
