import React, { FC } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore, {
  Autoplay,
  Pagination,
  Navigation,
  EffectFlip,
  EffectFade,
  EffectCoverflow,
  EffectCube,
} from 'swiper';
import Image from 'next/image';
import { useMedia } from 'hooks/useMedia';

import styles from '../slide/slide-galerry.module.scss';
import UseSlider from '../../hooks/useSlider';
import apiUrl from '../../api/config';
import Route from '../route/Route';
import { useSliderAnimation } from 'hooks/useSliderAnimation';
import { Spinner } from 'reactstrap';

SwiperCore.use([
  Autoplay,
  Pagination,
  Navigation,
  EffectFlip,
  EffectFade,
  EffectCoverflow,
  EffectCube,
]);

const SlideGallery: FC = () => {
  const { slides } = UseSlider();
  const sliderAnimation = useSliderAnimation();
  const isMobile = useMedia(`(max-width: ${styles.sm}px)`);
  const isUrlIncludesHttpOrDot = (url: string): boolean => {
    return url.includes('http') || url.includes('.');
  };

  const isCorrectAnimation = (a: string | undefined) => {
    switch (a) {
      case 'coverflow':
        return true;
      case 'fade':
        return true;
      case 'flip':
        return true;
      case 'slide':
        return true;
      default:
        return false;
    }
  };

  while (!isCorrectAnimation(sliderAnimation.animation)) {
    return (
      <div className={styles.loading}>
        <Spinner size="lg" />
      </div>
    );
  }

  if (!slides || !slides.length) return null;

  return (
    <Swiper
      autoplay={{
        delay: 12000,
        disableOnInteraction: false,
      }}
      className={`${styles.gallery_slide}`}
      spaceBetween={5}
      slidesPerView={1}
      loop={true}
      pagination={{ clickable: true }}
      navigation
      effect={sliderAnimation.animation}
      coverflowEffect={{
        rotate: 40,
        stretch: 110,
        depth: 50,
        modifier: 3,
        slideShadows: false
      }}
    >
      {slides
        ?.filter((slide) => slide.isShown)
        .sort((a, b) => a.priority - b.priority)
        .map((slide) => (
          <SwiperSlide key={slide.href}>
            <Route
              href={
                isUrlIncludesHttpOrDot(slide.href) ? `${slide.href}` : `${apiUrl}/${slide.href}`
              }
            >
              <Image
                priority={true}
                alt={slide.text}
                src={`${apiUrl}/static/uploads/${isMobile ? slide.imageMobile : slide.image}`}
                width={1400}
                height={400}
              />
            </Route>
          </SwiperSlide>
        ))}
    </Swiper>
  );
};

export default SlideGallery;
