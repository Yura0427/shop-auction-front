import useSWR from 'swr';
import { ISlide } from '../interfaces/slide';

interface slideRes {
  data: ISlide[];
  count: number;
  totalPages: number;
}

const UseSlider = () => {
  const get = { page: 1, limit: 30 };
  const { data } = useSWR<slideRes>(`/slide?page=${get.page}&limit=${get.limit}`);

  return {
    slides: data?.data,
  };
};

export default UseSlider;
