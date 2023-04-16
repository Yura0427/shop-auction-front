import React, { FC, useState } from 'react';
import { TabContent, Nav, NavItem } from 'reactstrap';
import classnames from 'classnames';
import { AiOutlineInfoCircle, AiOutlineMessage, AiOutlineFileSearch } from 'react-icons/ai';

import MainTab from './main-tab/main-tab';
import SpecTab from './spec-tab';
import ReviewTab from './review-tab/review-tab';
import { IProduct } from '../../../interfaces/product/products';
import { ICategory } from '../../../interfaces/category/category';
import { ICommentResponse } from 'interfaces/comment/comment';
import styles from './product-tabs.module.scss';
import { useComments } from '../../../hooks/useComments';
import Route from '../../route/Route';

interface ProductTabsProps {
  activeTabName: string | string[];
  relatedProduct: IProduct;
  relatedCategory: ICategory;
  productComments: ICommentResponse;
}

const ProductsTabs: FC<ProductTabsProps> = ({
  activeTabName = 'info',
  relatedProduct,
  relatedCategory,
  productComments,
}) => {
  const tabsNameMap = ['info', 'characteristics', 'reviews'];
  const tabsIndexMap = new Map();
  const [activeTab, setActiveTab] = useState('1');
  const baseUrl = `${relatedProduct.url}/${relatedProduct.key}`;

  for (let i = 1; i <= tabsNameMap.length; i++) {
    tabsIndexMap.set(tabsNameMap[i - 1], String(i));
  }

  const toggle = (tab: string) => {
    if (activeTab !== tab) setActiveTab(tab);
  };

  toggle(tabsIndexMap.get(activeTabName));

  const { commentsData } = useComments(relatedProduct.id, 1);

  return (
    <div className={styles.tabs}>
      <Nav tabs className={styles.tabsNav}>
        <NavItem className={styles.tabsItem}>
          <Route
            href={baseUrl}
            linkClass={classnames('nav-link', { [styles.active]: activeTab === '1' })}
            onClick={() => toggle('1')}
          >
            <AiOutlineInfoCircle size={20} /> Головне про товар
          </Route>
        </NavItem>
        <NavItem className={styles.tabsItem}>
          <Route
            href={`${baseUrl}?tab=characteristics`}
            linkClass={classnames('nav-link', { [styles.active]: activeTab === '2' })}
            onClick={() => toggle('2')}
          >
            <AiOutlineFileSearch size={20} />
            Характеристики
          </Route>
        </NavItem>
        <NavItem className={styles.tabsItem}>
          <Route
            href={`${baseUrl}?tab=reviews`}
            linkClass={classnames('nav-link', { [styles.active]: activeTab === '3' })}
            onClick={() => toggle('3')}
          >
            <AiOutlineMessage size={20} />
            Відгуки та коментарі {commentsData?.count ? commentsData?.count : null}
          </Route>
        </NavItem>
      </Nav>
      <TabContent activeTab={activeTab} className={styles.tabContent}>
        <MainTab relatedProduct={relatedProduct} />
        <SpecTab relatedProduct={relatedProduct} relatedCategory={relatedCategory} />
        <ReviewTab
          product={relatedProduct}
          initialComments={productComments}
          activeTab={activeTab}
        />
      </TabContent>
    </div>
  );
};

export default ProductsTabs;
