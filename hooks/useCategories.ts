import useSWR from 'swr';

import { ICategoryTree } from '../interfaces/category/category';

export const useCategories = (initialData?: ICategoryTree[]) => {
  const initData = initialData?.length ? { initialData } : undefined;

  const { data, error, mutate } = useSWR<ICategoryTree[]>(`/category/tree?hideDisabled=true`, initData);

  return {
    allCategories: data,
    isLoading: !error && !data,
    isError: error,
    mutate,
  };
};
