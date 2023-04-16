import useSWR from 'swr';

import { ILikeResponse } from '../interfaces/like';

export const useLikes = (userId: number, page: number) => {
  const { data, error, mutate } = useSWR<ILikeResponse>(`/likes/product/${userId}?page=${page}`);

  return { data, error, mutate };
};
