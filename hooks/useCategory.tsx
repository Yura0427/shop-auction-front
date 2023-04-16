import useSWR from 'swr';

import { ICategory } from '../interfaces/category/category';

export const useCategory = (key: string | string[], initialData?: ICategory) => {
  const { data, error, mutate } = useSWR<ICategory>(`/category/tree/key/${key}?hideDisabled=true`, {
    initialData,
  });

  return {
    data,
    category: data,
    products: data?.products,
    isLoading: !error && !data,
    isError: error,
    mutate,
  };
};
