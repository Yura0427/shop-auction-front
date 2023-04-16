import React, { FC } from 'react';
import { Modal, ModalHeader, ModalBody } from 'reactstrap';
import parse from 'html-react-parser';

import { IModalProps } from '../../../interfaces/modal';
import { Swiper } from 'swiper/react';
import { IProduct } from '../../../interfaces/product/products';
import SwiperCore, { Navigation, Pagination } from 'swiper';
import { useWindowSize } from 'hooks/useWindowSize';
import styles from './modal-gallery.module.scss';
import PriceBlock from '../../products/products-tabs/main-tab/price-block/price-block';

SwiperCore.use([Navigation, Pagination]);

interface ModalGalleryProps extends IModalProps {
  slides: JSX.Element[];
  initialSlide: number;
  relatedProduct: IProduct;
}

const ModalGallery: FC<ModalGalleryProps> = ({
  isOpen,
  toggle,
  slides,
  initialSlide,
  relatedProduct,
}) => {
  const { width } = useWindowSize();

  return (
    <Modal
      isOpen={isOpen}
      centered
      toggle={toggle}
      className={styles['product-modal']}
      unmountOnClose={false}
      autoFocus={true}
    >
      <ModalHeader toggle={toggle} tag={'div'} className={styles.header}>
        <div className={styles['price-block']}>
          <h2 className={styles['product-name']}>{parse(relatedProduct.name)}</h2>
          <PriceBlock relatedProduct={relatedProduct} compact />
        </div>
      </ModalHeader>
      <ModalBody className={styles.modalBody}>
        <Swiper
          slidesPerView={1}
          initialSlide={initialSlide}
          pagination={{ dynamicBullets: true, clickable: true }}
          navigation={width >= 575}
          className="swiper5"
        >
          {slides}
        </Swiper>
      </ModalBody>
    </Modal>
  );
};

export default ModalGallery;
