import React, { FC } from 'react';
import SwiperCore, { Autoplay, Navigation, Pagination } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';

import ProductItem from 'components/products/product-item/product-item';
import { IProduct } from 'interfaces/product/products';
import style from './NewArrivals.module.scss';
import { useProductLike } from 'hooks/products/useProductLike';
import { useColors } from 'hooks/products/useColors';

SwiperCore.use([Navigation, Autoplay, Pagination]);

interface NewArrivalsProps {
  products: IProduct[];
  isWidgetActive: boolean;
}

const NewArrivals: FC<NewArrivalsProps> = ({ products, isWidgetActive }) => {
  if (!isWidgetActive || !products.length) {
    return null;
  }

  const likedProduct = useProductLike(products);
  const currentColors = useColors(products);

  const productsData = products.map((product) => (
    <SwiperSlide className={style.swiperItem} key={product.id}>
      <div className={style.productItem}>
        <ProductItem
          key={product.id}
          product={product}
          likedProduct={likedProduct}
          currentColors={currentColors}
          disableColorSize
        />
      </div>
    </SwiperSlide>
  ));

  return (
    <>
      <div className={style.container}>
        <span className={style.title}>Новинки</span>
        <Swiper
          id="new_arrivals_slider"
          className={style.swiperContainer}
          spaceBetween={25}
          slidesPerView={1}
          slidesPerGroup={1}
          autoplay={{
            disableOnInteraction: false,
            delay: 5000,
          }}
          loop
          loopedSlides={4}
          pagination={{
            dynamicBullets: true,
            clickable: true,
            el: '.swiper-pagination',
          }}
          navigation={{
            nextEl: `.swiper-button-next`,
            prevEl: `.swiper-button-prev`,
          }}
          breakpoints={{
            768: {
              slidesPerView: 2,
              slidesPerGroup: 2,
            },
            992: {
              slidesPerView: 3,
              slidesPerGroup: 3,
            },
            1200: {
              slidesPerView: 4,
              slidesPerGroup: 4,
            },
          }}
        >
          {productsData}

          <div className={`swiper-button-prev ${style.swiperNavigation}`}></div>
          <div className={`swiper-button-next ${style.swiperNavigation}`}></div>
          <div className={`swiper-pagination ${style.customPagination}`}></div>
        </Swiper>
        <div className={style.divider} />
      </div>
    </>
  );
};

export default NewArrivals;
