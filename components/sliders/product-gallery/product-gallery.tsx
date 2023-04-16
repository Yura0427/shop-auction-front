import React, { FC, useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import SwiperCore, { Navigation, Pagination, Thumbs, Controller } from 'swiper';
import Image from 'next/image';
import InnerImageZoom from 'react-inner-image-zoom';

import { GallaryTabProps } from '../../../interfaces/galleryProps';
import { IFile } from '../../../interfaces/product/products';
import ModalGallery from '@modals/products/modal-gallery';
import { useModal } from '../../../hooks/useModal';
import ProductImage from '../../products/product-item/product-image';
import apiUrl from '../../../api/config';
import { useWindowSize } from 'hooks/useWindowSize';
import styles from './product-gallery.module.scss';

SwiperCore.use([Navigation, Pagination, Thumbs, Controller]);

const ProductGallery: FC<GallaryTabProps> = ({ relatedProduct }) => {
  if (!relatedProduct.files.length) {
    return <ProductImage relatedProduct={relatedProduct} isTitleShown={true} />;
  }

  const { width } = useWindowSize();

  const [thumbsSwiper, setThumbsSwiper] = useState<null | SwiperCore>(null);
  const [mobileSwiper, setMobileSwiper] = useState<null | SwiperCore>(null);
  const [activeSlideIndex, setActiveIndex] = useState(0);
  const [isShowing, toggle] = useModal();

  const setThumbsHandler = (swiper: any): void => {
    setThumbsSwiper(swiper);
  };

  const changeActiveSlideIndex = (swiper: any): void => {
    setActiveIndex(swiper.activeIndex);
  };

  const productImages: IFile[] = relatedProduct.files;
  const previewImages = productImages.filter((file) => !file.name.includes('cropped-', 0));
  const thumbImages = productImages.filter((file) => file.name.includes('cropped-', 0));

  const myLoader = ({ src, width, quality, height }) => {
    return `${apiUrl}/static/uploads/${src}?w=${width}&q=${quality || 75}`;
  };

  const makeSlides = (
    files: IFile[],
    width: number,
    height: number,
    quality: number,
    isThumbnail: boolean
  ) => {
    return files.map((file, index) => {
      // const url = `${apiUrl}/static/uploads/${file.name}`;
      const url = `${file.name}`;
      return (
        <SwiperSlide
          key={file.id}
          onMouseEnter={() => setActiveIndex(index)}
          onClick={width === 440 ? toggle : undefined}
        >
          <Image
            className={styles.img}
            alt={`Фото товару ${relatedProduct.name} №${index + 1}${
              isThumbnail ? ' thumbnail' : ''
            }`}
            loader={myLoader}
            src={url}
            width={width}
            height={height}
            quality={quality}
          />
        </SwiperSlide>
      );
    });
  };

  const makeSlidesLarge = () => {
    return previewImages.map((file) => {
      const url = `${apiUrl}/static/uploads/${file.name}`;
      return (
        <SwiperSlide key={file.id}>
          <InnerImageZoom
            src={url}
            fullscreenOnMobile={true}
            zoomPreload={true}
            hasSpacer={true}
            hideHint={true}
          />
        </SwiperSlide>
      );
    });
  };

  const previewSlides = makeSlides(previewImages, 440, 387, 100, false);
  const thumbs = makeSlides(thumbImages, 100, 88, 100, true);

  useEffect(() => {
    return () => {
      if (isShowing) {
        toggle();
      }
    };
  });

  return (
    <>
      {isShowing && (
        <ModalGallery
          isOpen={isShowing}
          toggle={toggle}
          slides={makeSlidesLarge()}
          initialSlide={activeSlideIndex}
          relatedProduct={relatedProduct}
        />
      )}

      <div className={width >= 575 ? styles.container : styles['hide-container']}>
        <Swiper
          className="swiper1"
          spaceBetween={0}
          slidesPerView={1}
          thumbs={{ swiper: thumbsSwiper }}
          onSlideChange={changeActiveSlideIndex}
          initialSlide={activeSlideIndex}
        >
          {previewSlides}
        </Swiper>

        <Swiper
          onSwiper={setThumbsHandler}
          className="swiper2"
          direction="vertical"
          slidesPerView={4}
          spaceBetween={10}
          allowTouchMove={false}
        >
          {thumbs}
        </Swiper>
      </div>

      <div className={width < 575 ? '' : styles['hide-container']}>
        <Swiper
          className="swiper4"
          spaceBetween={0}
          slidesPerView={1}
          thumbs={{ swiper: mobileSwiper }}
          onSlideChange={changeActiveSlideIndex}
          initialSlide={activeSlideIndex}
          pagination={{ dynamicBullets: true, clickable: true }}
        >
          {previewSlides}
        </Swiper>

        <Swiper onSwiper={setMobileSwiper} className="swiper3" slidesPerView={4} spaceBetween={10}>
          {thumbs}
        </Swiper>
      </div>
    </>
  );
};

export default ProductGallery;
