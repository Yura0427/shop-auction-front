import React, { FC } from 'react';
import { TabPane } from 'reactstrap';
import parse from 'html-react-parser';

import { GallaryTabProps } from '../../../interfaces/galleryProps';
import styles from './product-tabs.module.scss';
import { ICategory } from '../../../interfaces/category/category';
import SpecTable from '../spec-table/spec-table';
import { useCharacteristics } from '../../../hooks/useCharacteristics';

interface SpecTabs extends GallaryTabProps {
  relatedCategory: ICategory;
}

const SpecTab: FC<SpecTabs> = ({ relatedProduct, relatedCategory }) => {
  const { characteristicGroups } = useCharacteristics(relatedCategory, relatedProduct);

  const specData = characteristicGroups.map((group) => {
    return (
      <SpecTable key={group.name} name={group.name} characteristicGroup={group.characteristic} />
    );
  });

  return (
    <TabPane tabId="2" className={styles.specTab}>
      <h2 className={styles.tabsHeading}>
        Технічні характеристики{' '}
        <span className={styles.productName}>{parse(relatedProduct.name)}</span>
      </h2>
      {relatedProduct.characteristicValue.length ? (
        specData
      ) : (
        <div className={styles.emptySpec}>Вибачте, характеристики товару не знайдені</div>
      )}
    </TabPane>
  );
};

export default SpecTab;
