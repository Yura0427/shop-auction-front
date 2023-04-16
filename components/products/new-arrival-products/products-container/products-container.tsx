import React, { FC } from 'react';

import { IProduct } from '../../../../interfaces/product/products';
import styles from '../new-arrival-products.module.scss';
import ProductItem from 'components/products/product-item/product-item';
import { Row } from 'reactstrap';
import Route from './../../../route/Route';
import { useProductLike } from 'hooks/products/useProductLike';
import { useColors } from 'hooks/products/useColors';

interface NewProductsProps {
  data: {
    categoryName: string;
    products: IProduct[];
  };
  isSidebarShowing: boolean;
}

const ProductsContainer: FC<NewProductsProps> = ({ data, isSidebarShowing }) => {
  const likedProduct = useProductLike(data.products);
  const currentColors = useColors(data.products);

  const productsData = data.products.map((product) =>
    product.disabled ? null : (
      <ProductItem
        customClass={styles.productCard}
        key={product.id}
        product={product}
        likedProduct={likedProduct}
        currentColors={currentColors}
      />
    )
  );

  return (
    <div className={styles.productsCard}>
      <Route href={`${data.products[0].url}`} linkClass={styles.productsCard_title}>
        {data.categoryName}
      </Route>
      <Row xs={1} sm={2} md={3} lg={isSidebarShowing ? 4 : 5}>
        {productsData}
      </Row>
    </div>
  );
};

export default ProductsContainer;
