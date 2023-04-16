import React, { FC, useState } from 'react';
import { Col, Row, TabPane } from 'reactstrap';
import parse from 'html-react-parser';

import ProductGallery from '../../../sliders/product-gallery/product-gallery';
import { GallaryTabProps } from '../../../../interfaces/galleryProps';
import styles from './main-tab.module.scss';
import PriceBlock from './price-block/price-block';
import SizeBlock from './size-block/size-block';
import ColorBlock from './color-block/color-block';
import { SizeContext } from '../../../context/sizes-context';

const MainTab: FC<GallaryTabProps> = ({ relatedProduct }) => {
  const [isCurrentColor, setIsCurrentColor] = useState('');
  const [isSelectedDescriptionBySize, setSelectedDescriptionBySize] = useState<string>('');
  const [isCurrentSize, setIsCurrentSize] = useState('');

  const sizeFetcher = (size: string) => {
    if (size && relatedProduct?.shopKey === 'letsShop' && relatedProduct.description) {
      const arrStrings = relatedProduct.description?.split('Розмір: ');
      arrStrings?.forEach((item) => {
        if (item.split('\n')[0] === size) {
          setSelectedDescriptionBySize(`Розмір: ` + item);
        }
      });
    }
  };

  let descriptionContent = null;

  if (relatedProduct.shopKey === 'letsShop' && isSelectedDescriptionBySize) {
    descriptionContent = parse(
      isSelectedDescriptionBySize.replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1<br>$2') ||
        'Опис товару відсутній'
    );
  } else if (relatedProduct.shopKey === 'whiteMandarin' && isSelectedDescriptionBySize) {
    descriptionContent = (
      <div dangerouslySetInnerHTML={{ __html: relatedProduct.description || '' }} />
    );
  } else {
    descriptionContent = parse(
      relatedProduct?.description?.replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1<br>$2') ||
        'Опис товару відсутній'
    );
  }

  return (
    <SizeContext.Provider
      value={{ isCurrentColor, setIsCurrentColor, isCurrentSize, setIsCurrentSize }}
    >
      <TabPane tabId="1" className={styles.tab}>
        <Row>
          <Col lg="6" className={styles.col}>
            <ProductGallery relatedProduct={relatedProduct} />
          </Col>
          <Col>
            <PriceBlock
              relatedProduct={relatedProduct}
              isCurrentColor={isCurrentColor}
              isCurrentSize={isCurrentSize}
            />
            <div className={styles.selectBlock}>
              <ColorBlock
                characteristicsValue={relatedProduct.characteristicValue}
                productId={relatedProduct.id}
              />
              <SizeBlock
                characteristicsValue={relatedProduct.characteristicValue}
                productId={relatedProduct.id}
                sizeFetcher={sizeFetcher}
              />
            </div>
            <div>{descriptionContent}</div>
          </Col>
        </Row>
      </TabPane>
    </SizeContext.Provider>
  );
};

export default MainTab;
