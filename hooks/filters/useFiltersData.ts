import { useRouter } from 'next/router';

import { ICharacteristicGroup } from '../../interfaces/category/characteristicGroup';
import { ICharacteristic } from '../../interfaces/category/characteristic';
import { CharacteristicTypes } from '../../interfaces/product/characteristicType.enum';
import { IFilterReqData, IFilterReqGroup, IPriceRange } from '../../interfaces/filters/filtersData';
import { FilterItemState } from '../../interfaces/filters/initialState';
import { getLastUrlSegment } from '../../utils/urlValidation';
import { enumCharacteristics } from './enumStringCharacteristics';

interface initialStateData {
  initialFiltersState?: {
    [key: string]: Array<FilterItemState>;
  };
  filteredCharacteristics?: ICharacteristic[];
  filtersReqDataBuilder: (char: ICharacteristic[], take: number, skip: number) => IFilterReqData;
}

export const useFiltersData = (
  filteredGroups?: ICharacteristicGroup<ICharacteristic>[],
  priceRange?: IPriceRange
): initialStateData => {
  const filtersReqDataBuilder = (
    characteristics: ICharacteristic[],
    take: number,
    skip: number
  ): IFilterReqData => {
    const router = useRouter();
    const routerQuery = router.query;
    const entries = Object.entries(routerQuery);

    const lastSegment = getLastUrlSegment(routerQuery.slug as string[]);

    const categoryQuery = router.query.slug;

    const filtersQuery = Object.fromEntries(entries);
    const mainCategoryItemIndex = entries.findIndex((item) => item[1] === categoryQuery);
    entries.splice(mainCategoryItemIndex, 1);

    const priceRange = filtersQuery.priceRange
      ? {
          min: +(filtersQuery.priceRange as string).split(',')[0],
          max: +(filtersQuery.priceRange as string).split(',')[1],
        }
      : null;

    const sorting = filtersQuery.sorting ? (filtersQuery.sorting as string).toUpperCase() : null;
    const quantityQuery = filtersQuery.quantity ? (filtersQuery.quantity as string) : null;

    const filtersGroup: IFilterReqGroup[] = [];

    Object.keys(filtersQuery).forEach((key) => {
      const relatedCharacteristic = characteristics.find((char) => char.name === key);

      if (relatedCharacteristic) {
        const values = [];
        switch (relatedCharacteristic.type) {
          case CharacteristicTypes.ENUM:
            const indexValues = (filtersQuery[key] as string).split(',').map((item) => +item - 1);
            indexValues.forEach((item) => {
              values.push(relatedCharacteristic.defaultValues!.values[item]);
            });
            break;
          case CharacteristicTypes.BOOLEAN:
            +filtersQuery[key] === 1 ? values.push(true) : values.push(false);
            break;
          case CharacteristicTypes.STRING:
            values.push(filtersQuery[key]);
            break;
        }

        filtersGroup.push({
          characteristicId: relatedCharacteristic.id!,
          type: relatedCharacteristic.type,
          values,
          characteristicName: relatedCharacteristic.name,
        });
      }
    });

    const filters = [];

    if (priceRange) {
      filters.push([['priceRange'], priceRange], [['categoryKey'], lastSegment]);
    }

    if (sorting) {
      filters.push([['sorting'], sorting], [['categoryKey'], lastSegment]);
    } else {
      filters.push([['sorting'], 'POPULAR']);
    }

    if (quantityQuery) {
      filters.push([['categoryKey'], lastSegment]);
    }

    if (filtersGroup.length) {
      filters.push([['filtersGroup'], [...filtersGroup]], [['categoryKey'], lastSegment]);
    }

    if (filters.length) filters.push([['take'], take], [['skip'], skip]);

    return Object.fromEntries(filters);
  };

  if (!filteredGroups && !priceRange) {
    return { filtersReqDataBuilder };
  }

  const characteristics = [];
  const entries = [];

  const filteredTypes = ['enum', 'range', 'boolean'];

  for (const group of filteredGroups!) {
    characteristics.push(...group.characteristic);
  }

  const router = useRouter();
  const categoryQuery = router.query.slug;

  const filteredCharacteristics = characteristics.filter((characteristic) => {
    if (characteristic.type === 'string') {
      return (categoryQuery as []).some((category) =>
        enumCharacteristics.some(
          (obj) =>
            obj.enumCategory.includes(category) &&
            !obj.enumBanedCategory.includes(category) &&
            obj.enumStringCharacteristics.includes(characteristic.name)
        )
      );
    }
    return filteredTypes.find((item) => characteristic.type === item);
  });

  for (let i = 0; i < filteredCharacteristics.length; i++) {
    switch (filteredCharacteristics[i].type) {
      case CharacteristicTypes.ENUM:
        const checkBoxInnerState = [];
        for (
          let j = 0, values = filteredCharacteristics[i].defaultValues!.values;
          j < values.length;
          j++
        ) {
          checkBoxInnerState.push({ index: j + 1, active: false });
        }
        entries.push([
          `${filteredCharacteristics[i].type}_${filteredCharacteristics[i].id}`,
          checkBoxInnerState,
        ]);
        break;
      case CharacteristicTypes.BOOLEAN:
        entries.push([
          `${filteredCharacteristics[i].type}_${filteredCharacteristics[i].id}`,
          [
            { index: 1, active: false },
            { index: 2, active: false },
          ],
        ]);
        break;
      case CharacteristicTypes.STRING:
        [
          ...new Set(
            enumCharacteristics
              .map((el) => el.enumStringCharacteristics.map((characteristic) => characteristic))
              .flat()
          ),
        ].map((el) => {
          entries.push([[`${el}`], []]);
        });
        break;
    }
  }

  const sortingState = {
    priceAsc: true,
    priseDesc: false,
    newArrivals: false,
  };
  const paginationState = 1;
  const quantityState = 20;

  const quantityEntries = [['quantity', quantityState]];
  const paginationEntries = [['page', paginationState]];
  const sortingEntries = [['sorting', sortingState]];
  const priceRangeEntries = [['priceRange', { ...priceRange }]];
  const initialFiltersState = Object.fromEntries([
    ...entries,
    ...priceRangeEntries,
    ...sortingEntries,
    ...paginationEntries,
    ...quantityEntries,
  ]);

  return { initialFiltersState, filteredCharacteristics, filtersReqDataBuilder };
};
