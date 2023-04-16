import { ICommentResponse } from 'interfaces/comment/comment';
import useSWR from 'swr';

export const useComments = (productId: number, page: number, initialData?: ICommentResponse) => {
  const { data, error, mutate } = useSWR<ICommentResponse>(
    `comments/product/${productId}?page=${page}`,
    {
      initialData,
    },
  );

  return {
    commentsData: data,
    isLoading: !error && !data,
    isError: error,
    mutate,
  };
};



export const useUserComments = (userId: number, page: number) => {
  const { data, error, mutate } = useSWR<ICommentResponse>(
    `comments/user/${userId}/?page=${page}`,
  );

  return {
    data: data,
    isLoading: !error && !data,
    isError: error,
    mutate,
  };
};
