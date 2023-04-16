import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

import { ISizeColorSelect } from '../../interfaces/product/products';
import { ISortedSize } from '../../interfaces/product/sortedSizes';
import { getSortedSizeFromLS } from '../../services/local-storage-controller';
import { AppState } from '../../store/reducers';

// Sorted size 'S'->'M'->'L'->'XL'->...
export const useSizeSorting = () => {
  const extSizesPriority = useSelector(
    (state: AppState) => state.parametersReducer.parameters['size-priority']
  );

  const [sortSizes, setSortSizes] = useState<ISortedSize | null>(null);

  useEffect(() => {
    const sortedSizeLs = getSortedSizeFromLS();
    if (extSizesPriority) {
      setSortSizes(extSizesPriority);
    } else if (sortedSizeLs) {
      setSortSizes(sortedSizeLs);
    }
  }, [extSizesPriority]);

  const getSize = (size: string): number => {
    if (sortSizes?.[size]) {
      return sortSizes[size];
    }
    return 0;
  };

  const sortForSelector = (incomingSize: ISizeColorSelect[]) => {
    if (!isNaN(Number(incomingSize[0].value))) {
      return incomingSize.sort((a, b) => parseInt(a.value) - parseInt(b.value));
    }

    return incomingSize.sort((a, b) => {
      const sizeA = getSize(a.value);
      const sizeB = getSize(b.value);
      if (sizeA === sizeB) {
        return a.value.localeCompare(b.value);
      }
      return sizeA - sizeB;
    });
  };

  const sortForStrings = (incomingSize: string[]) => {
    if (!isNaN(Number(incomingSize[0]))) {
      return incomingSize.sort((a, b) => parseInt(a) - parseInt(b));
    }

    return incomingSize.sort((a, b) => {
      const sizeA = getSize(a);
      const sizeB = getSize(b);
      if (sizeA === sizeB) {
        return a.localeCompare(b);
      }
      return sizeA - sizeB;
    });
  };

  return { sortForSelector, sortForStrings };
};
