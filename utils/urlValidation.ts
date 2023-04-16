import { PageTypes } from '../enums/pageTypes';
import { ICategory } from '../interfaces/category/category';

export interface UrlValidationData {
  slug: string[];
  pageType: keyof typeof PageTypes;
  mpath: string;
  ascCategories: Partial<ICategory>[];
  category?: ICategory;
}

export const urlValidate = ({
  slug,
  pageType,
  mpath,
  ascCategories,
  category,
}: UrlValidationData): { isValid: boolean; validUrl: string } => {
  let actualUrl = '';
  slug.forEach((slug) => (actualUrl += `/${slug}`));

  let validUrl = '';

  const slugSegments = mpath.slice(0, -1).split('.');
  const lastSlug = slug[slug.length - 1];

  const cutSlugSegments = pageType !== PageTypes.product ? slugSegments.slice(0, -1) : slugSegments;

  cutSlugSegments.forEach((id) => {
    const findCategory = ascCategories.find((item) => item.id === +id);
    if (findCategory) validUrl += `/${findCategory?.key}`;
  });

  if (pageType === PageTypes.product) {
    validUrl += `/${category!.key}`;
  }

  validUrl += `/${lastSlug}`;

  return {
    isValid: validUrl === actualUrl,
    validUrl,
  };
};

export const getLastUrlSegment = (slug: string[]) => slug[slug.length - 1];
