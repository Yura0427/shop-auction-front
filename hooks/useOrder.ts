import useSWR from 'swr';
import { IOrder } from 'interfaces/order';

export const useOrder = (orderId: number) => {
  const { data, error } = useSWR<IOrder>(`/orders/get/${orderId}`);

  return { data, error };
};
