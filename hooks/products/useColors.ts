import { useEffect, useState } from 'react';

import { IProduct } from 'interfaces/product/products';
import { getColorsPictures } from 'utils/get-colors-pictures';
import { IColororsPictures } from 'interfaces/colorsPictures.interface';

export const useColors = (products: IProduct[]) => {
  const [currentColors, setCurrentColors] = useState<IColororsPictures[]>([]);

  const allProductsColors: string[] = [];
  if (products) {
    products.forEach((product) =>
      product.characteristicValue.forEach((value) => {
        if (value.jsonValue) allProductsColors.push(...Object.keys(value.jsonValue));
      })
    );
  }

  useEffect(() => {
    let isLoaded = true;
    const colorsReq = {
      colorsNames: allProductsColors.filter((el, i) => i === allProductsColors.indexOf(el.trim())),
    };
    getColorsPictures(colorsReq)
      .then((data) => {
        if (isLoaded) setCurrentColors(data);
      })
      .catch((error) =>
        console.log('Error in file:useColors.ts, useEffect: in function getColors: ', error)
      );
    return () => {
      isLoaded = false;
    };
  }, []);

  return currentColors;
};
