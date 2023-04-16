import useSWR from 'swr';

import { ProductInListCategory } from '../interfaces/product/products';

export const useProductsInListCategory = (
  key: string,
  page: number = 1,
  limit: number = 20,
  productsData?: ProductInListCategory
) => {
  const initData = productsData?.products.length ? { initialData: productsData } : undefined;

  const { data, error, mutate } = useSWR<ProductInListCategory>(
    `/product/listCategory/${key}?take=${page}&skip=${limit}`,
    initData
  );

  return {
    data,
    products: data?.products,
    isLoading: !error && !data,
    isError: error,
    mutate,
  };
};
