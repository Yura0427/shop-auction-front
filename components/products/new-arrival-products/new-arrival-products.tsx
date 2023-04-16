import React, { FC } from 'react';
import { Alert } from 'reactstrap';
import { IProductsData, ISortedProducts } from '../../../interfaces/product/products';
import ProductsContainer from './products-container/products-container';
import styles from './new-arrival-products.module.scss';

interface NewProductsProps extends IProductsData {
  isSidebarShowing: boolean;
  parentFromUrl?: boolean;
  sortedProducts: ISortedProducts[];
}

const NewProducts: FC<NewProductsProps> = ({ products, isSidebarShowing, sortedProducts }) => {
  const isEmptyProducts = products.length === 0;
  const emptyData = isEmptyProducts ? (
    <Alert color="info" className={'col'}>
      <h4 className="alert-heading">Не знайдено жодного товару</h4>
    </Alert>
  ) : null;

  return (
    <div>
      {emptyData}
      <div className={styles.productsContainer}>
        {sortedProducts.map((item) => {
          return (
            <ProductsContainer
              key={item.categoryName}
              data={item}
              isSidebarShowing={isSidebarShowing}
            />
          );
        })}
      </div>
    </div>
  );
};

export default NewProducts;
