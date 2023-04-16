import React, { FC, useEffect, useState } from 'react';
import { Alert, Spinner, Col, Row } from 'reactstrap';
import ProductItem from './product-item/product-item';
import { IProductsData } from '../../interfaces/product/products';
import styles from './products.module.scss';
import { useProductLike } from 'hooks/products/useProductLike';

interface ProductsProps extends IProductsData {
  isSidebarShowing: boolean;
  parentFromUrl?: boolean;
  customClass?: string;
}

const Products: FC<ProductsProps> = ({ products, isSidebarShowing, customClass }) => {
  let isEmptyProducts = true;
  if (products !== undefined) isEmptyProducts = products?.length === 0;

  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    setIsLoading(true);
    if (products === undefined) return;
    setIsLoading(false);
  }, [products]);
  const likedProduct = useProductLike(products);

  const productsData =
    !isEmptyProducts && !isLoading
      ? products.map((product) => (
          <ProductItem key={product.id} product={product} likedProduct={likedProduct} />
        ))
      : null;

  const spinner = isLoading ? (
    <Col sm="12" md={{ size: 6, offset: 3 }} className={'text-center'}>
      <Spinner color="info" />
    </Col>
  ) : null;

  const emptyData =
    isEmptyProducts && !isLoading ? (
      <Alert color="info" className={'col'}>
        <h4 className="alert-heading">Не знайдено жодного товару</h4>
      </Alert>
    ) : null;

  return (
    <>
      {spinner}
      {emptyData}
      <Row
        xs={1}
        sm={2}
        md={3}
        lg={isSidebarShowing ? 3 : 4}
        xl={isSidebarShowing ? 4 : 5}
        className={!customClass ? styles.productsBox : `${customClass} ${styles.productsBox}`}
      >
        {productsData}
      </Row>
    </>
  );
};

export default Products;
