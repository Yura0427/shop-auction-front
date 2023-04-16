import useSWR from 'swr';
import { useContext } from 'react';
import { UserContext } from '../../components/context/user-context';
import { ProductToOrder } from '../../interfaces/product/products-in-cart';

export interface IOrder {
  amount?: number;
  id?: number | string;
  productToOrder: ProductToOrder[];
  status?: string;
  additionalEmail?: string | null;
  additionalFirstName?: string | null;
  additionalLastName?: string | null;
  additionalNumber?: string| null;
  comment?: string | null;
  orderIdForLiqpay?: string;
  liqpayOrderId?: string | null;
  liqpayPaymentStatus?: string | null;
  paymentStatus?: boolean;
  notcall?: boolean | null;
  updatedAt?: string;
  createdAt?: string;
}

export const UseProductsInCart = () => {
  const { user } = useContext(UserContext);

  const shouldRevalidate = !!user;

  const { data, error, mutate, isValidating } = useSWR<IOrder>('/orders/cart', {
    revalidateOnMount: shouldRevalidate,
    revalidateOnFocus: shouldRevalidate,
    revalidateOnReconnect: shouldRevalidate,
  });

  return {
    data,
    productsInCart: data?.productToOrder,
    isLoading: !error && !data,
    isError: error,
    mutate,
    isValidating,
  };
};
