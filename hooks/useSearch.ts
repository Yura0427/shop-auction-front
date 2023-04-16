import useSWR from 'swr';

import { IProductsSearchResponse } from '../interfaces/product/products';

const useSearch = (searchQuery: string, page: number) => {
  const { data, error } = useSWR<IProductsSearchResponse>(`/product/search/${searchQuery}?page=${page}`);

  return {
    data,
    searchResults: data?.data,
    count:data?.count,
    totalPages:data?.totalPages,
    isLoading: !error && !data,
    isError: error,
  };
};

export default useSearch;