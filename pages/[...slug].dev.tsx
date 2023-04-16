import React, { FC } from 'react';
import { GetServerSideProps } from 'next';
import { useRouter } from 'next/router';
import { AxiosResponse } from 'axios';
import parse from 'html-react-parser';

import { PageTypes } from '../enums/pageTypes';
import { ICategory, ICategoryTree } from '../interfaces/category/category';
import { IProduct } from '../interfaces/product/products';
import { ICommentResponse } from '../interfaces/comment/comment';
import { urlValidate, UrlValidationData } from '../utils/urlValidation';
import { makeBreadCrumbsData } from '../utils/makeBreadCrumbsData';
import ProductPage from '../components/dynamic-pages/product';
import CtWithChildren from '../components/dynamic-pages/category-with-children';
import CategoryWithoutChildren from '../components/dynamic-pages/category-without-children';
import { api } from '../api';

interface PageProps {
  pageType: keyof typeof PageTypes;
  category?: ICategory;
  product?: IProduct;
  comments?: ICommentResponse;
  productsData?: { products: IProduct[]; count: number };
  allCategories: ICategoryTree[];
}

const DynamicPage: FC<PageProps> = ({
  pageType,
  product,
  category,
  comments,
  productsData,
  allCategories,
}) => {
  const { query } = useRouter();
  const slug = query.slug as string[];

  const metaData = {
    title: parse(pageType !== PageTypes.product ? category!.name : product!.name) as string,
    description: `Товар ${parse(pageType !== PageTypes.product ? category!.name : product!.name)}`,
    addBrand: true,
  };

  const validationData = {
    slug,
    pageType,
    mpath: pageType === PageTypes.product ? product?.category?.mpath! : category?.mpath!,
    ascCategories:
      pageType === PageTypes.product ? product?.category?.ascCategories! : category?.ascCategories!,
    category: pageType === PageTypes.product ? product?.category! : category,
  };

  const { validUrl } = urlValidate(validationData);

  const breadcrumbs =
    pageType === PageTypes.product
      ? makeBreadCrumbsData(pageType, product)
      : makeBreadCrumbsData(pageType, undefined, category);
  const breadcrumbsData = {
    isBreadcrumbsShown: true,
    breadcrumbs,
  };

  switch (pageType) {
    case PageTypes.product:
      return (
        <ProductPage
          allCategories={allCategories}
          metaData={metaData}
          breadcrumbsData={breadcrumbsData}
          comments={comments!}
          product={product!}
        />
      );
    case PageTypes.ctWithChildren:
      return (
        <CtWithChildren
          allCategories={allCategories}
          validUrl={validUrl}
          breadcrumbsData={breadcrumbsData}
          metaData={metaData}
          category={category!}
          productsData={productsData!}
        />
      );
    default:
      return (
        <CategoryWithoutChildren
          allCategories={allCategories}
          breadcrumbsData={breadcrumbsData}
          category={category!}
          metaData={metaData}
          productsData={productsData!}
        />
      );
  }
};

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const { data: allCategories } = await api.categories.getTree();

  const slug = params?.slug as string[];
  const lastSlug = slug[slug.length - 1];

  let isProduct: AxiosResponse<IProduct> | undefined;
  const isCategory = await api.categories.getByKey(lastSlug);
  !isCategory && (isProduct = await api.products.getByKey(lastSlug));

  const pageType = isCategory
    ? isCategory.data.children.length
      ? PageTypes.ctWithChildren
      : PageTypes.ctWithoutChildren
    : PageTypes.product;

  const nothingFound = !isCategory && !isProduct;
  let deepValidation;

  let validationData: UrlValidationData;

  if (pageType !== PageTypes.product) {
    validationData = {
      slug,
      pageType: pageType as keyof typeof PageTypes,
      mpath: isCategory.data.mpath,
      ascCategories: isCategory.data.ascCategories,
    };
  } else {
    validationData = {
      slug,
      pageType,
      mpath: isProduct?.data?.category?.mpath!,
      ascCategories: isProduct?.data?.category?.ascCategories!,
      category: isProduct?.data?.category!,
    };
  }

  const products =
    pageType === PageTypes.ctWithoutChildren &&
    (await api.products.getByCategoryKey(isCategory.data.key, 40, 0));

  if (!nothingFound) {
    const { isValid } = urlValidate(validationData!);
    deepValidation = isValid;
  }

  if (nothingFound || !deepValidation) {
    return {
      notFound: true,
    };
  }

  const productsInListCategory =
    pageType === PageTypes.ctWithChildren &&
    (await api.products.getInListCategory(isCategory.data.key, 20, 0));

  const productComments =
    pageType === PageTypes.product && (await api.comments.getByProduct(isProduct?.data.id!, 1));

  const basicProps: Record<string, any> = {
    props: {
      pageType: PageTypes.product,
      allCategories: allCategories.length ? allCategories : [],
    },
  };

  switch (pageType) {
    case PageTypes.ctWithChildren:
      return {
        ...basicProps,
        props: {
          ...basicProps.props,
          pageType: PageTypes.ctWithChildren,
          category: isCategory.data,
          productsData: productsInListCategory && productsInListCategory.data,
        },
      };
    case PageTypes.ctWithoutChildren:
      return {
        ...basicProps,
        props: {
          ...basicProps.props,
          pageType: PageTypes.ctWithoutChildren,
          category: isCategory.data,
          productsData: products && products.data,
        },
      };
    case PageTypes.product:
      return {
        ...basicProps,
        props: {
          ...basicProps.props,
          product: isProduct?.data,
          comments: productComments && productComments.data,
        },
      };
  }
};

export default DynamicPage;
