import useSWR from 'swr';
import { IProduct } from '../interfaces/product/products';

export const useNewArrivalProducts = (take: number, initialData?: IProduct[]): IProduct[] => {
  const { data: allNewArrivalProducts = [] } = useSWR<IProduct[]>(
    `/product/newArrivals?take=${take}`,
    { initialData }
  );

  return allNewArrivalProducts;
};