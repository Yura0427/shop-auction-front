import { ISliderAnimation } from 'interfaces/sliderAnimation';
import useSWR from 'swr';

export const useSliderAnimation = (): ISliderAnimation => {
  const { data } = useSWR<ISliderAnimation>('/slider-animations/active');
  const anim = { id: data?.id, animation: data?.animation, active: data?.active };
  return anim;
};
