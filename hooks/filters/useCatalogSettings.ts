import React, { useContext, useState } from 'react';
import { NextRouter, useRouter } from 'next/router';
import { initialSortingState } from '../../interfaces/filters/initialState';
import { LoadingContext } from '../../components/context/loading-context';

type MouseEvent = React.MouseEvent & {
  currentTarget: {
    title: string;
  };
};

interface IQuery {
  param: string;
  value: string;
  active: boolean;
  type: string;
}

export const useCatalogSettings = (
  pathModifier: (
    currentQuery: IQuery,
    router: NextRouter,
    shouldDeletePagination?: boolean
  ) => string
) => {
  const [catalogView, setCatalogView] = useState('small');
  const [mobileSidebar, setMobileSidebarWindow] = useState(false);

  const closeMobileFilters = () => {
    setMobileSidebarWindow(false);
  };

  const openMobileFilters = () => {
    setMobileSidebarWindow(true);
  };

  const changeCatalogView = (e: MouseEvent) => {
    if (e.currentTarget.title === 'Мала плитка') {
      localStorage.setItem('catalog-view', 'small');
      setCatalogView('small');
    }
    if (e.currentTarget.title === 'Крупна плитка') {
      localStorage.setItem('catalog-view', 'large');
      setCatalogView('large');
    }
  };

  const router = useRouter();
  const routerQuery = router.query;
  const sortingQuery = routerQuery.sorting;
  const quantityQuery = routerQuery.quantity;

  const initialSortingState: initialSortingState = {
    value: 'popular',
    quantity: 40,
  };

  const [sortingState, setSorting] = useState<initialSortingState>(initialSortingState);
  const { setLoading } = useContext(LoadingContext);

  const optionChange = async (evt: React.ChangeEvent<HTMLInputElement>) => {
    const target = evt.target;
    const optionName = target.name;
    const optionValue = target.value;

    const modifiedPath = pathModifier!(
      { param: optionName, value: `${optionValue}`, active: true, type: optionName },
      router,
      true
    );

    setLoading(true);
    await router.push(modifiedPath, undefined, { scroll: true });
  };

  const initialSortingSetUp = () => {
    setSorting(initialSortingState);

    if (sortingQuery) {
      setSorting((prevState) => ({ ...prevState, value: sortingQuery as string }));
    }

    if (quantityQuery) {
      setSorting((prevState) => ({ ...prevState, quantity: +(quantityQuery as string) }));
    }
  };

  return {
    initialSortingSetUp,
    optionChange,
    sortingState,
    catalogView,
    mobileSidebar,
    openMobileFilters,
    closeMobileFilters,
    changeCatalogView,
    setCatalogView,
  };
};
