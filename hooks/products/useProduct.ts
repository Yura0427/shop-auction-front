import useSWR from 'swr';

import { IProduct } from '../../interfaces/product/products';

export const useProduct = (key: string, initialData?: IProduct) => {
  const { data, error, mutate } = useSWR<IProduct>(`/product/key/${key}`, {
    initialData,
  });

  return {
    data,
    avgRating: data?.avgRating,
    numRates: data?.numRates,
    isLoading: !error && !data,
    isError: error,
    mutate,
  };
};
