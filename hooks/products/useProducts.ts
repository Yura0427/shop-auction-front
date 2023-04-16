import useSWR from 'swr';

import { IProduct } from '../../interfaces/product/products';

export const useProducts = (
  key: string | string[],
  take: number = 40,
  skip: number = 0,
  initialData?: { products: IProduct[]; count: number }
) => {
  const initData = initialData?.products.length ? { initialData } : undefined;

  const { data, error, mutate } = useSWR<{ products: IProduct[]; count: number }>(
    `/product/category/${key}?take=${take}&skip=${skip}`,
    initData
  );

  return {
    data,
    products: data?.products,
    count: data?.count,
    isLoading: !error && !data,
    isError: error,
    mutate,
  };
};
