import useSWR from 'swr';

import { IProduct, PaginatedProducts } from '../../interfaces/product/products';

export const useAllProducts = (page: number = 1, limit: number = 20, products?: IProduct[]) => {
  const { data, error, mutate } = useSWR<PaginatedProducts>(`/product?page=${page}&limit=${limit}`);
  return {
    data,
    products: data?.data,
    totalPages: data?.totalPages,
    isLoading: !error && !data,
    isError: error,
    mutate,
  };
};
