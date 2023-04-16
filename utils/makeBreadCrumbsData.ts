import { PageTypes } from '../enums/pageTypes';
import { IProduct } from '../interfaces/product/products';
import { ICategory } from '../interfaces/category/category';

export const makeBreadCrumbsData = (
  pageType: keyof typeof PageTypes,
  product?: IProduct,
  category?: ICategory
): Array<{ name: string; key: string }> => {
  const mpath = pageType === PageTypes.product ? product?.category?.mpath! : category?.mpath!;
  let orderedData = [{ name: 'Головна', key: '/' }];

  const splitMpath = mpath!.slice(0, -1).split('.');

  splitMpath.forEach((path) => {
    const whereFind = pageType === PageTypes.product ? product?.category : category;
    const findCategory = whereFind!.ascCategories.find((category) => category.id === +path);
    findCategory && orderedData.push({ name: findCategory.name!, key: findCategory.key! });
  });

  pageType === PageTypes.product
    ? orderedData.push(
        {
          name: product?.category?.name!,
          key: product?.category?.key!,
        },
        { name: product?.name!, key: product?.key! }
      )
    : orderedData.push({ name: category?.name!, key: category?.key! });

  return orderedData;
};
