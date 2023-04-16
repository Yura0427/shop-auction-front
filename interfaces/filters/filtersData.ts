import { CharacteristicTypes } from '../product/characteristicType.enum';

export interface IPriceRange {
  min: number;
  max: number;
}

export interface IFilterGroup {
  characteristicId: number;
  type:
    | CharacteristicTypes.RANGE
    | CharacteristicTypes.NUMBER
    | CharacteristicTypes.STRING
    | CharacteristicTypes.JSON
    | CharacteristicTypes.ENUM
    | CharacteristicTypes.BOOLEAN
    | CharacteristicTypes.DATE;
  values: Array<string | number>;
}

export interface IFilterReqGroup {
  characteristicId: number;
  characteristicName?: string;
  type:
    | CharacteristicTypes.RANGE
    | CharacteristicTypes.NUMBER
    | CharacteristicTypes.STRING
    | CharacteristicTypes.JSON
    | CharacteristicTypes.ENUM
    | CharacteristicTypes.BOOLEAN
    | CharacteristicTypes.DATE;
  values: boolean[] | string[] | number[];
}

export interface IFilterReqData {
  priceRange?: IPriceRange | null;
  filtersGroup?: IFilterReqGroup[];
}

export enum SortingEnum {
  priceAsc = 'ASC',
  priceDesc = 'DESC',
  newArriwals = 'NEW',
}
