import useSWR from 'swr';

import { IOrdersResponse } from 'interfaces/order';

export const useOrders = (userId: number, page: number) => {
  const { data, error, mutate } = useSWR<IOrdersResponse>(`/orders/user/${userId}?page=${page}`);

  return { data, error, mutate };
};
