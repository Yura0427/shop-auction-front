import React, { FC } from 'react';
import { PageContainer } from '@containers/page-container';
import styles from './product-page.module.scss';
import parse from 'html-react-parser';
import StarRating from '../star-rating/star-rating';
import ProductsTabs from '../products/products-tabs/products-tabs';
import MainLayout from '../layout/MainLayout';
import { useRouter } from 'next/router';
import { ProductPageProps } from '../../interfaces/pages/dynamic-pages';
import apiUrl from '../../api/config';

const ProductPage: FC<ProductPageProps> = ({
  metaData,
  allCategories,
  breadcrumbsData,
  product,
  comments,
}) => {
  const { query } = useRouter();

  const microBreadCrumbsData = breadcrumbsData.breadcrumbs.slice(1, -1);

  const makeMicroBreadUrl = (index: number): string => {
    const breadCrumbsSegments = microBreadCrumbsData.map((item) => item.key);

    let url: string = '';

    for (let i = 0; i <= index; i++) {
      url += `/${breadCrumbsSegments[i]}`;
    }

    url = `${apiUrl}${url}`;

    return url;
  };

  const data = {
    '@context': 'https://schema.org/',
    '@type': 'Product',
    'name': `${product.name}`,
    'image': product.files.map((file) => `${apiUrl}/static/uploads/${file.name}`),
    'description': product.name,
    'offers': {
      '@type': 'Offer',
      'url': `${apiUrl}${product.url}/${product.key}`,
      'priceCurrency': 'UAH',
      'price': product.price,
      'itemCondition': 'https://schema.org/UsedCondition',
      'availability': `https://schema.org/${product.availability ? 'InStock' : 'OutOfStock'}`,
    },
    'breadcrumbs': {
      '@type': 'BreadcrumbList',
      'itemListElement': microBreadCrumbsData.map((item, index) => ({
        '@type': 'ListItem',
        'position': index + 1,
        'name': item.name,
        'item': makeMicroBreadUrl(index),
      })),
    },
  };

  return (
    <MainLayout metaData={metaData}>
      <PageContainer
        categories={allCategories}
        isSideBarShown={false}
        breadcrumbsData={breadcrumbsData}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
        />
        <h1 className={styles.heading}>{parse(product!.name)}</h1>
        <StarRating relatedProduct={product!} />
        <ProductsTabs
          activeTabName={query.tab}
          relatedProduct={product!}
          relatedCategory={product?.category!}
          productComments={comments!}
        />
      </PageContainer>
    </MainLayout>
  );
};

export default ProductPage;
